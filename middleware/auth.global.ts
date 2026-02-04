// Auth middleware for protecting routes
export default defineNuxtRouteMiddleware((to, from) => {
  // Skip on server side
  if (import.meta.server) return

  const auth = useAuth()
  auth.initAuth()

  const publicRoutes = ['/', '/login', '/login/admin', '/register', '/cek-kelulusan']
  const pendaftarRoutes = ['/pendaftar']
  const adminRoutes = ['/admin']

  // Check if route requires auth
  const isPublicRoute = publicRoutes.some(route => to.path === route)
  const isPendaftarRoute = pendaftarRoutes.some(route => to.path.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => to.path.startsWith(route))

  // Allow public routes
  if (isPublicRoute) {
    return
  }

  // Check authentication
  if (!auth.isAuthenticated.value) {
    if (isPendaftarRoute) {
      return navigateTo('/login')
    }
    if (isAdminRoute) {
      return navigateTo('/login/admin')
    }
    return navigateTo('/login')
  }

  // Check role-based access
  if (isPendaftarRoute && auth.role.value !== 'pendaftar') {
    return navigateTo('/admin')
  }

  if (isAdminRoute && auth.role.value !== 'admin' && auth.role.value !== 'prodi') {
    return navigateTo('/pendaftar')
  }
})
