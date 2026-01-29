<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BarangController;

Route::get('/', function () {
    return view('index');
});

// API Testing routes (optional - for development)
Route::get('/api/test', function () {
    return view('api-test');
});
