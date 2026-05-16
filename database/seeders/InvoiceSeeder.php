<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Inventory;
use Faker\Factory as Faker;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $inventoryItems = Inventory::all();

        if ($inventoryItems->isEmpty()) {
            $this->command->info('No inventory items found. Please seed inventory first.');
            return;
        }

        // We want to generate 20 invoices
        for ($i = 0; $i < 20; $i++) {
            // Pick a random number of items for this invoice (1 to 3)
            $numItems = rand(1, 3);
            
            // Randomly select distinct products
            $selectedProducts = $inventoryItems->count() >= $numItems 
                ? $inventoryItems->random($numItems) 
                : $inventoryItems;
            
            $totalAmount = 0;
            $itemsData = [];

            foreach ($selectedProducts as $product) {
                $qty = rand(1, 3);
                $totalAmount += ($product->price * $qty);

                $itemsData[] = [
                    'product_code' => $product->product_code ?? (string)$product->id,
                    'description' => $product->name,
                    'unit_cost' => $product->price,
                    'qty' => $qty,
                ];
            }

            $latestInvoice = Invoice::latest('id')->first();
            $nextId = $latestInvoice ? $latestInvoice->id + 1 : 1;
            $invoiceNumber = '#1047' . (string)($nextId);

            $invoice = Invoice::create([
                'invoice_number' => $invoiceNumber,
                'customer_name' => $faker->name(),
                'shipping_address' => $faker->address(),
                'contact' => $faker->phoneNumber(),
                'tin' => $faker->numerify('###-###-###-000'),
                'po_number' => 'PO-' . $faker->randomNumber(5, true),
                'cashier' => $faker->randomElement(['Admin', 'Cashier User']),
                'sales_person' => $faker->name(),
                'date' => $faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
                'terms' => $faker->randomElement(['Cash', '30 Days', 'Installment']),
                'installment_duration' => null,
                'total_amount' => $totalAmount,
                'status' => $faker->randomElement(['Paid', 'Pending']),
            ]);

            foreach ($itemsData as $item) {
                $item['invoice_id'] = $invoice->id;
                InvoiceItem::create($item);
            }
        }
    }
}
