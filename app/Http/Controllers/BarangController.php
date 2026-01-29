<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BarangController extends Controller
{
    /**
     * Display a listing of all barang.
     */
    public function index(): JsonResponse
    {
        try {
            $barang = Barang::all();
            return response()->json([
                'success' => true,
                'message' => 'Data barang berhasil diambil',
                'data' => $barang,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data barang: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created barang in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string|unique:barang,nama',
                'harga' => 'required|numeric|min:0',
                'stok' => 'required|integer|min:0',
                'deskripsi' => 'nullable|string',
                'kategori' => 'nullable|string|in:Elektronik,Makanan,Minuman,Perlengkapan,Lainnya',
            ]);

            $barang = Barang::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Barang berhasil ditambahkan',
                'data' => $barang,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan barang: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified barang.
     */
    public function show(Barang $barang): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Detail barang berhasil diambil',
                'data' => $barang,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail barang: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified barang in storage.
     */
    public function update(Request $request, Barang $barang): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nama' => 'sometimes|string|unique:barang,nama,' . $barang->id,
                'harga' => 'sometimes|numeric|min:0',
                'stok' => 'sometimes|integer|min:0',
                'deskripsi' => 'nullable|string',
            ]);

            $barang->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Barang berhasil diperbarui',
                'data' => $barang,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui barang: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified barang from storage.
     */
    public function destroy(Barang $barang): JsonResponse
    {
        try {
            $barang->delete();

            return response()->json([
                'success' => true,
                'message' => 'Barang berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus barang: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reduce stock of barang.
     */
    public function kurangiStok(Request $request, Barang $barang): JsonResponse
    {
        try {
            $validated = $request->validate([
                'jumlah' => 'required|integer|min:1',
            ]);

            if ($barang->stok < $validated['jumlah']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stok tidak mencukupi',
                ], 400);
            }

            $barang->update([
                'stok' => $barang->stok - $validated['jumlah'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Stok berhasil dikurangi',
                'data' => $barang,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengurangi stok: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Increase stock of barang.
     */
    public function tambahStok(Request $request, Barang $barang): JsonResponse
    {
        try {
            $validated = $request->validate([
                'jumlah' => 'required|integer|min:1',
            ]);

            $barang->update([
                'stok' => $barang->stok + $validated['jumlah'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Stok berhasil ditambahkan',
                'data' => $barang,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan stok: ' . $e->getMessage(),
            ], 500);
        }
    }
}
