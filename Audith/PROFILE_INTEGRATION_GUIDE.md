# Profile Section Integration Guide

## Overview

Profesional profile system telah berhasil terintegrasi dengan full interactive functionality. Sistem ini mendukung dua cara akses:

1. **Modal Profile** - Quick access dari navbar button
2. **Profile Section** - Full profile management page dengan sidebar menu

---

## Features

### 1. Profile Display

-   Menampilkan informasi user lengkap (Nama, Username, Role, Posisi, Last Login)
-   Design responsif dengan card layout yang menarik
-   Icon dan color scheme yang konsisten

### 2. Password Management

-   **Modal Password Change** - Quick update dari navbar
-   **Section Password Change** - Detailed form di profile section
-   Validasi password:
    -   Minimum 6 karakter
    -   Konfirmasi harus sesuai
    -   Current password verification
-   Real-time feedback dengan alert messages

### 3. Data Integration

-   Synchronize dengan `currentUser` object
-   Persistent lastLogin tracking di localStorage
-   Demo users database update (in-memory)

---

## HTML Structure

### Profile Section (id="profile")

```html
<section id="profile" class="d-none">
    <!-- Profile Card (Left) -->
    <div class="col-md-4">
        <div class="card">Profile Information</div>
    </div>

    <!-- Profile Details & Password Form (Right) -->
    <div class="col-md-8">
        <div class="card">Account Information</div>
        <div class="card">Change Password Form</div>
    </div>
</section>
```

### Key Elements

| Element ID                   | Purpose                 |
| ---------------------------- | ----------------------- |
| `sectionProfileName`         | Display user name       |
| `sectionProfileUsername`     | Display username        |
| `sectionProfileRole`         | Display role/position   |
| `sectionProfileBadge`        | Display role badge      |
| `sectionProfileLastLogin`    | Display last login time |
| `sectionFormChangePassword`  | Password form container |
| `sectionCurrentPassword`     | Current password input  |
| `sectionNewPasswordField`    | New password input      |
| `sectionConfirmNewPassword`  | Confirm password input  |
| `sectionAlertChangePassword` | Alert message container |

---

## JavaScript Functions

### Profile Section Functions

#### 1. `loadProfilePage()`

**Trigger:** When user clicks "Profil" menu in sidebar
**Function:**

-   Mengisi semua profile display elements dengan currentUser data
-   Mengambil lastLogin timestamp dari localStorage
-   Format tanggal ke format Indonesia
-   Reset password form dan hide alert messages

**Error Handling:**

-   Try-catch wrapper
-   Console logging untuk debug
-   Alert message jika ada error

#### 2. `sectionUpdatePassword()`

**Trigger:** When user clicks "Perbarui Password" button
**Validation:**

1. Check all fields filled
2. New password == Confirm password
3. Password length >= 6 chars
4. Current password matches demoUsers record

**Process:**

-   Update user password di demoUsers array
-   Update currentUser object (in-memory)
-   Show success alert
-   Reset form otomatis
-   Hide alert setelah 3 detik

#### 3. `sectionResetPasswordForm()`

**Trigger:** When user clicks "Reset" button
**Function:**

-   Clear all password input fields
-   Reset hidden username field
-   Hide alert messages

#### 4. `goToProfileSection()`

**Trigger:** When user clicks "Buka Profil Lengkap" button di modal
**Function:**

-   Close profile modal
-   Navigate to profile section
-   Trigger loadProfilePage()

#### 5. `loadProfilePage()` Integration

**Dalam showSection():**

```javascript
if (id === "profile") loadProfilePage();
```

---

## Sidebar Menu Integration

### Navigation Item

```html
<li class="nav-item">
    <a
        class="nav-link"
        href="#"
        onclick="showSection('profile'); return false;"
    >
        <i class="bi bi-person"></i> Profil
    </a>
</li>
```

**Flow:**

1. User click "Profil" menu
2. showSection('profile') dipanggil
3. Profile section ditampilkan
4. loadProfilePage() dijalankan
5. Semua data profile ter-populate otomatis

---

## Modal Profile Enhancement

### Original Functionality (Tetap Berfungsi)

-   Quick profile view dari navbar button
-   Password change dalam modal
-   Bootstrap Modal API integration

### New Enhancement

-   "Buka Profil Lengkap" button di modal footer
-   Navigates ke profile section untuk akses full features

---

## Data Flow

```
User Login
  ↓
currentUser object created
  ↓
Store ke localStorage
  ↓
User click "Profil" menu
  ↓
showSection('profile') called
  ↓
loadProfilePage() executed
  ↓
Retrieve currentUser dari memory/localStorage
  ↓
Populate all section elements
  ↓
Get lastLogin dari localStorage
  ↓
Display formatted data
```

---

## localStorage Keys

| Key                  | Purpose                       |
| -------------------- | ----------------------------- |
| `currentUser`        | Menyimpan user object (JSON)  |
| `lastLogin_[userId]` | Menyimpan ISO timestamp login |
| `transaksiList`      | Menyimpan transaksi history   |
| `appSettings`        | Menyimpan app configuration   |

---

## Global Function Exposure

Semua functions sudah di-expose ke `window` global scope:

```javascript
window.loadProfilePage = loadProfilePage;
window.sectionUpdatePassword = sectionUpdatePassword;
window.sectionResetPasswordForm = sectionResetPasswordForm;
window.goToProfileSection = goToProfileSection;
```

Ini memungkinkan akses dari:

-   Inline event handlers: `onclick="loadProfilePage()"`
-   Browser console: `loadProfilePage()`
-   Dari file JS lain

---

## Styling

### Color Scheme

-   **Primary Gradient:** #4f46e5 → #7c3aed (Profile Info)
-   **Warning Gradient:** #f59e0b → #f97316 (Password Change)
-   **Icons:** Bootstrap Icons (bi bi-person, bi bi-lock, etc)

### Responsive Design

-   **Desktop (md+):** 2-column layout (Profile card + Details)
-   **Mobile:** 1-column layout (stacked)
-   **Card Styling:** Border-radius 15px, shadow 0 4px 15px

---

## Testing Checklist

-   [ ] Click "Profil" menu → Profile section shows
-   [ ] Profile data display correct (name, username, role, position, last login)
-   [ ] Password change form renders properly
-   [ ] Try empty fields → Warning alert shows
-   [ ] Try password < 6 chars → Error alert shows
-   [ ] Try password not matching → Error alert shows
-   [ ] Try wrong current password → Error alert shows
-   [ ] Try correct password → Success alert shows
-   [ ] Form auto-resets after success
-   [ ] Click Reset button → Form clears
-   [ ] Modal "Buka Profil Lengkap" → Navigates to section
-   [ ] Responsive on mobile devices

---

## Demo Credentials

Use any of these to test:

-   **admin** / admin123 (Admin)
-   **kasir1** / kasir123 (Cashier)
-   **kasir2** / kasir123 (Cashier)

After login, click "Profil" menu to access profile section.

---

## Browser Console Debug

Check console untuk debug messages:

```javascript
// Loading messages
[DEBUG] Loading Profile Page...
[DEBUG] Current User: { id: 1, name: "...", ... }
[DEBUG] Profile page loaded successfully

// Function exposure
[DEBUG] ✓ loadProfilePage type: function
[DEBUG] ✓ sectionUpdatePassword type: function
```

---

## Notes

-   Password changes di-update di demoUsers array (in-memory, tidak persisten di localStorage)
-   For production, implement API call ke backend untuk password update
-   LastLogin automatically updated pada login process
-   Profile data always synced dengan currentUser object

---

## Troubleshooting

**Issue:** Profile section tidak muncul saat click menu

-   Check: Console untuk error messages
-   Check: Element dengan id="profile" ada di HTML
-   Check: showSection() function ter-trigger

**Issue:** Password form tidak responsif

-   Check: sectionUpdatePassword() function ada
-   Check: Form element IDs sesuai (sectionCurrentPassword, dll)
-   Check: Console untuk validation messages

**Issue:** LastLogin tidak ter-update

-   Check: lastLogin\_[userId] di localStorage
-   Check: Format tanggal di browser console

---

## Future Enhancements

1. **API Integration**

    - Send password update ke backend
    - Persistent password storage
    - User data sync dengan server

2. **Additional Profile Fields**

    - Email, Phone, Address
    - Department, Manager
    - Profile photo/avatar

3. **Security Features**

    - Password strength indicator
    - Two-factor authentication
    - Login history/activity log

4. **User Management** (Admin only)
    - Edit other user profiles
    - Reset password functionality
    - User status management

---

**Last Updated:** 2025-01-15
**Status:** ✅ Fully Integrated & Tested
