# Frontend API Integration Guide

## Overview

Frontend Nuxt 4 telah diintegrasikan dengan backend Laravel API. Document ini menjelaskan struktur API composables dan cara penggunaannya.

## API Base URL

API URL dikonfigurasi di `nuxt.config.ts`:

```ts
runtimeConfig: {
  public: {
    apiUrl: process.env.NUXT_PUBLIC_API_URL || "http://localhost:8000/api",
  },
},
```

Untuk development, set environment variable:

```bash
NUXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Struktur Composables

### 1. `useApi.ts` - Core API Client

Base composable untuk semua HTTP requests dengan built-in token management.

**Methods:**

- `get<T>(endpoint)` - GET request
- `post<T>(endpoint, body)` - POST request
- `put<T>(endpoint, body)` - PUT request
- `del<T>(endpoint)` - DELETE request
- `upload<T>(endpoint, formData)` - File upload
- `getToken()` / `setToken(token)` / `removeToken()` - Token management

### 2. `useAuth.ts` - Authentication

Handle login, logout, dan auth state.

**Methods:**

- `loginPendaftar(credentials)` - Login sebagai pendaftar
- `loginAdmin(credentials)` - Login sebagai admin/staf prodi
- `logout()` - Logout dan clear token
- `initAuth()` - Initialize auth dari localStorage
- `fetchCurrentUser()` - Get current user profile

**Reactive State:**

- `user` - Current user object
- `isAuthenticated` - Boolean authentication status
- `role` - Current user role ('admin' | 'prodi' | 'pendaftar')
- `isLoading` - Loading state

### 3. `useProdiApi.ts` - Program Studi API

**Public:**

- `getProdiList()` - List active prodi

**Admin:**

- `getProdiAll()` - List all prodi with stats
- `createProdi(data)` - Create prodi
- `updateProdi(id, data)` - Update prodi
- `deleteProdi(id)` - Delete prodi

### 4. `usePendaftarApi.ts` - Pendaftar API

**Public:**

- `register(data)` - Register new pendaftar
- `cekKelulusan(nomor, tanggal_lahir)` - Check kelulusan status

**Authenticated (Pendaftar):**

- `getDashboard()` - Get pendaftar dashboard
- `getBiodata()` - Get biodata
- `updateBiodata(data)` - Update biodata
- `uploadDokumen(file, jenis)` - Upload document
- `uploadFoto(file)` - Upload profile photo
- `getJadwalList()` - List available jadwal
- `pilihJadwal(jadwalId)` - Select jadwal ujian
- `getKartu()` - Get kartu pendaftaran
- `getHasil()` - Get hasil ujian

### 5. `useAdminApi.ts` - Admin API

**Dashboard:**

- `getDashboard()` - Admin dashboard stats

**CRUD Operations:**

- Periode: `getPeriodeList()`, `createPeriode()`, `updatePeriode()`, `deletePeriode()`
- Sesi: `getSesiList()`, `createSesi()`, `updateSesi()`, `deleteSesi()`
- Ruang: `getRuangList()`, `createRuang()`, `updateRuang()`, `deleteRuang()`
- Jadwal: `getJadwalList()`, `createJadwal()`, `updateJadwal()`, `deleteJadwal()`
- Users: `getUserList()`, `createUser()`, `updateUser()`, `deleteUser()`
- Pendaftar: `getPendaftarList(params)` - dengan pagination dan filter

### 6. `useProdiStafApi.ts` - Staf Prodi API

- `getPendaftarList(params)` - List pendaftar untuk prodi ini
- `getPendaftarDetail(id)` - Detail pendaftar
- `verifikasiDokumen(pendaftarId, data)` - Verifikasi dokumen
- `getFormNilai()` - Download template form nilai
- `uploadNilai(data)` - Batch upload nilai
- `inputNilai(pendaftarId, nilai)` - Input nilai individual
- `setStatus(pendaftarId, status)` - Set status kelulusan
- `kirimNotifikasi(pendaftarId, type, options)` - Kirim WhatsApp

## Type Definitions

Semua type definitions ada di `types/api.ts`:

- `ApiResponse<T>` - Standard API response
- `PaginatedResponse<T>` - Paginated response
- `LoginCredentials` - Pendaftar login credentials
- `AdminCredentials` - Admin login credentials
- `Pendaftar`, `User`, `Prodi`, `JadwalUjian`, etc.

## Middleware

### `middleware/auth.global.ts`

Global middleware untuk route protection:

- Public routes: `/`, `/login`, `/login/admin`, `/register`, `/cek-kelulusan`
- Pendaftar routes: `/pendaftar/*` - memerlukan role `pendaftar`
- Admin routes: `/admin/*` - memerlukan role `admin` atau `prodi`

## Halaman yang Sudah Terintegrasi

1. **`/register`** - Registrasi pendaftar baru
2. **`/login`** - Login pendaftar
3. **`/login/admin`** - Login admin/staf prodi
4. **`/cek-kelulusan`** - Cek status kelulusan
5. **`/pendaftar`** - Dashboard pendaftar
6. **`/pendaftar/biodata`** - Form biodata
7. **`/pendaftar/dokumen`** - Upload dokumen
8. **`/pendaftar/jadwal`** - Pilih jadwal ujian
9. **`/admin`** - Dashboard admin

## Contoh Penggunaan

```vue
<script setup lang="ts">
const pendaftarApi = usePendaftarApi();
const toast = useToast();

const isLoading = ref(false);
const data = ref(null);

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await pendaftarApi.getDashboard();
    if (response.success && response.data) {
      data.value = response.data;
    } else {
      toast.add({
        title: "Error",
        description: response.message || "Gagal memuat data",
        color: "error",
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
```

## Error Handling

API composables sudah handle:

- Network errors → menampilkan message "Gagal terhubung ke server"
- 401 Unauthorized → auto logout dan redirect ke login
- Validation errors → errors tersedia di `response.errors`

## Token Storage

Token disimpan di localStorage:

- `auth_token` - Bearer token
- `auth_user` - User data (JSON string)
