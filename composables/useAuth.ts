// Auth composable for PMB Pascasarjana
import type { 
  User, 
  Pendaftar, 
  LoginCredentials, 
  AdminCredentials,
  AuthToken,
  ApiResponse 
} from '~/types/api'

export const useAuth = () => {
  const api = useApi()
  const router = useRouter()

  // Reactive state
  const user = ref<User | Pendaftar | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const role = ref<'admin' | 'prodi' | 'pendaftar' | null>(null)

  // Initialize from localStorage
  const initAuth = () => {
    if (import.meta.client) {
      const token = api.getToken()
      const storedUser = localStorage.getItem('auth_user')
      
      if (token && storedUser) {
        try {
          user.value = JSON.parse(storedUser)
          isAuthenticated.value = true
          role.value = user.value?.role as any || 'pendaftar'
        } catch {
          api.removeToken()
        }
      }
    }
  }

  // Login as Pendaftar
  const loginPendaftar = async (credentials: LoginCredentials): Promise<ApiResponse> => {
    isLoading.value = true
    
    try {
      const response = await api.post<{ user: Pendaftar; token: string }>('/auth/login', credentials, false)

      if (response.success && response.data) {
        api.setToken(response.data.token)
        user.value = response.data.user
        isAuthenticated.value = true
        role.value = 'pendaftar'
        
        if (import.meta.client) {
          localStorage.setItem('auth_user', JSON.stringify(response.data.user))
        }
      }

      return response
    } finally {
      isLoading.value = false
    }
  }

  // Login as Admin/Prodi
  const loginAdmin = async (credentials: AdminCredentials): Promise<ApiResponse> => {
    isLoading.value = true

    try {
      const response = await api.post<{ user: User; token: string }>('/auth/admin/login', credentials, false)

      if (response.success && response.data) {
        api.setToken(response.data.token)
        user.value = response.data.user
        isAuthenticated.value = true
        role.value = response.data.user.role

        if (import.meta.client) {
          localStorage.setItem('auth_user', JSON.stringify(response.data.user))
        }
      }

      return response
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const logout = async (): Promise<void> => {
    isLoading.value = true

    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore logout errors
    } finally {
      api.removeToken()
      user.value = null
      isAuthenticated.value = false
      role.value = null
      isLoading.value = false
      
      await router.push('/login')
    }
  }

  // Check role
  const hasRole = (requiredRole: 'admin' | 'prodi' | 'pendaftar'): boolean => {
    return role.value === requiredRole
  }

  // Get current user
  const fetchCurrentUser = async (): Promise<void> => {
    if (!api.getToken()) return

    const response = await api.get<User | Pendaftar>('/auth/me')
    
    if (response.success && response.data) {
      user.value = response.data
      isAuthenticated.value = true
      role.value = response.data.role as any || 'pendaftar'
      
      if (import.meta.client) {
        localStorage.setItem('auth_user', JSON.stringify(response.data))
      }
    } else {
      api.removeToken()
      isAuthenticated.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    role,
    initAuth,
    loginPendaftar,
    loginAdmin,
    logout,
    hasRole,
    fetchCurrentUser,
  }
}
