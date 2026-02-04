<script setup lang="ts">
definePageMeta({ layout: false });

const auth = useAuth()
const toast = useToast()
const router = useRouter()

const form = reactive({
  username: "",
  password: "",
  remember: false,
});

const showPassword = ref(false);
const isLoading = ref(false);

// Check if already logged in
onMounted(() => {
  auth.initAuth()
  if (auth.isAuthenticated.value) {
    if (auth.role.value === 'admin') {
      router.push('/admin')
    } else if (auth.role.value === 'prodi') {
      router.push('/admin') // Prodi staff uses admin panel
    }
  }
})

async function handleLogin() {
  if (!form.username || !form.password) {
    toast.add({
      title: 'Validasi Gagal',
      description: 'Mohon isi semua field',
      color: 'error'
    })
    return
  }

  isLoading.value = true

  try {
    const response = await auth.loginAdmin({
      username: form.username,
      password: form.password
    })

    if (response.success) {
      toast.add({
        title: 'Login Berhasil!',
        description: `Selamat datang, ${auth.user.value?.name || 'Admin'}`,
        color: 'success'
      })
      router.push('/admin')
    } else {
      toast.add({
        title: 'Login Gagal',
        description: response.message || 'Username atau password salah',
        color: 'error'
      })
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Gagal terhubung ke server',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark font-display antialiased text-[#111816] dark:text-white transition-colors duration-300 min-h-screen">
    <div class="relative flex min-h-screen w-full flex-col overflow-x-hidden group/design-root">
      <!-- Background Decor -->
      <div class="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#e8f5f1] to-transparent dark:from-[#0c1a16] dark:to-transparent pointer-events-none -z-10"></div>
      
      <!-- Main Content Centered -->
      <div class="layout-container flex h-full grow flex-col items-center justify-center p-4 py-10">
        <!-- Card Container -->
        <div class="w-full max-w-[440px] bg-white dark:bg-[#1A2E28] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-black/20 border border-[#e6e6e6] dark:border-[#2a4038] overflow-hidden">
          <!-- Card Header -->
          <div class="flex flex-col items-center pt-10 pb-2 px-8 text-center">
            <!-- Logo -->
            <div class="flex flex-col items-center gap-3 mb-5">
              <img src="~/assets/images/Logo-UIN.webp" alt="Logo UIN" class="h-16 w-auto" />
            </div>
            <h1 class="text-[#111816] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] mb-3">UIN K.H. Abdurrahman Wahid</h1>
            <!-- Secure Badge -->
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50">
              <span class="material-symbols-outlined text-primary text-[16px]">shield_lock</span>
              <span class="text-primary text-xs font-bold tracking-wide uppercase">Portal Staf Terlindungi</span>
            </div>
          </div>

          <!-- Form Section -->
          <form @submit.prevent="handleLogin" class="p-8 space-y-5">
            <!-- Staff ID Field -->
            <label class="flex flex-col gap-1.5">
              <span class="text-[#111816] dark:text-gray-200 text-sm font-semibold ml-1">Username</span>
              <div class="relative">
                <input 
                  v-model="form.username"
                  class="form-input w-full rounded-lg border border-[#dbe6e2] dark:border-[#4a6b5d] bg-white dark:bg-[#10221c] text-[#111816] dark:text-white h-12 px-4 placeholder:text-[#61897c]/60 dark:placeholder:text-[#4a6b5d] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200" 
                  placeholder="Masukkan username anda" 
                  type="text"
                  required
                />
              </div>
            </label>

            <!-- Password Field -->
            <label class="flex flex-col gap-1.5">
              <div class="flex justify-between items-center ml-1">
                <span class="text-[#111816] dark:text-gray-200 text-sm font-semibold">Kata Sandi</span>
              </div>
              <div class="relative flex w-full items-center">
                <input 
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input w-full rounded-lg border border-[#dbe6e2] dark:border-[#4a6b5d] bg-white dark:bg-[#10221c] text-[#111816] dark:text-white h-12 pl-4 pr-12 placeholder:text-[#61897c]/60 dark:placeholder:text-[#4a6b5d] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200" 
                  placeholder="Masukkan kata sandi" 
                  required
                />
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-0 top-0 h-full px-3 text-[#61897c] hover:text-primary transition-colors flex items-center justify-center rounded-r-lg"
                >
                  <span class="material-symbols-outlined text-[20px]">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </label>

            <!-- Checkbox & Forgot Password -->
            <div class="flex items-center justify-between pt-1">
              <label class="flex items-center gap-2.5 cursor-pointer select-none">
                <input v-model="form.remember" class="form-checkbox size-4 rounded border-[#dbe6e2] text-primary focus:ring-primary focus:ring-offset-0 bg-white dark:bg-[#10221c] dark:border-[#4a6b5d]" type="checkbox"/>
                <span class="text-[#61897c] dark:text-gray-400 text-sm font-medium">Ingat saya</span>
              </label>
              <a class="text-primary text-sm font-semibold hover:text-emerald-600 transition-colors" href="#">Lupa Kata Sandi?</a>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              :disabled="isLoading"
              class="group flex w-full cursor-pointer items-center justify-center rounded-lg h-12 bg-primary hover:bg-emerald-600 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all shadow-[0_2px_4px_rgba(16,183,127,0.2)] hover:shadow-[0_4px_12px_rgba(16,183,127,0.3)] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="material-symbols-outlined text-[18px] mr-2 animate-spin">progress_activity</span>
              <span v-else class="material-symbols-outlined text-[18px] mr-2 group-hover:-translate-x-0.5 transition-transform">login</span>
              <span>{{ isLoading ? 'Memproses...' : 'Masuk' }}</span>
            </button>
          </form>

          <!-- Card Footer -->
          <div class="bg-[#fcfdfd] dark:bg-[#15251f] p-5 text-center border-t border-[#f0f4f3] dark:border-[#2a4038]">
            <p class="text-[#61897c] dark:text-gray-400 text-xs leading-relaxed">
              Akses tidak sah dilarang dan dipantau. <br/>
              Butuh bantuan? <a class="text-[#111816] dark:text-gray-200 font-semibold hover:text-primary transition-colors" href="#">Hubungi IT Support</a>.
            </p>
          </div>
        </div>

        <!-- Back to Pendaftar Login -->
        <NuxtLink to="/login" class="mt-6 flex items-center gap-2 text-sm font-medium text-[#61897c] hover:text-primary transition-colors">
          <span class="material-symbols-outlined text-lg">arrow_back</span>
          <span>Kembali ke Login Pendaftar</span>
        </NuxtLink>

        <!-- Bottom Copyright/Info -->
        <div class="mt-8 flex flex-col items-center gap-4 text-center">
          <div class="flex gap-6 text-sm text-[#61897c]">
            <a class="hover:text-primary transition-colors" href="#">Kebijakan Privasi</a>
            <span class="text-[#dbe6e2] dark:text-[#2a4038]">•</span>
            <a class="hover:text-primary transition-colors" href="#">Syarat Layanan</a>
          </div>
          <p class="text-[#98b8ad] dark:text-[#4a6b5d] text-xs">© 2026 Sistem Penerimaan Pascasarjana</p>
        </div>
      </div>
    </div>
  </div>
</template>
