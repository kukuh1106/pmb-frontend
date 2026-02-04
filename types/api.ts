// Type definitions for PMB Pascasarjana API

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

// Auth
export interface LoginCredentials {
  nomor_pendaftaran: string
  kode_akses: string
}

export interface AdminCredentials {
  username: string
  password: string
}

export interface AuthToken {
  token: string
  token_type: string
}

// User & Pendaftar
export interface User {
  id: number
  username: string
  name: string
  email: string
  role: 'admin' | 'prodi'
  prodi_id?: number
  prodi?: Prodi
}

export interface Pendaftar {
  id: number
  nomor_pendaftaran: string
  nama_lengkap: string
  no_whatsapp: string
  tanggal_lahir?: string
  tempat_lahir?: string
  jenis_kelamin?: 'L' | 'P'
  alamat?: string
  pendidikan_terakhir?: string
  asal_institusi?: string
  foto_path?: string
  prodi_id: number
  prodi?: Prodi
  jadwal_ujian_id?: number
  jadwal_ujian?: JadwalUjian
  periode_id?: number
  nilai_ujian?: number
  status_kelulusan: 'lulus' | 'tidak_lulus' | 'belum_diproses'
  status_pendaftaran: 'registrasi' | 'biodata_lengkap' | 'jadwal_dipilih' | 'selesai'
  created_at?: string
}

// Master Data
export interface Prodi {
  id: number
  kode: string
  nama: string
  jenjang: 'S2' | 'S3'
  is_active?: boolean
  pendaftar_count?: number
}

export interface PeriodePendaftaran {
  id: number
  nama: string
  tanggal_buka: string
  tanggal_tutup: string
  is_active: boolean
  pendaftar_count?: number
}

export interface SesiUjian {
  id: number
  nama: string
  jam_mulai: string
  jam_selesai: string
  is_active: boolean
}

export interface RuangUjian {
  id: number
  kode: string
  nama: string
  kapasitas: number
  is_active: boolean
}

export interface JadwalUjian {
  id: number
  periode_id: number
  periode?: PeriodePendaftaran
  tanggal: string
  tanggal_formatted?: string
  sesi_id: number
  sesi?: SesiUjian
  ruang_id: number
  ruang?: RuangUjian
  kuota: number
  terisi: number
  sisa_kuota?: number
  is_active: boolean
}

export interface Dokumen {
  id: number
  pendaftar_id: number
  jenis_dokumen: 'ijazah' | 'transkrip' | 'ktp' | 'pas_foto' | 'surat_rekomendasi' | 'proposal' | 'lainnya'
  file_name: string
  file_path: string
  file_url?: string
  file_size: number
  status_verifikasi: 'pending' | 'valid' | 'tidak_valid'
  catatan?: string
  created_at?: string
}

// Dashboard
export interface PendaftarDashboard {
  pendaftar: {
    nomor_pendaftaran: string
    nama_lengkap: string
    status_pendaftaran: 'registrasi' | 'biodata_lengkap' | 'jadwal_dipilih' | 'selesai'
    status_kelulusan: string
    nilai_ujian?: number
  }
  prodi?: {
    nama: string
    jenjang: string
  }
  jadwal_ujian?: {
    tanggal: string
    sesi: string
    jam: string
    ruang: string
  }
  biodata_lengkap: boolean
  dokumen_lengkap: boolean
  dokumen: {
    total: number
    valid: number
    pending: number
    tidak_valid: number
    required: string[]
    missing: string[]
  }
}

export interface AdminDashboard {
  total_pendaftar: number
  total_prodi: number
  total_users: number
  pendaftar_by_prodi: Array<{
    prodi: string
    jenjang: string
    total: number
  }>
  pendaftar_by_status: Record<string, number>
  kelulusan_by_status: Record<string, number>
  periode_aktif?: PeriodePendaftaran
}

// Request Types
export interface RegisterRequest {
  nama_lengkap: string
  no_whatsapp: string
  prodi_id: number
}

export interface UpdateBiodataRequest {
  nama_lengkap?: string
  tanggal_lahir?: string
  tempat_lahir?: string
  jenis_kelamin?: 'L' | 'P'
  alamat?: string
  pendidikan_terakhir?: string
  asal_institusi?: string
  no_whatsapp?: string
}

export interface VerifikasiDokumenRequest {
  dokumen_id: number
  status: 'valid' | 'tidak_valid'
  catatan?: string
}
