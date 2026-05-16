<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|unique:inventories,product_code', // Front-end uses 'id' for Product Code
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'onHand' => 'required|integer|min:0',
            'sold' => 'nullable|integer|min:0',
        ]);

        Inventory::create([
            'product_code' => $validated['id'],
            'name' => $validated['name'],
            'category' => $validated['category'],
            'price' => $validated['price'],
            'on_hand' => $validated['onHand'],
            'sold' => $validated['sold'] ?? 0,
        ]);

        // Just redirect back so Inertia refreshes the props
        return redirect()->back()->with('success', 'Product added successfully.');
    }

    public function update(Request $request, $product_code)
    {
        $inventory = Inventory::where('product_code', $product_code)
                              ->orWhere('id', $product_code) // Fallback for auto-increment IDs
                              ->firstOrFail();

        $validated = $request->validate([
            'id' => 'required|string|unique:inventories,product_code,' . $inventory->id, 
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'onHand' => 'required|integer|min:0',
            'sold' => 'nullable|integer|min:0',
        ]);

        $inventory->update([
            'product_code' => $validated['id'],
            'name' => $validated['name'],
            'category' => $validated['category'],
            'price' => $validated['price'],
            'on_hand' => $validated['onHand'],
            'sold' => $validated['sold'] ?? 0,
        ]);

        return redirect()->back()->with('success', 'Product updated successfully.');
    }

    public function destroy($product_code)
    {
        $inventory = Inventory::where('product_code', $product_code)
                              ->orWhere('id', $product_code) // Fallback for auto-increment IDs
                              ->firstOrFail();
        
        $inventory->delete();

        return redirect()->back()->with('success', 'Product deleted successfully.');
    }
}
