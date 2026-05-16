<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    protected $fillable = [
        'invoice_id',
        'product_code',
        'description',
        'unit_cost',
        'qty',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
