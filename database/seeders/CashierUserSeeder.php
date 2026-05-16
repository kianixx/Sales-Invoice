<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CashierUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::updateOrCreate(
            ['email' => 'kiana@gmail.com'],
            [
                'name' => 'Kiana Cirilo',
                'password' => \Illuminate\Support\Facades\Hash::make('kiana'),
                'role' => 'cashier',
            ]
        );
    }
}
