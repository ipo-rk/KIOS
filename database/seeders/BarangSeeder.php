<?php

namespace Database\Seeders;

use App\Models\Barang;
use Illuminate\Database\Seeder;

class BarangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Barang::create([
            'nama' => 'Mie Instan',
            'harga' => 3000,
            'stok' => 50,
            'deskripsi' => 'Mie instan rasa ayam',
        ]);

        Barang::create([
            'nama' => 'Roti Tawar',
            'harga' => 12000,
            'stok' => 20,
            'deskripsi' => 'Roti tawar putih premium',
        ]);

        Barang::create([
            'nama' => 'Susu UHT',
            'harga' => 5000,
            'stok' => 30,
            'deskripsi' => 'Susu UHT full cream 200ml',
        ]);

        Barang::create([
            'nama' => 'Teh Botol',
            'harga' => 4000,
            'stok' => 40,
            'deskripsi' => 'Teh botol sosro 300ml',
        ]);

        Barang::create([
            'nama' => 'Snack Keripik',
            'harga' => 8000,
            'stok' => 25,
            'deskripsi' => 'Snack keripik jagung 100g',
        ]);
    }
}
