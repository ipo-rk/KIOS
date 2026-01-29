<!-- PROFILE MODAL QUICK START GUIDE -->

# 🎯 PROFILE SECTION - Panduan Implementasi

## ✅ Apa yang sudah diimplementasikan?

### 1. **HTML Components**

-   ✅ Profile Section di main content area
-   ✅ Profile Card (left side) - Menampilkan info user
-   ✅ Account Information (right side) - Detail user data
-   ✅ Change Password Form - Form ubah password lengkap
-   ✅ Profile Modal - Quick access dari navbar

### 2. **JavaScript Functions**

-   ✅ `loadProfilePage()` - Load profile section dengan data user
-   ✅ `sectionUpdatePassword()` - Update password dari section
-   ✅ `sectionResetPasswordForm()` - Reset form ke state awal
-   ✅ `goToProfileSection()` - Navigate dari modal ke section
-   ✅ `showSection()` updated - Include profile handling

### 3. **Features**

-   ✅ Display user information (Nama, Username, Role, Position)
-   ✅ Last Login tracking & display
-   ✅ Password validation (6+ chars, matching)
-   ✅ Current password verification
-   ✅ Real-time alert messages
-   ✅ Responsive design (mobile & desktop)
-   ✅ Color-coded UI (info, warning, success alerts)

---

## 🚀 Cara Menggunakan

### Akses Profile Section

**Opsi 1: Dari Sidebar Menu**

```
1. Login dengan user credentials
2. Klik menu "Profil" di sidebar
3. Profile section terbuka otomatis
4. Semua data user ter-populate
```

**Opsi 2: Dari Navbar Modal**

```
1. Klik profile button di navbar (atas kanan)
2. Modal profile terbuka
3. Klik "Buka Profil Lengkap" button
4. Navigate ke profile section
```

---

## 📋 Struktur Data

### User Object (currentUser)

```javascript
{
  id: 1,
  name: "Admin User",
  username: "admin",
  password: "admin123",
  role: "Admin",
  position: "System Administrator",
  email: "admin@example.com"
}
```

### LocalStorage Keys

```javascript
// User data
localStorage.getItem("currentUser"); // JSON stringified user object

// Last login time per user
localStorage.getItem("lastLogin_1"); // ISO timestamp string

// Other app data
localStorage.getItem("transaksiList");
localStorage.getItem("appSettings");
```

---

## 🔒 Password Change Flow

```
User Input Password
    ↓
Validation
├─ All fields filled?
├─ Password >= 6 chars?
├─ New password = Confirm?
└─ Current password correct?
    ↓
Update demoUsers array
    ↓
Update currentUser object
    ↓
Show Success Alert
    ↓
Reset Form (2-3 detik)
```

---

## 🎨 UI Elements & IDs

| ID                           | Element | Purpose                 |
| ---------------------------- | ------- | ----------------------- |
| `profile`                    | Section | Main profile container  |
| `sectionProfileName`         | h4      | Display user name       |
| `sectionProfileUsername`     | span    | Display username        |
| `sectionProfileRole`         | p       | Display role            |
| `sectionProfileBadge`        | span    | Role badge              |
| `sectionProfilePosition`     | span    | Display position        |
| `sectionProfileLastLogin`    | span    | Display last login      |
| `sectionFormChangePassword`  | form    | Password change form    |
| `sectionCurrentPassword`     | input   | Current password field  |
| `sectionNewPasswordField`    | input   | New password field      |
| `sectionConfirmNewPassword`  | input   | Confirm password field  |
| `sectionAlertChangePassword` | div     | Alert message container |

---

## 💡 Demo Credentials

Gunakan salah satu user berikut untuk test:

| Username | Password | Role    |
| -------- | -------- | ------- |
| admin    | admin123 | Admin   |
| kasir1   | kasir123 | Cashier |
| kasir2   | kasir123 | Cashier |

**Flow Test:**

1. Login dengan user diatas
2. Klik "Profil" menu
3. Lihat data user ter-populate
4. Coba ubah password
5. Logout dan login dengan password baru

---

## ⚙️ Konfigurasi

### Untuk Menambah/Edit User Data

Edit di `resources/js/kios.js` baris 10-14:

```javascript
const demoUsers = [
    {
        id: 1,
        name: "Admin User",
        username: "admin",
        password: "admin123",
        role: "Admin",
        position: "System Administrator",
    },
    // ... more users
];
```

### Untuk Mengubah Styling

Profile Section CSS ada di:

-   `resources/views/index.blade.php` - Lines 640-750 (inline styles)
-   Ubah `background:`, `color:`, `border-radius:` sesuai kebutuhan

### Untuk Menambah Fields

1. Tambah field di demoUsers object
2. Tambah display element di HTML (sectionProfileXxx)
3. Populate di `loadProfilePage()` function

---

## 🧪 Testing Checklist

-   [ ] User bisa login
-   [ ] "Profil" menu visible di sidebar
-   [ ] Click menu → Section terbuka
-   [ ] Profile data ter-display correct
-   [ ] Password form visible
-   [ ] Try change password dengan valid credentials
-   [ ] Error messages show untuk invalid input
-   [ ] Success alert show untuk valid change
-   [ ] Form reset otomatis
-   [ ] Modal "Buka Profil Lengkap" button works
-   [ ] Logout & login dengan password baru success
-   [ ] Responsive di mobile

---

## 🐛 Debug Tips

### Check Console (F12)

```javascript
// Debug messages
[DEBUG] Loading Profile Page...
[DEBUG] Current User: {...}
[DEBUG] ✓ loadProfilePage type: function

// Test functions dari console
loadProfilePage()
sectionUpdatePassword()
```

### Check localStorage

```javascript
// Di console, ketik:
localStorage.getItem("currentUser");
localStorage.getItem("lastLogin_1");

// Clear data
localStorage.clear();
location.reload();
```

### Test API via Console

```javascript
// Manual test functions
window.loadProfilePage();
console.log(window.currentUser);
console.log(demoUsers);
```

---

## 📝 Integration Checklist

-   ✅ HTML section created dengan semua elements
-   ✅ JavaScript functions implemented
-   ✅ Global function exposure (window.function)
-   ✅ Sidebar menu item added
-   ✅ Modal integration updated
-   ✅ Password validation complete
-   ✅ Data persistence via localStorage
-   ✅ Responsive design applied
-   ✅ Error handling implemented
-   ✅ Console debug logging added

---

## 🔄 Function Call Chain

```
Sidebar Click "Profil"
  ↓
onclick="showSection('profile')"
  ↓
showSection('profile') executed
  ↓
Hide all sections, show #profile
  ↓
Update active sidebar link
  ↓
if (id === 'profile') loadProfilePage()
  ↓
loadProfilePage() executed
  ↓
Populate all section elements
  ↓
Get lastLogin from localStorage
  ↓
Format dan display data
  ↓
Reset password form
  ↓
Profile section ready for user
```

---

## 📞 Support Notes

### Common Issues & Solutions

**Q: Profile section tidak muncul?**
A: Check:

-   Element dengan id="profile" exists
-   CSS class "d-none" berfungsi
-   showSection() function dipanggil
-   Lihat console untuk error

**Q: Data tidak ter-display?**
A: Check:

-   currentUser object populated setelah login
-   Element IDs match antara HTML & JS
-   loadProfilePage() function called
-   localStorage tidak corrupt

**Q: Password tidak bisa diubah?**
A: Check:

-   Current password sesuai dengan demoUsers
-   Password baru >= 6 chars
-   Confirm password match
-   Lihat alert message untuk detail error

**Q: Last login tidak ter-update?**
A: Check:

-   saveLastLogin() dipanggil saat login
-   localStorage keys format: lastLogin\_[userId]
-   Browser localStorage tidak disabled

---

## 🚀 Next Steps

1. **Test di Browser**

    - Buka http://localhost/kios
    - Login dengan credentials
    - Test all features

2. **Customize Design** (Optional)

    - Edit colors, fonts, layout
    - Match dengan brand/theme
    - Adjust responsive breakpoints

3. **Add More Fields** (Optional)

    - Email, phone, department
    - Photo/avatar upload
    - Address, city, country

4. **API Integration** (Future)
    - Connect ke backend database
    - Persistent password storage
    - Real user authentication

---

**Implementasi Status:** ✅ 100% Complete & Ready to Use

**Last Updated:** 2025-01-15
