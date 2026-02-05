// Staf Prodi API service
import type { 
  AdminDashboard, // Reusing schema as structure is similar enough or I will define new one
  Pendaftar,
  ApiResponse,
  PaginatedResponse
} from '~/types/api'

export const useStafApi = () => {
  const api = useApi()

  // Dashboard
  const getDashboard = async (): Promise<ApiResponse<any>> => {
    return api.get<any>('/prodi/dashboard')
  }

  // Pendaftar (Read & Verify)
  const getPendaftarList = async (params?: {
    page?: number
    per_page?: number
    status_pendaftaran?: string
    status_kelulusan?: string
    search?: string
  }): Promise<PaginatedResponse<Pendaftar>> => {
    const query = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          query.append(key, String(value))
        }
      })
    }
    const queryString = query.toString() ? `?${query.toString()}` : ''
    return api.get<Pendaftar[]>(`/prodi/pendaftar${queryString}`) as Promise<PaginatedResponse<Pendaftar>>
  }

  const getPendaftarDetail = async (id: number): Promise<ApiResponse<any>> => {
    return api.get<any>(`/prodi/pendaftar/${id}`)
  }

  // Input nilai ujian
  const inputNilai = async (id: number, nilai_ujian: number): Promise<ApiResponse<any>> => {
    return api.put<any>(`/prodi/pendaftar/${id}/nilai`, { nilai_ujian })
  }

  // Set status kelulusan
  const setStatusKelulusan = async (
    id: number, 
    status_kelulusan: 'lulus' | 'tidak_lulus' | 'belum_diproses'
  ): Promise<ApiResponse<any>> => {
    return api.put<any>(`/prodi/pendaftar/${id}/status`, { status_kelulusan })
  }

  // Send notification to pendaftar
  const sendNotifikasi = async (
    id: number, 
    type: 'hasil' | 'custom',
    subject?: string,
    message?: string
  ): Promise<ApiResponse<any>> => {
    const payload: any = { type }
    if (type === 'custom') {
      payload.subject = subject
      payload.message = message
    }
    return api.post<any>(`/prodi/notifikasi/${id}`, payload)
  }

  return {
    getDashboard,
    getPendaftarList,
    getPendaftarDetail,
    inputNilai,
    setStatusKelulusan,
    sendNotifikasi
  }
}
