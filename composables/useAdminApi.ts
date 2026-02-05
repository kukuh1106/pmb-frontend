// Admin API service
import type { 
  AdminDashboard,
  PeriodePendaftaran,
  SesiUjian,
  RuangUjian,
  JadwalUjian,
  User,
  Pendaftar,
  ApiResponse,
  PaginatedResponse
} from '~/types/api'

export const useAdminApi = () => {
  const api = useApi()

  // Dashboard
  const getDashboard = async (): Promise<ApiResponse<AdminDashboard>> => {
    return api.get<AdminDashboard>('/admin/dashboard')
  }

  // ==================== Periode ====================
  const getPeriodeList = async (): Promise<ApiResponse<PeriodePendaftaran[]>> => {
    return api.get<PeriodePendaftaran[]>('/admin/periode')
  }

  const createPeriode = async (data: Partial<PeriodePendaftaran>): Promise<ApiResponse<PeriodePendaftaran>> => {
    return api.post<PeriodePendaftaran>('/admin/periode', data)
  }

  const updatePeriode = async (id: number, data: Partial<PeriodePendaftaran>): Promise<ApiResponse<PeriodePendaftaran>> => {
    return api.put<PeriodePendaftaran>(`/admin/periode/${id}`, data)
  }

  const deletePeriode = async (id: number): Promise<ApiResponse> => {
    return api.del(`/admin/periode/${id}`)
  }

  // ==================== Sesi Ujian ====================
  const getSesiList = async (): Promise<ApiResponse<SesiUjian[]>> => {
    return api.get<SesiUjian[]>('/admin/sesi')
  }

  const createSesi = async (data: Partial<SesiUjian>): Promise<ApiResponse<SesiUjian>> => {
    return api.post<SesiUjian>('/admin/sesi', data)
  }

  const updateSesi = async (id: number, data: Partial<SesiUjian>): Promise<ApiResponse<SesiUjian>> => {
    return api.put<SesiUjian>(`/admin/sesi/${id}`, data)
  }

  const deleteSesi = async (id: number): Promise<ApiResponse> => {
    return api.del(`/admin/sesi/${id}`)
  }

  // ==================== Ruang Ujian ====================
  const getRuangList = async (): Promise<ApiResponse<RuangUjian[]>> => {
    return api.get<RuangUjian[]>('/admin/ruang')
  }

  const createRuang = async (data: Partial<RuangUjian>): Promise<ApiResponse<RuangUjian>> => {
    return api.post<RuangUjian>('/admin/ruang', data)
  }

  const updateRuang = async (id: number, data: Partial<RuangUjian>): Promise<ApiResponse<RuangUjian>> => {
    return api.put<RuangUjian>(`/admin/ruang/${id}`, data)
  }

  const deleteRuang = async (id: number): Promise<ApiResponse> => {
    return api.del(`/admin/ruang/${id}`)
  }

  // ==================== Jadwal Ujian ====================
  const getJadwalList = async (periodeId?: number): Promise<ApiResponse<JadwalUjian[]>> => {
    const query = periodeId ? `?periode_id=${periodeId}` : ''
    return api.get<JadwalUjian[]>(`/admin/jadwal${query}`)
  }

  const createJadwal = async (data: Partial<JadwalUjian>): Promise<ApiResponse<JadwalUjian>> => {
    return api.post<JadwalUjian>('/admin/jadwal', data)
  }

  const updateJadwal = async (id: number, data: Partial<JadwalUjian>): Promise<ApiResponse<JadwalUjian>> => {
    return api.put<JadwalUjian>(`/admin/jadwal/${id}`, data)
  }

  const deleteJadwal = async (id: number): Promise<ApiResponse> => {
    return api.del(`/admin/jadwal/${id}`)
  }

  // ==================== Users ====================
  const getUserList = async (role?: string): Promise<ApiResponse<User[]>> => {
    const query = role ? `?role=${role}` : ''
    return api.get<User[]>(`/admin/users${query}`)
  }

  const createUser = async (data: Partial<User> & { password: string }): Promise<ApiResponse<User>> => {
    return api.post<User>('/admin/users', data)
  }

  const updateUser = async (id: number, data: Partial<User>): Promise<ApiResponse<User>> => {
    return api.put<User>(`/admin/users/${id}`, data)
  }

  const deleteUser = async (id: number): Promise<ApiResponse> => {
    return api.del(`/admin/users/${id}`)
  }

  // ==================== Pendaftar (Read Only) ====================
  const getPendaftarList = async (params?: {
    page?: number
    per_page?: number
    prodi_id?: number
    periode_id?: number
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
    return api.get<Pendaftar[]>(`/admin/pendaftar${queryString}`) as Promise<PaginatedResponse<Pendaftar>>
  }

  return {
    getDashboard,
    // Periode
    getPeriodeList,
    createPeriode,
    updatePeriode,
    deletePeriode,
    // Sesi
    getSesiList,
    createSesi,
    updateSesi,
    deleteSesi,
    // Ruang
    getRuangList,
    createRuang,
    updateRuang,
    deleteRuang,
    // Jadwal
    getJadwalList,
    createJadwal,
    updateJadwal,
    deleteJadwal,
    // Users
    getUserList,
    createUser,
    updateUser,
    deleteUser,
    // Pendaftar
    getPendaftarList,
    getPendaftarDetail: async (id: number): Promise<ApiResponse<any>> => {
      return api.get<any>(`/admin/pendaftar/${id}`)
    }
  }
}
