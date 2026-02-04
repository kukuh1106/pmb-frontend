<script setup lang="ts">
const auth = useAuth()
const router = useRouter()

// Initialize auth and check if user is logged in
onMounted(() => {
  auth.initAuth()
  
  if (!auth.isAuthenticated.value || auth.role.value !== 'pendaftar') {
    router.push('/login')
  }
})

const handleLogout = async () => {
  await auth.logout()
}

// Get user initials for avatar
const userInitials = computed(() => {
  if (!auth.user.value) return 'U'
  const name = (auth.user.value as any).nama_lengkap || auth.user.value.name || 'User'
  return name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
})
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-[#111816] dark:text-white">
    <!-- Top Navigation Bar -->
    <header class="sticky top-0 z-50 w-full border-b border-border-light bg-white/80 backdrop-blur-md dark:bg-background-dark/80 dark:border-white/10">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <img src="~/assets/images/Logo-UIN.webp" alt="Logo UIN" class="h-12 w-auto" />
          <div class="hidden sm:flex flex-col">
            <span class="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-tight">UIN K.H. Abdurrahman Wahid</span>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button 
            @click="handleLogout"
            class="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#f0f4f3] hover:bg-[#e0e8e5] dark:bg-white/10 dark:hover:bg-white/20 transition-colors text-[#111816] dark:text-white gap-2 text-sm font-bold px-4"
          >
            <UIcon name="i-heroicons-arrow-right-start-on-rectangle" class="text-[20px]" />
            <span class="hidden sm:inline">Keluar</span>
          </button>
          
          <!-- User Avatar with Initials -->
          <div class="size-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm border border-gray-200 dark:border-white/10">
            {{ userInitials }}
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Layout -->
    <main class="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
      <div class="w-full flex flex-col gap-8">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="mt-auto border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#1A2C26]">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 text-center">
        <div class="flex flex-wrap items-center justify-center gap-8">
          <a class="text-[#61897c] dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">Pusat Bantuan</a>
          <a class="text-[#61897c] dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">Kebijakan Privasi</a>
          <a class="text-[#61897c] dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">Syarat Layanan</a>
        </div>
        <p class="text-gray-400 dark:text-slate-500 text-sm font-normal">© 2026 UIN K.H. Abdurrahman Wahid Pekalongan. Hak Cipta Dilindungi.</p>
      </div>
    </footer>
  </div>
</template>
