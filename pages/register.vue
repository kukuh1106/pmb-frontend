<script setup lang="ts">
import type { Prodi } from '~/types/api'

definePageMeta({
  layout: false
})

const prodiApi = useProdiApi()
const pendaftarApi = usePendaftarApi()
const toast = useToast()

const isSuccess = ref(false)
const isLoading = ref(false)
const prodiList = ref<Prodi[]>([])

const form = reactive({
  nama_lengkap: '',
  no_whatsapp: '',
  prodi_id: ''
})

const credentials = reactive({
  nomor_pendaftaran: '',
  kode_akses: ''
})

// Fetch prodi list on mount
onMounted(async () => {
  const response = await prodiApi.getProdiList()
  if (response.success && response.data) {
    prodiList.value = response.data
  }
})

const submitRegistration = async () => {
  if (!form.nama_lengkap || !form.no_whatsapp || !form.prodi_id) {
    toast.add({
      title: 'Validasi Gagal',
      description: 'Mohon lengkapi semua field',
      color: 'error'
    })
    return
  }

  isLoading.value = true

  try {
    const response = await pendaftarApi.register({
      nama_lengkap: form.nama_lengkap,
      no_whatsapp: form.no_whatsapp,
      prodi_id: Number(form.prodi_id)
    })

    if (response.success && response.data) {
      credentials.nomor_pendaftaran = response.data.nomor_pendaftaran
      credentials.kode_akses = response.data.kode_akses
      isSuccess.value = true
      
      toast.add({
        title: 'Registrasi Berhasil!',
        description: 'Kredensial sudah dikirim ke WhatsApp Anda',
        color: 'success'
      })
    } else {
      toast.add({
        title: 'Registrasi Gagal',
        description: response.message || 'Terjadi kesalahan',
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

const copyCredentials = () => {
  const text = `Nomor Pendaftaran: ${credentials.nomor_pendaftaran}\nKode Akses: ${credentials.kode_akses}`
  navigator.clipboard.writeText(text)
  toast.add({
    title: 'Berhasil disalin!',
    description: 'Kredensial sudah disalin ke clipboard',
    color: 'success'
  })
}
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark text-slate-800 dark:text-white font-display min-h-screen flex flex-col antialiased selection:bg-primary/30 selection:text-primary-dark">
    <!-- Navbar -->
    <header class="sticky top-0 z-50 w-full border-b border-border-light bg-white/80 backdrop-blur-md dark:bg-background-dark/80 dark:border-white/10">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <img src="~/assets/images/Logo-UIN.webp" alt="Logo UIN" class="h-12 w-auto" />
          <div class="hidden md:flex flex-col">
            <span class="text-sm font-bold tracking-tight text-text-main dark:text-white leading-tight">UIN K.H. Abdurrahman Wahid</span>
          </div>
        </div>
        <!-- Desktop Nav & Actions -->
        <div class="hidden md:flex items-center gap-8">
          <nav class="flex gap-6">
            <NuxtLink class="text-sm font-medium text-text-main hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary" to="/">Beranda</NuxtLink>
            <NuxtLink class="text-sm font-medium text-text-main hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary" to="#">Program</NuxtLink>
          </nav>
          <NuxtLink to="/login" class="flex items-center justify-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors dark:hover:bg-primary/20">
            Masuk
          </NuxtLink>
        </div>
        <!-- Mobile Menu Button -->
        <div class="flex md:hidden">
          <button class="text-text-main dark:text-white hover:text-primary" type="button">
            <span class="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col items-center justify-center p-4 py-12 md:py-20 relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-white to-transparent dark:from-white/5 dark:to-transparent pointer-events-none"></div>
      <div class="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white to-transparent dark:from-background-dark dark:to-transparent pointer-events-none"></div>
      
      <div class="w-full max-w-lg z-10 space-y-8">
        <!-- Hero Section -->
        <div class="text-center space-y-2">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide mb-2">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Pendaftaran Dibuka 2026
          </div>
          <h2 class="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Pendaftaran Mahasiswa Baru
          </h2>
          <p class="text-slate-500 dark:text-slate-400 text-base md:text-lg">
            Lengkapi formulir di bawah ini untuk memulai perjalanan pascasarjana Anda.
          </p>
        </div>

        <!-- Registration Card -->
        <div class="bg-white dark:bg-[#1c3029] rounded-2xl shadow-premium border border-slate-100 dark:border-white/5 p-6 md:p-10 space-y-8">
          
          <!-- Success Box State -->
          <div v-if="isSuccess" class="bg-success-bg border border-green-100 dark:border-green-900/30 dark:bg-green-900/10 rounded-xl p-5 md:p-6 flex flex-col items-center text-center relative overflow-hidden group/success">
            <div class="absolute top-0 right-0 p-3 opacity-10">
              <span class="material-symbols-outlined text-6xl text-success-text">verified</span>
            </div>
            <div class="size-10 rounded-full bg-white dark:bg-green-900 border border-green-100 dark:border-green-800 flex items-center justify-center mb-3 shadow-sm">
              <span class="material-symbols-outlined text-success-text text-xl">check_circle</span>
            </div>
            <h3 class="text-success-text font-bold text-lg mb-1">Pendaftaran Berhasil!</h3>
            <p class="text-success-text/80 text-sm mb-4 max-w-[280px]">Harap simpan detail ini. Anda akan membutuhkannya untuk langkah-langkah selanjutnya.</p>
            <div class="grid grid-cols-2 gap-3 w-full">
              <div class="bg-white dark:bg-black/20 p-3 rounded-lg border border-green-100 dark:border-white/5 flex flex-col gap-1">
                <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">No. Pendaftaran</span>
                <span class="font-mono text-base md:text-lg font-bold text-slate-800 dark:text-white tracking-tight">{{ credentials.nomor_pendaftaran }}</span>
              </div>
              <div class="bg-white dark:bg-black/20 p-3 rounded-lg border border-green-100 dark:border-white/5 flex flex-col gap-1">
                <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Kode Akses</span>
                <span class="font-mono text-base md:text-lg font-bold text-slate-800 dark:text-white tracking-tight">{{ credentials.kode_akses }}</span>
              </div>
            </div>
            <button @click="copyCredentials" class="mt-4 text-xs font-semibold text-success-text hover:text-primary-dark flex items-center gap-1 transition-colors">
              <span class="material-symbols-outlined text-sm">content_copy</span>
              Salin Kredensial
            </button>
            <NuxtLink to="/login" class="mt-4 w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2">
              <span>Masuk Sekarang</span>
              <span class="material-symbols-outlined">arrow_forward</span>
            </NuxtLink>
          </div>

          <!-- Form Inputs -->
          <form v-else @submit.prevent="submitRegistration" class="space-y-6">
            <!-- Name Field -->
            <label class="block group">
              <span class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1">
                <span class="material-symbols-outlined text-[18px] text-slate-400">person</span>
                Nama Lengkap
              </span>
              <input v-model="form.nama_lengkap" class="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200" placeholder="e.g. Budi Santoso" type="text" required/>
            </label>
            <!-- WhatsApp Field -->
            <label class="block group">
              <span class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1">
                <span class="material-symbols-outlined text-[18px] text-slate-400">chat</span>
                Nomor WhatsApp
              </span>
              <input v-model="form.no_whatsapp" class="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200" placeholder="e.g. 081234567890" type="tel" required/>
            </label>
            <!-- Program Select -->
            <label class="block group">
              <span class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1">
                <span class="material-symbols-outlined text-[18px] text-slate-400">school</span>
                Program Studi
              </span>
              <div class="relative">
                <select v-model="form.prodi_id" class="w-full h-12 px-4 pr-10 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 appearance-none cursor-pointer" required>
                  <option disabled value="">Pilih program Anda</option>
                  <optgroup label="Program Magister (S2)">
                    <option v-for="prodi in prodiList.filter(p => p.jenjang === 'S2')" :key="prodi.id" :value="prodi.id">
                      {{ prodi.nama }}
                    </option>
                  </optgroup>
                  <optgroup label="Program Doktor (S3)">
                    <option v-for="prodi in prodiList.filter(p => p.jenjang === 'S3')" :key="prodi.id" :value="prodi.id">
                      {{ prodi.nama }}
                    </option>
                  </optgroup>
                </select>
                <span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 material-symbols-outlined">expand_more</span>
              </div>
            </label>
            <!-- Submit Button -->
            <button 
              :disabled="isLoading"
              class="w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit"
            >
              <span v-if="isLoading" class="material-symbols-outlined animate-spin">progress_activity</span>
              <span v-else>Daftar Sekarang</span>
              <span v-if="!isLoading" class="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>

          <!-- Divider -->
          <div v-if="!isSuccess" class="relative flex py-2 items-center">
            <div class="flex-grow border-t border-slate-100 dark:border-white/10"></div>
            <span class="flex-shrink-0 mx-4 text-xs font-medium text-slate-400 uppercase tracking-widest">Status Pendaftaran</span>
            <div class="flex-grow border-t border-slate-100 dark:border-white/10"></div>
          </div>
          
          <!-- Footer Links -->
          <div v-if="!isSuccess" class="text-center text-sm text-slate-400 dark:text-slate-500">
            <p>Sudah punya akun? <NuxtLink class="text-primary font-bold hover:underline" to="/login">Masuk di sini</NuxtLink></p>
          </div>
        </div>
      </div>
    </main>
    <footer class="py-6 border-t border-slate-100 dark:border-white/5 text-center text-slate-400 text-xs">
      <p>© 2026 UIN K.H. Abdurrahman Wahid Pekalongan. Hak Cipta Dilindungi.</p>
    </footer>
  </div>
</template>
