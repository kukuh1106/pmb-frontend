<script setup lang="ts">
definePageMeta({
  layout: false
})

const isMobileMenuOpen = ref(false)

const programs = [
  {
    level: 'Magister (S2)',
    name: 'Pendidikan Agama Islam (PAI)',
    accreditation: 'Unggul',
    duration: '4 Semester',
    description: 'Menghasilkan sarjana magister yang ahli dalam pengembangan kurikulum dan metodologi pembelajaran Agama Islam yang moderat.'
  },
  {
    level: 'Magister (S2)',
    name: 'Hukum Keluarga Islam (HKI)',
    accreditation: 'A',
    duration: '4 Semester',
    description: 'Fokus pada kajian hukum keluarga Islam dengan pendekatan interdisipliner untuk menjawab persoalan hukum kontemporer.'
  },
  {
    level: 'Magister (S2)',
    name: 'Ekonomi Syariah',
    accreditation: 'B',
    duration: '4 Semester',
    description: 'Mengembangkan keilmuan ekonomi syariah yang berbasis pada inovasi dan pemberdayaan ekonomi umat.'
  },
  {
    level: 'Doktor (S3)',
    name: 'Studi Islam',
    accreditation: 'Minat',
    duration: '6 Semester',
    description: 'Menghasilkan doktor yang memiliki kedalaman ilmu dalam studi Islam dengan wawasan global dan lokal.'
  }
]
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark text-text-main font-display antialiased min-h-screen flex flex-col relative overflow-x-hidden">
    <!-- Top Navigation Bar (Copied from index.vue for consistency) -->
    <header class="sticky top-0 z-50 w-full border-b border-border-light bg-white/80 backdrop-blur-md dark:bg-background-dark/80 dark:border-white/10">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="flex items-center gap-3">
          <img src="~/assets/images/Logo-UIN.webp" alt="Logo UIN" class="h-12 w-auto" />
          <div class="hidden md:flex flex-col">
              <span class="text-sm font-bold tracking-tight text-text-main dark:text-white leading-tight">UIN K.H. Abdurrahman Wahid</span>
          </div>
        </NuxtLink>
        <div class="hidden md:flex items-center gap-8">
          <nav class="flex gap-6">
            <NuxtLink class="text-sm font-medium text-primary dark:text-primary" to="/program-studi">Program Studi</NuxtLink>
            <NuxtLink class="text-sm font-medium text-text-main hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary" to="/cara-mendaftar">Cara Mendaftar</NuxtLink>
            <NuxtLink class="text-sm font-medium text-text-main hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary" to="/cek-kelulusan">Cek Kelulusan</NuxtLink>
          </nav>
          <NuxtLink to="/login" class="flex items-center justify-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors dark:hover:bg-primary/20">
            Masuk
          </NuxtLink>
        </div>
        <div class="flex md:hidden">
          <button class="text-text-main dark:text-white hover:text-primary" type="button" @click="isMobileMenuOpen = !isMobileMenuOpen">
            <span class="material-symbols-outlined">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
          </button>
        </div>
      </div>
      
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-border-light dark:border-white/10 bg-white/95 backdrop-blur-md dark:bg-background-dark/95">
        <div class="space-y-1 px-4 py-6">
          <NuxtLink to="/program-studi" class="block py-3 text-base font-medium text-primary">Program Studi</NuxtLink>
          <NuxtLink to="/cara-mendaftar" class="block py-3 text-base font-medium text-text-main hover:text-primary dark:text-gray-200 dark:hover:text-primary">Cara Mendaftar</NuxtLink>
          <NuxtLink to="/cek-kelulusan" class="block py-3 text-base font-medium text-text-main hover:text-primary dark:text-gray-200 dark:hover:text-primary">Cek Kelulusan</NuxtLink>
          <div class="pt-4 mt-4 border-t border-gray-100 dark:border-white/10">
            <NuxtLink to="/login" class="flex w-full items-center justify-center rounded-md border border-primary px-4 py-3 text-base font-medium text-primary hover:bg-primary/5 transition-colors">
              Masuk
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow">
      <!-- Hero Section -->
      <section class="bg-primary/5 py-16 border-b border-border-light dark:border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-4xl font-black text-text-main dark:text-white mb-4">Program Studi Pascasarjana</h1>
          <p class="text-lg text-text-sub dark:text-gray-400 max-w-2xl mx-auto">
            Pilih program studi yang sesuai dengan visi karir dan kontribusi intelektual Anda di masa depan.
          </p>
        </div>
      </section>

      <!-- Programs Grid -->
      <section class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-for="program in programs" :key="program.name" 
              class="group bg-white dark:bg-background-dark border border-border-light dark:border-white/10 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div class="flex justify-between items-start mb-4">
                <span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  {{ program.level }}
                </span>
                <span class="flex items-center gap-1 text-sm font-medium text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900/30">
                  <span class="material-symbols-outlined text-[16px]">stars</span>
                  Akreditasi {{ program.accreditation }}
                </span>
              </div>
              <h3 class="text-2xl font-bold text-text-main dark:text-white mb-3 group-hover:text-primary transition-colors">
                {{ program.name }}
              </h3>
              <p class="text-text-sub dark:text-gray-400 mb-6 leading-relaxed">
                {{ program.description }}
              </p>
              <div class="flex items-center gap-4 text-sm text-text-sub dark:text-gray-400 mb-8">
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-lg opacity-60">schedule</span>
                  {{ program.duration }}
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-lg opacity-60">workspace_premium</span>
                  Gelar M.Pd / M.H / M.E
                </div>
              </div>
              <NuxtLink to="/register" class="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                Daftar Sekarang
                <span class="material-symbols-outlined">arrow_forward</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-20 bg-white dark:bg-background-dark border-y border-border-light dark:border-white/5">
        <div class="max-w-5xl mx-auto px-4 text-center">
          <div class="bg-primary rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
            <!-- Decorative circle -->
            <div class="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            <div class="absolute -bottom-12 -left-12 w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>
            
            <h2 class="text-3xl font-bold mb-6 relative z-10">Sudah Menentukan Pilihan?</h2>
            <p class="text-primary-foreground/90 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Segera mulai pendaftaran Anda sekarang juga untuk menjadi bagian dari civitas akademika UIN K.H. Abdurrahman Wahid.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <NuxtLink to="/register" class="bg-white text-primary px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-gray-50 transition-colors">
                Mulai Pendaftaran
              </NuxtLink>
              <NuxtLink to="/cara-mendaftar" class="bg-primary-dark/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors">
                Pelajari Cara Daftar
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer (Copied from index.vue for consistency) -->
    <footer class="bg-white dark:bg-background-dark border-t border-border-light dark:border-white/10">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center justify-center gap-6">
          <div class="flex items-center gap-2 text-text-main dark:text-white mb-2">
            <img src="~/assets/images/Logo-UIN.webp" alt="Logo UIN" class="h-8 w-auto grayscale opacity-80" />
            <span class="font-bold text-lg">UIN K.H. Abdurrahman Wahid</span>
          </div>
          <div class="flex flex-wrap justify-center gap-8">
            <NuxtLink class="text-sm text-text-sub hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors" to="/cek-kelulusan">Cek Kelulusan</NuxtLink>
            <NuxtLink class="text-sm text-text-sub hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors" to="#">Kebijakan Privasi</NuxtLink>
            <NuxtLink class="text-sm text-text-sub hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors" to="#">Syarat dan Ketentuan</NuxtLink>
            <NuxtLink class="text-sm text-text-sub hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors" to="#">Hubungi Kami</NuxtLink>
          </div>
          <p class="text-sm text-text-sub dark:text-gray-500 mt-4">
            © 2026 UIN K.H. Abdurrahman Wahid Pekalongan. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
