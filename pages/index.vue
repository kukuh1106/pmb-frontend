<script setup lang="ts">
definePageMeta({
  layout: false
})

const isMobileMenuOpen = ref(false)

</script>

<template>
  <div class="bg-background-light dark:bg-background-dark text-text-main font-display antialiased min-h-screen flex flex-col relative overflow-x-hidden">
    <!-- Top Navigation Bar -->
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
            <NuxtLink class="text-sm font-medium text-text-main hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary" to="/program-studi">Program Studi</NuxtLink>
            <NuxtLink class="text-sm font-medium text-text-main hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary" to="/cara-mendaftar">Cara Mendaftar</NuxtLink>
            <NuxtLink class="text-sm font-medium text-text-main hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary" to="/cek-kelulusan">Cek Kelulusan</NuxtLink>
          </nav>
          <NuxtLink to="/login" class="flex items-center justify-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors dark:hover:bg-primary/20">
            Masuk
          </NuxtLink>
        </div>
        <!-- Mobile Menu Button (Simplified Placeholder) -->
        <div class="flex md:hidden">
          <button class="text-text-main dark:text-white hover:text-primary" type="button" @click="isMobileMenuOpen = !isMobileMenuOpen">
            <span class="material-symbols-outlined">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu Overlay -->
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-border-light dark:border-white/10 bg-white/95 backdrop-blur-md dark:bg-background-dark/95">
        <div class="space-y-1 px-4 py-6">
          <NuxtLink to="/program-studi" class="block py-3 text-base font-medium text-text-main hover:text-primary dark:text-gray-200 dark:hover:text-primary">Program Studi</NuxtLink>
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

    <!-- Main Content -->
    <main class="flex-grow">
      <!-- Hero Section -->
      <section class="relative py-20 lg:py-32 overflow-hidden">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div class="flex flex-col justify-center text-left">
              <h1 class="text-4xl font-black tracking-tight text-text-main sm:text-5xl lg:text-6xl dark:text-white mb-6">
                Raih Keunggulan Akademik Bersama <span class="text-primary">Pascasarjana UIN</span>.
              </h1>
              <p class="text-lg text-text-sub dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
                Bergabunglah dengan komunitas intelektual kami. Nikmati kemudahan proses pendaftaran digital yang cepat, transparan, dan terintegrasi untuk masa depan karir Anda.
              </p>
              <div class="flex flex-col sm:flex-row gap-4">
                <NuxtLink to="/register" class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all">
                  Mulai Pendaftaran
                </NuxtLink>
                <NuxtLink to="/cek-kelulusan" class="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-text-main border border-border-light hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all dark:bg-transparent dark:text-white dark:border-white/20 dark:hover:bg-white/10">
                  <span class="material-symbols-outlined text-lg mr-2">school</span>
                  Cek Kelulusan
                </NuxtLink>
              </div>
            </div>
            <div class="relative w-full h-full min-h-[400px] lg:min-h-[500px]">
              <!-- Image Container with soft rounded corners -->
              <div class="absolute inset-0 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl" data-alt="Modern university campus students studying outdoors" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCgNmzDs7JJA9q9HRewTu7nQyS1VbxziWtClxheXUHGN_MEelm6w_bSYcP9-zmVVAO4uBCmxiHL2nuj2hREs79OxYzwbM4B2jvVoNDb83QiunaZVkmcINlVAU79Mc1U2ajxBeA4buNMKYk7M2LCGw3WMzOdqnjXszVti4WWinfBFkaF2PrY_7AhsbqEhaAKA9LynuihCCOqkaIY3rXPWyc90zSNCXr7Tv0wKGYoamN0S7VYj9kPYBfZ0gf-EYV71QCgPLSmNLtFPAs"); background-size: cover; background-position: center;'>
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <!-- Floating Card Element for Visual Interest -->
              <div class="absolute -bottom-6 -left-6 bg-white dark:bg-background-dark p-4 rounded-xl shadow-lg border border-border-light dark:border-white/10 hidden md:block">
                <div class="flex items-center gap-3">
                  <div class="bg-primary/10 pt-1 px-1 rounded-full text-primary">
                    <span class="material-symbols-outlined">check_circle</span>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-text-main dark:text-white">Pendaftaran Dibuka</p>
                    <p class="text-xs text-text-sub">Gelombang 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Feature Section -->
      <section class="py-16 bg-gray-50 dark:bg-white/5 border-y border-border-light dark:border-white/5">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row gap-12 items-start md:items-center">
            <div class="flex-1 max-w-lg">
              <h2 class="text-3xl font-bold tracking-tight text-text-main dark:text-white mb-4">
                PMB Pascasarjana UIN 
              </h2>
              <p class="text-text-sub dark:text-gray-400 text-lg leading-relaxed">
                Nikmati proses yang efisien mulai dari pendaftaran hingga penerimaan. Kami telah menghilangkan dokumen fisik agar Anda dapat fokus pada masa depan Anda.
              </p>
            </div>
            <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              <!-- Feature 1 -->
              <div class="group flex flex-col gap-4 p-6 rounded-xl bg-white dark:bg-background-dark border border-border-light dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined">desktop_windows</span>
                </div>
                <div>
                  <h3 class="text-base font-bold text-text-main dark:text-white mb-1">Pendaftaran Online</h3>
                  <p class="text-sm text-text-sub dark:text-gray-400">Kirim dokumen Anda secara digital dari mana saja.</p>
                </div>
              </div>
              <!-- Feature 2 -->
              <div class="group flex flex-col gap-4 p-6 rounded-xl bg-white dark:bg-background-dark border border-border-light dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <h3 class="text-base font-bold text-text-main dark:text-white mb-1">Cek Status</h3>
                  <p class="text-sm text-text-sub dark:text-gray-400">Dapatkan pembaruan real-time tentang keputusan penerimaan Anda.</p>
                </div>
              </div>
              <!-- Feature 3 -->
              <div class="group flex flex-col gap-4 p-6 rounded-xl bg-white dark:bg-background-dark border border-border-light dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined">chat_bubble</span>
                </div>
                <div>
                  <h3 class="text-base font-bold text-text-main dark:text-white mb-1">Dukungan 24/7</h3>
                  <p class="text-sm text-text-sub dark:text-gray-400">Akses tim dukungan khusus kami kapan saja.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
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
