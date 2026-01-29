// ===== DATA STORAGE =====
let barangList = [];
let keranjang = [];
let transaksiList = [];
let currentUser = null;
let currentPageBarang = 1;
let filteredBarangList = []; // For search/filtering
const ITEMS_PER_PAGE_BARANG = 6;

const API_URL = '/api';

// ===== DEMO USERS DATA =====
let demoUsers = [
    { id: 1, username: 'admin', password: 'admin123', name: 'Administrator', role: 'admin' },
    { id: 2, username: 'kasir1', password: 'kasir123', name: 'Kasir 1', role: 'kasir' },
    { id: 3, username: 'kasir2', password: 'kasir123', name: 'Kasir 2', role: 'kasir' }
];

// ===== DEMO BARANG DATA =====
let demoBarang = [
    { id: 1, kategori: 'Makanan', nama: 'Nasi Goreng Spesial', harga: 25000, stok: 15, deskripsi: 'Nasi goreng dengan ayam, telur, dan sayuran segar' },
    { id: 2, kategori: 'Makanan', nama: 'Ayam Bakar Madu', harga: 35000, stok: 8, deskripsi: 'Ayam bakar dengan saus madu dan rempah-rempah' },
    { id: 3, kategori: 'Minuman', nama: 'Es Teh Manis', harga: 5000, stok: 25, deskripsi: 'Teh manis dingin yang menyegarkan' },
    { id: 4, kategori: 'Minuman', nama: 'Jus Jeruk Segar', harga: 12000, stok: 12, deskripsi: 'Jus jeruk murni tanpa gula tambahan' },
    { id: 5, kategori: 'Permen', nama: 'Power Bank 10000mAh', harga: 150000, stok: 5, deskripsi: 'Power bank berkapasitas tinggi untuk kebutuhan sehari-hari' },
    { id: 6, kategori: 'Permen', nama: 'Kabel USB Type-C', harga: 25000, stok: 20, deskripsi: 'Kabel USB Type-C universal untuk berbagai perangkat' },
    { id: 7, kategori: 'Sirup Es', nama: 'Tas Sekolah Anak', harga: 75000, stok: 3, deskripsi: 'Tas sekolah tahan lama dengan desain anak-anak' },
    { id: 8, kategori: 'Sirup Es', nama: 'Botol Minum Stainless', harga: 45000, stok: 10, deskripsi: 'Botol minum stainless steel anti karat' },
    { id: 9, kategori: 'Makanan', nama: 'Bakso Urat Jumbo', harga: 18000, stok: 6, deskripsi: 'Bakso urat jumbo dengan kuah kaldu sapi' },
    { id: 10, kategori: 'Minuman', nama: 'Kopi Hitam', harga: 8000, stok: 18, deskripsi: 'Kopi hitam pekat tanpa gula' },
    { id: 11, kategori: 'Lainnya', nama: 'Buku Tulis Campus', harga: 5000, stok: 30, deskripsi: 'Buku tulis campus 100 lembar' },
    { id: 12, kategori: 'Lainnya', nama: 'Pensil 2B', harga: 2000, stok: 50, deskripsi: 'Pensil 2B berkualitas untuk menulis dan menggambar' }
];

// Load users from localStorage if exists
function loadDemoUsers() {
    const saved = localStorage.getItem('demoUsers');
    if (saved) {
        try {
            demoUsers = JSON.parse(saved);
            console.log('[INIT] Users loaded from localStorage');
        } catch (error) {
            console.warn('[INIT] Failed to load users from localStorage, using defaults');
        }
    }
}

// Load demo barang data if no barang exists
function loadDemoBarang() {
    const savedBarang = localStorage.getItem('barangList');
    if (!savedBarang || JSON.parse(savedBarang).length === 0) {
        // No barang data exists, populate with demo data
        localStorage.setItem('barangList', JSON.stringify(demoBarang));
        console.log('[INIT] Demo barang data populated');
    } else {
        console.log('[INIT] Barang data already exists in localStorage');
    }
}

// ===== LOGIN SYSTEM =====
function initializeAuth() {
    // Load users from localStorage first
    loadDemoUsers();
    loadDemoBarang();

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainContent();
    } else {
        showLoginModal();
    }
}

function showLoginModal() {
    document.getElementById('mainNavbar').style.display = 'none';
    document.getElementById('mainContent').style.display = 'none';
    const loginModalEl = document.getElementById('loginModal');
    loginModalEl.setAttribute('aria-hidden', 'true');
    const loginModal = new bootstrap.Modal(loginModalEl, {
        backdrop: 'static',
        keyboard: false
    });
    loginModal.show();
    // Set aria-hidden after show
    setTimeout(() => {
        loginModalEl.setAttribute('aria-hidden', 'false');
    }, 300);
}

function showMainContent() {
    const navbarEl = document.getElementById('mainNavbar');
    const contentEl = document.getElementById('mainContent');
    const displayEl = document.getElementById('userDisplay');
    const loginModalEl = document.getElementById('loginModal');

    // Safety checks
    if (!navbarEl || !contentEl || !loginModalEl) {
        console.error('[AUTH] Required DOM elements not found');
        return;
    }

    navbarEl.style.display = 'block';
    contentEl.style.display = 'block';
    loginModalEl.setAttribute('aria-hidden', 'true');

    if (displayEl) {
        displayEl.textContent = currentUser.name + ' (' + currentUser.role + ')';
    }

    // Delay dashboard load with longer timeout and retry mechanism
    setTimeout(() => {
        try {
            loadDashboard();
        } catch (error) {
            console.error('[DASHBOARD] Initial load failed, retrying...', error);
            setTimeout(() => loadDashboard(), 300);
        }
    }, 400);
}

document.getElementById('formLogin')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('inputUsername').value;
    const password = document.getElementById('inputPassword').value;

    // Find user in demo data
    const user = demoUsers.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        // Save last login directly
        localStorage.setItem('lastLogin_' + currentUser.id, new Date().toISOString());

        // Hide login modal and show main content
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();
        setTimeout(() => {
            showMainContent();
        }, 300);
        document.getElementById('formLogin').reset();
    } else {
        showAlert('loginAlert', '❌ Username atau password salah!', 'danger');
    }
});

function logout() {
    Swal.fire({
        title: 'Konfirmasi Logout',
        text: 'Yakin ingin keluar dari sistem?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Keluar',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('currentUser');
            currentUser = null;
            location.reload();
        }
    });
}

// Load profile page with all user data
function loadProfilePage() {
    try {
        if (!currentUser) {
            showAlert('profileAlert', 'Tidak ada user yang login', 'danger');
            return;
        }

        console.log('Loading Profile Page...');
        console.log('Current User:', currentUser);

        // Populate profile section elements with null checks
        const sectionProfileName = document.getElementById('sectionProfileName');
        if (sectionProfileName) sectionProfileName.textContent = currentUser.name || '-';

        const sectionProfileUsername = document.getElementById('sectionProfileUsername');
        if (sectionProfileUsername) sectionProfileUsername.textContent = currentUser.username || '-';

        const sectionProfileRole = document.getElementById('sectionProfileRole');
        if (sectionProfileRole) sectionProfileRole.textContent = currentUser.role || '-';

        const sectionProfileBadge = document.getElementById('sectionProfileBadge');
        if (sectionProfileBadge) sectionProfileBadge.textContent = currentUser.role || 'User';

        const sectionProfilePosition = document.getElementById('sectionProfilePosition');
        if (sectionProfilePosition) sectionProfilePosition.textContent = currentUser.position || '-';

        const sectionFullName = document.getElementById('sectionFullName');
        if (sectionFullName) sectionFullName.textContent = currentUser.name || '-';

        const sectionUsername = document.getElementById('sectionUsername');
        if (sectionUsername) sectionUsername.textContent = currentUser.username || '-';

        const sectionRole = document.getElementById('sectionRole');
        if (sectionRole) sectionRole.textContent = currentUser.role || '-';

        // Set hidden form username
        const sectionFormUsername = document.getElementById('sectionFormUsername');
        if (sectionFormUsername) sectionFormUsername.value = currentUser.username || '';

        // Get and display last login
        const lastLogin = localStorage.getItem('lastLogin_' + currentUser.id);
        if (lastLogin) {
            const lastLoginDate = new Date(lastLogin);
            const formattedDate = lastLoginDate.toLocaleString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            const sectionProfileLastLogin = document.getElementById('sectionProfileLastLogin');
            if (sectionProfileLastLogin) sectionProfileLastLogin.textContent = formattedDate;

            const sectionLastLogin = document.getElementById('sectionLastLogin');
            if (sectionLastLogin) sectionLastLogin.textContent = formattedDate;
        } else {
            const sectionProfileLastLogin = document.getElementById('sectionProfileLastLogin');
            if (sectionProfileLastLogin) sectionProfileLastLogin.textContent = 'Belum ada login history';

            const sectionLastLogin = document.getElementById('sectionLastLogin');
            if (sectionLastLogin) sectionLastLogin.textContent = 'Belum ada login history';
        }

        // Reset form and hide alert
        const sectionFormChangePassword = document.getElementById('sectionFormChangePassword');
        if (sectionFormChangePassword) sectionFormChangePassword.reset();

        const alertElement = document.getElementById('sectionAlertChangePassword');
        if (alertElement) {
            alertElement.classList.add('d-none');
        }

        // Auto-fill current password from demoUsers (AFTER reset)
        const userFromDB = demoUsers.find(u => u.id === currentUser.id);
        if (userFromDB) {
            const sectionCurrentPassword = document.getElementById('sectionCurrentPassword');
            if (sectionCurrentPassword) sectionCurrentPassword.value = userFromDB.password;
            console.log('[PROFILE] Current password auto-filled for user:', currentUser.username);
        }

        // Load user profile image from localStorage
        loadProfileImage();

        console.log('Profile page loaded successfully');
    } catch (error) {
        console.error('Error loading profile page:', error);
        showAlert('profileAlert', 'Error memuat halaman profil: ' + error.message, 'danger');
    }
}

// Load profile image from localStorage
function loadProfileImage() {
    try {
        const profileImageKey = 'profileImage_' + currentUser.id;
        const savedImage = localStorage.getItem(profileImageKey);
        const profileImageElement = document.getElementById('sectionProfileImage');

        if (savedImage && profileImageElement) {
            profileImageElement.src = savedImage;
            console.log('[PROFILE] Profile image loaded from localStorage');
        }
    } catch (error) {
        console.error('Error loading profile image:', error);
    }
}

// Handle profile image change - show crop modal
function handleProfileImageChange(event) {
    try {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showAlert('alertKasir', 'Silakan pilih file gambar!', 'warning');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showAlert('alertKasir', 'Ukuran file terlalu besar (max 2MB)!', 'warning');
            return;
        }

        // Read and show crop modal
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;
            window.currentImageData = imageData; // Store for cropping
            initializeCropCanvas(imageData);

            // Show crop modal
            const cropModal = new bootstrap.Modal(document.getElementById('cropImageModal'));
            cropModal.show();
        };

        reader.readAsDataURL(file);

        // Reset input
        event.target.value = '';
    } catch (error) {
        console.error('Error handling profile image change:', error);
        showAlert('alertKasir', 'Error mengubah foto profil', 'danger');
    }
}

// Initialize crop canvas with image
function initializeCropCanvas(imageData) {
    const canvas = document.getElementById('cropCanvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function () {
        window.cropImage = img; // Store image for manipulation
        window.cropZoom = 1;
        window.cropOffsetX = 0;
        window.cropOffsetY = 0;

        // Set canvas dimensions (square for profile)
        canvas.width = 400;
        canvas.height = 400;

        // Calculate initial position to fit image
        const scale = Math.min(400 / img.width, 400 / img.height);
        window.cropScale = scale;

        // Draw initial image
        redrawCropCanvas();
    };

    img.src = imageData;
}

// Redraw crop canvas with current zoom/offset
function redrawCropCanvas() {
    const canvas = document.getElementById('cropCanvas');
    const ctx = canvas.getContext('2d');

    if (!window.cropImage) return;

    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw circle guide for profile
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(200, 200, 180, 0, Math.PI * 2);
    ctx.stroke();

    // Calculate dimensions with zoom
    const zoomedWidth = window.cropImage.width * window.cropScale * window.cropZoom;
    const zoomedHeight = window.cropImage.height * window.cropScale * window.cropZoom;

    // Center by default
    const x = (400 - zoomedWidth) / 2 + window.cropOffsetX;
    const y = (400 - zoomedHeight) / 2 + window.cropOffsetY;

    // Draw image
    ctx.drawImage(window.cropImage, x, y, zoomedWidth, zoomedHeight);

    // Draw darkening outside circle
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.rect(0, 0, 400, 400);
    ctx.arc(200, 200, 180, 0, Math.PI * 2);
    ctx.fill('evenodd');
}

// Setup crop modal interactions
function setupCropModalListeners() {
    const zoomSlider = document.getElementById('zoomSlider');
    const canvas = document.getElementById('cropCanvas');
    const btnSaveCrop = document.getElementById('btnSaveCrop');

    // Zoom slider
    if (zoomSlider) {
        zoomSlider.addEventListener('input', (e) => {
            window.cropZoom = parseFloat(e.target.value);
            redrawCropCanvas();
        });
    }

    // Canvas drag for positioning
    if (canvas) {
        let isDragging = false;
        let startX = 0;
        let startY = 0;

        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            canvas.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            window.cropOffsetX += deltaX;
            window.cropOffsetY += deltaY;

            startX = e.clientX;
            startY = e.clientY;

            redrawCropCanvas();
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            canvas.style.cursor = 'grab';
        });

        canvas.addEventListener('mouseenter', () => {
            canvas.style.cursor = 'grab';
        });
    }

    // Save crop button
    if (btnSaveCrop) {
        const newHandler = (e) => {
            saveCroppedImage();
        };
        const oldHandler = btnSaveCrop.onclick;
        btnSaveCrop.onclick = newHandler;
    }
}

// Save cropped image
function saveCroppedImage() {
    try {
        const canvas = document.getElementById('cropCanvas');
        const croppedCanvas = document.createElement('canvas');
        const ctx = croppedCanvas.getContext('2d');

        // Create circular crop
        const size = 360; // Diameter of circle
        croppedCanvas.width = size;
        croppedCanvas.height = size;

        // Draw circular region
        const sourceCanvas = canvas;
        const sourceCtx = sourceCanvas.getContext('2d');

        // Create circular clipping path
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();

        // Get image data from crop canvas
        const imageData = sourceCtx.getImageData(
            (400 - size) / 2,
            (400 - size) / 2,
            size,
            size
        );
        ctx.putImageData(imageData, 0, 0);

        // Convert to data URL
        const croppedImageData = croppedCanvas.toDataURL('image/png');

        // Save to profile
        const profileImageElement = document.getElementById('sectionProfileImage');
        profileImageElement.src = croppedImageData;

        // Save to localStorage
        const profileImageKey = 'profileImage_' + currentUser.id;
        localStorage.setItem(profileImageKey, croppedImageData);
        console.log('[PROFILE] Cropped image saved to localStorage');

        // Close modal
        const cropModal = bootstrap.Modal.getInstance(document.getElementById('cropImageModal'));
        if (cropModal) cropModal.hide();

        showAlert('alertKasir', '✓ Foto profil berhasil disimpan!', 'success');
    } catch (error) {
        console.error('Error saving cropped image:', error);
        showAlert('alertKasir', 'Error menyimpan foto: ' + error.message, 'danger');
    }
}

// Update password from profile section
function sectionUpdatePassword() {
    try {
        const currentPassword = document.getElementById('sectionCurrentPassword').value;
        const newPassword = document.getElementById('sectionNewPasswordField').value;
        const confirmPassword = document.getElementById('sectionConfirmNewPassword').value;
        const alertElement = document.getElementById('sectionAlertChangePassword');

        console.log('Update Password - Current User:', currentUser);

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            if (alertElement) {
                alertElement.className = 'alert alert-warning';
                alertElement.innerHTML = '<i class="bi bi-exclamation-circle"></i> Semua field harus diisi!';
                alertElement.classList.remove('d-none');
            }
            return;
        }

        if (newPassword !== confirmPassword) {
            if (alertElement) {
                alertElement.className = 'alert alert-danger';
                alertElement.innerHTML = '<i class="bi bi-x-circle"></i> Password baru dan konfirmasi tidak sesuai!';
                alertElement.classList.remove('d-none');
            }
            return;
        }

        if (newPassword.length < 6) {
            if (alertElement) {
                alertElement.className = 'alert alert-danger';
                alertElement.innerHTML = '<i class="bi bi-x-circle"></i> Password minimal 6 karakter!';
                alertElement.classList.remove('d-none');
            }
            return;
        }

        // Check if current password is correct
        const user = demoUsers.find(u => u.id === currentUser.id);
        if (!user || user.password !== currentPassword) {
            if (alertElement) {
                alertElement.className = 'alert alert-danger';
                alertElement.innerHTML = '<i class="bi bi-x-circle"></i> Password saat ini salah!';
                alertElement.classList.remove('d-none');
            }
            return;
        }

        // Update password
        user.password = newPassword;
        currentUser.password = newPassword; // Update in memory

        // Save updated users to localStorage
        localStorage.setItem('demoUsers', JSON.stringify(demoUsers));
        console.log('[PROFILE] Password saved to localStorage');

        // Show success message
        if (alertElement) {
            alertElement.className = 'alert alert-success';
            alertElement.innerHTML = '<i class="bi bi-check-circle"></i> Password berhasil diubah!';
            alertElement.classList.remove('d-none');
        }

        // Reset form
        const sectionFormChangePassword = document.getElementById('sectionFormChangePassword');
        if (sectionFormChangePassword) sectionFormChangePassword.reset();

        const sectionFormUsername = document.getElementById('sectionFormUsername');
        if (sectionFormUsername) sectionFormUsername.value = currentUser.username;

        // Close alert after 3 seconds
        setTimeout(function () {
            if (alertElement) {
                alertElement.classList.add('d-none');
            }
        }, 3000);

        console.log('Password updated successfully');
    } catch (error) {
        console.error('Error updating password:', error);
        const alertElement = document.getElementById('sectionAlertChangePassword');
        if (alertElement) {
            alertElement.className = 'alert alert-danger';
            alertElement.innerHTML = '<i class="bi bi-x-circle"></i> Error: ' + error.message;
            alertElement.classList.remove('d-none');
        }
    }
}

// Reset password form
function sectionResetPasswordForm() {
    try {
        const sectionFormChangePassword = document.getElementById('sectionFormChangePassword');
        if (sectionFormChangePassword) sectionFormChangePassword.reset();

        const sectionFormUsername = document.getElementById('sectionFormUsername');
        if (sectionFormUsername) sectionFormUsername.value = currentUser.username || '';

        // Reset all password fields to default visibility
        const passwordFields = ['sectionCurrentPassword', 'sectionNewPasswordField', 'sectionConfirmNewPassword'];
        passwordFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const icon = document.getElementById('icon-' + fieldId);
            if (field) {
                field.type = 'password';
            }
            if (icon) {
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });

        // Hide alert and re-fill current password
        const alertElement = document.getElementById('sectionAlertChangePassword');
        if (alertElement) {
            alertElement.classList.add('d-none');
        }

        // Auto-fill current password again
        const userFromDB = demoUsers.find(u => u.id === currentUser.id);
        if (userFromDB) {
            document.getElementById('sectionCurrentPassword').value = userFromDB.password;
            console.log('[PROFILE] Current password re-filled after reset');
        }

        console.log('Password form reset');
    } catch (error) {
        console.error('Error resetting form:', error);
    }
}

// Toggle password visibility
function togglePasswordVisibility(fieldId) {
    try {
        const field = document.getElementById(fieldId);
        const icon = document.getElementById('icon-' + fieldId);

        if (!field || !icon) {
            console.warn('[PASSWORD] Field atau icon tidak ditemukan:', fieldId);
            return;
        }

        if (field.type === 'password') {
            // Show password
            field.type = 'text';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
            console.log('[PASSWORD] Password shown:', fieldId);
        } else {
            // Hide password
            field.type = 'password';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
            console.log('[PASSWORD] Password hidden:', fieldId);
        }
    } catch (error) {
        console.error('[PASSWORD] Error toggling visibility:', error);
    }
}

// ===== UTILITY FUNCTIONS =====
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// ===== DASHBOARD FUNCTIONS =====
let dashboardCharts = {};
let dashboardPeriod = 'today';

function setDashboardPeriod(period) {
    dashboardPeriod = period;

    // Update button states
    document.getElementById('btnPeriodToday')?.classList.remove('btn-primary');
    document.getElementById('btnPeriodToday')?.classList.add('btn-outline-primary');
    document.getElementById('btnPeriodWeek')?.classList.remove('btn-primary');
    document.getElementById('btnPeriodWeek')?.classList.add('btn-outline-primary');
    document.getElementById('btnPeriodMonth')?.classList.remove('btn-primary');
    document.getElementById('btnPeriodMonth')?.classList.add('btn-outline-primary');

    const btnMap = {
        'today': 'btnPeriodToday',
        'week': 'btnPeriodWeek',
        'month': 'btnPeriodMonth'
    };

    if (btnMap[period]) {
        document.getElementById(btnMap[period])?.classList.add('btn-primary');
        document.getElementById(btnMap[period])?.classList.remove('btn-outline-primary');
    }

    loadDashboard();
}

function loadDashboard() {
    try {
        // Check if dashboard section exists
        const dashboardSection = document.getElementById('dashboard');
        if (!dashboardSection) {
            console.warn('[DASHBOARD] Dashboard section not found in DOM');
            return;
        }

        // Ensure dashboardCharts object exists
        if (!window.dashboardCharts) {
            window.dashboardCharts = {};
        }

        // Delay all dashboard operations to ensure DOM is fully ready
        setTimeout(() => {
            try {
                // Load KPI metrics
                updateDashboardMetrics();

                // Load charts
                initializeDashboardCharts();
                updateDashboardCharts();

                // Load additional data
                updateDashboardStok();
                updateDashboardTopProducts();
                updateDashboardLatestTransactions();

                console.log('[DASHBOARD] Dashboard fully loaded with period:', dashboardPeriod);
            } catch (error) {
                console.error('[DASHBOARD] Error loading dashboard components:', error);
            }
        }, 150);

        console.log('[DASHBOARD] Dashboard loaded with period:', dashboardPeriod);
    } catch (error) {
        console.error('[DASHBOARD] Error loading dashboard:', error);
    }
}

function getDateRange() {
    const today = new Date();
    let startDate, endDate = today;

    switch (dashboardPeriod) {
        case 'today':
            startDate = new Date(today);
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'week':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7);
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'month':
            startDate = new Date(today);
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);
            break;
        default:
            startDate = new Date(today);
            startDate.setHours(0, 0, 0, 0);
    }

    return { startDate, endDate };
}

function updateDashboardMetrics() {
    try {
        // Comprehensive pre-flight check for ALL required elements
        const requiredElements = [
            'dashboardTotalBarang',
            'dashboardTotalTransaksi',
            'dashboardTotalPenjualan',
            'dashboardAvgPenjualan',
            'dashboardBarangTrend',
            'dashboardTransaksiTrend',
            'dashboardPenjualanTrend',
            'dashboardAvgTrend'
        ];

        // Verify ALL elements exist first
        let allElementsValid = true;
        const elementCheckResults = {};

        for (const id of requiredElements) {
            const el = document.getElementById(id);
            elementCheckResults[id] = el ? 'OK' : 'MISSING';
            if (!el) {
                allElementsValid = false;
                console.warn('[DASHBOARD] Required element missing:', id);
            }
        }

        if (!allElementsValid) {
            console.error('[DASHBOARD] Cannot update metrics - missing elements:', elementCheckResults);
            return;
        }

        const { startDate, endDate } = getDateRange();


        // Ensure arrays are initialized
        if (!Array.isArray(transaksiList)) {
            console.warn('[DASHBOARD] transaksiList is not an array');
            transaksiList = [];
        }
        if (!Array.isArray(barangList)) {
            console.warn('[DASHBOARD] barangList is not an array');
            barangList = [];
        }

        // Calculate metrics from transaksiList array
        const filteredTransaksi = transaksiList.filter(t => {
            try {
                const tDate = new Date(t.tanggal);
                return tDate >= startDate && tDate <= endDate;
            } catch (e) {
                return false;
            }
        });

        const totalBarang = barangList.length || 0;
        const totalTransaksi = filteredTransaksi.length || 0;
        const totalPenjualan = filteredTransaksi.reduce((sum, t) => {
            return sum + (t.totalBayar || t.total || 0);
        }, 0);
        const avgPenjualan = totalTransaksi > 0 ? Math.round(totalPenjualan / totalTransaksi) : 0;

        // Get previous period data
        const prevRange = getPreviousPeriodRange();
        const prevTransaksi = transaksiList.filter(t => {
            try {
                const tDate = new Date(t.tanggal);
                return tDate >= prevRange.startDate && tDate <= prevRange.endDate;
            } catch (e) {
                return false;
            }
        });
        const prevPenjualan = prevTransaksi.reduce((sum, t) => {
            return sum + (t.totalBayar || t.total || 0);
        }, 0);

        // Calculate trends
        const penjualanTrend = prevPenjualan > 0 ? Math.round(((totalPenjualan - prevPenjualan) / prevPenjualan) * 100) : 0;
        const transaksiTrend = prevTransaksi.length > 0 ? Math.round(((totalTransaksi - prevTransaksi.length) / prevTransaksi.length) * 100) : 0;

        // Update elements safely with explicit null checks
        const updateElement = (id, value, isHTML = false) => {
            const el = document.getElementById(id);
            if (el) {
                if (isHTML) {
                    el.innerHTML = value;
                } else {
                    el.textContent = value;
                }
            } else {
                console.warn('[DASHBOARD] Element not found:', id);
            }
        };

        const updateElementStyle = (id, prop, value) => {
            const el = document.getElementById(id);
            if (el) {
                el.style[prop] = value;
            }
        };

        // Update values with individual try-catch
        try {
            updateElement('dashboardTotalBarang', totalBarang);
        } catch (e) {
            console.warn('[DASHBOARD] Could not update dashboardTotalBarang:', e);
        }

        try {
            updateElement('dashboardTotalTransaksi', totalTransaksi);
        } catch (e) {
            console.warn('[DASHBOARD] Could not update dashboardTotalTransaksi:', e);
        }

        try {
            updateElement('dashboardTotalPenjualan', formatRupiah(totalPenjualan));
        } catch (e) {
            console.warn('[DASHBOARD] Could not update dashboardTotalPenjualan:', e);
        }

        try {
            updateElement('dashboardAvgPenjualan', formatRupiah(avgPenjualan));
        } catch (e) {
            console.warn('[DASHBOARD] Could not update dashboardAvgPenjualan:', e);
        }

        // Update trends with color and icon
        try {
            const trendColor = (value) => value >= 0 ? '#10b981' : '#ef4444';
            const trendIcon = (value) => value >= 0 ? '↑' : '↓';

            try {
                updateElementStyle('dashboardPenjualanTrend', 'color', trendColor(penjualanTrend));
                updateElement('dashboardPenjualanTrend', `${trendIcon(penjualanTrend)} ${Math.abs(penjualanTrend)}% dari periode lalu`);
            } catch (e) {
                console.warn('[DASHBOARD] Could not update penjualanTrend:', e);
            }

            try {
                updateElementStyle('dashboardTransaksiTrend', 'color', trendColor(transaksiTrend));
                updateElement('dashboardTransaksiTrend', `${trendIcon(transaksiTrend)} ${Math.abs(transaksiTrend)}% dari periode lalu`);
            } catch (e) {
                console.warn('[DASHBOARD] Could not update transaksiTrend:', e);
            }

            // Trend for barang (always stable)
            try {
                const barangTrendEl = document.getElementById('dashboardBarangTrend');
                if (barangTrendEl && barangTrendEl.parentElement) {
                    barangTrendEl.style.color = '#10b981';
                    barangTrendEl.textContent = '→ Stabil';
                }
            } catch (e) {
                console.warn('[DASHBOARD] Could not update barangTrend:', e);
            }

            // Trend for avg penjualan (shows as info)
            try {
                const avgTrendEl = document.getElementById('dashboardAvgTrend');
                if (avgTrendEl && avgTrendEl.parentElement) {
                    avgTrendEl.textContent = 'Per transaksi';
                }
            } catch (e) {
                console.warn('[DASHBOARD] Could not update avgTrend:', e);
            }
        } catch (e) {
            console.warn('[DASHBOARD] Error updating trends:', e);
        }

        console.log('[DASHBOARD] Metrics updated:', { totalBarang, totalTransaksi, totalPenjualan, avgPenjualan });

    } catch (error) {
        console.error('[DASHBOARD] Error updating metrics:', error);
    }
}

function getPreviousPeriodRange() {
    const { startDate } = getDateRange();
    let prevStart, prevEnd = new Date(startDate);

    switch (dashboardPeriod) {
        case 'today':
            prevStart = new Date(startDate);
            prevStart.setDate(startDate.getDate() - 1);
            prevEnd = new Date(startDate);
            prevEnd.setSeconds(prevEnd.getSeconds() - 1);
            break;
        case 'week':
            prevStart = new Date(startDate);
            prevStart.setDate(startDate.getDate() - 7);
            prevEnd = new Date(startDate);
            prevEnd.setSeconds(prevEnd.getSeconds() - 1);
            break;
        case 'month':
            prevStart = new Date(startDate);
            prevStart.setMonth(startDate.getMonth() - 1);
            prevEnd = new Date(startDate);
            prevEnd.setSeconds(prevEnd.getSeconds() - 1);
            break;
    }

    return { startDate: prevStart, endDate: prevEnd };
}

function initializeDashboardCharts() {
    try {
        // Verify Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('[DASHBOARD] Chart.js library not loaded');
            return;
        }

        // Initialize dashboardCharts if not exists
        if (!window.dashboardCharts) {
            window.dashboardCharts = {};
        }

        // Chart Penjualan (Line Chart)
        const ctx1 = document.getElementById('chartPenjualan');
        if (ctx1 && !dashboardCharts.penjualan) {
            try {
                dashboardCharts.penjualan = new Chart(ctx1, {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [{
                            label: 'Penjualan (Rp)',
                            data: [],
                            borderColor: '#4f46e5',
                            backgroundColor: 'rgba(79, 70, 229, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#4f46e5',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                                labels: { usePointStyle: true, padding: 15 }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function (value) {
                                        return 'Rp ' + (value / 1000).toFixed(0) + 'K';
                                    }
                                }
                            }
                        }
                    }
                });
                console.log('[DASHBOARD] Chart Penjualan initialized');
            } catch (e) {
                console.error('[DASHBOARD] Error initializing Chart Penjualan:', e);
            }
        }

        // Chart Kategori (Doughnut Chart)
        const ctx2 = document.getElementById('chartKategori');
        if (ctx2 && !dashboardCharts.kategori) {
            try {
                dashboardCharts.kategori = new Chart(ctx2, {
                    type: 'doughnut',
                    data: {
                        labels: [],
                        datasets: [{
                            data: [],
                            backgroundColor: [
                                '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'
                            ],
                            borderColor: '#fff',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: { usePointStyle: true, padding: 15 }
                            }
                        }
                    }
                });
                console.log('[DASHBOARD] Chart Kategori initialized');
            } catch (e) {
                console.error('[DASHBOARD] Error initializing Chart Kategori:', e);
            }
        }

        // Chart Harian (Bar Chart)
        const ctx3 = document.getElementById('chartHarian');
        if (ctx3 && !dashboardCharts.harian) {
            try {
                dashboardCharts.harian = new Chart(ctx3, {
                    type: 'bar',
                    data: {
                        labels: [],
                        datasets: [
                            {
                                label: 'Transaksi',
                                data: [],
                                backgroundColor: '#f59e0b',
                                borderColor: '#f59e0b',
                                borderWidth: 1
                            },
                            {
                                label: 'Penjualan (Rp)',
                                data: [],
                                backgroundColor: '#10b981',
                                borderColor: '#10b981',
                                borderWidth: 1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'x',
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
                console.log('[DASHBOARD] Chart Harian initialized');
            } catch (e) {
                console.error('[DASHBOARD] Error initializing Chart Harian:', e);
            }
        }
    } catch (error) {
        console.error('[DASHBOARD] Error initializing charts:', error);
    }
}

function updateDashboardCharts() {
    try {
        // Verify dashboardCharts object exists
        if (!window.dashboardCharts) {
            console.warn('[DASHBOARD] dashboardCharts object not initialized');
            return;
        }

        const { startDate, endDate } = getDateRange();

        // Ensure arrays are initialized
        if (!Array.isArray(transaksiList)) {
            console.warn('[DASHBOARD] transaksiList is not an array');
            transaksiList = [];
        }
        if (!Array.isArray(barangList)) {
            console.warn('[DASHBOARD] barangList is not an array');
            barangList = [];
        }

        // Filter transactions by date range
        const filteredTransaksi = transaksiList.filter(t => {
            try {
                if (!t || !t.tanggal) return false;
                const tDate = new Date(t.tanggal);
                return tDate >= startDate && tDate <= endDate;
            } catch (e) {
                return false;
            }
        });

        console.log('[DASHBOARD] Filtered transactions:', filteredTransaksi.length);

        // Update Chart Penjualan (by date)
        try {
            const dateMap = {};
            filteredTransaksi.forEach(t => {
                try {
                    const date = new Date(t.tanggal);
                    const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
                    const amount = t.totalBayar || t.total || 0;
                    dateMap[dateStr] = (dateMap[dateStr] || 0) + amount;
                } catch (e) {
                    console.warn('[DASHBOARD] Error processing transaction date:', e);
                }
            });

            if (dashboardCharts.penjualan && Object.keys(dateMap).length > 0) {
                dashboardCharts.penjualan.data.labels = Object.keys(dateMap);
                dashboardCharts.penjualan.data.datasets[0].data = Object.values(dateMap);
                dashboardCharts.penjualan.update();
                console.log('[DASHBOARD] Chart Penjualan updated with', Object.keys(dateMap).length, 'data points');
            }
        } catch (e) {
            console.error('[DASHBOARD] Error updating Chart Penjualan:', e);
        }

        // Update Chart Kategori (by product category in transactions)
        try {
            const kategoriMap = {};
            filteredTransaksi.forEach(t => {
                try {
                    if (t.items && Array.isArray(t.items)) {
                        t.items.forEach(item => {
                            if (item && item.id) {
                                const prod = barangList.find(b => b && b.id === item.id);
                                if (prod && prod.kategori) {
                                    kategoriMap[prod.kategori] = (kategoriMap[prod.kategori] || 0) + (item.quantity || 1);
                                }
                            }
                        });
                    }
                } catch (e) {
                    console.warn('[DASHBOARD] Error processing transaction items:', e);
                }
            });

            if (dashboardCharts.kategori && Object.keys(kategoriMap).length > 0) {
                dashboardCharts.kategori.data.labels = Object.keys(kategoriMap);
                dashboardCharts.kategori.data.datasets[0].data = Object.values(kategoriMap);
                dashboardCharts.kategori.update();
                console.log('[DASHBOARD] Chart Kategori updated with', Object.keys(kategoriMap).length, 'categories');
            }
        } catch (e) {
            console.error('[DASHBOARD] Error updating Chart Kategori:', e);
        }

        // Update Chart Harian (daily stats: transaction count and sales)
        try {
            const hariMap = {};
            filteredTransaksi.forEach(t => {
                try {
                    const date = new Date(t.tanggal);
                    const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
                    const amount = t.totalBayar || t.total || 0;
                    if (!hariMap[dateStr]) {
                        hariMap[dateStr] = { transaksi: 0, penjualan: 0 };
                    }
                    hariMap[dateStr].transaksi += 1;
                    hariMap[dateStr].penjualan += amount;
                } catch (e) {
                    console.warn('[DASHBOARD] Error processing daily stats:', e);
                }
            });

            if (dashboardCharts.harian && Object.keys(hariMap).length > 0) {
                dashboardCharts.harian.data.labels = Object.keys(hariMap);
                dashboardCharts.harian.data.datasets[0].data = Object.values(hariMap).map(h => h.transaksi || 0);
                dashboardCharts.harian.data.datasets[1].data = Object.values(hariMap).map(h => h.penjualan || 0);
                dashboardCharts.harian.update();
                console.log('[DASHBOARD] Chart Harian updated with', Object.keys(hariMap).length, 'days');
            }
        } catch (e) {
            console.error('[DASHBOARD] Error updating Chart Harian:', e);
        }

        console.log('[DASHBOARD] All charts updated successfully');
    } catch (error) {
        console.error('[DASHBOARD] Error updating charts:', error);
    }
}

function updateDashboardStok() {
    try {
        const container = document.getElementById('dashboardStokStatus');
        if (!container) return;

        if (!Array.isArray(barangList)) barangList = [];

        const lowStokItems = barangList.filter(b => b.stok < 10).sort((a, b) => a.stok - b.stok);

        let html = '';
        if (lowStokItems.length === 0) {
            html = '<p style="color: #10b981; text-align: center; padding: 1rem;">✓ Semua stok normal</p>';
        } else {
            lowStokItems.forEach(item => {
                const color = item.stok <= 3 ? '#ef4444' : '#f59e0b';
                html += `<div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">
                    <div>
                        <p style="color: #1f2937; font-weight: 500; margin: 0; font-size: 0.9rem;">${item.nama || '-'}</p>
                        <small style="color: #6b7280;">${item.kategori || '-'}</small>
                    </div>
                    <span style="background: ${color}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-weight: 600; font-size: 0.85rem;">
                        ${item.stok} unit
                    </span>
                </div>`;
            });
        }
        container.innerHTML = html;
        console.log('[DASHBOARD] Stok status updated');
    } catch (error) {
        console.error('[DASHBOARD] Error updating stok:', error);
    }
}

function updateDashboardTopProducts() {
    try {
        const container = document.getElementById('dashboardTopProducts');
        if (!container) return;

        if (!Array.isArray(transaksiList)) transaksiList = [];

        // Count product sales
        const productSales = {};
        transaksiList.forEach(t => {
            if (t.items && Array.isArray(t.items)) {
                t.items.forEach(item => {
                    if (!productSales[item.id]) {
                        productSales[item.id] = { quantity: 0, total: 0, nama: item.nama };
                    }
                    productSales[item.id].quantity += item.quantity || 1;
                    productSales[item.id].total += (item.harga || 0) * (item.quantity || 1);
                });
            }
        });

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        let html = '';
        if (topProducts.length === 0) {
            html = '<p style="color: #9ca3af; text-align: center; padding: 1rem;">Belum ada data penjualan</p>';
        } else {
            topProducts.forEach((product, index) => {
                html += `<div style="display: flex; align-items: center; padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">
                    <span style="background: #4f46e5; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 0.75rem; font-size: 0.85rem;">${index + 1}</span>
                    <div style="flex: 1;">
                        <p style="color: #1f2937; font-weight: 500; margin: 0; font-size: 0.9rem;">${product.nama || '-'}</p>
                        <small style="color: #6b7280;">${product.quantity} terjual</small>
                    </div>
                    <span style="color: #4f46e5; font-weight: 600;">${formatRupiah(product.total)}</span>
                </div>`;
            });
        }
        container.innerHTML = html;
        console.log('[DASHBOARD] Top products updated');
    } catch (error) {
        console.error('[DASHBOARD] Error updating top products:', error);
    }
}

function updateDashboardLatestTransactions() {
    try {
        const container = document.getElementById('dashboardLatestTransactions');
        if (!container) return;

        if (!Array.isArray(transaksiList)) transaksiList = [];

        const latest = transaksiList.slice(-5).reverse();

        let html = '';
        if (latest.length === 0) {
            html = '<p style="color: #9ca3af; text-align: center; padding: 1rem;">Belum ada transaksi</p>';
        } else {
            latest.forEach(t => {
                const date = new Date(t.tanggal);
                const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                const itemCount = (t.items && Array.isArray(t.items)) ? t.items.length : 0;
                const total = t.totalBayar || t.total || 0;
                html += `<div style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <p style="color: #1f2937; font-weight: 500; margin: 0; font-size: 0.9rem;">${itemCount} item</p>
                            <small style="color: #6b7280;">${timeStr}</small>
                        </div>
                        <span style="color: #10b981; font-weight: 600;">${formatRupiah(total)}</span>
                    </div>
                </div>`;
            });
        }
        container.innerHTML = html;
        console.log('[DASHBOARD] Latest transactions updated');
    } catch (error) {
        console.error('[DASHBOARD] Error updating latest transactions:', error);
    }
}

function showSection(id) {
    try {
        // Hide all sections immediately
        document.querySelectorAll('main section').forEach(sec => {
            sec.classList.add('d-none');
        });

        // Show target section with null check
        const targetSection = document.getElementById(id);
        if (!targetSection) {
            console.error(`[SECTION] Section with id '${id}' not found in DOM`);
            return;
        }
        targetSection.classList.remove('d-none');

        // Update active sidebar
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const targetLink = event?.target?.closest('.nav-link');
        if (targetLink) {
            targetLink.classList.add('active');
        }

        // Close sidebar on mobile
        const sidebar = document.querySelector('.sidebar');
        if (sidebar?.classList.contains('active')) {
            sidebar.classList.remove('active');
        }

        // Defer data loading to next tick to prevent blocking
        requestAnimationFrame(() => {
            setTimeout(() => {
                if (id === 'barang') loadBarang();
                if (id === 'kasir') loadBarangForKasir();
                if (id === 'transaksi') loadTransaksi();
                if (id === 'laporan') loadLaporan();
                if (id === 'settings') loadSettingsPage();
                if (id === 'dashboard') loadDashboard();
                if (id === 'profile') loadProfilePage();
            }, 0);
        });
    } catch (error) {
        console.error('[SECTION] Error in showSection:', error);
    }
}

function showAlert(elementId, message, type = 'info', duration = 3000) {
    // Map alert types to SweetAlert icons
    const iconMap = {
        'danger': 'error',
        'warning': 'warning',
        'success': 'success',
        'info': 'info'
    };

    const icon = iconMap[type] || 'info';

    Swal.fire({
        icon: icon,
        title: type === 'success' ? 'Berhasil' : type === 'danger' ? 'Gagal' : 'Informasi',
        text: message,
        timer: duration,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
    });
}

function updateTime() {
    const now = new Date();
    const currentTimeEl = document.getElementById('currentTime');
    if (currentTimeEl) currentTimeEl.textContent = now.toLocaleTimeString('id-ID');

    const dashboardTimeEl = document.getElementById('dashboardTime');
    if (dashboardTimeEl) dashboardTimeEl.textContent = now.toLocaleString('id-ID');
}

// ===== STOK ALERT SYSTEM =====
const STOK_THRESHOLD = 5; // Threshold untuk warning stok rendah

function checkStokLow() {
    const lowStokItems = barangList.filter(barang => barang.stok < STOK_THRESHOLD && barang.stok > 0);
    const noStokItems = barangList.filter(barang => barang.stok === 0);

    return { lowStokItems, noStokItems };
}

function updateBarangCounts() {
    try {
        const totalBarangEl = document.getElementById('totalBarangCount');
        if (totalBarangEl) {
            totalBarangEl.textContent = barangList.length;
        }

        const { lowStokItems } = checkStokLow();
        const lowStokCount = lowStokItems.length;
        const stokAlertEl = document.getElementById('stokAlertCount');
        if (stokAlertEl) {
            stokAlertEl.textContent = lowStokCount;
            stokAlertEl.style.display = lowStokCount > 0 ? 'inline' : 'none';
        }

        console.log('[BARANG] Counts updated:', { total: barangList.length, alerts: lowStokCount });
    } catch (error) {
        console.error('[BARANG] Error updating counts:', error);
    }
}

// ===== BARANG MANAGEMENT =====
async function loadBarang() {
    try {
        console.log('[BARANG] Loading barang data...');

        // Load from localStorage
        const saved = localStorage.getItem('barangList');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Ensure it's an array and validate structure
                if (Array.isArray(parsed)) {
                    barangList = parsed.filter(item => {
                        // Basic validation for each item
                        return item &&
                            typeof item.id !== 'undefined' &&
                            typeof item.nama === 'string' &&
                            typeof item.kategori === 'string' &&
                            typeof item.harga === 'number' &&
                            typeof item.stok === 'number';
                    });
                    console.log('[BARANG] Loaded', barangList.length, 'items from localStorage');
                } else {
                    console.warn('[BARANG] Invalid data structure, using empty array');
                    barangList = [];
                }
            } catch (parseError) {
                console.error('[BARANG] Error parsing localStorage data:', parseError);
                barangList = [];
            }
        } else {
            console.log('[BARANG] No data in localStorage, using empty array');
            barangList = [];
        }

        // Reset filtered list and pagination when loading
        filteredBarangList = [];
        currentPageBarang = 1;

        // Render table
        renderBarangTable(currentPageBarang);

        // Update counts
        updateBarangCounts();

        // Check stock alerts
        checkStokAlertOnLoad();

        console.log('[BARANG] Barang data loaded successfully');

    } catch (error) {
        console.error('[BARANG] Error loading barang:', error);
        barangList = [];
        renderBarangTable();
        showAlert('alertBarang', 'Error memuat data barang: ' + error.message, 'danger');
    }
}

function getStokBadgeClass(stok) {
    if (stok === 0) return 'danger';
    if (stok < STOK_THRESHOLD) return 'warning';
    if (stok > 10) return 'success';
    return 'info';
}

function getStokBadgeText(stok) {
    if (stok === 0) return `⚠️ ${stok} (Habis)`;
    if (stok < STOK_THRESHOLD) return `⚠️ ${stok} (Rendah)`;
    return stok;
}

function renderBarangTable(page = 1) {
    try {
        const tbody = document.getElementById('tableBarang');
        if (!tbody) {
            console.error('[BARANG] tableBarang element not found');
            return;
        }

        tbody.innerHTML = '';

        // Use filtered list if search is active, otherwise use full list
        const listToRender = filteredBarangList.length > 0 ? filteredBarangList : barangList;
        const totalItems = listToRender.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE_BARANG);

        // Validate page number - ensure it's within valid range
        let validPage = page;
        if (validPage < 1) validPage = 1;
        if (validPage > totalPages && totalPages > 0) validPage = totalPages;
        if (totalItems === 0) validPage = 1;

        // Update current page if it was adjusted
        if (validPage !== page) {
            currentPageBarang = validPage;
        }

        const startIndex = (validPage - 1) * ITEMS_PER_PAGE_BARANG;
        const endIndex = Math.min(startIndex + ITEMS_PER_PAGE_BARANG, totalItems);
        const itemsToShow = listToRender.slice(startIndex, endIndex);

        itemsToShow.forEach((barang, index) => {
            const row = document.createElement('tr');
            const badgeClass = getStokBadgeClass(barang.stok);
            const badgeText = getStokBadgeText(barang.stok);
            const kategoriIcon = getKategoriIcon(barang.kategori);
            const globalIndex = startIndex + index + 1; // Global numbering

            row.innerHTML = `
                <td>${globalIndex}</td>
                <td><span class="badge bg-info">${kategoriIcon} ${barang.kategori || '-'}</span></td>
                <td>${barang.nama}</td>
                <td>${formatRupiah(barang.harga)}</td>
                <td><span class="badge bg-${badgeClass}">${badgeText}</span></td>
                <td>${barang.deskripsi || '-'}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-warning" onclick="editBarang(${barang.id})" title="Edit Barang">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="hapusBarang(${barang.id})" title="Hapus Barang">
                            <i class="bi bi-trash"></i> Hapus
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Update totalBarang element with pagination info
        const totalBarangEl = document.getElementById('totalBarang');
        if (totalBarangEl) {
            const displayList = filteredBarangList.length > 0 ? filteredBarangList : barangList;
            totalBarangEl.textContent = `${displayList.length} item${displayList.length !== 1 ? 's' : ''}`;
        }

        // Update page info
        const pageInfoEl = document.getElementById('pageInfo');
        if (pageInfoEl) {
            if (totalPages > 1) {
                pageInfoEl.textContent = `- Halaman ${validPage} dari ${totalPages}`;
            } else {
                pageInfoEl.textContent = '';
            }
        }

        // Render pagination controls
        renderBarangPagination(validPage, totalPages);

        console.log('[BARANG] Table rendered with', itemsToShow.length, 'items on page', validPage, 'of', totalPages);
    } catch (error) {
        console.error('[BARANG] Error rendering barang table:', error);
    }
}

function renderBarangPagination(currentPage, totalPages) {
    const paginationContainer = document.getElementById('barangPagination');
    if (!paginationContainer) {
        console.error('[BARANG] barangPagination element not found');
        return;
    }

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '<nav aria-label="Barang pagination"><ul class="pagination justify-content-center">';

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changeBarangPage(${currentPage - 1})" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>`;
    } else {
        paginationHTML += '<li class="page-item disabled"><span class="page-link">&laquo;</span></li>';
    }

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changeBarangPage(1)">1</a></li>`;
        if (startPage > 2) {
            paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            paginationHTML += `<li class="page-item active"><span class="page-link">${i}</span></li>`;
        } else {
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changeBarangPage(${i})">${i}</a></li>`;
        }
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changeBarangPage(${totalPages})">${totalPages}</a></li>`;
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changeBarangPage(${currentPage + 1})" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>`;
    } else {
        paginationHTML += '<li class="page-item disabled"><span class="page-link">&raquo;</span></li>';
    }

    paginationHTML += '</ul></nav>';
    paginationContainer.innerHTML = paginationHTML;
}

function changeBarangPage(page) {
    // Validate page number
    const listToRender = filteredBarangList.length > 0 ? filteredBarangList : barangList;
    const totalItems = listToRender.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE_BARANG);

    let validPage = parseInt(page);
    if (isNaN(validPage) || validPage < 1) validPage = 1;
    if (validPage > totalPages && totalPages > 0) validPage = totalPages;
    if (totalItems === 0) validPage = 1;

    currentPageBarang = validPage;
    renderBarangTable(validPage);

    console.log('[BARANG] Changed to page', validPage, 'of', totalPages);
}

function refreshBarangTable() {
    // Refresh table while trying to maintain current page if possible
    renderBarangTable(currentPageBarang);
    console.log('[BARANG] Table refreshed, current page:', currentPageBarang);
}

// Helper function untuk kategori icon
function getKategoriIcon(kategori) {
    const icons = {
        'Permen': '📱',
        'Makanan': '🍔',
        'Minuman': '🥤',
        'Sirup Es': '🛠️',
        'Lainnya': '📦'
    };
    return icons[kategori] || '📦';
}

// Search/Filter untuk Data Barang
document.getElementById('searchBarang')?.addEventListener('keyup', function () {
    const query = this.value.toLowerCase().trim();

    if (query === '') {
        // No search query, show all items
        filteredBarangList = [];
        currentPageBarang = 1;
        renderBarangTable(1);
        return;
    }

    // Filter barangList based on search query
    filteredBarangList = barangList.filter(barang =>
        barang.nama.toLowerCase().includes(query) ||
        barang.kategori.toLowerCase().includes(query) ||
        (barang.deskripsi && barang.deskripsi.toLowerCase().includes(query)) ||
        formatRupiah(barang.harga).includes(query) ||
        barang.stok.toString().includes(query)
    );

    // Reset to first page when searching
    currentPageBarang = 1;
    renderBarangTable(1);

    console.log('[BARANG] Search results:', filteredBarangList.length, 'items found');
});

function resetSearchBarang() {
    const searchBarang = document.getElementById('searchBarang');
    if (searchBarang) searchBarang.value = '';
    filteredBarangList = [];
    currentPageBarang = 1;
    renderBarangTable(1);
    console.log('[BARANG] Search reset, showing all items');
}

document.getElementById('formBarang')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form elements
    const namaEl = document.getElementById('inputNamaBarang');
    const hargaEl = document.getElementById('inputHargaBarang');
    const stokEl = document.getElementById('inputStokBarang');
    const deskripsiEl = document.getElementById('inputDeskripsi');
    const kategoriEl = document.getElementById('inputKategori');

    // Safety checks
    if (!namaEl || !hargaEl || !stokEl || !deskripsiEl || !kategoriEl) {
        showAlert('alertBarang', 'Form tidak lengkap. Silakan refresh halaman.', 'danger');
        return;
    }

    // Get values
    const nama = namaEl.value.trim();
    const harga = parseFloat(hargaEl.value);
    const stok = parseInt(stokEl.value);
    const deskripsi = deskripsiEl.value.trim();
    const kategori = kategoriEl.value;

    console.log('[BARANG] Create attempt:', { nama, harga, stok, kategori });

    // Validation
    if (!nama) {
        showAlert('alertBarang', 'Nama barang tidak boleh kosong', 'warning');
        namaEl.focus();
        return;
    }

    if (!kategori) {
        showAlert('alertBarang', 'Kategori harus dipilih', 'warning');
        kategoriEl.focus();
        return;
    }

    if (isNaN(harga) || harga < 0) {
        showAlert('alertBarang', 'Harga harus berupa angka positif', 'warning');
        hargaEl.focus();
        return;
    }

    if (isNaN(stok) || stok < 0) {
        showAlert('alertBarang', 'Stok harus berupa angka positif', 'warning');
        stokEl.focus();
        return;
    }

    // Check for duplicate name
    const existingItem = barangList.find(b => b.nama.toLowerCase() === nama.toLowerCase());
    if (existingItem) {
        showAlert('alertBarang', 'Nama barang sudah ada di sistem. Gunakan nama lain.', 'warning');
        namaEl.focus();
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('#formBarang button[type="submit"]');
    if (!submitBtn) {
        showAlert('alertBarang', 'Error: Tombol submit tidak ditemukan', 'danger');
        return;
    }

    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Menyimpan...';
    submitBtn.disabled = true;

    try {
        // Generate new ID (find max ID + 1)
        const maxId = barangList.length > 0 ? Math.max(...barangList.map(b => parseInt(b.id))) : 0;
        const newId = maxId + 1;

        // Create new barang object
        const newBarang = {
            id: newId,
            nama,
            kategori,
            harga,
            stok,
            deskripsi
        };

        // Add to array
        barangList.push(newBarang);

        // Save to localStorage
        localStorage.setItem('barangList', JSON.stringify(barangList));
        console.log('[BARANG] Item created successfully:', newBarang);

        // Reset form
        document.getElementById('formBarang').reset();

        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Show success message
        showAlert('alertBarang', '✓ Barang berhasil ditambahkan!', 'success');

        // Refresh UI after small delay
        setTimeout(() => {
            loadBarang(); // Reload barang table
            loadBarangForKasir(); // Update kasir display
            loadDashboard(); // Update dashboard
            console.log('[BARANG] UI refreshed after create');
        }, 300);

    } catch (error) {
        console.error('[BARANG] Error in create barang:', error);

        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        showAlert('alertBarang', '❌ ' + (error.message || 'Terjadi kesalahan saat menyimpan'), 'danger');
    }
});

async function hapusBarang(id) {
    try {
        console.log('[BARANG] Delete attempt for ID:', id);

        // Find item to confirm deletion
        const itemToDelete = barangList.find(b => parseInt(b.id) === parseInt(id));
        if (!itemToDelete) {
            showAlert('alertBarang', 'Barang tidak ditemukan', 'danger');
            return;
        }

        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Hapus Barang',
            html: `Yakin ingin menghapus barang:<br><br><strong>${itemToDelete.nama}</strong><br><small class="text-muted">${itemToDelete.kategori} - ${formatRupiah(itemToDelete.harga)}</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        });

        if (!result.isConfirmed) return;

        // Show loading
        Swal.fire({
            title: 'Menghapus...',
            html: 'Mohon tunggu sebentar',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        // Remove from array
        const initialLength = barangList.length;
        barangList = barangList.filter(b => parseInt(b.id) !== parseInt(id));

        if (barangList.length === initialLength) {
            throw new Error('Barang gagal dihapus dari database');
        }

        // Save to localStorage
        localStorage.setItem('barangList', JSON.stringify(barangList));
        console.log('[BARANG] Item deleted successfully:', itemToDelete);

        // Close loading
        Swal.close();

        // Show success message
        showAlert('alertBarang', '✓ Barang berhasil dihapus!', 'success');

        // Refresh UI after small delay
        setTimeout(() => {
            loadBarang(); // Refresh table with pagination
            updateBarangCounts(); // Update counts
            loadBarangForKasir(); // Update kasir display
            loadDashboard(); // Update dashboard
            console.log('[BARANG] UI refreshed after delete');
        }, 300);

    } catch (error) {
        console.error('[BARANG] Error deleting barang:', error);

        // Close loading if open
        Swal.close();

        showAlert('alertBarang', '❌ ' + (error.message || 'Terjadi kesalahan saat menghapus'), 'danger');
    }
}

// ===== HAPUS SEMUA BARANG =====
async function hapusSemuaBarang() {
    try {
        // Refresh data terlebih dahulu untuk memastikan kita punya data terbaru
        await loadBarang();

        if (barangList.length === 0) {
            showAlert('alertBarang', 'Tidak ada data barang untuk dihapus', 'warning');
            return;
        }

        const result = await Swal.fire({
            title: 'Hapus Semua Barang',
            html: `Yakin ingin menghapus <strong>${barangList.length}</strong> barang?<br><br><span style="color: #dc3545; font-weight: bold;">PERINGATAN: Tindakan ini tidak dapat dibatalkan!</span>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus Semua',
            cancelButtonText: 'Batal'
        });

        if (!result.isConfirmed) {
            return;
        }

        // Show loading
        Swal.fire({
            title: 'Menghapus Data...',
            html: 'Mohon tunggu sebentar',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        // Backup data sebelum hapus (untuk recovery jika diperlukan)
        const backupData = [...barangList];
        console.log('[BARANG] Backup created before mass delete:', backupData.length, 'items');

        // Clear array
        barangList = [];

        // Save empty array to localStorage
        localStorage.setItem('barangList', JSON.stringify(barangList));
        console.log('[BARANG] All items deleted from localStorage');

        // Close loading
        Swal.close();

        // Show success message
        showAlert('alertBarang', `✓ Berhasil menghapus ${backupData.length} barang!`, 'success');

        // Refresh UI after small delay
        setTimeout(() => {
            renderBarangTable(); // Refresh table
            updateBarangCounts(); // Update counts
            loadBarangForKasir(); // Update kasir display
            loadDashboard(); // Update dashboard
            console.log('[BARANG] UI refreshed after mass delete');
        }, 300);

    } catch (error) {
        console.error('[BARANG] Error in hapusSemuaBarang:', error);

        // Close loading if open
        Swal.close();

        showAlert('alertBarang', '❌ ' + (error.message || 'Terjadi kesalahan saat menghapus semua barang'), 'danger');
    }
}

// ===== EDIT BARANG =====
function editBarang(id) {
    try {
        console.log('[BARANG] Opening edit modal for ID:', id);

        // Find barang by id
        const barang = barangList.find(b => parseInt(b.id) === parseInt(id));

        if (!barang) {
            console.error('[BARANG] Barang not found with ID:', id);
            console.log('[BARANG] Available barang IDs:', barangList.map(b => b.id));
            showAlert('alertBarang', 'Barang tidak ditemukan', 'danger');
            return;
        }

        console.log('[BARANG] Found barang:', barang);

        // Get form elements
        const idEl = document.getElementById('editBarangId');
        const namaEl = document.getElementById('editNamaBarang');
        const kategoriEl = document.getElementById('editKategori');
        const hargaEl = document.getElementById('editHargaBarang');
        const stokEl = document.getElementById('editStokBarang');
        const deskripsiEl = document.getElementById('editDeskripsi');

        // Verify all elements exist
        if (!idEl || !namaEl || !kategoriEl || !hargaEl || !stokEl || !deskripsiEl) {
            console.error('[BARANG] Form elements not found');
            showAlert('alertBarang', 'Error: Form elements tidak ditemukan', 'danger');
            return;
        }

        // Fill form with barang data
        idEl.value = barang.id;
        namaEl.value = barang.nama || '';
        kategoriEl.value = barang.kategori || '';
        hargaEl.value = barang.harga || 0;
        stokEl.value = barang.stok || 0;
        deskripsiEl.value = barang.deskripsi || '';

        console.log('[BARANG] Form populated with:', {
            id: idEl.value,
            nama: namaEl.value,
            kategori: kategoriEl.value,
            harga: hargaEl.value,
            stok: stokEl.value
        });

        // Show modal
        const modalEl = document.getElementById('editBarangModal');
        if (!modalEl) {
            throw new Error('Modal element tidak ditemukan');
        }

        // Ensure form is reset before showing modal
        const form = document.getElementById('formEditBarang');
        if (form) {
            form.classList.remove('was-validated');
        }

        const modal = new bootstrap.Modal(modalEl, {
            backdrop: 'static',
            keyboard: false
        });
        modal.show();

        console.log('[BARANG] Modal shown successfully');

        // Focus on first input field
        setTimeout(() => {
            namaEl.focus();
        }, 300);

    } catch (error) {
        console.error('[BARANG] Error in editBarang:', error);
        showAlert('alertBarang', 'Error membuka form edit: ' + error.message, 'danger');
    }
}

async function updateBarang() {
    try {
        // Get form elements
        const idEl = document.getElementById('editBarangId');
        const namaEl = document.getElementById('editNamaBarang');
        const kategoriEl = document.getElementById('editKategori');
        const hargaEl = document.getElementById('editHargaBarang');
        const stokEl = document.getElementById('editStokBarang');
        const deskripsiEl = document.getElementById('editDeskripsi');

        // Safety checks
        if (!idEl || !namaEl || !kategoriEl || !hargaEl || !stokEl || !deskripsiEl) {
            throw new Error('Form elements tidak ditemukan. Silakan refresh halaman.');
        }

        // Get values
        const id = parseInt(idEl.value);
        const nama = namaEl.value.trim();
        const kategori = kategoriEl.value;
        const harga = parseFloat(hargaEl.value);
        const stok = parseInt(stokEl.value);
        const deskripsi = deskripsiEl.value.trim();

        console.log('[BARANG] Update attempt - ID:', id, 'Nama:', nama, 'Harga:', harga, 'Stok:', stok);

        // Validation
        if (!id || isNaN(id)) {
            throw new Error('ID barang tidak valid');
        }

        if (!nama) {
            showAlert('alertBarang', 'Nama barang tidak boleh kosong', 'warning');
            namaEl.focus();
            return;
        }

        if (!kategori) {
            showAlert('alertBarang', 'Kategori harus dipilih', 'warning');
            kategoriEl.focus();
            return;
        }

        if (isNaN(harga) || harga < 0) {
            showAlert('alertBarang', 'Harga harus berupa angka positif', 'warning');
            hargaEl.focus();
            return;
        }

        if (isNaN(stok) || stok < 0) {
            showAlert('alertBarang', 'Stok harus berupa angka positif', 'warning');
            stokEl.focus();
            return;
        }

        // Check for duplicate name (excluding current item)
        const existingItem = barangList.find(b => b.nama.toLowerCase() === nama.toLowerCase() && parseInt(b.id) !== id);
        if (existingItem) {
            showAlert('alertBarang', 'Nama barang sudah ada di sistem. Gunakan nama lain.', 'warning');
            namaEl.focus();
            return;
        }

        // Show loading state on submit button
        const submitBtn = document.querySelector('#formEditBarang button[type="submit"]');
        if (!submitBtn) {
            throw new Error('Tombol submit tidak ditemukan');
        }

        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Menyimpan...';
        submitBtn.disabled = true;

        // Find item index
        const itemIndex = barangList.findIndex(b => parseInt(b.id) === id);

        if (itemIndex === -1) {
            throw new Error('Barang dengan ID ' + id + ' tidak ditemukan dalam database');
        }

        // Update item in array
        const oldData = { ...barangList[itemIndex] };
        barangList[itemIndex] = {
            ...barangList[itemIndex],
            nama,
            kategori,
            harga,
            stok,
            deskripsi
        };

        // Save to localStorage
        localStorage.setItem('barangList', JSON.stringify(barangList));
        console.log('[BARANG] Item updated successfully:', {
            old: oldData,
            new: barangList[itemIndex]
        });

        // Reset form and close modal
        document.getElementById('formEditBarang').reset();
        const modalEl = document.getElementById('editBarangModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) {
            modal.hide();
        }

        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Show success message
        showAlert('alertBarang', '✓ Barang berhasil diperbarui!', 'success');

        // Refresh UI after small delay to ensure modal closes
        setTimeout(() => {
            loadBarang(); // Reload barang table
            loadBarangForKasir(); // Update kasir display
            loadDashboard(); // Update dashboard
            console.log('[BARANG] UI refreshed after update');
        }, 300);

    } catch (error) {
        console.error('[BARANG] Error in updateBarang:', error);

        // Reset button state on error
        const submitBtn = document.querySelector('#formEditBarang button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="bi bi-save"></i> Simpan Perubahan';
            submitBtn.disabled = false;
        }

        showAlert('alertBarang', '❌ ' + (error.message || 'Terjadi kesalahan saat menyimpan'), 'danger');
    }
}

// ===== EXPORT/IMPORT BARANG =====
function exportBarangCSV() {
    try {
        if (barangList.length === 0) {
            showAlert('alertBarang', 'Tidak ada data barang untuk diekspor', 'warning');
            return;
        }

        // Create CSV content
        let csvContent = 'Kategori,Nama,Harga,Stok,Deskripsi\n';

        barangList.forEach(barang => {
            // Escape commas and quotes in fields
            const kategori = `"${barang.kategori.replace(/"/g, '""')}"`;
            const nama = `"${barang.nama.replace(/"/g, '""')}"`;
            const harga = barang.harga;
            const stok = barang.stok;
            const deskripsi = barang.deskripsi ? `"${barang.deskripsi.replace(/"/g, '""')}"` : '';

            csvContent += `${kategori},${nama},${harga},${stok},${deskripsi}\n`;
        });

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `data_barang_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showAlert('alertBarang', 'Data barang berhasil diekspor ke CSV', 'success');
    } catch (error) {
        showAlert('alertBarang', 'Error export CSV: ' + error.message, 'danger');
    }
}

async function importBarangCSV() {
    try {
        const fileInput = document.getElementById('importBarangFile');
        if (!fileInput.files || fileInput.files.length === 0) {
            showAlert('alertBarang', 'Pilih file CSV terlebih dahulu', 'warning');
            return;
        }

        const file = fileInput.files[0];
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim() !== '');

        if (lines.length === 0) {
            showAlert('alertBarang', 'File CSV kosong', 'warning');
            return;
        }

        let importedCount = 0;
        let skippedCount = 0;
        let errors = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line === '') continue;

            // Parse CSV line (simple parsing, assumes no escaped commas in fields)
            const fields = line.split(',').map(field => field.replace(/^"|"$/g, '').replace(/""/g, '"').trim());

            // Skip header rows
            const firstField = fields[0]?.toLowerCase() || '';
            if (firstField.includes('kategori') || firstField.includes('nama') || firstField.includes('harga') ||
                firstField.includes('stok') || firstField.includes('deskripsi')) {
                continue; // Skip header row
            }

            if (fields.length < 4) {
                skippedCount++;
                errors.push(`Baris ${i + 1}: Format tidak valid (harus minimal 4 kolom)`);
                continue;
            }

            // Handle different CSV formats
            let kategori, nama, hargaStr, stokStr, deskripsi, deskripsiParts = [];

            if (fields.length >= 5) {
                // Format: Kategori,Nama,Harga,Stok,Deskripsi
                [kategori, nama, hargaStr, stokStr, ...deskripsiParts] = fields;
                deskripsi = deskripsiParts.join(',');
            } else if (fields.length === 4) {
                // TEMP: Force no-category format for debugging
                [nama, hargaStr, stokStr, ...deskripsiParts] = fields;
                kategori = 'Lainnya'; // Default category
                deskripsi = deskripsiParts.join(',');
                console.log(`Row ${i + 1}: FORCED no-category format: nama="${nama}", harga="${hargaStr}", stok="${stokStr}", deskripsi="${deskripsi}", kategori="${kategori}"`);
                deskripsiParts = []; // Ensure it's defined
            } else {
                // Try to detect format by checking if first field is empty
                if (fields[0] === '') {
                    // Format: ,Nama,Harga,Stok,Deskripsi
                    [, nama, hargaStr, stokStr, ...deskripsiParts] = fields;
                    kategori = 'Lainnya'; // Default category
                    deskripsi = deskripsiParts.join(',');
                } else {
                    skippedCount++;
                    errors.push(`Baris ${i + 1}: Format tidak dikenali`);
                    continue;
                }
            }

            // Clean price field (remove Rp prefix and spaces)
            hargaStr = hargaStr.replace(/Rp\s*/g, '').replace(/\s/g, '');
            stokStr = stokStr.replace(/\s/g, '');

            const harga = parseFloat(hargaStr);
            const stok = parseInt(stokStr);

            // Validate data
            if (!nama || nama.trim() === '' || isNaN(harga) || isNaN(stok) || harga < 0 || stok < 0) {
                skippedCount++;
                errors.push(`Baris ${i + 1}: Data tidak valid (nama: "${nama}", harga: "${hargaStr}", stok: "${stokStr}")`);
                continue;
            }

            // Set default category if empty
            if (!kategori || kategori.trim() === '') {
                kategori = 'Lainnya';
            }

            // Validate kategori before sending
            const validKategori = ['Permen', 'Makanan', 'Minuman', 'Sirup Es', 'Lainnya'];
            if (kategori && !validKategori.includes(kategori)) {
                skippedCount++;
                errors.push(`Baris ${i + 1}: Kategori "${kategori}" tidak valid. Kategori yang diperbolehkan: ${validKategori.join(', ')}`);
                continue;
            }

            // Check if item already exists
            const existingItem = barangList.find(b => b.nama.toLowerCase() === nama.toLowerCase().trim());

            if (existingItem) {
                // Update existing item in localStorage
                Object.assign(existingItem, {
                    nama: nama.trim(),
                    harga,
                    stok,
                    deskripsi: deskripsi.trim(),
                    kategori: kategori.trim()
                });

                // Save to localStorage
                localStorage.setItem('barangList', JSON.stringify(barangList));

                importedCount++;
                console.log(`[IMPORT] Updated existing item: ${nama.trim()}`);
            } else {
                // Create new item in localStorage
                const newItem = {
                    id: Date.now() + Math.floor(Math.random() * 1000), // Generate unique integer ID
                    nama: nama.trim(),
                    harga,
                    stok,
                    deskripsi: deskripsi.trim(),
                    kategori: kategori.trim()
                };

                barangList.push(newItem);

                // Save to localStorage
                localStorage.setItem('barangList', JSON.stringify(barangList));

                importedCount++;
                console.log(`[IMPORT] Created new item: ${nama.trim()}`);
            }
        }

        // Clear file input
        fileInput.value = '';

        // Show results
        if (importedCount > 0) {
            showAlert('alertBarang', `Import selesai: ${importedCount} item berhasil, ${skippedCount} item dilewati`, 'success');
            loadBarang(); // Refresh the table
            updateBarangCounts(); // Update counts
            loadBarangForKasir(); // Update kasir display
            loadDashboard(); // Update dashboard metrics and charts
        } else {
            showAlert('alertBarang', `Import gagal: ${skippedCount} item dilewati. Tidak ada data yang berhasil diimpor.`, 'warning');
        }

        // Log errors if any
        if (errors.length > 0 && errors.length <= 5) {
            console.warn('Import errors:', errors);
        } else if (errors.length > 5) {
            console.warn(`Import errors: ${errors.length} errors occurred. First 5:`, errors.slice(0, 5));
        }

    } catch (error) {
        showAlert('alertBarang', 'Error import CSV: ' + error.message, 'danger');
        console.error('Import CSV error:', error);
    }
}

// ===== KASIR LOGIC =====
async function loadBarangForKasir() {
    try {
        // Load from localStorage (consistent with other CRUD operations)
        await loadBarang();
        renderBarangGrid();
        console.log('[KASIR] Barang loaded for kasir from localStorage');
    } catch (error) {
        showAlert('alertKasir', 'Error memuat data barang: ' + error.message, 'danger');
    }
}

function renderBarangGrid(filteredList = null) {
    const grid = document.getElementById('barangGrid');
    const listToRender = filteredList || barangList;
    if (!grid) return; // Safety check

    grid.innerHTML = '';

    if (listToRender.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #9ca3af; padding: 3rem;">Tidak ada barang ditemukan</div>';
        const barangCountKasir = document.getElementById('barangCountKasir');
        if (barangCountKasir) barangCountKasir.textContent = '(0 barang)';
        return;
    }

    listToRender.forEach(barang => {
        const card = document.createElement('div');
        card.className = 'barang-card';
        card.onclick = () => tambahKeKeranjang(barang);
        const kategoriIcon = getKategoriIcon(barang.kategori);
        card.innerHTML = `
            <div class="barang-kategori">${kategoriIcon} ${barang.kategori || '-'}</div>
            <div class="barang-name">${barang.nama}</div>
            <div class="barang-price">${formatRupiah(barang.harga)}</div>
            <div class="barang-stock">Stok: ${barang.stok}</div>
            <button type="button" class="btn btn-primary btn-sm w-100">
                <i class="bi bi-cart-plus"></i> Tambah
            </button>
        `;
        grid.appendChild(card);
    });

    const barangCountKasir = document.getElementById('barangCountKasir');
    if (barangCountKasir) barangCountKasir.textContent = `(${listToRender.length} barang)`;
}

// Search untuk Kasir
document.getElementById('searchBarangKasir')?.addEventListener('keyup', function () {
    const query = this.value.toLowerCase();
    const kategoriFilter = document.getElementById('filterKategoriKasir')?.value;

    const filtered = barangList.filter(barang => {
        const nama = barang.nama.toLowerCase();
        const harga = String(barang.harga).toLowerCase();
        const deskripsi = (barang.deskripsi || '').toLowerCase();
        const matchesSearch = nama.includes(query) || harga.includes(query) || deskripsi.includes(query);
        const matchesKategori = !kategoriFilter || kategoriFilter === '' || barang.kategori === kategoriFilter;
        return matchesSearch && matchesKategori;
    });
    renderBarangGrid(filtered);
});

// Filter kategori untuk Kasir
document.getElementById('filterKategoriKasir')?.addEventListener('change', function () {
    const query = document.getElementById('searchBarangKasir')?.value.toLowerCase() || '';
    const kategoriFilter = this.value;

    const filtered = barangList.filter(barang => {
        const nama = barang.nama.toLowerCase();
        const harga = String(barang.harga).toLowerCase();
        const deskripsi = (barang.deskripsi || '').toLowerCase();
        const matchesSearch = query === '' || nama.includes(query) || harga.includes(query) || deskripsi.includes(query);
        const matchesKategori = !kategoriFilter || kategoriFilter === '' || barang.kategori === kategoriFilter;
        return matchesSearch && matchesKategori;
    });
    renderBarangGrid(filtered);
});


function tambahKeKeranjang(barang) {
    if (barang.stok <= 0) {
        showAlert('alertKasir', 'Stok barang tidak tersedia!', 'warning');
        return;
    }

    const existingItem = keranjang.find(item => item.id === barang.id);

    if (existingItem) {
        if (existingItem.qty < barang.stok) {
            existingItem.qty += 1;
        } else {
            showAlert('alertKasir', 'Stok tidak cukup!', 'warning');
            return;
        }
    } else {
        keranjang.push({
            id: barang.id,
            nama: barang.nama,
            harga: barang.harga,
            stok: barang.stok,
            qty: 1
        });
    }

    renderKeranjang();
    updateKasirSummary();
}

function renderKeranjang() {
    const itemsList = document.getElementById('itemsList');

    if (keranjang.length === 0) {
        itemsList.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 2rem 0;">Tidak ada item</p>';
        return;
    }

    itemsList.innerHTML = '';

    keranjang.forEach((item, index) => {
        const total = item.harga * item.qty;
        const row = document.createElement('div');
        row.className = 'item-row';
        row.innerHTML = `
            <div class="item-name">${item.nama}</div>
            <div class="item-qty">
                <button onclick="kurangiQty(${index})">−</button>
                <span style="min-width: 30px; text-align: center;">${item.qty}</span>
                <button onclick="tambahQty(${index})">+</button>
            </div>
            <div class="item-total">${formatRupiah(total)}</div>
            <button onclick="hapusItem(${index})" class="btn btn-sm btn-danger ms-2">
                <i class="bi bi-trash"></i>
            </button>
        `;
        itemsList.appendChild(row);
    });
}

function tambahQty(index) {
    const item = keranjang[index];
    if (item.qty < item.stok) {
        item.qty += 1;
        renderKeranjang();
        updateKasirSummary();
    } else {
        showAlert('alertKasir', 'Stok tidak cukup!', 'warning');
    }
}

function kurangiQty(index) {
    const item = keranjang[index];
    if (item.qty > 1) {
        item.qty -= 1;
    } else {
        hapusItem(index);
        return;
    }
    renderKeranjang();
    updateKasirSummary();
}

function hapusItem(index) {
    keranjang.splice(index, 1);
    renderKeranjang();
    updateKasirSummary();
}

function updateKasirSummary() {
    const subtotal = keranjang.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    const diskonPersenEl = document.getElementById('diskonPersen');
    const diskonPersen = diskonPersenEl ? parseFloat(diskonPersenEl.value) : 0 || 0;
    const diskonRp = Math.round(subtotal * (diskonPersen / 100));
    const totalBayar = subtotal - diskonRp;

    const subtotalEl = document.getElementById('subtotal');
    if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);

    const diskonRpEl = document.getElementById('diskonRp');
    if (diskonRpEl) diskonRpEl.textContent = formatRupiah(diskonRp);

    const totalBayarEl = document.getElementById('totalBayar');
    if (totalBayarEl) totalBayarEl.textContent = formatRupiah(totalBayar);

    // Update kembalian
    const jumlahBayarEl = document.getElementById('jumlahBayar');
    const jumlahBayar = jumlahBayarEl ? parseFloat(jumlahBayarEl.value) : 0 || 0;
    const kembalian = Math.max(0, jumlahBayar - totalBayar);

    const kembalianEl = document.getElementById('kembalian');
    if (kembalianEl) kembalianEl.textContent = formatRupiah(kembalian);
}

// Update summary when discount changes
document.getElementById('diskonPersen')?.addEventListener('change', updateKasirSummary);
document.getElementById('jumlahBayar')?.addEventListener('input', updateKasirSummary);

function batalKasir() {
    if (keranjang.length === 0) {
        showAlert('alertKasir', 'Keranjang sudah kosong!', 'info');
        return;
    }

    Swal.fire({
        title: 'Batalkan Transaksi',
        text: 'Yakin ingin membatalkan transaksi?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Batalkan',
        cancelButtonText: 'Tidak'
    }).then((result) => {
        if (result.isConfirmed) {
            keranjang = [];
            document.getElementById('formBarang').reset();
            document.getElementById('jumlahBayar').value = '';
            renderKeranjang();
            updateKasirSummary();
            showAlert('alertKasir', 'Transaksi dibatalkan!', 'warning');
        }
    });
}

async function prosesCheckout() {
    if (keranjang.length === 0) {
        showAlert('alertKasir', 'Keranjang masih kosong!', 'danger');
        return;
    }

    const jumlahBayar = parseFloat(document.getElementById('jumlahBayar').value) || 0;
    const subtotal = keranjang.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    const diskonPersen = parseFloat(document.getElementById('diskonPersen').value) || 0;
    const diskonRp = Math.round(subtotal * (diskonPersen / 100));
    const totalBayar = subtotal - diskonRp;

    if (jumlahBayar < totalBayar) {
        showAlert('alertKasir', 'Jumlah pembayaran kurang!', 'danger');
        return;
    }

    try {
        // Update stok untuk setiap barang (using localStorage)
        for (let item of keranjang) {
            const barang = barangList.find(b => b.id === item.id);
            if (!barang) {
                throw new Error(`Barang dengan ID ${item.id} tidak ditemukan`);
            }
            if (barang.stok < item.qty) {
                throw new Error(`Stok ${barang.nama} tidak mencukupi`);
            }
            barang.stok -= item.qty;
        }

        // Save updated barang list to localStorage
        localStorage.setItem('barangList', JSON.stringify(barangList));
        console.log('[CHECKOUT] Stock updated in localStorage');

        // Save transaction
        const transaksi = {
            id: Date.now(),
            tanggal: new Date().toISOString(),
            items: keranjang.map(item => ({
                ...item,
                total: item.harga * item.qty
            })),
            subtotal: subtotal,
            diskon: diskonRp,
            pajak: 0,
            totalBayar: totalBayar,
            jumlahBayar: jumlahBayar,
            kembalian: jumlahBayar - totalBayar,
            kasir: currentUser ? currentUser.name : 'Unknown User'
        };

        transaksiList.push(transaksi);
        localStorage.setItem('transaksiList', JSON.stringify(transaksiList));

        showAlert('alertKasirSuccess', '✓ Pembayaran berhasil diproses!', 'success');

        // Generate and print receipt
        generateThermalReceipt(transaksi);

        // Reset kasir
        setTimeout(() => {
            keranjang = [];
            document.getElementById('formBarang').reset();
            document.getElementById('jumlahBayar').value = '';
            renderKeranjang();
            updateKasirSummary();
            loadBarangForKasir();
        }, 1000);

    } catch (error) {
        showAlert('alertKasir', 'Error: ' + error.message, 'danger');
    }
}

function generateThermalReceipt(transaksi) {
    const date = new Date(transaksi.tanggal);

    // Generate transaction ID
    const transactionId = String(transaksi.id).slice(-8).toUpperCase();

    // Build items HTML with modern styling
    let itemsHTML = '';
    transaksi.items.forEach(item => {
        itemsHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb; margin-bottom: 4px;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #1f2937; font-size: 14px;">${item.nama}</div>
                    <div style="font-size: 12px; color: #6b7280;">${item.qty}x ${formatRupiah(item.harga)}</div>
                </div>
                <div style="font-weight: 700; color: #059669; font-size: 14px;">${formatRupiah(item.total)}</div>
            </div>
        `;
    });

    // Create modern receipt HTML
    const receiptHTML = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 320px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 20px; text-align: center;">
                <div style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">🛒 KIOS MAMKO</div>
                <div style="font-size: 12px; opacity: 0.9;">ELEKTRONIK & KULINER</div>
                <div style="font-size: 10px; opacity: 0.8; margin-top: 4px;">Jl. Medan - Karang Mulia - Nabire - Papua Tengah</div>
            </div>

            <!-- Transaction Info -->
            <div style="padding: 16px; background: #f8fafc; border-bottom: 1px solid #e5e7eb;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 600; color: #374151;">Tanggal:</span>
                    <span style="color: #6b7280;">${date.toLocaleDateString('id-ID', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 600; color: #374151;">Waktu:</span>
                    <span style="color: #6b7280;">${date.toLocaleTimeString('id-ID')}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="font-weight: 600; color: #374151;">ID Transaksi:</span>
                    <span style="color: #4f46e5; font-weight: 600;">${transactionId}</span>
                </div>
            </div>

            <!-- Items -->
            <div style="padding: 16px;">
                <div style="font-weight: 700; color: #1f2937; margin-bottom: 12px; font-size: 14px;">📋 DETAIL PEMBELIAN</div>
                ${itemsHTML}
            </div>

            <!-- Summary -->
            <div style="padding: 16px; background: #f8fafc; border-top: 1px solid #e5e7eb;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                    <span style="color: #6b7280;">Subtotal:</span>
                    <span style="font-weight: 600; color: #374151;">${formatRupiah(transaksi.subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                    <span style="color: #6b7280;">Diskon:</span>
                    <span style="font-weight: 600; color: #dc2626;">-${formatRupiah(transaksi.diskon)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                    <span style="color: #6b7280;">Pajak:</span>
                    <span style="font-weight: 600; color: #374151;">${formatRupiah(transaksi.pajak)}</span>
                </div>
                <div style="border-top: 2px solid #e5e7eb; margin: 8px 0; padding-top: 8px;">
                    <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: 700;">
                        <span style="color: #1f2937;">TOTAL BAYAR:</span>
                        <span style="color: #059669;">${formatRupiah(transaksi.totalBayar)}</span>
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                    <span style="color: #6b7280;">Bayar:</span>
                    <span style="font-weight: 600; color: #374151;">${formatRupiah(transaksi.jumlahBayar)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; background: #ecfdf5; padding: 8px; border-radius: 6px; margin-top: 8px;">
                    <span style="color: #065f46;">Kembalian:</span>
                    <span style="color: #047857;">${formatRupiah(transaksi.kembalian)}</span>
                </div>
            </div>

            <!-- Footer -->
            <div style="padding: 16px; text-align: center; background: #f8fafc; border-top: 1px solid #e5e7eb;">
                <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">✅ Terima kasih atas kunjungan Anda!</div>
                <div style="font-size: 10px; color: #9ca3af;">Kios Elektronik & Kuliner Modern</div>
            </div>
        </div>
    `;

    // Show receipt with SweetAlert
    Swal.fire({
        title: '<i class="bi bi-receipt" style="color: #4f46e5;"></i> Struk Pembelian',
        html: receiptHTML,
        width: 'auto',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: '<i class="bi bi-printer"></i> Print Struk',
        cancelButtonText: '<i class="bi bi-x-circle"></i> Tutup',
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#6b7280',
        customClass: {
            popup: 'modern-receipt-popup',
            confirmButton: 'modern-receipt-btn-confirm',
            cancelButton: 'modern-receipt-btn-cancel'
        },
        buttonsStyling: false,
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            // Print functionality
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Struk Pembelian - ${transactionId}</title>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: 'Courier New', monospace;
                            margin: 0;
                            padding: 10px;
                            background: white;
                            color: black;
                        }
                        .receipt {
                            max-width: 300px;
                            margin: 0 auto;
                            font-size: 10px;
                            line-height: 1.4;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 10px;
                            padding-bottom: 5px;
                            border-bottom: 1px solid black;
                        }
                        .items {
                            margin: 10px 0;
                        }
                        .item {
                            margin-bottom: 5px;
                            padding-bottom: 3px;
                            border-bottom: 1px dashed #ccc;
                        }
                        .summary {
                            margin: 10px 0;
                            border-top: 1px solid black;
                            padding-top: 5px;
                        }
                        .total {
                            border-top: 2px solid black;
                            padding-top: 5px;
                            font-weight: bold;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 10px;
                            font-size: 9px;
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt">
                        <div class="header">
                            <div style="font-size: 14px; font-weight: bold;">KIOS MAMKO</div>
                            <div>ELEKTRONIK & KULINER</div>
                            <div>Jl. Medan - Karang Mulia - Nabire - Papua Tengah</div>
                            <div>${date.toLocaleDateString('id-ID')} ${date.toLocaleTimeString('id-ID')}</div>
                            <div>ID: ${transactionId}</div>
                        </div>

                        <div class="items">
                            ${transaksi.items.map(item => `
                                <div class="item">
                                    <div>${item.nama}</div>
                                    <div>${item.qty}x ${formatRupiah(item.harga)} = ${formatRupiah(item.total)}</div>
                                </div>
                            `).join('')}
                        </div>

                        <div class="summary">
                            <div>Subtotal: ${formatRupiah(transaksi.subtotal)}</div>
                            <div>Diskon: ${formatRupiah(transaksi.diskon)}</div>
                            <div>Pajak: ${formatRupiah(transaksi.pajak)}</div>
                            <div class="total">TOTAL: ${formatRupiah(transaksi.totalBayar)}</div>
                            <div>Bayar: ${formatRupiah(transaksi.jumlahBayar)}</div>
                            <div>Kembalian: ${formatRupiah(transaksi.kembalian)}</div>
                        </div>

                        <div class="footer">
                            Terima kasih atas kunjungan Anda!
                        </div>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    });
}

// ===== TRANSAKSI HISTORY =====
async function loadTransaksi() {
    const saved = localStorage.getItem('transaksiList');
    if (saved) {
        transaksiList = JSON.parse(saved);
    }
    renderTransaksiTable();
}

function renderTransaksiTable(filteredList = null) {
    const tbody = document.getElementById('tableTransaksi');
    tbody.innerHTML = '';

    const listToRender = filteredList || transaksiList;

    if (listToRender.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="8" style="text-align: center; color: #9ca3af; padding: 2rem;">Belum ada transaksi atau tidak ada hasil filter</td>`;
        tbody.appendChild(row);
        return;
    }

    listToRender.slice().reverse().forEach((transaksi, index) => {
        const date = new Date(transaksi.tanggal);
        const totalItems = transaksi.items.reduce((sum, item) => sum + item.qty, 0);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaksiList.length - transaksiList.indexOf(transaksi)}</td>
            <td>${date.toLocaleDateString('id-ID')}</td>
            <td>${date.toLocaleTimeString('id-ID')}</td>
            <td><span class="badge bg-primary">${totalItems} item</span></td>
            <td>${formatRupiah(transaksi.subtotal)}</td>
            <td>${transaksi.diskon > 0 ? '<span class="badge bg-warning">' + formatRupiah(transaksi.diskon) + '</span>' : '-'}</td>
            <td><strong class="text-success">${formatRupiah(transaksi.totalBayar)}</strong></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="lihatStruk(${transaksi.id})">
                    <i class="bi bi-eye"></i> Lihat
                </button>
                <button class="btn btn-sm btn-secondary" onclick="hapusTransaksi(${transaksi.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Filter untuk Transaksi
function filterTransaksi() {
    const tanggal = document.getElementById('filterTanggal').value;
    const minTotal = parseInt(document.getElementById('filterMinTotal').value) || 0;
    const maxTotal = parseInt(document.getElementById('filterMaxTotal').value) || Infinity;

    const filtered = transaksiList.filter(transaksi => {
        const date = new Date(transaksi.tanggal);
        const dateStr = date.toISOString().split('T')[0];
        const passDate = !tanggal || dateStr === tanggal;
        const passTotal = transaksi.totalBayar >= minTotal && transaksi.totalBayar <= maxTotal;
        return passDate && passTotal;
    });

    renderTransaksiTable(filtered);
}

// Add event listeners untuk filter transaksi
document.getElementById('filterTanggal')?.addEventListener('change', filterTransaksi);
document.getElementById('filterMinTotal')?.addEventListener('input', filterTransaksi);
document.getElementById('filterMaxTotal')?.addEventListener('input', filterTransaksi);

function resetFilterTransaksi() {
    document.getElementById('filterTanggal').value = '';
    document.getElementById('filterMinTotal').value = '';
    document.getElementById('filterMaxTotal').value = '';
    loadTransaksi();
}

function hapusTransaksi(id) {
    Swal.fire({
        title: 'Hapus Transaksi',
        text: 'Yakin ingin menghapus transaksi ini? Stok barang tidak akan dikembalikan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (!result.isConfirmed) return;

        transaksiList = transaksiList.filter(t => t.id !== id);
        localStorage.setItem('transaksiList', JSON.stringify(transaksiList));
        renderTransaksiTable();
        showAlert('alertTransaksi', 'Transaksi berhasil dihapus!', 'success');
    });
}

function lihatStruk(id) {
    const transaksi = transaksiList.find(t => t.id === id);
    if (transaksi) {
        generateThermalReceipt(transaksi);
    }
}

// ===== LAPORAN =====
function loadLaporan() {
    const saved = localStorage.getItem('transaksiList');
    if (saved) {
        transaksiList = JSON.parse(saved);
    }

    const totalTransaksi = transaksiList.length;
    const totalPenjualan = transaksiList.reduce((sum, t) => sum + t.totalBayar, 0);
    const totalDiskon = transaksiList.reduce((sum, t) => sum + t.diskon, 0);
    const totalPajak = transaksiList.reduce((sum, t) => sum + t.pajak, 0);

    const laporanTotalTransaksi = document.getElementById('laporanTotalTransaksi');
    if (laporanTotalTransaksi) laporanTotalTransaksi.textContent = totalTransaksi;

    const laporanTotalPenjualan = document.getElementById('laporanTotalPenjualan');
    if (laporanTotalPenjualan) laporanTotalPenjualan.textContent = formatRupiah(totalPenjualan);

    const laporanTotalDiskon = document.getElementById('laporanTotalDiskon');
    if (laporanTotalDiskon) laporanTotalDiskon.textContent = formatRupiah(totalDiskon);

    const laporanTotalPajak = document.getElementById('laporanTotalPajak');
    if (laporanTotalPajak) laporanTotalPajak.textContent = formatRupiah(totalPajak);

    const totalPenjualanEl = document.getElementById('totalPenjualan');
    if (totalPenjualanEl) totalPenjualanEl.textContent = formatRupiah(totalPenjualan);

    // Render tabel transaksi
    renderLaporanTable();
}

function renderLaporanTable() {
    const tbody = document.getElementById('tableLaporan');
    tbody.innerHTML = '';

    if (transaksiList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #9ca3af; padding: 2rem;">Belum ada transaksi</td></tr>';
        return;
    }

    transaksiList.forEach((transaksi, index) => {
        const row = document.createElement('tr');
        const tglWaktu = new Date(transaksi.tanggal).toLocaleString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${tglWaktu}</td>
            <td>${transaksi.items.length} item</td>
            <td>${formatRupiah(transaksi.subtotal)}</td>
            <td>${formatRupiah(transaksi.diskon)}</td>
            <td>${formatRupiah(transaksi.pajak)}</td>
            <td><strong>${formatRupiah(transaksi.totalBayar)}</strong></td>
            <td>${transaksi.kasir || 'N/A'}</td>
        `;
        tbody.appendChild(row);
    });
}

// ===== EXPORT FUNCTIONS =====
function exportLaporanPDF() {
    if (transaksiList.length === 0) {
        showAlert('alertLaporan', 'Tidak ada data transaksi untuk diexport', 'warning');
        return;
    }

    // Gunakan html2pdf library
    const element = document.querySelector('section#laporan');
    const opt = {
        margin: 10,
        filename: `laporan-penjualan-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
    };

    // Create a clean table for PDF
    const pdfContent = createPDFContent();
    html2pdf().set(opt).from(pdfContent).save();
}

function createPDFContent() {
    const today = new Date().toLocaleDateString('id-ID');
    const totalTransaksi = transaksiList.length;
    const totalPenjualan = transaksiList.reduce((sum, t) => sum + t.totalBayar, 0);
    const totalDiskon = transaksiList.reduce((sum, t) => sum + t.diskon, 0);
    const totalPajak = transaksiList.reduce((sum, t) => sum + t.pajak, 0);

    let html = `
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #1f2937; margin-bottom: 5px; }
            .date { text-align: center; color: #6b7280; margin-bottom: 20px; }
            .summary { margin-bottom: 30px; }
            .summary-item { display: inline-block; width: 22%; margin: 10px 1%; padding: 15px; background: #f3f4f6; border-radius: 8px; }
            .summary-item h4 { margin: 0 0 10px 0; color: #6b7280; font-size: 12px; }
            .summary-item h2 { margin: 0; color: #1f2937; font-size: 18px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #f3f4f6; padding: 10px; text-align: left; border-bottom: 2px solid #d1d5db; font-weight: bold; }
            td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
            tr:hover { background: #f9fafb; }
        </style>
        <h1>📊 LAPORAN PENJUALAN</h1>
        <p class="date">Tanggal: ${today}</p>
        
        <div class="summary">
            <div class="summary-item">
                <h4>Total Transaksi</h4>
                <h2>${totalTransaksi}</h2>
            </div>
            <div class="summary-item">
                <h4>Total Penjualan</h4>
                <h2>${formatRupiah(totalPenjualan)}</h2>
            </div>
            <div class="summary-item">
                <h4>Total Diskon</h4>
                <h2>${formatRupiah(totalDiskon)}</h2>
            </div>
            <div class="summary-item">
                <h4>Total Pajak</h4>
                <h2>${formatRupiah(totalPajak)}</h2>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tanggal & Waktu</th>
                    <th>Item</th>
                    <th>Subtotal</th>
                    <th>Diskon</th>
                    <th>Pajak</th>
                    <th>Total Bayar</th>
                    <th>Kasir</th>
                </tr>
            </thead>
            <tbody>
    `;

    transaksiList.forEach((transaksi, index) => {
        const tglWaktu = new Date(transaksi.tanggal).toLocaleString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${tglWaktu}</td>
                <td>${transaksi.items.length} item</td>
                <td>${formatRupiah(transaksi.subtotal)}</td>
                <td>${formatRupiah(transaksi.diskon)}</td>
                <td>${formatRupiah(transaksi.pajak)}</td>
                <td><strong>${formatRupiah(transaksi.totalBayar)}</strong></td>
                <td>${transaksi.kasir || 'N/A'}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    return html;
}

function exportLaporanExcel() {
    if (transaksiList.length === 0) {
        showAlert('alertLaporan', 'Tidak ada data transaksi untuk diexport', 'warning');
        return;
    }

    // Create CSV format (Excel compatible)
    let csv = 'Laporan Penjualan - ' + new Date().toLocaleDateString('id-ID') + '\n\n';
    csv += 'Total Transaksi,' + transaksiList.length + '\n';
    csv += 'Total Penjualan,' + transaksiList.reduce((sum, t) => sum + t.totalBayar, 0) + '\n';
    csv += 'Total Diskon,' + transaksiList.reduce((sum, t) => sum + t.diskon, 0) + '\n';
    csv += 'Total Pajak,' + transaksiList.reduce((sum, t) => sum + t.pajak, 0) + '\n\n';

    csv += '#,Tanggal & Waktu,Item,Subtotal,Diskon,Pajak,Total Bayar,Kasir\n';

    transaksiList.forEach((transaksi, index) => {
        const tglWaktu = new Date(transaksi.tanggal).toLocaleString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        csv += `${index + 1},"${tglWaktu}",${transaksi.items.length},${transaksi.subtotal},${transaksi.diskon},${transaksi.pajak},${transaksi.totalBayar},"${transaksi.kasir || 'N/A'}"\n`;
    });

    // Download CSV file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-penjualan-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showAlert('alertLaporan', 'Laporan berhasil diexport ke Excel!', 'success');
}

function printLaporan() {
    if (transaksiList.length === 0) {
        showAlert('alertLaporan', 'Tidak ada data transaksi untuk diprint', 'warning');
        return;
    }

    const printWindow = window.open('', '', 'height=600,width=800');
    const pdfContent = createPDFContent();

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Laporan Penjualan</title>
            <meta charset="UTF-8">
        </head>
        <body>
            ${pdfContent}
            <script>
                window.print();
                window.close();
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// ===== SETTINGS =====
// Default settings object
let appSettings = {
    storeName: 'Kios MamKo',
    storeAddress: 'Jl. Medan - Karang Mulia - Nabire - Papua Tengah',
    storePhone: '0812-3456-7890',
    storeEmail: 'info@kiomamko.com',
    pajakDefault: 10,
    diskonDefault: 0,
    pajakEnabled: true,
    stokThreshold: 5
};

// Load settings from localStorage or use defaults
function loadSettings() {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
        appSettings = JSON.parse(saved);
    } else {
        saveSettings();
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
}

// Load Settings Page
function loadSettingsPage() {
    loadSettings();

    // Populate General Info with null checks
    const namaTokoSetting = document.getElementById('namaTokoSetting');
    if (namaTokoSetting) namaTokoSetting.value = appSettings.storeName;

    const alamatTokoSetting = document.getElementById('alamatTokoSetting');
    if (alamatTokoSetting) alamatTokoSetting.value = appSettings.storeAddress;

    const teleponTokoSetting = document.getElementById('teleponTokoSetting');
    if (teleponTokoSetting) teleponTokoSetting.value = appSettings.storePhone;

    const emailTokoSetting = document.getElementById('emailTokoSetting');
    if (emailTokoSetting) emailTokoSetting.value = appSettings.storeEmail;

    // Populate Calculation Settings with null checks
    const pajakDefaultSetting = document.getElementById('pajakDefaultSetting');
    if (pajakDefaultSetting) pajakDefaultSetting.value = appSettings.pajakDefault;

    const diskonDefaultSetting = document.getElementById('diskonDefaultSetting');
    if (diskonDefaultSetting) diskonDefaultSetting.value = appSettings.diskonDefault;

    const pajakEnabledSetting = document.getElementById('pajakEnabledSetting');
    if (pajakEnabledSetting) pajakEnabledSetting.checked = appSettings.pajakEnabled;

    const stokThresholdSetting = document.getElementById('stokThresholdSetting');
    if (stokThresholdSetting) stokThresholdSetting.value = appSettings.stokThreshold;

    // Update Database Info
    updateDatabaseInfo();

    // Load Users Table
    renderUsersTable();
}

// Update Database Info
function updateDatabaseInfo() {
    const dbTotalBarang = document.getElementById('dbTotalBarang');
    if (dbTotalBarang) dbTotalBarang.textContent = barangList.length;

    const dbTotalTransaksi = document.getElementById('dbTotalTransaksi');
    if (dbTotalTransaksi) dbTotalTransaksi.textContent = transaksiList.length;

    const now = new Date().toLocaleString('id-ID');
    const dbLastUpdate = document.getElementById('dbLastUpdate');
    if (dbLastUpdate) dbLastUpdate.textContent = now;
}

// Render Users Table
function renderUsersTable() {
    const tbody = document.getElementById('tableUsers');
    if (!tbody) return;

    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();

    demoUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        const roleColor = user.role === 'admin' ? '#ef4444' : '#4f46e5';

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${user.username}</strong></td>
            <td>${user.name}</td>
            <td><span class="badge" style="background-color: ${roleColor};">${user.role}</span></td>
            <td><span class="badge bg-success">Aktif</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editUser(${user.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Hapus</button>
            </td>
        `;
        fragment.appendChild(row);
    });

    // Clear and append all at once
    tbody.innerHTML = '';
    tbody.appendChild(fragment);
}

// Save New User
function saveNewUser() {
    const username = document.getElementById('newUsername').value;
    const name = document.getElementById('newUserName').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newUserRole').value;

    if (!username || !name || !password || !role) {
        showAlert('alertAddUser', 'Semua field harus diisi!', 'danger');
        return;
    }

    // Check if username already exists
    if (demoUsers.some(u => u.username === username)) {
        showAlert('alertAddUser', 'Username sudah terdaftar!', 'danger');
        return;
    }

    // Defer heavy operations to next animation frame
    requestAnimationFrame(() => {
        // Add new user
        const newId = Math.max(...demoUsers.map(u => u.id)) + 1;
        demoUsers.push({
            id: newId,
            username: username,
            password: password,
            name: name,
            role: role
        });

        // Clear form
        document.getElementById('formAddUser').reset();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
        if (modal) {
            modal.hide();
        }

        // Show success message and refresh table in next tick
        setTimeout(() => {
            showAlert('alertSettingsSuccess', `User ${name} berhasil ditambahkan!`, 'success');
            renderUsersTable();
        }, 100);
    });
}

// Edit User (simplified)
function editUser(userId) {
    const user = demoUsers.find(u => u.id === userId);
    if (!user) return;

    const newName = prompt('Nama baru:', user.name);
    if (newName) {
        user.name = newName;
        renderUsersTable();
        showAlert('alertSettingsSuccess', 'User berhasil diupdate!', 'success');
    }
}

// Delete User
function deleteUser(userId) {
    if (userId === currentUser.id) {
        showAlert('alertSettings', 'Anda tidak bisa menghapus akun sendiri!', 'danger');
        return;
    }

    if (demoUsers.length <= 1) {
        showAlert('alertSettings', 'Minimal harus ada satu user!', 'danger');
        return;
    }

    Swal.fire({
        title: 'Hapus User',
        text: 'Yakin ingin menghapus user ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            demoUsers = demoUsers.filter(u => u.id !== userId);
            renderUsersTable();
            showAlert('alertSettingsSuccess', 'User berhasil dihapus!', 'success');
        }
    });
}

// Backup Data
function backupData() {
    const backup = {
        barangList,
        transaksiList,
        appSettings,
        users: demoUsers,
        timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-kios-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showAlert('alertSettingsSuccess', 'Backup data berhasil dibuat!', 'success');
}

// Reset Database
function resetDatabase() {
    Swal.fire({
        title: '⚠️ PERINGATAN PENTING',
        html: '<p style="color: #d33; font-weight: bold;">Ini akan menghapus SEMUA data transaksi dan barang!</p><p>Tindakan ini tidak bisa dibatalkan!</p>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Reset Semua Data',
        cancelButtonText: 'Batal',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Konfirmasi Terakhir',
                text: 'Ini adalah peringatan terakhir. Data tidak akan dapat dipulihkan!',
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Ya, Saya Yakin',
                cancelButtonText: 'Jangan!'
            }).then((result2) => {
                if (result2.isConfirmed) {
                    barangList = [];
                    transaksiList = [];
                    keranjang = [];
                    localStorage.removeItem('barangList');
                    localStorage.removeItem('transaksiList');

                    showAlert('alertSettingsSuccess', 'Database berhasil direset!', 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 1500);
                }
            });
        }
    });
}

// Save General Settings Form
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('formGeneralSettings')?.addEventListener('submit', function (e) {
        e.preventDefault();

        appSettings.storeName = document.getElementById('namaTokoSetting').value;
        appSettings.storeAddress = document.getElementById('alamatTokoSetting').value;
        appSettings.storePhone = document.getElementById('teleponTokoSetting').value;
        appSettings.storeEmail = document.getElementById('emailTokoSetting').value;

        saveSettings();
        showAlert('alertSettingsSuccess', 'Pengaturan umum berhasil disimpan!', 'success');
    });

    // Save Calculation Settings Form
    document.getElementById('formCalculationSettings')?.addEventListener('submit', function (e) {
        e.preventDefault();

        appSettings.pajakDefault = parseInt(document.getElementById('pajakDefaultSetting').value) || 10;
        appSettings.diskonDefault = parseInt(document.getElementById('diskonDefaultSetting').value) || 0;
        appSettings.pajakEnabled = document.getElementById('pajakEnabledSetting').checked;
        appSettings.stokThreshold = parseInt(document.getElementById('stokThresholdSetting').value) || 5;

        saveSettings();
        showAlert('alertSettingsSuccess', 'Pengaturan kalkulasi berhasil disimpan!', 'success');
    });
});

// ===== DASHBOARD (OLD API FALLBACK) =====

async function loadDashboardOld() {
    try {
        // Load from localStorage (consistent with other operations)
        await loadBarang();

        // Safely update totalBarang element if it exists
        const totalBarangEl = document.getElementById('totalBarang');
        if (totalBarangEl) {
            totalBarangEl.textContent = barangList.length;
        }
        checkStokAlertOnLoad();
        console.log('[DASHBOARD] Loaded from localStorage');
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }

    const saved = localStorage.getItem('transaksiList');
    if (saved) {
        transaksiList = JSON.parse(saved);
        // Safely update totalTransaksi element if it exists
        const totalTransaksiEl = document.getElementById('totalTransaksi');
        if (totalTransaksiEl) {
            totalTransaksiEl.textContent = transaksiList.length;
        }
        // Safely update totalPenjualan element if it exists
        const totalPenjualanEl = document.getElementById('totalPenjualan');
        if (totalPenjualanEl) {
            const total = transaksiList.reduce((sum, t) => sum + t.totalBayar, 0);
            totalPenjualanEl.textContent = formatRupiah(total);
        }
    }
}

function checkStokAlertOnLoad() {
    const { lowStokItems, noStokItems } = checkStokLow();
    let alertMsg = '';

    if (noStokItems.length > 0) {
        alertMsg += `<strong>⛔ Stok Habis (${noStokItems.length}):</strong><br>`;
        noStokItems.forEach(item => {
            alertMsg += `• ${item.nama}<br>`;
        });
    }

    if (lowStokItems.length > 0) {
        if (alertMsg) alertMsg += '<br>';
        alertMsg += `<strong>⚠️ Stok Rendah (${lowStokItems.length}) - < ${STOK_THRESHOLD}:</strong><br>`;
        lowStokItems.forEach(item => {
            alertMsg += `• ${item.nama} (Stok: ${item.stok})<br>`;
        });
    }

    if (alertMsg) {
        // Check if alert was already shown today
        const today = new Date().toDateString();
        const lastAlertDate = localStorage.getItem('lastStokAlertDate');

        if (lastAlertDate === today) {
            console.log('[STOK] Alert already shown today, skipping...');
            return;
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-warning alert-dismissible fade show';
        alertDiv.style.borderLeft = '4px solid #f59e0b';
        alertDiv.innerHTML = alertMsg + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';

        const mainContent = document.getElementById('mainContent');
        const firstSection = mainContent.querySelector('section');
        if (firstSection) {
            firstSection.insertAdjacentElement('beforebegin', alertDiv);
            // Save that alert was shown today
            localStorage.setItem('lastStokAlertDate', today);
            console.log('[STOK] Alert shown and date saved');
        }
    }
}

// ===== SIDEBAR TOGGLE (MOBILE) =====
document.getElementById('toggleSidebar')?.addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');

    if (sidebar && toggleBtn &&
        !sidebar.contains(e.target) &&
        !toggleBtn.contains(e.target) &&
        sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// ===== EXPOSE TO GLOBAL SCOPE FOR INLINE EVENT HANDLERS =====
console.log('[DEBUG] Starting to expose functions to global scope...');

window.formatRupiah = formatRupiah;
window.setDashboardPeriod = setDashboardPeriod;
window.loadDashboard = loadDashboard;
window.showSection = showSection;
window.showAlert = showAlert;
window.updateTime = updateTime;
window.loadBarang = loadBarang;
window.renderBarangTable = renderBarangTable;
window.getKategoriIcon = getKategoriIcon;
window.hapusBarang = hapusBarang;
window.loadBarangForKasir = loadBarangForKasir;
window.tambahKeKeranjang = tambahKeKeranjang;
window.tambahQty = tambahQty;
window.kurangiQty = kurangiQty;
window.hapusItem = hapusItem;
window.updateKasirSummary = updateKasirSummary;
window.batalKasir = batalKasir;
window.prosesCheckout = prosesCheckout;
window.loadTransaksi = loadTransaksi;
window.lihatStruk = lihatStruk;
window.hapusTransaksi = hapusTransaksi;
window.loadLaporan = loadLaporan;
window.renderLaporanTable = renderLaporanTable;
window.exportLaporanPDF = exportLaporanPDF;
window.exportLaporanExcel = exportLaporanExcel;
window.printLaporan = printLaporan;
window.loadSettingsPage = loadSettingsPage;
window.renderUsersTable = renderUsersTable;
window.saveNewUser = saveNewUser;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.backupData = backupData;
window.resetDatabase = resetDatabase;
window.loadDashboard = loadDashboard;
window.logout = logout;

// ===== PROFILE SECTION FUNCTIONS =====
window.loadProfilePage = loadProfilePage;
window.loadProfileImage = loadProfileImage;
window.handleProfileImageChange = handleProfileImageChange;
window.initializeCropCanvas = initializeCropCanvas;
window.setupCropModalListeners = setupCropModalListeners;
window.saveCroppedImage = saveCroppedImage;
window.redrawCropCanvas = redrawCropCanvas;
window.sectionUpdatePassword = sectionUpdatePassword;
window.sectionResetPasswordForm = sectionResetPasswordForm;
window.togglePasswordVisibility = togglePasswordVisibility;

window.resetSearchBarang = resetSearchBarang;
window.resetFilterTransaksi = resetFilterTransaksi;
window.exportBarangCSV = exportBarangCSV;
window.importBarangCSV = importBarangCSV;
window.editBarang = editBarang;
window.updateBarang = updateBarang;
window.changeBarangPage = changeBarangPage;
window.refreshBarangTable = refreshBarangTable;
window.hapusSemuaBarang = hapusSemuaBarang;

console.log('[DEBUG] ✓ loadProfilePage type:', typeof window.loadProfilePage);
console.log('[DEBUG] ✓ sectionUpdatePassword type:', typeof window.sectionUpdatePassword);
console.log('[DEBUG] Functions exposure complete');

// ===== THEME TOGGLE SYSTEM (MUST BE DEFINED BEFORE INITIALIZATION) =====
const THEME_STORAGE_KEY = 'kios_theme_preference';

function initializeThemeSystem() {
    try {
        // Load saved theme preference from localStorage
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDarkMode = savedTheme === 'dark' || (savedTheme === null && prefersDark);

        if (isDarkMode) {
            setDarkMode(true, false);
        } else {
            setDarkMode(false, false);
        }

        // Add theme toggle button listener
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', toggleTheme);
            console.log('[THEME] Theme toggle button initialized');
        } else {
            console.warn('[THEME] Theme toggle button not found');
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            // Only update if user hasn't set a preference
            if (savedTheme === null) {
                setDarkMode(e.matches, false);
            }
        });

        console.log('[THEME] Theme system initialized');
    } catch (error) {
        console.error('[THEME] Error initializing theme system:', error);
    }
}

function toggleTheme() {
    try {
        const html = document.documentElement;
        const isDarkMode = html.classList.contains('dark-theme');
        setDarkMode(!isDarkMode, true);
    } catch (error) {
        console.error('[THEME] Error toggling theme:', error);
    }
}

function setDarkMode(enabled, savePref = true) {
    try {
        const html = document.documentElement;
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        const themeIcon = themeToggleBtn?.querySelector('i');

        if (enabled) {
            html.classList.add('dark-theme');
            if (themeToggleBtn) {
                themeToggleBtn.classList.add('dark-mode');
                themeToggleBtn.title = 'Toggle Light Mode';
            }
            if (themeIcon) {
                themeIcon.className = 'bi bi-sun';
            }
            if (savePref) {
                localStorage.setItem(THEME_STORAGE_KEY, 'dark');
            }
            console.log('[THEME] Dark mode enabled');
        } else {
            html.classList.remove('dark-theme');
            if (themeToggleBtn) {
                themeToggleBtn.classList.remove('dark-mode');
                themeToggleBtn.title = 'Toggle Dark Mode';
            }
            if (themeIcon) {
                themeIcon.className = 'bi bi-moon-stars';
            }
            if (savePref) {
                localStorage.setItem(THEME_STORAGE_KEY, 'light');
            }
            console.log('[THEME] Light mode enabled');
        }
    } catch (error) {
        console.error('[THEME] Error setting dark mode:', error);
    }
}

// Expose theme functions to global scope
window.toggleTheme = toggleTheme;
window.setDarkMode = setDarkMode;
window.initializeThemeSystem = initializeThemeSystem;

console.log('[DEBUG] Theme system functions exposed to global scope');

// ===== INITIALIZE =====
console.log('[DEBUG] Initializing application...');

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('[INIT] DOMContentLoaded - Setting up event listeners');
        setupProfileButton();
        setupPasswordFieldListeners();
        setupProfileImageListeners();
        setupBarangCRUDListeners();
        initializeThemeSystem();
        initializeAuth();
        updateTime();
        setInterval(updateTime, 1000);
    });
} else {
    console.log('[INIT] DOM already loaded - Setting up event listeners');
    setupProfileButton();
    setupPasswordFieldListeners();
    setupProfileImageListeners();
    setupBarangCRUDListeners();
    initializeThemeSystem();
    initializeAuth();
    updateTime();
    setInterval(updateTime, 1000);
}

// Setup interactive features for password fields
function setupPasswordFieldListeners() {
    const passwordFields = [
        'sectionCurrentPassword',
        'sectionNewPasswordField',
        'sectionConfirmNewPassword'
    ];

    passwordFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // Add focus event
            field.addEventListener('focus', function () {
                this.style.borderColor = '#4f46e5';
                this.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
            });

            // Add blur event
            field.addEventListener('blur', function () {
                this.style.borderColor = '#e5e7eb';
                this.style.boxShadow = 'none';
            });

            // Prevent autocomplete suggestion
            field.setAttribute('autocomplete', 'off');
        }
    });

    // Add real-time password match validation
    const newPasswordField = document.getElementById('sectionNewPasswordField');
    const confirmPasswordField = document.getElementById('sectionConfirmNewPassword');

    if (newPasswordField && confirmPasswordField) {
        const checkPasswordMatch = function () {
            if (newPasswordField.value && confirmPasswordField.value) {
                if (newPasswordField.value === confirmPasswordField.value) {
                    confirmPasswordField.style.borderColor = '#10b981';
                    confirmPasswordField.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                } else {
                    confirmPasswordField.style.borderColor = '#ef4444';
                    confirmPasswordField.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                }
            } else {
                confirmPasswordField.style.borderColor = '#e5e7eb';
                confirmPasswordField.style.boxShadow = 'none';
            }
        };

        newPasswordField.addEventListener('keyup', checkPasswordMatch);
        confirmPasswordField.addEventListener('keyup', checkPasswordMatch);
    }

    console.log('[INIT] Password field listeners setup complete');
}

// Setup interactive profile image features
function setupProfileImageListeners() {
    const profileImageElement = document.getElementById('sectionProfileImage');
    const btnChangeProfileImage = document.getElementById('btnChangeProfileImage');
    const profileImageInput = document.getElementById('profileImageInput');

    if (profileImageElement) {
        // Make profile image clickable
        profileImageElement.addEventListener('click', function () {
            profileImageInput.click();
        });

        // Add hover effect
        profileImageElement.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.3)';
        });

        profileImageElement.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });

        console.log('[INIT] Profile image click listener attached');
    }

    if (btnChangeProfileImage) {
        // Change button hover effects
        btnChangeProfileImage.addEventListener('mouseenter', function () {
            this.style.background = '#6366f1';
            this.style.transform = 'scale(1.1)';
        });

        btnChangeProfileImage.addEventListener('mouseleave', function () {
            this.style.background = '#4f46e5';
            this.style.transform = 'scale(1)';
        });

        // Button click opens file input
        btnChangeProfileImage.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            profileImageInput.click();
        });

        console.log('[INIT] Profile image button listener attached');
    }

    if (profileImageInput) {
        // Handle file selection
        profileImageInput.addEventListener('change', handleProfileImageChange);
        console.log('[INIT] Profile image input listener attached');
    }

    // Setup crop modal listeners
    setupCropModalListeners();
}

function setupProfileButton() {
    const headerProfileBtn = document.getElementById('headerProfileBtn');
    console.log('[INIT] Looking for headerProfileBtn:', !!headerProfileBtn);

    if (headerProfileBtn) {
        // Remove any existing listeners
        const newBtn = headerProfileBtn.cloneNode(true);
        headerProfileBtn.parentNode.replaceChild(newBtn, headerProfileBtn);

        // Add new listener
        newBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[INIT] Header profile button clicked');

            // Navigate to profile section
            showSection('profile');
        });
        console.log('[INIT] Event listener attached to headerProfileBtn');
    } else {
        console.warn('[INIT] headerProfileBtn not found in DOM');
    }

    // Setup userDisplay click handler
    const userDisplay = document.getElementById('userDisplay');
    console.log('[INIT] Looking for userDisplay:', !!userDisplay);

    if (userDisplay) {
        userDisplay.style.cursor = 'pointer';
        userDisplay.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[INIT] User display clicked');

            // Navigate to profile section
            showSection('profile');
        });
        console.log('[INIT] Click listener attached to userDisplay');
    } else {
        console.warn('[INIT] userDisplay not found in DOM');
    }

    // Setup profile section form handlers
    const profileForm = document.getElementById('sectionFormChangePassword');
    if (profileForm) {
        // Remove old listener by cloning
        const newProfileForm = profileForm.cloneNode(true);
        profileForm.parentNode.replaceChild(newProfileForm, profileForm);

        // Add submit handler for form
        newProfileForm.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log('[PROFILE] Password form submitted');

            // Call update password function
            if (typeof window.sectionUpdatePassword === 'function') {
                window.sectionUpdatePassword();
            }
        });

        console.log('[INIT] Event listener attached to profile password form');
    } else {
        console.warn('[INIT] sectionFormChangePassword not found in DOM');
    }

    // Setup reset button for profile password form
    const btnResetPassword = document.getElementById('btnResetPassword');
    if (btnResetPassword) {
        btnResetPassword.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('[PROFILE] Reset button clicked');

            if (typeof window.sectionResetPasswordForm === 'function') {
                window.sectionResetPasswordForm();
            }
        });
        console.log('[INIT] Event listener attached to reset password button');
    } else {
        console.warn('[INIT] btnResetPassword not found in DOM');
    }

    // Setup add user form handlers
    const formAddUser = document.getElementById('formAddUser');
    if (formAddUser) {
        // Remove old listener by cloning
        const newAddUserForm = formAddUser.cloneNode(true);
        formAddUser.parentNode.replaceChild(newAddUserForm, formAddUser);

        // Add submit handler
        newAddUserForm.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log('[INIT] Add user form submitted');

            // Return immediately and defer heavy work
            setTimeout(() => {
                if (typeof window.saveNewUser === 'function') {
                    window.saveNewUser();
                }
            }, 0);
        });

        // Also add click handler to submit button as backup
        const addUserSubmitBtn = newAddUserForm.querySelector('button[type="submit"]');
        if (addUserSubmitBtn) {
            addUserSubmitBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                console.log('[INIT] Add user button clicked');

                // Defer the form dispatch
                setTimeout(() => {
                    newAddUserForm.dispatchEvent(new Event('submit'));
                }, 0);
            });
        }
    }
}

function setupBarangCRUDListeners() {
    // Reset edit form when modal is hidden
    const editModal = document.getElementById('editBarangModal');
    if (editModal) {
        editModal.addEventListener('hidden.bs.modal', function () {
            const form = document.getElementById('formEditBarang');
            if (form) {
                form.reset();
                form.classList.remove('was-validated');
                console.log('[BARANG] Edit form reset on modal close');
            }
        });
        console.log('[INIT] Edit modal close listener attached');
    }

    // Enhanced form validation for create
    const createForm = document.getElementById('formBarang');
    if (createForm) {
        const inputs = createForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateBarangInput(this);
            });
        });
        console.log('[INIT] Create form validation listeners attached');
    }
}

function validateBarangInput(input) {
    const value = input.value.trim();
    const isValid = value !== '';

    input.classList.toggle('is-valid', isValid && input.checkValidity());
    input.classList.toggle('is-invalid', !isValid || !input.checkValidity());

    // Special validation for numbers
    if (input.type === 'number') {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
        }
    }
}

console.log('[DEBUG] Application initialization complete');
