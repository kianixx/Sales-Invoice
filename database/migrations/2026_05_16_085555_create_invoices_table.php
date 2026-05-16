<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->string('customer_name');
            $table->string('shipping_address')->nullable();
            $table->string('contact')->nullable();
            $table->string('tin')->nullable();
            $table->string('po_number')->nullable();
            $table->string('cashier')->nullable();
            $table->string('sales_person')->nullable();
            $table->date('date');
            $table->string('terms')->nullable();
            $table->string('installment_duration')->nullable();
            $table->decimal('total_amount', 12, 2);
            $table->string('status')->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
