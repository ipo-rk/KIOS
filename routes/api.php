<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BarangController;

Route::apiResource('barang', BarangController::class);

// Custom stock routes
Route::post('/barang/{barang}/kurangi-stok', [BarangController::class, 'kurangiStok']);
Route::post('/barang/{barang}/tambah-stok', [BarangController::class, 'tambahStok']);
