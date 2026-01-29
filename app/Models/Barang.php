<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    protected $table = 'barang';

    protected $fillable = [
        'nama',
        'harga',
        'stok',
        'deskripsi',
        'kategori',
    ];

    protected $casts = [
        'harga' => 'decimal:2',
        'stok' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
