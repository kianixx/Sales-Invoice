<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Inventory;
use App\Models\Invoice;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\InvoiceController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/invoice', function () {
    return Inertia::render('Invoice');
});

Route::get('/dashboard', function () {
    $inventory = Inventory::all()->map(function($item) {
        return [
            'id' => $item->product_code ?? (string)$item->id, // Fallback to id if product_code is null
            'name' => $item->name,
            'category' => $item->category,
            'price' => 'PHP ' . number_format($item->price, 2),
            'onHand' => $item->on_hand,
            'sold' => $item->sold,
        ];
    });

    $invoices = Invoice::with('items')->latest()->get()->map(function($inv) {
        return [
            'id' => $inv->invoice_number,
            'name' => $inv->customer_name,
            'shippingAddress' => $inv->shipping_address,
            'contact' => $inv->contact,
            'tin' => $inv->tin,
            'poNumber' => $inv->po_number,
            'cashier' => $inv->cashier,
            'salesPerson' => $inv->sales_person,
            'date' => \Carbon\Carbon::parse($inv->date)->format('F d, Y'),
            'rawDate' => $inv->date,
            'amount' => 'PHP ' . number_format($inv->total_amount, 2),
            'status' => $inv->status,
            'terms' => $inv->terms,
            'installmentDuration' => $inv->installment_duration,
            'items' => $inv->items->map(function($item) {
                return [
                    'code' => $item->product_code,
                    'description' => $item->description,
                    'unitCost' => $item->unit_cost,
                    'qty' => $item->qty,
                ];
            }),
            'avatar' => 'https://i.pravatar.cc/150?u=' . urlencode($inv->invoice_number),
        ];
    });

    return Inertia::render('Dashboard', [
        'initialInventory' => $inventory,
        'initialInvoices' => $invoices,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::post('/invoice', [InvoiceController::class, 'store'])->middleware(['auth', 'verified'])->name('invoice.store');
Route::put('/invoice/{id}', [InvoiceController::class, 'update'])->middleware(['auth', 'verified'])->name('invoice.update');
Route::delete('/invoice/{id}', [InvoiceController::class, 'destroy'])->middleware(['auth', 'verified'])->name('invoice.destroy');

Route::post('/inventory', [InventoryController::class, 'store'])->middleware(['auth', 'verified'])->name('inventory.store');
Route::put('/inventory/{product_code}', [InventoryController::class, 'update'])->middleware(['auth', 'verified'])->name('inventory.update');
Route::delete('/inventory/{product_code}', [InventoryController::class, 'destroy'])->middleware(['auth', 'verified'])->name('inventory.destroy');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
