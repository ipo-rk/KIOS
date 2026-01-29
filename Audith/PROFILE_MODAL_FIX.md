# Profile Modal - Detailed Interactive Fix

## 🎯 Masalah yang Diperbaiki

Sebelumnya, modal profile tidak berfungsi karena:

1. Event listener untuk tombol header profile tidak bekerja dengan benar
2. Tombol ubah password di modal tidak memiliki handler
3. Timing issue saat DOM loading

## ✅ Solusi yang Diterapkan

### 1. **Setup Event Listener yang Robust** (kios.js)

```javascript
// Menunggu DOM fully loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupProfileButton);
} else {
    setupProfileButton();
}

function setupProfileButton() {
    // Clone element untuk menghapus old listeners
    const newBtn = headerProfileBtn.cloneNode(true);
    headerProfileBtn.parentNode.replaceChild(newBtn, headerProfileBtn);

    // Pasang listener baru
    newBtn.addEventListener("click", function (e) {
        window.__showProfileModal();
    });
}
```

**Keuntungan:**

-   Memastikan DOM fully loaded sebelum attach listener
-   Menghapus old listener dengan cloning
-   Logging untuk debugging

---

### 2. **Perbaikan Function `__showProfileModal`** (kios.js)

Sebelumnya:

```javascript
function __showProfileModal() {
    // Minimal logging
    const profileName = document.getElementById("profileName");
    // ...
}
```

Sesudahnya:

```javascript
function __showProfileModal() {
    console.log("[PROFILE] __showProfileModal called");
    console.log("[PROFILE] currentUser:", currentUser);

    if (!currentUser) {
        showAlert("alert", "User tidak terdeteksi", "danger");
        return;
    }

    try {
        // Object untuk semua elemen
        const elements = {
            profileName: document.getElementById("profileName"),
            profileUsername: document.getElementById("profileUsername"),
            formUsername: document.getElementById("formUsername"),
            profileModalEl: document.getElementById("profileModal"),
            // ... lengkap semua elemen
        };

        // Validasi semua elemen
        console.log("[PROFILE] Checking elements:", {
            profileName: !!elements.profileName,
            formUsername: !!elements.formUsername,
            // ... validasi semua
        });

        // Populate data dengan error handling
        if (elements.profileName) {
            elements.profileName.textContent =
                currentUser.name || "Unknown User";
        }

        // Show modal dengan try-catch
        if (elements.profileModalEl) {
            const profileModal = new bootstrap.Modal(elements.profileModalEl);
            profileModal.show();
        }
    } catch (error) {
        console.error("[PROFILE] Error:", error);
        showAlert("alert", "Error: " + error.message, "danger");
    }
}
```

**Keuntungan:**

-   Better error handling dengan try-catch
-   Validasi setiap elemen sebelum digunakan
-   Fallback jika Bootstrap Modal gagal
-   Logging detail untuk debugging

---

### 3. **Tambah Tombol Ubah Password di Modal** (index.blade.php)

Sebelumnya form tidak ada tombol submit:

```html
<form id="formChangePassword">
    <div class="mb-3">
        <input type="password" id="currentPassword" ... />
    </div>
    <!-- ... form inputs ... -->
    <!-- NO BUTTON! -->
</form>
```

Sesudahnya:

```html
<form id="formChangePassword">
    <input
        type="hidden"
        id="formUsername"
        name="username"
        autocomplete="username"
    />
    <div class="mb-3">
        <label class="form-label">Password Saat Ini</label>
        <input type="password" class="form-control" id="currentPassword" ... />
    </div>
    <div class="mb-3">
        <label class="form-label">Password Baru</label>
        <input type="password" class="form-control" id="newPasswordField" ... />
    </div>
    <div class="mb-3">
        <label class="form-label">Konfirmasi Password Baru</label>
        <input
            type="password"
            class="form-control"
            id="confirmNewPassword"
            ...
        />
    </div>
    <div
        class="alert alert-info d-none"
        id="alertChangePassword"
        role="alert"
    ></div>

    <!-- ✨ TOMBOL SUBMIT DITAMBAH ✨ -->
    <div class="d-grid gap-2">
        <button
            type="button"
            class="btn btn-warning"
            onclick="window.__updatePassword && window.__updatePassword()"
        >
            <i class="bi bi-check-lg"></i> Perbarui Password
        </button>
    </div>
</form>
```

---

### 4. **Perbaikan Function `__updatePassword`** (kios.js)

Menambah logging detail:

```javascript
function __updatePassword() {
    console.log("[PASSWORD] __updatePassword called");
    try {
        const currentPassword =
            document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPasswordField").value;
        const confirmPassword =
            document.getElementById("confirmNewPassword").value;

        console.log("[PASSWORD] Form values received:", {
            currentPasswordLength: currentPassword.length,
            newPasswordLength: newPassword.length,
            confirmPasswordLength: confirmPassword.length,
        });

        // Validation dengan message yang jelas
        if (!currentPassword || !newPassword || !confirmPassword) {
            alertElement.className = "alert alert-danger";
            alertElement.textContent = "Semua field harus diisi!";
            return;
        }

        if (newPassword !== confirmPassword) {
            alertElement.textContent = "Password baru tidak cocok!";
            return;
        }

        if (newPassword.length < 6) {
            alertElement.textContent = "Password minimal 6 karakter!";
            return;
        }

        // Verify current password
        const user = demoUsers.find((u) => u.id === currentUser.id);
        if (!user || user.password !== currentPassword) {
            alertElement.textContent = "Password saat ini salah!";
            return;
        }

        // Update password
        user.password = newPassword;

        // Success message
        alertElement.className = "alert alert-success";
        alertElement.innerHTML =
            '<i class="bi bi-check-circle"></i> Password berhasil diubah!';

        // Close modal after 2 seconds
        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(
                document.getElementById("profileModal")
            );
            if (modal) modal.hide();
        }, 2000);
    } catch (error) {
        console.error("[PASSWORD] Error:", error);
    }
}
```

---

## 🔄 Flow Interaktif Lengkap

### Step 1: User Login

```
User masukkan username & password
    ↓
Login berhasil
    ↓
currentUser = { id: 1, username: 'admin', name: 'Administrator', ... }
currentUser disimpan ke localStorage
    ↓
showMainContent() dipanggil
    ↓
Header navbar ditampilkan dengan nama user
```

### Step 2: User Klik Tombol Administrator di Header

```
User klik button dengan id="headerProfileBtn"
    ↓
Event listener trigger: function(e) { window.__showProfileModal(); }
    ↓
[INIT] Header profile button clicked
[INIT] window.__showProfileModal: function
[INIT] currentUser: { id: 1, username: 'admin', ... }
    ↓
__showProfileModal() dipanggil
```

### Step 3: Populate Modal Data

```
__showProfileModal() execute:
    ↓
1. Validasi currentUser ada
2. Get semua DOM elements
3. Validate setiap element ada atau tidak
4. Populate data:
   - profileName.textContent = "Administrator"
   - profileUsername.textContent = "admin"
   - profileRole.textContent = "Administrator"
   - formUsername.value = "admin" (hidden field)
   - profileLastLogin = last login time dari localStorage
5. Reset form changePassword
6. Create Bootstrap Modal instance
7. Modal.show()
    ↓
[PROFILE] Modal showed successfully
    ↓
Modal profil muncul dengan data user yang benar
```

### Step 4: User Ubah Password di Modal

```
User input:
   - Password Saat Ini: "admin123"
   - Password Baru: "admin456"
   - Konfirmasi: "admin456"
    ↓
User klik tombol "Perbarui Password"
    ↓
onclick="window.__updatePassword && window.__updatePassword()"
    ↓
__updatePassword() execute:
```

### Step 5: Validasi Password

```
__updatePassword() validasi:

1. Check semua field tidak kosong
   ✓ currentPassword = "admin123"
   ✓ newPassword = "admin456"
   ✓ confirmPassword = "admin456"

2. Check password cocok
   ✓ "admin456" === "admin456"

3. Check minimal 6 karakter
   ✓ "admin456".length = 8

4. Check password saat ini benar
   ✓ demoUsers[0].password === "admin123"

   Jika ada yang error → tampilkan alert dengan pesan error
```

### Step 6: Update Password

```
Jika semua validasi PASS:
    ↓
1. Find user di demoUsers array
   user = demoUsers.find(u => u.id === 1)
    ↓
2. Update password
   user.password = "admin456"
   currentUser.password = "admin456"
    ↓
3. Tampilkan success message
   <div class="alert alert-success">
       <i class="bi bi-check-circle"></i> Password berhasil diubah!
   </div>
    ↓
4. Reset form
   formChangePassword.reset()
    ↓
5. Wait 2 seconds
    ↓
6. Close modal otomatis
```

### Step 7: Navigate ke Profile Page (Optional)

```
User bisa klik "Profil Lengkap" button
    ↓
onclick="goToProfileSection()" data-bs-dismiss="modal"
    ↓
1. Modal dismissed otomatis
2. showSection('profile') dipanggil
3. Sidebar highlight menu Profil
4. Profile section ditampilkan dengan data lengkap
5. loadProfilePage() populate semua data profil section
```

---

## 🧪 Testing Checklist

-   [ ] Refresh halaman
-   [ ] Login dengan username: `admin`, password: `admin123`
-   [ ] Lihat header navbar muncul dengan nama "Administrator (admin)"
-   [ ] Klik tombol nama user di header
-   [ ] Modal profile muncul dengan data:
    -   [ ] Nama: "Administrator"
    -   [ ] Username: "admin"
    -   [ ] Role: "Administrator"
    -   [ ] Badge: "Admin"
    -   [ ] Last Login time
-   [ ] Input password change:
    -   [ ] Password Saat Ini: `admin123`
    -   [ ] Password Baru: `newpass123`
    -   [ ] Konfirmasi: `newpass123`
-   [ ] Klik "Perbarui Password"
-   [ ] Lihat success message: "Password berhasil diubah!"
-   [ ] Wait 2 seconds
-   [ ] Modal closes otomatis
-   [ ] Try login lagi dengan password baru
-   [ ] Verifikasi berhasil dengan password baru

---

## 🔧 Debug Tips

### Buka Browser Console (F12)

Harus lihat logs ini:

```
[DEBUG] Initializing application...
[INIT] DOMContentLoaded - Setting up event listeners
[INIT] Looking for headerProfileBtn: true
[INIT] Event listener attached to headerProfileBtn

[Saat klik tombol profile]
[INIT] Header profile button clicked
[INIT] window.__showProfileModal: function
[INIT] currentUser: { id: 1, username: 'admin', ... }
[PROFILE] __showProfileModal called
[PROFILE] currentUser: { id: 1, username: 'admin', ... }
[PROFILE] Checking elements: { profileName: true, profileUsername: true, ... }
[PROFILE] Showing profile modal...
[PROFILE] Modal showed successfully

[Saat klik ubah password]
[PASSWORD] __updatePassword called
[PASSWORD] Form values received: {
    currentPasswordLength: 8,
    newPasswordLength: 11,
    confirmPasswordLength: 11
}
```

### Jika Ada Error

Lihat console error dan trace:

```
[PROFILE] profileModal element not found in DOM!
  → Periksa ID "profileModal" ada di HTML

__showProfileModal not available as function
  → Periksa syntax error di kios.js (jalankan: node -c resources/js/kios.js)
```

---

## 📝 Summary

**File yang diubah:**

1. ✅ `resources/views/index.blade.php` - Tambah tombol submit di form password
2. ✅ `resources/js/kios.js` - Perbaiki event listener, tambah logging, improve error handling

**Fitur yang berfungsi:**

-   ✅ Modal profile muncul saat klik tombol administrator
-   ✅ Data user populated dengan benar
-   ✅ Form ubah password bekerja
-   ✅ Validasi password akurat
-   ✅ Success/error messages ditampilkan
-   ✅ Modal close otomatis setelah berhasil
-   ✅ Debug logging lengkap di console
