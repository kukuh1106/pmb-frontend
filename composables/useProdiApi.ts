// Prodi API service
import type { Prodi, ApiResponse } from '~/types/api'

export const useProdiApi = () => {
  const api = useApi()

  // Get all active prodi (public)
  const getProdiList = async (): Promise<ApiResponse<Prodi[]>> => {
    return api.get<Prodi[]>('/prodi', false)
  }

  // Admin: Get all prodi with stats
  const getProdiAll = async (): Promise<ApiResponse<Prodi[]>> => {
    return api.get<Prodi[]>('/admin/prodi')
  }

  // Admin: Create prodi
  const createProdi = async (data: Partial<Prodi>): Promise<ApiResponse<Prodi>> => {
    return api.post<Prodi>('/admin/prodi', data)
  }

  // Admin: Update prodi
  const updateProdi = async (id: number, data: Partial<Prodi>): Promise<ApiResponse<Prodi>> => {
    return api.put<Prodi>(`/admin/prodi/${id}`, data)
  }

  // Admin: Delete prodi
  const deleteProdi = async (id: number): Promise<ApiResponse> => {
    return api.del(`/admin/prodi/${id}`)
  }

  return {
    getProdiList,
    getProdiAll,
    createProdi,
    updateProdi,
    deleteProdi,
  }
}
