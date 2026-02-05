<script setup lang="ts">
definePageMeta({
  layout: false
})

const isMobileMenuOpen = ref(false)

const steps = [
  {
    icon: 'person_add',
    title: 'Buat Akun',
    description: 'Daftarkan diri Anda dengan mengisi data diri dasar dan email aktif untuk memulai proses pendaftaran.'
  },
  {
    icon: 'payments',
    title: 'Pembayaran',
    description: 'Lakukan pembayaran biaya pendaftaran melalui bank atau kanal pembayaran yang tersedia.'
  },
  {
    icon: 'edit_document',
    title: 'Isi Formulir',
    description: 'Lengkapi biodata, riwayat pendidikan, dan unggah dokumen persyaratan yang diminta.'
  },
  {
    icon: 'assignment_turned_in',
    title: 'Finalisasi',
    description: 'Periksa kembali semua data yang telah diisi, lalu lakukan finalisasi data pendaftaran.'
  },
  {
    icon: 'event_available',
    title: 'Ujian Seleksi',
    description: 'Mengikuti ujian seleksi sesuai dengan jadwal yang telah ditentukan oleh panitia.'
  },
  {
    icon: 'campaign',
    title: 'Pengumuman',
    description: 'Cek hasil kelulusan melalui portal PMB pada tanggal pengumuman yang dijadwalkan.'
  }
]

const requirements = [
  'Ijazah & Transkrip Nilai (Legalisir)',
  'Pas Foto Berwarna Terbaru',
  'Kartu Tanda Penduduk (KTP)',
  'Proposal Rencana Tesis/Disertasi',
  'Sertifikat TOEFL/IELTS (Jika ada)',
  'Surat Rekomendasi Akademik'
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
            <NuxtLink class="text-sm font-medium text-text-main hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary" to="/program-studi">Program Studi</NuxtLink>
            <NuxtLink class="text-sm font-medium text-primary dark:text-primary" to="/cara-mendaftar">Cara Mendaftar</NuxtLink>
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
          <NuxtLink to="/program-studi" class="block py-3 text-base font-medium text-text-main hover:text-primary dark:text-gray-200 dark:hover:text-primary">Program Studi</NuxtLink>
          <NuxtLink to="/cara-mendaftar" class="block py-3 text-base font-medium text-primary">Cara Mendaftar</NuxtLink>
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
          <h1 class="text-4xl font-black text-text-main dark:text-white mb-4">Cara Mendaftar</h1>
          <p class="text-lg text-text-sub dark:text-gray-400 max-w-2xl mx-auto">
            Ikuti langkah-langkah mudah di bawah ini untuk menjadi calon mahasiswa Pascasarjana UIN K.H. Abdurrahman Wahid.
          </p>
        </div>
      </section>

      <!-- Steps Section -->
      <section class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative">
            <!-- Decorative Line (hidden on mobile) -->
            <div class="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 dark:bg-white/5 -translate-y-1/2 z-0"></div>
            
            <div v-for="(step, index) in steps" :key="index" class="relative z-10 flex flex-col items-center text-center group">
              <div class="size-20 bg-white dark:bg-background-dark border-4 border-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white group-hover:border-primary/20 transition-all duration-300 shadow-lg">
                <span class="material-symbols-outlined text-3xl">{{ step.icon }}</span>
              </div>
              <div class="absolute -top-4 -right-2 size-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                {{ index + 1 }}
              </div>
              <h3 class="text-xl font-bold text-text-main dark:text-white mb-3">{{ step.title }}</h3>
              <p class="text-text-sub dark:text-gray-400 leading-relaxed px-4">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Requirements & Timeline -->
      <section class="py-20 bg-gray-50 dark:bg-white/5 border-y border-border-light dark:border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-16">
            <!-- Requirements -->
            <div>
              <h2 class="text-3xl font-bold text-text-main dark:text-white mb-8 flex items-center gap-3">
                <span class="material-symbols-outlined text-primary">description</span>
                Persyaratan Berkas
              </h2>
              <ul class="space-y-4">
                <li v-for="req in requirements" :key="req" class="flex items-center gap-4 p-4 bg-white dark:bg-background-dark border border-border-light dark:border-white/10 rounded-xl shadow-sm">
                  <div class="size-6 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-[16px]">check</span>
                  </div>
                  <span class="text-text-main dark:text-gray-200 font-medium">{{ req }}</span>
                </li>
              </ul>
            </div>

            <!-- FAQ or Additional Info -->
            <div class="flex flex-col justify-center">
              <div class="bg-white dark:bg-background-dark p-10 rounded-3xl border border-border-light dark:border-white/10 shadow-xl">
                <h3 class="text-2xl font-bold text-text-main dark:text-white mb-6">Butuh Bantuan?</h3>
                <p class="text-text-sub dark:text-gray-400 mb-8 leading-relaxed">
                  Jika Anda mengalami kesulitan dalam proses pendaftaran, tim Helpdesk kami siap membantu Anda melalui kanal berikut:
                </p>
                <div class="space-y-6">
                  <a href="#" class="flex items-center gap-4 group">
                    <div class="size-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                      <span class="material-symbols-outlined">chat</span>
                    </div>
                    <div>
                      <p class="text-xs text-text-sub font-bold uppercase tracking-wider">WhatsApp</p>
                      <p class="text-text-main dark:text-white font-bold">+62 877-3911-5554</p>
                    </div>
                  </a>
                  <a href="#" class="flex items-center gap-4 group">
                    <div class="size-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <span class="material-symbols-outlined">mail</span>
                    </div>
                    <div>
                      <p class="text-xs text-text-sub font-bold uppercase tracking-wider">Email</p>
                      <p class="text-text-main dark:text-white font-bold">pmb@pascasarjana.uin.ac.id</p>
                    </div>
                  </a>
                </div>
              </div>
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
