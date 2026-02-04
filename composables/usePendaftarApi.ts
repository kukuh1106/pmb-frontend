// Pendaftar API service
import type { 
  Pendaftar, 
  PendaftarDashboard,
  RegisterRequest,
  UpdateBiodataRequest,
  Dokumen,
  JadwalUjian,
  ApiResponse 
} from '~/types/api'

export const usePendaftarApi = () => {
  const api = useApi()

  // Public: Register new pendaftar
  const register = async (data: RegisterRequest): Promise<ApiResponse<{
    nomor_pendaftaran: string
    nama_lengkap: string
    prodi: string
    kode_akses: string
  }>> => {
    return api.post('/register', data, false)
  }

  // Public: Check kelulusan
  const cekKelulusan = async (nomor_pendaftaran: string, tanggal_lahir: string): Promise<ApiResponse<{
    nomor_pendaftaran: string
    nama_lengkap: string
    prodi: { nama: string; jenjang: string }
    nilai_ujian?: number
    status_kelulusan: string
  }>> => {
    return api.post('/cek-kelulusan', { nomor_pendaftaran, tanggal_lahir }, false)
  }

  // Pendaftar: Get dashboard
  const getDashboard = async (): Promise<ApiResponse<PendaftarDashboard>> => {
    return api.get<PendaftarDashboard>('/pendaftar/dashboard')
  }

  // Pendaftar: Get biodata
  const getBiodata = async (): Promise<ApiResponse<Pendaftar>> => {
    return api.get<Pendaftar>('/pendaftar/biodata')
  }

  // Pendaftar: Update biodata
  const updateBiodata = async (data: UpdateBiodataRequest): Promise<ApiResponse<Pendaftar>> => {
    return api.put<Pendaftar>('/pendaftar/biodata', data)
  }

  // Pendaftar: Upload dokumen
  const uploadDokumen = async (file: File, jenisDokumen: string): Promise<ApiResponse<Dokumen>> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('jenis_dokumen', jenisDokumen)
    return api.upload<Dokumen>('/pendaftar/dokumen', formData)
  }

  // Pendaftar: Upload foto
  const uploadFoto = async (file: File): Promise<ApiResponse<{ foto_path: string }>> => {
    const formData = new FormData()
    formData.append('foto', file)
    return api.upload<{ foto_path: string }>('/pendaftar/foto', formData)
  }

  // Pendaftar: Get available jadwal
  const getJadwalList = async (): Promise<ApiResponse<JadwalUjian[]>> => {
    return api.get<JadwalUjian[]>('/pendaftar/jadwal')
  }

  // Pendaftar: Pilih jadwal
  const pilihJadwal = async (jadwalId: number): Promise<ApiResponse> => {
    return api.post('/pendaftar/pilih-jadwal', { jadwal_ujian_id: jadwalId })
  }

  // Pendaftar: Get kartu pendaftaran
  const getKartu = async (): Promise<ApiResponse<{ kartu: any }>> => {
    return api.get<{ kartu: any }>('/pendaftar/kartu')
  }

  // Pendaftar: Get hasil ujian
  const getHasil = async (): Promise<ApiResponse<{
    nomor_pendaftaran: string
    nama_lengkap: string
    prodi?: { nama: string; jenjang: string }
    nilai_ujian?: number
    status_kelulusan: string
    status_label: string
  }>> => {
    return api.get('/pendaftar/hasil')
  }

  return {
    register,
    cekKelulusan,
    getDashboard,
    getBiodata,
    updateBiodata,
    uploadDokumen,
    uploadFoto,
    getJadwalList,
    pilihJadwal,
    getKartu,
    getHasil,
  }
}
