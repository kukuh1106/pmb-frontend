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

  return {
    getDashboard,
    getPendaftarList,
    getPendaftarDetail
  }
}
