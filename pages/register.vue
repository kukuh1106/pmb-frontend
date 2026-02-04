<script setup lang="ts">
definePageMeta({
  layout: false
})

const isSuccess = ref(false)
const form = reactive({
  nama_lengkap: '',
  no_whatsapp: '',
  program_studi: ''
})
const credentials = reactive({
  no_pendaftaran: '2024-PG-88',
  kode_akses: 'A7B9'
})

const submitRegistration = () => {
    // Simulate API call
    setTimeout(() => {
        isSuccess.value = true
    }, 1000)
}
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark text-slate-800 dark:text-white font-display min-h-screen flex flex-col antialiased selection:bg-primary/30 selection:text-primary-dark">
    <!-- Navbar -->
    <header class="w-full bg-white dark:bg-[#1A2C26] border-b border-gray-100 dark:border-white/5 px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-50">
      <div class="flex items-center gap-3">
        <img src="~/assets/images/Logo-UIN.webp" alt="Logo UIN" class="h-10 w-auto" />
        <div class="hidden md:block">
          <h1 class="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase leading-none">UIN K.H. Abdurrahman Wahid</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Pekalongan</p>
        </div>
      </div>
      <nav class="hidden md:flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        <NuxtLink to="/" class="hover:text-primary transition-colors">Beranda</NuxtLink>
        <NuxtLink to="#" class="hover:text-primary transition-colors">Program</NuxtLink>
        <NuxtLink to="#" class="hover:text-primary transition-colors">Biaya</NuxtLink>
        <NuxtLink to="#" class="hover:text-primary transition-colors">Pusat Bantuan</NuxtLink>
      </nav>
      <div class="flex items-center gap-4">
        <NuxtLink to="/login" class="hidden md:flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors">
            <span>Masuk</span>
            <span class="material-symbols-outlined text-[20px]">login</span>
        </NuxtLink>
        <button class="md:hidden text-slate-700 dark:text-white">
            <span class="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col items-center justify-center p-4 py-12 md:py-20 relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-white to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" data-alt="Subtle top gradient fade"></div>
      <div class="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" data-alt="Abstract green glow top right"></div>
      <div class="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white to-transparent dark:from-background-dark dark:to-transparent pointer-events-none" data-alt="Subtle bottom gradient fade"></div>
      
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
            <h3 class="text-success-text font-bold text-lg mb-1">Pendaftaran Dimulai</h3>
            <p class="text-success-text/80 text-sm mb-4 max-w-[280px]">Harap simpan detail ini. Anda akan membutuhkannya untuk langkah-langkah selanjutnya.</p>
            <div class="grid grid-cols-2 gap-3 w-full">
              <div class="bg-white dark:bg-black/20 p-3 rounded-lg border border-green-100 dark:border-white/5 flex flex-col gap-1">
                <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">No. Pendaftaran</span>
                <span class="font-mono text-base md:text-lg font-bold text-slate-800 dark:text-white tracking-tight">{{ credentials.no_pendaftaran }}</span>
              </div>
              <div class="bg-white dark:bg-black/20 p-3 rounded-lg border border-green-100 dark:border-white/5 flex flex-col gap-1">
                <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Kode Akses</span>
                <span class="font-mono text-base md:text-lg font-bold text-slate-800 dark:text-white tracking-tight">{{ credentials.kode_akses }}</span>
              </div>
            </div>
            <button class="mt-4 text-xs font-semibold text-success-text hover:text-primary-dark flex items-center gap-1 transition-colors">
              <span class="material-symbols-outlined text-sm">content_copy</span>
              Salin Kredensial
            </button>
          </div>

          <!-- Form Inputs -->
          <form v-else @submit.prevent="submitRegistration" class="space-y-6">
            <!-- Name Field -->
            <label class="block group">
              <span class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1">
                <span class="material-symbols-outlined text-[18px] text-slate-400">person</span>
                Nama Lengkap
              </span>
              <input v-model="form.nama_lengkap" class="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200" placeholder="e.g. Budi Santoso" type="text"/>
            </label>
            <!-- WhatsApp Field -->
            <label class="block group">
              <span class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1">
                <span class="material-symbols-outlined text-[18px] text-slate-400">chat</span>
                Nomor WhatsApp
              </span>
              <input v-model="form.no_whatsapp" class="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200" placeholder="e.g. +62 812 3456 7890" type="tel"/>
            </label>
            <!-- Program Select -->
            <label class="block group">
              <span class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1">
                <span class="material-symbols-outlined text-[18px] text-slate-400">school</span>
                Program Studi
              </span>
              <div class="relative">
                <select v-model="form.program_studi" class="w-full h-12 px-4 pr-10 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 appearance-none cursor-pointer">
                  <option disabled value="">Pilih program Anda</option>
                  <option value="mba">Magister Administrasi Bisnis</option>
                  <option value="cs">Magister Ilmu Komputer</option>
                  <option value="ds">Magister Sains Data</option>
                  <option value="law">Magister Hukum</option>
                </select>
                <span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 material-symbols-outlined">expand_more</span>
              </div>
            </label>
            <!-- Submit Button -->
            <button class="w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2 group/btn" type="submit">
              <span>Daftar Sekarang</span>
              <span class="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
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
