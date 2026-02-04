// Prodi Staff API service
import type { 
  Pendaftar, 
  Dokumen,
  VerifikasiDokumenRequest,
  ApiResponse,
  PaginatedResponse
} from '~/types/api'

export const useProdiStafApi = () => {
  const api = useApi()

  // Get pendaftar list for this prodi
  const getPendaftarList = async (params?: {
    page?: number
    per_page?: number
    status_pendaftaran?: string
    status_kelulusan?: string
    search?: string
  }): Promise<PaginatedResponse<Pendaftar> & { statistics?: any }> => {
    const query = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          query.append(key, String(value))
        }
      })
    }
    const queryString = query.toString() ? `?${query.toString()}` : ''
    return api.get(`/prodi/pendaftar${queryString}`) as Promise<PaginatedResponse<Pendaftar> & { statistics?: any }>
  }

  // Get pendaftar detail
  const getPendaftarDetail = async (id: number): Promise<ApiResponse<{
    pendaftar: Pendaftar
    prodi?: any
    jadwal_ujian?: any
    periode?: string
    dokumen: Dokumen[]
  }>> => {
    return api.get(`/prodi/pendaftar/${id}`)
  }

  // Verifikasi dokumen
  const verifikasiDokumen = async (pendaftarId: number, data: VerifikasiDokumenRequest): Promise<ApiResponse<Dokumen>> => {
    return api.put<Dokumen>(`/prodi/verifikasi/${pendaftarId}`, data)
  }

  // Download form nilai template
  const getFormNilai = async (): Promise<ApiResponse<Array<{
    nomor_pendaftaran: string
    nama_lengkap: string
    nilai: number | string
  }>>> => {
    return api.get('/prodi/form-nilai')
  }

  // Upload batch nilai
  const uploadNilai = async (data: Array<{
    nomor_pendaftaran: string
    nilai: number
  }>): Promise<ApiResponse<{
    success: number
    failed: number
    errors?: any[]
  }>> => {
    return api.post('/prodi/upload-nilai', { data })
  }

  // Input nilai individual
  const inputNilai = async (pendaftarId: number, nilai: number): Promise<ApiResponse<Pendaftar>> => {
    return api.put<Pendaftar>(`/prodi/pendaftar/${pendaftarId}/nilai`, { nilai_ujian: nilai })
  }

  // Set status kelulusan
  const setStatus = async (pendaftarId: number, status: 'lulus' | 'tidak_lulus' | 'belum_diproses'): Promise<ApiResponse<Pendaftar>> => {
    return api.put<Pendaftar>(`/prodi/pendaftar/${pendaftarId}/status`, { status_kelulusan: status })
  }

  // Kirim notifikasi WhatsApp
  const kirimNotifikasi = async (pendaftarId: number, type: 'hasil' | 'custom', options?: {
    subject?: string
    message?: string
  }): Promise<ApiResponse> => {
    return api.post(`/prodi/notifikasi/${pendaftarId}`, { type, ...options })
  }

  return {
    getPendaftarList,
    getPendaftarDetail,
    verifikasiDokumen,
    getFormNilai,
    uploadNilai,
    inputNilai,
    setStatus,
    kirimNotifikasi,
  }
}
