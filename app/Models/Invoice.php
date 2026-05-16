<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'invoice_number',
        'customer_name',
        'shipping_address',
        'contact',
        'tin',
        'po_number',
        'cashier',
        'sales_person',
        'date',
        'terms',
        'installment_duration',
        'total_amount',
        'status',
    ];

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
