<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customerName' => 'nullable|string|max:255',
            'shippingAddress' => 'nullable|string',
            'contact' => 'nullable|string|max:255',
            'tin' => 'nullable|string|max:255',
            'poNumber' => 'nullable|string|max:255',
            'cashier' => 'nullable|string|max:255',
            'salesPerson' => 'nullable|string|max:255',
            'date' => 'required|date',
            'terms' => 'nullable|string|max:255',
            'installmentDuration' => 'nullable|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.code' => 'required|string',
            'items.*.description' => 'required|string',
            'items.*.unitCost' => 'required|numeric|min:0',
            'items.*.qty' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $totalAmount = 0;
            foreach ($validated['items'] as $item) {
                $totalAmount += $item['unitCost'] * $item['qty'];
            }

            // Generate next invoice number
            $latestInvoice = Invoice::latest('id')->first();
            $nextId = $latestInvoice ? $latestInvoice->id + 1 : 1;
            $invoiceNumber = '#1047' . (string)($nextId);

            $invoice = Invoice::create([
                'invoice_number' => $invoiceNumber,
                'customer_name' => $validated['customerName'] ?: 'Walk-in Customer',
                'shipping_address' => $validated['shippingAddress'],
                'contact' => $validated['contact'],
                'tin' => $validated['tin'],
                'po_number' => $validated['poNumber'],
                'cashier' => $validated['cashier'],
                'sales_person' => $validated['salesPerson'],
                'date' => $validated['date'],
                'terms' => $validated['terms'],
                'installment_duration' => $validated['installmentDuration'],
                'total_amount' => $totalAmount,
            ]);

            foreach ($validated['items'] as $item) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'product_code' => $item['code'],
                    'description' => $item['description'],
                    'unit_cost' => $item['unitCost'],
                    'qty' => $item['qty'],
                ]);

                // Deduct inventory
                $inventory = Inventory::where('product_code', $item['code'])
                                      ->orWhere('id', $item['code'])
                                      ->first();
                if ($inventory) {
                    $inventory->on_hand -= $item['qty'];
                    $inventory->sold += $item['qty'];
                    $inventory->save();
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Invoice created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Failed to create invoice: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        // Re-add the hash symbol that was stripped for the URL
        $invoiceNumber = '#' . ltrim($id, '#');
        $invoice = Invoice::where('invoice_number', $invoiceNumber)->firstOrFail();

        $validated = $request->validate([
            'customerName' => 'nullable|string|max:255',
            'shippingAddress' => 'nullable|string',
            'contact' => 'nullable|string|max:255',
            'tin' => 'nullable|string|max:255',
            'poNumber' => 'nullable|string|max:255',
            'cashier' => 'nullable|string|max:255',
            'salesPerson' => 'nullable|string|max:255',
            'date' => 'required|date',
            'terms' => 'nullable|string|max:255',
            'installmentDuration' => 'nullable|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.code' => 'required|string',
            'items.*.description' => 'required|string',
            'items.*.unitCost' => 'required|numeric|min:0',
            'items.*.qty' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            // Revert stock for existing items
            foreach ($invoice->items as $existingItem) {
                $inventory = Inventory::where('product_code', $existingItem->product_code)
                                      ->orWhere('id', $existingItem->product_code)
                                      ->first();
                if ($inventory) {
                    $inventory->on_hand += $existingItem->qty;
                    $inventory->sold -= $existingItem->qty;
                    $inventory->save();
                }
            }

            // Delete old items
            $invoice->items()->delete();

            $totalAmount = 0;
            foreach ($validated['items'] as $item) {
                $totalAmount += $item['unitCost'] * $item['qty'];
            }

            // Update main invoice record
            $invoice->update([
                'customer_name' => $validated['customerName'] ?: 'Walk-in Customer',
                'shipping_address' => $validated['shippingAddress'],
                'contact' => $validated['contact'],
                'tin' => $validated['tin'],
                'po_number' => $validated['poNumber'],
                'cashier' => $validated['cashier'],
                'sales_person' => $validated['salesPerson'],
                'date' => $validated['date'],
                'terms' => $validated['terms'],
                'installment_duration' => $validated['installmentDuration'],
                'total_amount' => $totalAmount,
            ]);

            // Insert new items and deduct stock
            foreach ($validated['items'] as $item) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'product_code' => $item['code'],
                    'description' => $item['description'],
                    'unit_cost' => $item['unitCost'],
                    'qty' => $item['qty'],
                ]);

                $inventory = Inventory::where('product_code', $item['code'])
                                      ->orWhere('id', $item['code'])
                                      ->first();
                if ($inventory) {
                    $inventory->on_hand -= $item['qty'];
                    $inventory->sold += $item['qty'];
                    $inventory->save();
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Invoice updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Failed to update invoice: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $invoiceNumber = '#' . ltrim($id, '#');
        $invoice = Invoice::where('invoice_number', $invoiceNumber)->firstOrFail();

        DB::beginTransaction();

        try {
            // Revert stock for existing items
            foreach ($invoice->items as $item) {
                $inventory = Inventory::where('product_code', $item->product_code)
                                      ->orWhere('id', $item->product_code)
                                      ->first();
                if ($inventory) {
                    $inventory->on_hand += $item->qty;
                    $inventory->sold -= $item->qty;
                    $inventory->save();
                }
            }

            // The invoice_items will automatically be deleted due to the onDelete('cascade') constraint in the migration
            $invoice->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Invoice deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Failed to delete invoice: ' . $e->getMessage()]);
        }
    }
}
