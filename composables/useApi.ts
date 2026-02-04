// API composable for PMB Pascasarjana
import type { ApiResponse, PaginatedResponse } from '~/types/api'

export const useApi = () => {
  const config = useRuntimeConfig()
  // Fallback ke default jika runtimeConfig tidak tersedia
  const baseUrl = (config.public?.apiUrl as string) || 'http://localhost:8000/api'
  
  // Pastikan baseUrl sudah benar (dengan /api)
  const apiBaseUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`

  // Get token from localStorage
  const getToken = (): string | null => {
    if (import.meta.client) {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  // Set token to localStorage
  const setToken = (token: string) => {
    if (import.meta.client) {
      localStorage.setItem('auth_token', token)
    }
  }

  // Remove token from localStorage
  const removeToken = () => {
    if (import.meta.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }

  // Build headers with auth token
  const buildHeaders = (includeAuth: boolean = true): HeadersInit => {
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }

    if (includeAuth) {
      const token = getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  // Generic fetch wrapper
  const request = async <T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> => {
    const url = `${apiBaseUrl}${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...buildHeaders(includeAuth),
          ...(options.headers || {}),
        },
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          removeToken()
          if (import.meta.client) {
            navigateTo('/login')
          }
        }
        return {
          success: false,
          message: data.message || 'Terjadi kesalahan',
          errors: data.errors,
        }
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      return {
        success: false,
        message: 'Gagal terhubung ke server',
      }
    }
  }

  // GET request
  const get = <T>(endpoint: string, includeAuth: boolean = true) => {
    return request<T>(endpoint, { method: 'GET' }, includeAuth)
  }

  // POST request
  const post = <T>(endpoint: string, body?: any, includeAuth: boolean = true) => {
    return request<T>(
      endpoint,
      {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      },
      includeAuth
    )
  }

  // PUT request
  const put = <T>(endpoint: string, body?: any, includeAuth: boolean = true) => {
    return request<T>(
      endpoint,
      {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      },
      includeAuth
    )
  }

  // DELETE request
  const del = <T>(endpoint: string, includeAuth: boolean = true) => {
    return request<T>(endpoint, { method: 'DELETE' }, includeAuth)
  }

  // Upload file (multipart/form-data)
  const upload = async <T>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> => {
    const url = `${apiBaseUrl}${endpoint}`
    const token = getToken()

    const headers: HeadersInit = {
      'Accept': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Upload gagal',
          errors: data.errors,
        }
      }

      return data
    } catch (error) {
      console.error('Upload Error:', error)
      return {
        success: false,
        message: 'Gagal mengupload file',
      }
    }
  }

  return {
    get,
    post,
    put,
    del,
    upload,
    getToken,
    setToken,
    removeToken,
  }
}
