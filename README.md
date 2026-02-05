# PMB Pascasarjana - Frontend

Frontend untuk Sistem Penerimaan Mahasiswa Baru (PMB) Program Pascasarjana, dibangun dengan Nuxt 3 dan Nuxt UI.

## Tech Stack

| Layer           | Teknologi         |
| --------------- | ----------------- |
| **Framework**   | Nuxt 3/4          |
| **UI Library**  | Nuxt UI           |
| **Styling**     | Tailwind CSS      |
| **State**       | Vue Composables   |
| **HTTP Client** | useFetch / $fetch |

## Requirements

- Node.js 18+
- npm atau pnpm

## Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` file:

```env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
```

### 3. Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## Project Structure

```
frontend/
├── pages/                          # Application routes
│   ├── index.vue                   # Landing page
│   ├── register.vue                # Registration form
│   ├── cara-mendaftar.vue          # How to register guide
│   ├── program-studi.vue           # Program studi info
│   ├── cek-kelulusan.vue           # Check graduation status
│   ├── login/
│   │   ├── index.vue               # Pendaftar login
│   │   └── admin.vue               # Admin/staff login
│   ├── pendaftar/
│   │   ├── index.vue               # Pendaftar dashboard
│   │   ├── biodata.vue             # Biodata form
│   │   ├── dokumen.vue             # Document upload
│   │   ├── jadwal.vue              # Schedule selection
│   │   └── kartu.vue               # Registration card
│   └── admin/
│       ├── index.vue               # Admin dashboard
│       ├── prodi/index.vue         # Prodi management
│       ├── periode/index.vue       # Periode management
│       ├── jadwal/index.vue        # Jadwal management
│       ├── users/index.vue         # User management
│       ├── settings/index.vue      # Settings
│       └── pendaftar/
│           ├── index.vue           # List pendaftar
│           └── [id].vue            # Detail pendaftar
├── layouts/
│   ├── default.vue                 # Default layout (public)
│   ├── pendaftar.vue               # Pendaftar layout
│   └── admin.vue                   # Admin layout with sidebar
├── composables/
│   ├── useApi.ts                   # Base API composable
│   ├── useAuth.ts                  # Authentication composable
│   ├── useAdminApi.ts              # Admin API endpoints
│   ├── usePendaftarApi.ts          # Pendaftar API endpoints
│   ├── useProdiApi.ts              # Prodi API endpoints
│   ├── useProdiStafApi.ts          # Prodi staff API endpoints
│   └── useStafApi.ts               # Staff API endpoints
├── components/
│   └── shared/                     # Shared components
├── tailwind.config.ts              # Tailwind configuration
└── nuxt.config.ts                  # Nuxt configuration
```

## Implemented Pages

### Public Pages (No Auth)

| Route             | Page               | Status |
| ----------------- | ------------------ | ------ |
| `/`               | Landing Page       | ✅     |
| `/register`       | Registration Form  | ✅     |
| `/cara-mendaftar` | How to Register    | ✅     |
| `/program-studi`  | Program Studi Info | ✅     |
| `/cek-kelulusan`  | Check Graduation   | ✅     |
| `/login`          | Pendaftar Login    | ✅     |
| `/login/admin`    | Admin/Staff Login  | ✅     |

### Pendaftar Pages (Role: pendaftar)

| Route                | Page               | Status |
| -------------------- | ------------------ | ------ |
| `/pendaftar`         | Dashboard          | ✅     |
| `/pendaftar/biodata` | Biodata Form       | ✅     |
| `/pendaftar/dokumen` | Document Upload    | ✅     |
| `/pendaftar/jadwal`  | Schedule Selection | ✅     |
| `/pendaftar/kartu`   | Registration Card  | ✅     |

### Admin Pages (Role: admin)

| Route                   | Page               | Status |
| ----------------------- | ------------------ | ------ |
| `/admin`                | Dashboard Overview | ✅     |
| `/admin/prodi`          | Prodi Management   | ✅     |
| `/admin/periode`        | Periode Management | ✅     |
| `/admin/jadwal`         | Jadwal Management  | ✅     |
| `/admin/users`          | User Management    | ✅     |
| `/admin/settings`       | Settings           | ✅     |
| `/admin/pendaftar`      | List Pendaftar     | ✅     |
| `/admin/pendaftar/[id]` | Detail Pendaftar   | ✅     |

## Composables

### `useAuth`

Handles authentication state and methods:

```typescript
const { user, isLoggedIn, login, logout, fetchUser } = useAuth();
```

### `useApi`

Base API composable for making HTTP requests:

```typescript
const { get, post, put, del } = useApi();
```

### `usePendaftarApi`

Pendaftar-specific API endpoints:

```typescript
const { getDashboard, getBiodata, updateBiodata, uploadDokumen } =
  usePendaftarApi();
```

### `useAdminApi`

Admin-specific API endpoints for CRUD operations:

```typescript
const { getProdi, createProdi, updateProdi, deleteProdi } = useAdminApi();
```

## Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Utilities
npm run lint         # Run linter
npm run typecheck    # Type checking
```

## Environment Variables

| Variable               | Default                     | Description     |
| ---------------------- | --------------------------- | --------------- |
| `NUXT_PUBLIC_API_BASE` | `http://localhost:8000/api` | Backend API URL |

## Notes

- UI menggunakan Nuxt UI components dengan custom Tailwind theme
- Authentication menggunakan Laravel Sanctum (cookie-based)
- File upload mendukung AWS S3 melalui backend API
- Responsive design untuk desktop dan mobile

## License

Proprietary - PT. Reagtive
