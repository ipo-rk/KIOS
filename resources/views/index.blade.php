<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Aplikasi Kios MamKo</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">

    <!-- Print CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/html2print/1.0.0/html2print.min.css" rel="stylesheet">

    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

    @vite(['resources/css/kios.css', 'resources/js/kios.js'])
</head>

<body>

    <!-- ===== LOGIN MODAL - MODERN DESIGN ===== -->
    <div class="modal fade" id="loginModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false"
        aria-labelledby="loginModalLabel" aria-hidden="true" role="dialog">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content login-modal-content border-0">
                <!-- Background Decorations -->
                <div class="login-bg-decoration login-bg-top-left"></div>
                <div class="login-bg-decoration login-bg-bottom-right"></div>

                <div class="modal-body login-modal-body">
                    <!-- Header Section -->
                    <div class="login-header">
                        <div class="login-icon-container">
                            <div class="login-icon">🛒</div>
                        </div>
                        <h2 class="login-title">Kios MamKo</h2>
                        <p class="login-subtitle">Sistem Manajemen Penjualan Modern</p>
                    </div>

                    <!-- Alert -->
                    <div class="alert alert-danger d-none login-alert" id="loginAlert" role="alert"></div>

                    <!-- Form Section -->
                    <form id="formLogin" class="login-form">
                        <!-- Username Input -->
                        <div class="login-input-group">
                            <label class="login-label" for="inputUsername">
                                <i class="bi bi-person"></i> Username
                            </label>
                            <div class="login-input-wrapper">
                                <input type="text" class="login-input" id="inputUsername"
                                    placeholder="Masukkan username Anda" required autocomplete="username">
                                <div class="login-input-focus-line"></div>
                            </div>
                        </div>

                        <!-- Password Input -->
                        <div class="login-input-group">
                            <label class="login-label" for="inputPassword">
                                <i class="bi bi-lock"></i> Password
                            </label>
                            <div class="login-input-wrapper">
                                <input type="password" class="login-input" id="inputPassword"
                                    placeholder="Masukkan password Anda" required autocomplete="current-password">
                                <div class="login-input-focus-line"></div>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" class="login-btn-submit">
                            <span class="login-btn-text">Masuk Sekarang</span>
                            <span class="login-btn-icon"><i class="bi bi-arrow-right"></i></span>
                        </button>
                    </form>

                    {{-- <!-- Divider -->
                    <div class="login-divider">
                        <span>atau</span>
                    </div>

                    <!-- Demo Info -->
                    <div class="login-demo-section">
                        <h4 class="login-demo-title">
                            <i class="bi bi-info-circle"></i> Akun Demo
                        </h4>
                        <div class="login-demo-grid">
                            <div class="login-demo-item">
                                <div class="login-demo-label">Username</div>
                                <div class="login-demo-value">admin</div>
                            </div>
                            <div class="login-demo-item">
                                <div class="login-demo-label">Password</div>
                                <div class="login-demo-value">admin123</div>
                            </div>
                        </div>
                        <p class="login-demo-hint">
                            <i class="bi bi-lightbulb"></i> Gunakan kredensial demo untuk mencoba aplikasi
                        </p>
                    </div> --}}

                    <!-- Footer -->
                    <div class="login-footer">
                        <p class="login-footer-text">
                            <i class="bi bi-shield-check"></i> Koneksi aman dan terenkripsi
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ===== HEADER ===== -->
    <nav class="navbar navbar-light px-3" id="mainNavbar" style="display: none;">
        <div class="d-flex align-items-center" style="width: 100%;">
            <button class="btn btn-link d-md-none" id="toggleSidebar"
                style="color: var(--text-primary); border: none; padding: 0.5rem;">
                <i class="bi bi-list" style="font-size: 1.5rem;"></i>
            </button>
            <span class="navbar-brand ms-2 mb-0">🛒 Aplikasi Kios MamKo</span>
            <div class="ms-auto d-flex align-items-center gap-3" style="flex-wrap: wrap;">
                <span id="currentTime"
                    style="color: var(--text-secondary); font-size: 0.9rem; font-weight: 600; white-space: nowrap;"></span>
                <button class="btn btn-outline-dark btn-sm navbar-theme-toggle" id="themeToggleBtn"
                    title="Toggle Dark Mode"
                    style="border: 1px solid var(--border-color); padding: 0.4rem 0.8rem; margin: 0; background: none; cursor: pointer; color: var(--text-primary); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
                    <i class="bi bi-moon-stars" style="font-size: 1rem;"></i>
                </button>
                <button class="btn btn-outline-dark btn-sm" id="headerProfileBtn"
                    style="border: 1px solid var(--border-color); padding: 0.4rem 0.8rem; margin: 0; background: none; cursor: pointer; color: var(--text-primary); transition: all 0.3s ease;">
                    <i class="bi bi-person-circle" style="font-size: 1.1rem;"></i> <span id="userDisplay"
                        style="color: var(--text-primary); font-weight: 600;">User</span>
                </button>
                <button class="btn btn-outline-dark btn-sm navbar-logout-btn" onclick="logout()"
                    style="border: 1px solid var(--border-color); color: var(--text-primary); white-space: nowrap; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
                    <i class="bi bi-box-arrow-right" style="font-size: 1.1rem;"></i> <span
                        class="logout-text">Keluar</span>
                </button>
            </div>
        </div>
    </nav>

    <div class="container-fluid" id="mainContent" style="margin-top: 0; display: none;">
        <div class="row" style="margin-top: 0;">

            <!-- ===== SIDEBAR ===== -->
            <aside class="col-md-2 sidebar">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link active" href="#" onclick="showSection('dashboard'); return false;">
                            <i class="bi bi-speedometer2"></i> Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" onclick="showSection('barang'); return false;">
                            <i class="bi bi-box-seam"></i> Data Barang
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" onclick="showSection('kasir'); return false;">
                            <i class="bi bi-cash-coin"></i> Kasir
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" onclick="showSection('transaksi'); return false;">
                            <i class="bi bi-receipt"></i> Transaksi
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" onclick="showSection('laporan'); return false;">
                            <i class="bi bi-bar-chart"></i> Laporan
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" onclick="showSection('settings'); return false;">
                            <i class="bi bi-gear"></i> Pengaturan
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" onclick="showSection('profile'); return false;">
                            <i class="bi bi-person"></i> Profil
                        </a>
                    </li>
                </ul>
            </aside>

            <!-- ===== CONTENT ===== -->
            <main class="col-md-10">

                <!-- DASHBOARD -->
                <section id="dashboard">
                    <div
                        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                        <h3><i class="bi bi-speedometer2"></i> Dashboard</h3>
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn btn-sm btn-outline-primary" onclick="setDashboardPeriod('today')"
                                id="btnPeriodToday" style="border-radius: 8px;">
                                <i class="bi bi-calendar-day"></i> Hari Ini
                            </button>
                            <button class="btn btn-sm btn-outline-primary" onclick="setDashboardPeriod('week')"
                                id="btnPeriodWeek" style="border-radius: 8px;">
                                <i class="bi bi-calendar2-week"></i> Minggu
                            </button>
                            <button class="btn btn-sm btn-outline-primary" onclick="setDashboardPeriod('month')"
                                id="btnPeriodMonth" style="border-radius: 8px;">
                                <i class="bi bi-calendar2-month"></i> Bulan
                            </button>
                        </div>
                    </div>

                    <!-- KPI Cards -->
                    <div class="row g-3 mb-4">
                        <div class="col-md-6 col-lg-3">
                            <div class="card"
                                style="border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: none;">
                                <div class="card-body">
                                    <div
                                        style="display: flex; justify-content: space-between; align-items: flex-start;">
                                        <div>
                                            <p
                                                style="color: #475569; font-size: 0.9rem; margin-bottom: 0.5rem; font-weight: 600;">
                                                📦 Total Barang</p>
                                            <h2 id="dashboardTotalBarang"
                                                style="margin: 0; color: #0f172a; font-weight: 800; letter-spacing: 0.3px;">
                                                0</h2>
                                            <small id="dashboardBarangTrend"
                                                style="color: #10b981; font-weight: 600;">↑ 0% dari periode
                                                lalu</small>
                                        </div>
                                        <div
                                            style="background: #e0e7ff; color: #4f46e5; width: 50px; height: 50px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                                            <i class="bi bi-box"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="card"
                                style="border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: none;">
                                <div class="card-body">
                                    <div
                                        style="display: flex; justify-content: space-between; align-items: flex-start;">
                                        <div>
                                            <p
                                                style="color: #475569; font-size: 0.9rem; margin-bottom: 0.5rem; font-weight: 600;">
                                                💰 Transaksi</p>
                                            <h2 id="dashboardTotalTransaksi"
                                                style="margin: 0; color: #0f172a; font-weight: 800; letter-spacing: 0.3px;">
                                                0</h2>
                                            <small id="dashboardTransaksiTrend"
                                                style="color: #10b981; font-weight: 600;">↑ 0% dari periode
                                                lalu</small>
                                        </div>
                                        <div
                                            style="background: #fef3c7; color: #f59e0b; width: 50px; height: 50px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                                            <i class="bi bi-receipt"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="card"
                                style="border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: none;">
                                <div class="card-body">
                                    <div
                                        style="display: flex; justify-content: space-between; align-items: flex-start;">
                                        <div>
                                            <p
                                                style="color: #475569; font-size: 0.9rem; margin-bottom: 0.5rem; font-weight: 600;">
                                                💵 Total Penjualan</p>
                                            <h2 id="dashboardTotalPenjualan"
                                                style="margin: 0; color: #0f172a; font-weight: 800; letter-spacing: 0.3px;">
                                                Rp 0</h2>
                                            <small id="dashboardPenjualanTrend"
                                                style="color: #10b981; font-weight: 600;">↑ 0% dari periode
                                                lalu</small>
                                        </div>
                                        <div
                                            style="background: #dcfce7; color: #10b981; width: 50px; height: 50px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                                            <i class="bi bi-currency-dollar"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="card"
                                style="border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: none;">
                                <div class="card-body">
                                    <div
                                        style="display: flex; justify-content: space-between; align-items: flex-start;">
                                        <div>
                                            <p
                                                style="color: #475569; font-size: 0.9rem; margin-bottom: 0.5rem; font-weight: 600;">
                                                📊 Avg Penjualan</p>
                                            <h2 id="dashboardAvgPenjualan"
                                                style="margin: 0; color: #0f172a; font-weight: 800; letter-spacing: 0.3px;">
                                                Rp 0</h2>
                                            <small id="dashboardAvgTrend"
                                                style="color: #475569; font-weight: 600;">Per transaksi</small>
                                        </div>
                                        <div
                                            style="background: #fce7f3; color: #ec4899; width: 50px; height: 50px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                                            <i class="bi bi-graph-up"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Charts Row 1 -->
                    <div class="row g-3 mb-4">
                        <div class="col-lg-8">
                            <div class="card"
                                style="border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: none;">
                                <div class="card-header"
                                    style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border: none; border-radius: 12px 12px 0 0; color: white; font-weight: 600; padding: 1.5rem;">
                                    <i class="bi bi-graph-up"></i> Grafik Penjualan
                                </div>
                                <div class="card-body">
                                    <div style="position: relative; height: 300px;">
                                        <canvas id="chartPenjualan"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="card"
                                style="border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: none;">
                                <div class="card-header"
                                    style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border: none; border-radius: 12px 12px 0 0; color: white; font-weight: 600; padding: 1.5rem;">
                                    <i class="bi bi-pie-chart"></i> Kategori Populer
                                </div>
                                <div class="card-body">
                                    <div style="position: relative; height: 300px;">
                                        <canvas id="chartKategori"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Charts Row 2 -->
                    <div class="row g-3 mb-4">
                        <div class="col-lg-6">
                            <div class="card"
                                style="border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: none;">
                                <div class="card-header"
                                    style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); border: none; border-radius: 12px 12px 0 0; color: white; font-weight: 600; padding: 1.5rem;">
                                    <i class="bi bi-bar-chart"></i> Perbandingan Setiap Hari
                                </div>
                                <div class="card-body">
                                    <div style="position: relative; height: 300px;">
                                        <canvas id="chartHarian"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="card"
                                style="border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: none;">
                                <div class="card-header"
                                    style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); border: none; border-radius: 12px 12px 0 0; color: white; font-weight: 600; padding: 1.5rem;">
                                    <i class="bi bi-activity"></i> Status Stok
                                </div>
                                <div class="card-body">
                                    <div id="dashboardStokStatus" style="max-height: 300px; overflow-y: auto;">
                                        <p
                                            style="color: #475569; text-align: center; padding: 2rem 0; font-weight: 600;">
                                            Memuat data stok...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Top Products -->
                    <div class="row g-3 mb-4">
                        <div class="col-lg-6">
                            <div class="card"
                                style="border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: none;">
                                <div class="card-header"
                                    style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); border: none; border-radius: 12px 12px 0 0; color: white; font-weight: 600; padding: 1.5rem;">
                                    <i class="bi bi-star"></i> Produk Terlaris
                                </div>
                                <div class="card-body">
                                    <div id="dashboardTopProducts" style="max-height: 300px; overflow-y: auto;">
                                        <p
                                            style="color: #475569; text-align: center; padding: 2rem 0; font-weight: 600;">
                                            Memuat data terlaris...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="card"
                                style="border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: none;">
                                <div class="card-header"
                                    style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border: none; border-radius: 12px 12px 0 0; color: white; font-weight: 600; padding: 1.5rem;">
                                    <i class="bi bi-clock-history"></i> Transaksi Terbaru
                                </div>
                                <div class="card-body">
                                    <div id="dashboardLatestTransactions"
                                        style="max-height: 300px; overflow-y: auto;">
                                        <p
                                            style="color: #475569; text-align: center; padding: 2rem 0; font-weight: 600;">
                                            Memuat transaksi...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- DATA BARANG -->
                <section id="barang" class="d-none">
                    <h3><i class="bi bi-box-seam"></i> Data Barang</h3>

                    <div class="alert alert-danger d-none" id="alertBarang" role="alert"></div>

                    <!-- Add Barang Form -->
                    <div class="card mb-4"
                        style="border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: none;">
                        <div class="card-header"
                            style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; border-radius: 12px 12px 0 0; padding: 1.5rem;">
                            <h5 style="margin: 0; font-weight: 700;"><i class="bi bi-plus-circle"></i> Tambah Barang
                                Baru</h5>
                        </div>
                        <div class="card-body" style="padding: 1.5rem;">
                            <form id="formBarang">
                                <div class="row g-3">
                                    <div class="col-md-3">
                                        <label class="form-label" style="font-weight: 600; color: #0f172a;">Nama
                                            Barang</label>
                                        <input type="text" class="form-control" id="inputNamaBarang"
                                            placeholder="Contoh: Nasi Goreng" required
                                            style="border-radius: 8px; border: 1.5px solid #cbd5e1;">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label"
                                            style="font-weight: 600; color: #0f172a;">Kategori</label>
                                        <select class="form-select" id="inputKategori" required
                                            style="border-radius: 8px; border: 1.5px solid #cbd5e1;">
                                            <option value="">Pilih Kategori</option>
                                            <option value="Makanan">🍔 Makanan</option>
                                            <option value="Minuman">🥤 Minuman</option>
                                            <option value="Permen">📱 Permen</option>
                                            <option value="Juss">🛠️ Juss/Sirup Es</option>
                                            <option value="Lainnya">📦 Lainnya</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <label class="form-label"
                                            style="font-weight: 600; color: #0f172a;">Harga</label>
                                        <input type="number" class="form-control" id="inputHargaBarang"
                                            placeholder="25000" min="0" required
                                            style="border-radius: 8px; border: 1.5px solid #cbd5e1;">
                                    </div>
                                    <div class="col-md-2">
                                        <label class="form-label"
                                            style="font-weight: 600; color: #0f172a;">Stok</label>
                                        <input type="number" class="form-control" id="inputStokBarang"
                                            placeholder="10" min="0" required
                                            style="border-radius: 8px; border: 1.5px solid #cbd5e1;">
                                    </div>
                                    <div class="col-md-2">
                                        <label class="form-label"
                                            style="font-weight: 600; color: #0f172a;">Deskripsi</label>
                                        <input type="text" class="form-control" id="inputDeskripsi"
                                            placeholder="Deskripsi singkat"
                                            style="border-radius: 8px; border: 1.5px solid #cbd5e1;">
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <button type="submit" class="btn btn-primary"
                                        style="border-radius: 8px; padding: 0.6rem 1.5rem; font-weight: 600;">
                                        <i class="bi bi-plus-circle"></i> Tambah Barang
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <!-- Data Table -->
                    <div class="card"
                        style="border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: none;">
                        <div class="card-header"
                            style="background: #f8fafc; padding: 1.5rem; border-bottom: 1px solid #e2e8f0;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <h5 style="margin: 0; color: #0f172a; font-weight: 700;"><i class="bi bi-table"></i>
                                    Daftar Barang (<span id="totalBarang">0</span>) <span id="pageInfo"
                                        style="font-size: 0.9rem; color: #64748b; font-weight: 500;"></span></h5>
                                <div style="flex: 1; max-width: 300px;">
                                    <input type="text" class="form-control" id="searchBarang"
                                        placeholder="🔍 Cari barang..."
                                        style="border-radius: 8px; border: 1.5px solid #cbd5e1;">
                                </div>
                                <button class="btn btn-sm btn-outline-secondary" onclick="resetSearchBarang()"
                                    style="margin-left: 0.5rem; border-radius: 8px;">Reset</button>
                            </div>
                        </div>
                        <div class="card-body" style="padding: 0;">
                            <div class="table-responsive">
                                <table class="table table-hover" style="margin: 0;">
                                    <thead style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                                        <tr style="color: #0f172a; font-weight: 700;">
                                            <th style="padding: 1rem; width: 50px;">No</th>
                                            <th style="padding: 1rem;">Kategori</th>
                                            <th style="padding: 1rem;">Nama Barang</th>
                                            <th style="padding: 1rem;">Harga</th>
                                            <th style="padding: 1rem;">Stok</th>
                                            <th style="padding: 1rem;">Deskripsi</th>
                                            <th style="padding: 1rem; width: 150px;">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tableBarang"></tbody>
                                </table>
                            </div>
                        </div>
                        <!-- Pagination -->
                        <div id="barangPagination" class="mt-3"></div>
                    </div>
                    <!-- Export/Import Section -->
                    <div class="card mb-4"
                        style="border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: none;">
                        <div class="card-header"
                            style="background: #f8fafc; padding: 1.5rem; border-bottom: 1px solid #e2e8f0;">
                            <h5 style="margin: 0; color: #0f172a; font-weight: 700;"><i
                                    class="bi bi-file-earmark-spreadsheet"></i> Export / Import Data</h5>
                        </div>
                        <div class="card-body" style="padding: 1.5rem;">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <button class="btn btn-success btn-sm w-100" onclick="exportBarangCSV()"
                                        style="border-radius: 8px; font-weight: 600;">
                                        <i class="bi bi-download"></i> Export CSV
                                    </button>
                                </div>
                                <div class="col-md-4">
                                    <input type="file" id="importBarangFile" accept=".csv"
                                        style="display: none;">
                                    <button class="btn btn-info btn-sm w-100"
                                        onclick="document.getElementById('importBarangFile').click()"
                                        style="border-radius: 8px; font-weight: 600;">
                                        <i class="bi bi-upload"></i> Import CSV
                                    </button>
                                </div>
                                <div class="col-md-4">
                                    <button class="btn btn-danger btn-sm w-100" onclick="hapusSemuaBarang()"
                                        style="border-radius: 8px; font-weight: 600;">
                                        <i class="bi bi-trash"></i> Hapus Semua
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                </section>

                <!-- EDIT BARANG MODAL -->
                <div class="modal fade" id="editBarangModal" tabindex="-1" aria-labelledby="editBarangModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content" style="border-radius: 12px;">
                            <div class="modal-header"
                                style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border: none;">
                                <h5 class="modal-title" id="editBarangModalLabel"
                                    style="color: white; font-weight: 700;">
                                    <i class="bi bi-pencil"></i> Edit Barang
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <form id="formEditBarang"
                                onsubmit="event.preventDefault(); updateBarang(); return false;">
                                <div class="modal-body" style="padding: 1.5rem;">
                                    <input type="hidden" id="editBarangId" name="editBarangId">
                                    <div class="mb-3">
                                        <label class="form-label" style="font-weight: 600;">Nama Barang</label>
                                        <input type="text" class="form-control" id="editNamaBarang"
                                            name="editNamaBarang" placeholder="Masukkan nama barang"
                                            style="border-radius: 8px; border: 1.5px solid #cbd5e1;" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label" style="font-weight: 600;">Kategori</label>
                                        <select class="form-select" id="editKategori" name="editKategori"
                                            style="border-radius: 8px; border: 1.5px solid #cbd5e1;" required>
                                            <option value="">Pilih Kategori</option>
                                            <option value="Makanan">🍔 Makanan</option>
                                            <option value="Minuman">🥤 Minuman</option>
                                            <option value="Permen">📱 Permen</option>
                                            <option value="Sirup Es">🛠️ Juss/Sirup Es</option>
                                            <option value="Lainnya">📦 Lainnya</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label" style="font-weight: 600;">Harga</label>
                                        <input type="number" class="form-control" id="editHargaBarang"
                                            name="editHargaBarang" placeholder="0" min="0"
                                            style="border-radius: 8px; border: 1.5px solid #cbd5e1;" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label" style="font-weight: 600;">Stok</label>
                                        <input type="number" class="form-control" id="editStokBarang"
                                            name="editStokBarang" placeholder="0" min="0"
                                            style="border-radius: 8px; border: 1.5px solid #cbd5e1;" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label" style="font-weight: 600;">Deskripsi</label>
                                        <input type="text" class="form-control" id="editDeskripsi"
                                            name="editDeskripsi" placeholder="Masukkan deskripsi barang"
                                            style="border-radius: 8px; border: 1.5px solid #cbd5e1;">
                                    </div>
                                </div>
                                <div class="modal-footer" style="padding: 1.5rem;">
                                    <button type="button" class="btn btn-secondary"
                                        data-bs-dismiss="modal">Batal</button>
                                    <button type="submit" class="btn btn-primary">
                                        <i class="bi bi-save"></i> Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- KASIR -->
                <section id="kasir" class="d-none">
                    <h3><i class="bi bi-cash-coin"></i> Kasir</h3>

                    <div class="alert alert-danger d-none" id="alertKasir" role="alert"></div>
                    <div class="alert alert-success d-none" id="alertKasirSuccess" role="alert"></div>

                    <!-- Search Box for Products -->
                    <div class="mb-4 p-3 bg-light rounded-3" style="border-left: 4px solid #10b981;">
                        <div class="row g-2 mb-3">
                            <div class="col-md-8">
                                <input type="text" class="form-control" id="searchBarangKasir"
                                    placeholder="🔍 Cari barang cepat (ketik nama atau harga)..."
                                    style="border-radius: 8px; border: 1.5px solid #cbd5e1; color: #0f172a;">
                            </div>
                            <div class="col-md-4">
                                <select class="form-select" id="filterKategoriKasir"
                                    style="border-radius: 8px; border: 1.5px solid #cbd5e1; color: #0f172a;">
                                    <option value="" style="color: #0f172a;">🏷️ Semua Kategori</option>
                                    <option value="Permen" style="color: #0f172a;">📱 Permen</option>
                                    <option value="Makanan" style="color: #0f172a;">🍔 Makanan</option>
                                    <option value="Minuman" style="color: #0f172a;">🥤 Minuman</option>
                                    <option value="Sirup Es" style="color: #0f172a;">🛠️ Juss/Sirup Es</option>
                                    <option value="Lainnya" style="color: #0f172a;">📦 Lainnya</option>
                                </select>
                            </div>
                        </div>
                        <small style="color: #475569; display: block; font-weight: 600;">💡 Tip: Ketik nama produk atau
                            harga untuk filter hasil</small>
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <h5 style="color: #0f172a; margin-bottom: 1rem; font-weight: 700;">
                            <i class="bi bi-grid-3x3-gap"></i> Pilih Barang
                            <span id="barangCountKasir"
                                style="font-size: 0.85rem; color: #475569; font-weight: 600;"></span>
                        </h5>
                        <div class="barang-grid" id="barangGrid">
                            <!-- barang cards will be inserted here -->
                        </div>
                    </div>

                    <div class="kasir-container">
                        <div class="kasir-items" id="kasirItems">
                            <h6 style="color: #0f172a; margin-bottom: 1rem; font-weight: 700;">
                                <i class="bi bi-cart3"></i> Keranjang Belanja
                            </h6>
                            <div id="itemsList" style="min-height: 100px;">
                                <p style="color: #475569; text-align: center; padding: 2rem 0; font-weight: 600;">Tidak
                                    ada item</p>
                            </div>
                        </div>

                        <div class="kasir-summary">
                            <div class="summary-card">
                                <div class="summary-row">
                                    <span style="color: #0f172a; font-weight: 600;">Subtotal:</span>
                                    <span id="subtotal" style="color: #0f172a; font-weight: 700;">Rp 0</span>
                                </div>
                                <div class="summary-row">
                                    <span style="color: #0f172a; font-weight: 600;">Diskon (%):</span>
                                    <input type="number" id="diskonPersen" min="0" max="100"
                                        value="0" class="form-control"
                                        style="width: 100px; height: 32px; border: 1.5px solid #cbd5e1; color: #0f172a;">
                                </div>
                                <div class="summary-row">
                                    <span style="color: #0f172a; font-weight: 600;">Diskon (Rp):</span>
                                    <span id="diskonRp" style="color: #0f172a; font-weight: 700;">Rp 0</span>
                                </div>
                                <div class="summary-row total">
                                    <span style="color: #0f172a; font-weight: 700;">Total Bayar:</span>
                                    <span id="totalBayar" style="color: #0f172a; font-weight: 800;">Rp 0</span>
                                </div>
                            </div>

                            <div class="summary-card">
                                <label class="form-label" style="color: #0f172a; font-weight: 700;">Jumlah
                                    Pembayaran</label>
                                <input type="number" id="jumlahBayar" class="form-control form-control-lg"
                                    placeholder="0" min="0"
                                    style="border: 1.5px solid #cbd5e1; color: #0f172a;">
                                <div class="summary-row"
                                    style="margin-top: 1rem; padding-top: 1rem; border-top: 2px solid #e5e7eb;">
                                    <span style="color: #0f172a; font-weight: 600;">Kembalian:</span>
                                    <span id="kembalian" style="font-weight: 800; color: #10b981;">Rp 0</span>
                                </div>
                            </div>

                            <div class="d-grid gap-2">
                                <button class="btn btn-success btn-lg" id="btnBayar" onclick="prosesCheckout()">
                                    <i class="bi bi-check-circle"></i> Bayar & Cetak Struk
                                </button>
                                <button class="btn btn-warning" id="btnBatalKasir" onclick="batalKasir()">
                                    <i class="bi bi-x-circle"></i> Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- TRANSAKSI -->
                <section id="transaksi" class="d-none">
                    <h3><i class="bi bi-receipt"></i> Riwayat Transaksi</h3>

                    <div class="alert alert-info d-none" id="alertTransaksi" role="alert"></div>

                    <!-- Filter Section -->
                    <div class="mb-4 p-3 bg-light rounded-3" style="border-left: 4px solid #0ea5e9;">
                        <div class="row g-2">
                            <div class="col-md-3">
                                <label class="form-label" style="color: #0f172a; font-weight: 700;">Filter
                                    Tanggal</label>
                                <input type="date" class="form-control" id="filterTanggal"
                                    style="border-radius: 8px; border: 1.5px solid #cbd5e1; color: #0f172a;">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label" style="color: #0f172a; font-weight: 700;">Min Total</label>
                                <input type="number" class="form-control" id="filterMinTotal" placeholder="Rp 0"
                                    min="0"
                                    style="border-radius: 8px; border: 1.5px solid #cbd5e1; color: #0f172a;">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label" style="color: #0f172a; font-weight: 700;">Max Total</label>
                                <input type="number" class="form-control" id="filterMaxTotal" placeholder="Rp 0"
                                    min="0"
                                    style="border-radius: 8px; border: 1.5px solid #cbd5e1; color: #0f172a;">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label" style="color: #0f172a; font-weight: 700;">&nbsp;</label>
                                <button class="btn btn-secondary w-100" onclick="resetFilterTransaksi()">
                                    <i class="bi bi-arrow-clockwise"></i> Reset Filter
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th style="width: 50px;">No</th>
                                    <th>Tanggal</th>
                                    <th>Waktu</th>
                                    <th>Item</th>
                                    <th>Subtotal</th>
                                    <th>Diskon</th>
                                    <th>Total Bayar</th>
                                    <th style="width: 150px;">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="tableTransaksi">
                                <!-- transaksi will be inserted here -->
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- LAPORAN -->
                <section id="laporan" class="d-none">
                    <h3><i class="bi bi-bar-chart"></i> Laporan</h3>
                    <div class="alert alert-danger d-none" id="alertLaporan" role="alert"></div>
                    <div class="alert alert-success d-none" id="alertLaporanSuccess" role="alert"></div>
                    <div class="row g-3 mb-4">
                        <div class="col-md-3">
                            <div class="card">
                                <div class="card-body">
                                    <h5 style="color: #475569; font-weight: 600; font-size: 0.9rem;">Total Transaksi
                                    </h5>
                                    <h2 id="laporanTotalTransaksi"
                                        style="color: #0f172a; font-weight: 800; letter-spacing: 0.3px;">0</h2>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card">
                                <div class="card-body">
                                    <h5 style="color: #475569; font-weight: 600; font-size: 0.9rem;">Total Penjualan
                                    </h5>
                                    <h2 id="laporanTotalPenjualan"
                                        style="color: #0f172a; font-weight: 800; letter-spacing: 0.3px;">Rp 0</h2>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card">
                                <div class="card-body">
                                    <h5 style="color: #475569; font-weight: 600; font-size: 0.9rem;">Total Diskon</h5>
                                    <h2 id="laporanTotalDiskon"
                                        style="color: #0f172a; font-weight: 800; letter-spacing: 0.3px;">Rp 0</h2>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card">
                                <div class="card-body">
                                    <h5 style="color: #475569; font-weight: 600; font-size: 0.9rem;">Total Pajak</h5>
                                    <h2 id="laporanTotalPajak"
                                        style="color: #0f172a; font-weight: 800; letter-spacing: 0.3px;">Rp 0</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Export Buttons -->
                    <div class="mb-4 p-3 bg-light rounded-3" style="border-left: 4px solid #0ea5e9;">
                        <h5 style="margin-bottom: 1rem; color: #0f172a; font-weight: 700; letter-spacing: 0.3px;">
                            <i class="bi bi-download"></i> Export Laporan
                        </h5>
                        <div class="row g-2">
                            <div class="col-md-4">
                                <button class="btn btn-info w-100" onclick="exportLaporanPDF()">
                                    <i class="bi bi-filetype-pdf"></i> Export ke PDF
                                </button>
                            </div>
                            <div class="col-md-4">
                                <button class="btn btn-success w-100" onclick="exportLaporanExcel()">
                                    <i class="bi bi-filetype-xlsx"></i> Export ke Excel
                                </button>
                            </div>
                            <div class="col-md-4">
                                <button class="btn btn-secondary w-100" onclick="printLaporan()">
                                    <i class="bi bi-printer"></i> Print Laporan
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Transaksi Table -->
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tanggal & Waktu</th>
                                    <th>Total Item</th>
                                    <th>Total Harga</th>
                                    <th>Diskon</th>
                                    <th>Pajak</th>
                                    <th>Total Bayar</th>
                                    <th>Kasir</th>
                                </tr>
                            </thead>
                            <tbody id="tableLaporan">
                                <!-- transaksi data -->
                            </tbody>
                        </table>
                    </div>

                    <p style="color: #475569; font-style: italic; margin-top: 1rem; font-weight: 600;">Laporan
                        penjualan real-time dari transaksi hari ini</p>
                </section>

                <!-- SETTINGS -->
                <section id="settings" class="d-none">
                    <h3><i class="bi bi-gear"></i> Pengaturan Sistem</h3>

                    <div class="alert alert-danger d-none" id="alertSettings" role="alert"></div>
                    <div class="alert alert-success d-none" id="alertSettingsSuccess" role="alert"></div>

                    <!-- Settings Tabs -->
                    <ul class="nav nav-tabs" id="settingsTabs" role="tablist" style="margin-bottom: 2rem;">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="tab-general" data-bs-toggle="tab"
                                data-bs-target="#content-general" type="button" role="tab">
                                <i class="bi bi-info-circle"></i> Informasi Umum
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="tab-calculation" data-bs-toggle="tab"
                                data-bs-target="#content-calculation" type="button" role="tab">
                                <i class="bi bi-calculator"></i> Kalkulasi
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="tab-users" data-bs-toggle="tab"
                                data-bs-target="#content-users" type="button" role="tab">
                                <i class="bi bi-people"></i> User Management
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="tab-database" data-bs-toggle="tab"
                                data-bs-target="#content-database" type="button" role="tab">
                                <i class="bi bi-database"></i> Database
                            </button>
                        </li>
                    </ul>

                    <!-- Tab Content -->
                    <div class="tab-content" id="settingsTabContent">
                        <!-- GENERAL INFO TAB -->
                        <div class="tab-pane fade show active" id="content-general" role="tabpanel">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title" style="color: #0f172a; font-weight: 700;">Informasi Toko
                                    </h5>
                                    <form id="formGeneralSettings">
                                        <div class="mb-3">
                                            <label class="form-label" style="color: #0f172a; font-weight: 700;">Nama
                                                Toko</label>
                                            <input type="text" class="form-control" id="namaTokoSetting"
                                                placeholder="Nama toko Anda"
                                                style="border-radius: 8px; border: 1.5px solid #cbd5e1; color: #0f172a;">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label"
                                                style="color: #0f172a; font-weight: 700;">Alamat</label>
                                            <textarea class="form-control" id="alamatTokoSetting" rows="3" placeholder="Alamat toko"
                                                style="border-radius: 8px; border: 1.5px solid #cbd5e1; color: #0f172a;"></textarea>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label" style="color: #0f172a; font-weight: 700;">Nomor
                                                Telepon</label>
                                            <input type="text" class="form-control" id="teleponTokoSetting"
                                                placeholder="Nomor telepon"
                                                style="border-radius: 8px; border: 1.5px solid #cbd5e1; color: #0f172a;">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label"
                                                style="color: #0f172a; font-weight: 700;">Email</label>
                                            <input type="email" class="form-control" id="emailTokoSetting"
                                                placeholder="Email toko"
                                                style="border-radius: 8px; border: 1.5px solid #cbd5e1; color: #0f172a;">
                                        </div>
                                        <button type="submit" class="btn btn-primary">
                                            <i class="bi bi-save"></i> Simpan Pengaturan
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <!-- CALCULATION TAB -->
                        <div class="tab-pane fade" id="content-calculation" role="tabpanel">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title" style="color: #0f172a; font-weight: 700;">Pengaturan
                                        Kalkulasi</h5>
                                    <form id="formCalculationSettings">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label"
                                                        style="color: #0f172a; font-weight: 700;">Pajak Default
                                                        (%)</label>
                                                    <input type="number" class="form-control"
                                                        id="pajakDefaultSetting" placeholder="Contoh: 10"
                                                        min="0" max="100"
                                                        style="border-radius: 8px; border: 1.5px solid #cbd5e1; color: #0f172a;">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label"
                                                        style="color: #0f172a; font-weight: 700;">Diskon Default
                                                        (%)</label>
                                                    <input type="number" class="form-control"
                                                        id="diskonDefaultSetting" placeholder="Contoh: 0"
                                                        min="0" max="100"
                                                        style="border-radius: 8px; border: 1.5px solid #cbd5e1; color: #0f172a;">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox"
                                                    id="pajakEnabledSetting" checked>
                                                <label class="form-check-label"
                                                    style="color: #0f172a; font-weight: 600;">
                                                    Aktifkan Pajak Otomatis
                                                </label>
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label"
                                                style="color: #0f172a; font-weight: 700;">Threshold Stok Rendah
                                                (unit)</label>
                                            <input type="number" class="form-control" id="stokThresholdSetting"
                                                placeholder="Contoh: 5" min="1"
                                                style="border-radius: 8px; border: 1.5px solid #cbd5e1; color: #0f172a;">
                                        </div>
                                        <button type="submit" class="btn btn-primary">
                                            <i class="bi bi-save"></i> Simpan Pengaturan
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <!-- USERS TAB -->
                        <div class="tab-pane fade" id="content-users" role="tabpanel">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title" style="color: #0f172a; font-weight: 700;">Kelola User</h5>
                                    <div class="mb-3">
                                        <button class="btn btn-success" data-bs-toggle="modal"
                                            data-bs-target="#addUserModal">
                                            <i class="bi bi-person-plus"></i> Tambah User
                                        </button>
                                    </div>
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Username</th>
                                                    <th>Nama</th>
                                                    <th>Role</th>
                                                    <th>Status</th>
                                                    <th>Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tableUsers">
                                                <!-- users will be inserted -->
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- DATABASE TAB -->
                        <div class="tab-pane fade" id="content-database" role="tabpanel">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title" style="color: #0f172a; font-weight: 700;">Manajemen
                                        Database</h5>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="p-3 bg-light rounded" style="border-left: 4px solid #4f46e5;">
                                                <h6 style="color: #0f172a; font-weight: 700;">Info Database</h6>
                                                <p style="margin: 0.5rem 0; color: #475569; font-weight: 600;">
                                                    <i class="bi bi-database"></i> Total Barang: <strong
                                                        style="color: #0f172a;">0</strong>
                                                </p>
                                                <p style="margin: 0.5rem 0; color: #475569; font-weight: 600;">
                                                    <i class="bi bi-receipt"></i> Total Transaksi: <strong
                                                        style="color: #0f172a;">0</strong>
                                                </p>
                                                <p style="margin: 0.5rem 0; color: #475569; font-weight: 600;">
                                                    <i class="bi bi-clock-history"></i> Update Terakhir: <strong
                                                        style="color: #0f172a;">-</strong>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="p-3 bg-light rounded" style="border-left: 4px solid #10b981;">
                                                <h6 style="color: #0f172a; font-weight: 700;">Backup & Reset</h6>
                                                <button class="btn btn-warning w-100 mb-2" onclick="backupData()">
                                                    <i class="bi bi-cloud-download"></i> Backup Data
                                                </button>
                                                <button class="btn btn-danger w-100" onclick="resetDatabase()">
                                                    <i class="bi bi-arrow-counterclockwise"></i> Reset Database
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- PROFILE SECTION -->
                <section id="profile" class="d-none">
                    <h3><i class="bi bi-person"></i> Profil Saya</h3>

                    <div class="row">
                        <!-- Profile Card -->
                        <div class="col-md-4">
                            <div class="card" style="border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                                <div class="card-body text-center" style="padding: 2rem;">
                                    <!-- Profile Picture Container -->
                                    <div style="position: relative; display: inline-block; margin-bottom: 1rem;">
                                        <img id="sectionProfileImage"
                                            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 24 24' fill='none' stroke='%234f46e5' stroke-width='1.5'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E"
                                            alt="Profile"
                                            style="width: 120px; height: 120px; border-radius: 50%; background: #e0e7ff; padding: 10px; object-fit: cover; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; border: 3px solid #4f46e5;">
                                        <button type="button" id="btnChangeProfileImage"
                                            style="position: absolute; bottom: 0; right: 0; background: #4f46e5; color: white; border: 2px solid white; border-radius: 50%; width: 40px; height: 40px; padding: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1rem; transition: background 0.3s ease;"
                                            title="Ubah Foto Profile">
                                            <i class="bi bi-camera-fill"></i>
                                        </button>
                                        <input type="file" id="profileImageInput" accept="image/*"
                                            style="display: none;">
                                    </div>
                                    <h4 id="sectionProfileName"
                                        style="color: #0f172a; font-weight: 800; margin-bottom: 0.5rem;">-</h4>
                                    <p id="sectionProfileRole"
                                        style="color: #475569; margin-bottom: 1rem; font-weight: 600;">-</p>
                                    <div
                                        style="display: inline-block; background: #e0e7ff; color: #4f46e5; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; margin-bottom: 1.5rem;">
                                        <i class="bi bi-shield-check"></i> <span id="sectionProfileBadge">User</span>
                                    </div>
                                    <hr style="opacity: 0.2;">
                                    <p style="color: #6b7280; font-size: 0.9rem; margin-bottom: 0.5rem;">
                                        <i class="bi bi-person"></i> <span id="sectionProfileUsername">-</span>
                                    </p>
                                    <p style="color: #6b7280; font-size: 0.9rem; margin-bottom: 0.5rem;">
                                        <i class="bi bi-briefcase"></i> <span id="sectionProfilePosition">-</span>
                                    </p>
                                    <p style="color: #6b7280; font-size: 0.9rem;">
                                        <i class="bi bi-calendar-event"></i> <span
                                            id="sectionProfileLastLogin">-</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Profile Details & Settings -->
                        <div class="col-md-8">
                            <div class="card"
                                style="border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 1.5rem;">
                                <div class="card-header"
                                    style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border: none; border-radius: 15px 15px 0 0;">
                                    <h5 style="color: white; margin: 0; font-weight: 600;">
                                        <i class="bi bi-info-circle"></i> Informasi Akun
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label style="color: #6b7280; font-size: 0.85rem; font-weight: 600;">Nama
                                                Lengkap</label>
                                            <p id="sectionFullName" style="color: #1f2937; font-weight: 500;">-</p>
                                        </div>
                                        <div class="col-md-6">
                                            <label
                                                style="color: #6b7280; font-size: 0.85rem; font-weight: 600;">Username</label>
                                            <p id="sectionUsername" style="color: #1f2937; font-weight: 500;">-</p>
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label style="color: #6b7280; font-size: 0.85rem; font-weight: 600;">Role /
                                                Jabatan</label>
                                            <p id="sectionRole" style="color: #1f2937; font-weight: 500;">-</p>
                                        </div>
                                        <div class="col-md-6">
                                            <label
                                                style="color: #6b7280; font-size: 0.85rem; font-weight: 600;">Status</label>
                                            <p><span class="badge bg-success" style="font-size: 0.85rem;">✓
                                                    Aktif</span></p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <label style="color: #6b7280; font-size: 0.85rem; font-weight: 600;">Login
                                                Terakhir</label>
                                            <p id="sectionLastLogin" style="color: #1f2937; font-weight: 500;">-</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Change Password Card -->
                            <div class="card" style="border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                                <div class="card-header"
                                    style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); border: none; border-radius: 15px 15px 0 0;">
                                    <h5 style="color: white; margin: 0; font-weight: 600;">
                                        <i class="bi bi-lock"></i> Ubah Password
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <form id="sectionFormChangePassword" autocomplete="off">
                                        <input type="text" id="sectionFormUsername" name="username"
                                            value="" autocomplete="username" hidden
                                            style="display:none; visibility:hidden; width:0; height:0; padding:0; border:none;">
                                        <div class="mb-3">
                                            <label class="form-label"
                                                style="color: #374151; font-weight: 600;">Password Saat Ini</label>
                                            <div class="input-group" style="border-radius: 8px; overflow: hidden;">
                                                <input type="password" class="form-control password-field"
                                                    id="sectionCurrentPassword" name="current_password"
                                                    placeholder="Masukkan password saat ini" required
                                                    autocomplete="current-password"
                                                    style="border-radius: 8px; border: 2px solid #e5e7eb;">
                                                <button type="button"
                                                    class="btn btn-outline-secondary password-toggle"
                                                    onclick="togglePasswordVisibility('sectionCurrentPassword')"
                                                    style="border: 2px solid #e5e7eb; border-left: none; border-radius: 0;">
                                                    <i class="bi bi-eye" id="icon-sectionCurrentPassword"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label"
                                                style="color: #374151; font-weight: 600;">Password Baru</label>
                                            <div class="input-group" style="border-radius: 8px; overflow: hidden;">
                                                <input type="password" class="form-control password-field"
                                                    id="sectionNewPasswordField" placeholder="Masukkan password baru"
                                                    required autocomplete="new-password"
                                                    style="border-radius: 8px; border: 2px solid #e5e7eb;">
                                                <button type="button"
                                                    class="btn btn-outline-secondary password-toggle"
                                                    onclick="togglePasswordVisibility('sectionNewPasswordField')"
                                                    style="border: 2px solid #e5e7eb; border-left: none; border-radius: 0;">
                                                    <i class="bi bi-eye" id="icon-sectionNewPasswordField"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label"
                                                style="color: #374151; font-weight: 600;">Konfirmasi Password
                                                Baru</label>
                                            <div class="input-group" style="border-radius: 8px; overflow: hidden;">
                                                <input type="password" class="form-control password-field"
                                                    id="sectionConfirmNewPassword"
                                                    placeholder="Konfirmasi password baru" required
                                                    autocomplete="new-password"
                                                    style="border-radius: 8px; border: 2px solid #e5e7eb;">
                                                <button type="button"
                                                    class="btn btn-outline-secondary password-toggle"
                                                    onclick="togglePasswordVisibility('sectionConfirmNewPassword')"
                                                    style="border: 2px solid #e5e7eb; border-left: none; border-radius: 0;">
                                                    <i class="bi bi-eye" id="icon-sectionConfirmNewPassword"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="alert alert-info d-none" id="sectionAlertChangePassword"
                                            role="alert"></div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <button type="submit" class="btn btn-warning w-100"
                                                    id="btnUpdatePassword">
                                                    <i class="bi bi-check-lg"></i> Perbarui Password
                                                </button>
                                            </div>
                                            <div class="col-md-6">
                                                <button type="reset" class="btn btn-secondary w-100"
                                                    id="btnResetPassword">
                                                    <i class="bi bi-arrow-counterclockwise"></i> Reset
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    </div>

    <!-- CROP IMAGE MODAL -->
    <div class="modal fade" id="cropImageModal" tabindex="-1" aria-labelledby="cropImageModalLabel"
        aria-hidden="true" role="dialog">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content" style="border-radius: 15px;">
                <div class="modal-header"
                    style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border: none;">
                    <h5 class="modal-title" id="cropImageModalLabel" style="color: white; font-weight: 600;">
                        <i class="bi bi-crop"></i> Crop Foto Profile
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body" style="padding: 2rem;">
                    <div
                        style="position: relative; display: flex; justify-content: center; align-items: center; background: #f3f4f6; border-radius: 12px; overflow: hidden; min-height: 400px;">
                        <canvas id="cropCanvas"
                            style="max-width: 100%; max-height: 400px; display: block;"></canvas>
                    </div>
                    <div style="margin-top: 1.5rem; color: #6b7280; font-size: 0.85rem;">
                        <p style="margin-bottom: 0.5rem;"><i class="bi bi-info-circle"></i> Drag untuk memposisikan,
                            gunakan slide untuk zoom</p>
                    </div>
                    <div style="margin-top: 1.5rem;">
                        <label class="form-label" style="color: #374151; font-weight: 600;">Zoom</label>
                        <input type="range" id="zoomSlider" class="form-range" min="1" max="3"
                            step="0.1" value="1" style="cursor: pointer;">
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 2px solid #e5e7eb; padding: 1.5rem;">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="bi bi-x-circle"></i> Batal
                    </button>
                    <button type="button" class="btn btn-primary" id="btnSaveCrop">
                        <i class="bi bi-check-circle"></i> Simpan Crop
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- ADD USER MODAL -->
    <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addUserModalLabel">
                        <i class="bi bi-person-plus"></i> Tambah User Baru
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-danger d-none" id="alertAddUser" role="alert"></div>
                    <form id="formAddUser">
                        <div class="mb-3">
                            <label class="form-label">Nama Lengkap</label>
                            <input type="text" class="form-control" id="newUserName"
                                placeholder="Nama Lengkap" required autocomplete="name">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Username</label>
                            <input type="text" class="form-control" id="newUsername" placeholder="Username"
                                required autocomplete="username">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Password</label>
                            <input type="password" class="form-control" id="newPassword" placeholder="Password"
                                required autocomplete="new-password">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Role</label>
                            <select class="form-select" id="newUserRole" required>
                                <option value="">-- Pilih Role --</option>
                                <option value="admin">Admin</option>
                                <option value="kasir">Kasir</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-primary" form="formAddUser"
                        onclick="setTimeout(() => saveNewUser(), 0); return false;">
                        <i class="bi bi-save"></i> Simpan User
                    </button>
                </div>
            </div>
        </div>
    </div>


    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

    <!-- SweetAlert2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <!-- html2pdf library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

    <!-- File Import Handler -->
    <script>
        document.getElementById('importBarangFile')?.addEventListener('change', function() {
            importBarangCSV();
        });
    </script>
</body>

</html>
