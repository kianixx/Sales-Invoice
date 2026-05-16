<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Inventory;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Inventory::truncate();

        $mockInventory = [
            ['product_code' => 'MWVV3AM/A', 'name' => '20W USB-C Power Adapter', 'category' => 'Accessories', 'price' => 1190.00, 'on_hand' => 45, 'sold' => 120],
            ['product_code' => 'MQD83ZP/A', 'name' => 'AirPods Pro (2nd gen)', 'category' => 'Audio', 'price' => 14990.00, 'on_hand' => 12, 'sold' => 85],
            ['product_code' => 'MLXW3PA/A', 'name' => 'MacBook Air M2', 'category' => 'Mac', 'price' => 69990.00, 'on_hand' => 8, 'sold' => 24],
            ['product_code' => 'MPV03ZP/A', 'name' => 'iPhone 14 Pro Max 256GB', 'category' => 'iPhone', 'price' => 89990.00, 'on_hand' => 15, 'sold' => 56],
            ['product_code' => 'MK2K3ZE/A', 'name' => 'iPad (9th gen) 64GB', 'category' => 'iPad', 'price' => 21990.00, 'on_hand' => 22, 'sold' => 110],
        ];

        foreach ($mockInventory as $item) {
            Inventory::create($item);
        }
    }
}
