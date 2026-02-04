<script setup lang="ts">
definePageMeta({ layout: false });

const form = reactive({
  nomor_pendaftaran: "",
  tanggal_lahir: "",
});

const resultStatus = ref<null | 'lulus' | 'tidak_lulus' | 'belum_diproses'>(null);

function handleCheck() {
  // Simulate random result for demo
  const statuses = ['lulus', 'tidak_lulus', 'belum_diproses'] as const;
  resultStatus.value = statuses[Math.floor(Math.random() * statuses.length)]!;
}

function reset() {
  resultStatus.value = null;
}
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark font-display text-[#111816] min-h-screen flex flex-col overflow-x-hidden">
    <!-- Top Navigation -->
    <header class="sticky top-0 z-50 w-full border-b border-border-light bg-white/80 backdrop-blur-md dark:bg-background-dark/80 dark:border-white/10">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <img src="~/assets/images/Logo-UIN.webp" alt="Logo UIN" class="h-12 w-auto" />
          <div class="hidden md:flex flex-col">
              <span class="text-sm font-bold tracking-tight text-text-main dark:text-white leading-tight">UIN K.H. Abdurrahman Wahid</span>
          </div>
        </div>
        <!-- Right Actions -->
        <button class="flex items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-800 text-[#111816] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-bold leading-normal tracking-wide">
           <UIcon name="i-heroicons-question-mark-circle" class="mr-2 text-[18px]" />
          <span class="truncate">Bantuan & Dukungan</span>
        </button>
      </div>
    </header>

    <main class="flex-1 flex flex-col items-center justify-start py-10 px-4 lg:px-8">
      <!-- Header Section -->
      <div class="max-w-2xl w-full text-center mb-10">
        <h1 class="text-[#111816] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight mb-3">
          Hasil Seleksi Pascasarjana
        </h1>
        <p class="text-[#61897c] dark:text-gray-400 text-base md:text-lg font-normal">
          Masukkan detail Anda di bawah ini untuk memeriksa status penerimaan Anda saat ini.
        </p>
      </div>

      <!-- Search Card -->
      <div v-if="!resultStatus" class="max-w-xl w-full bg-white dark:bg-[#1a2c26] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden mb-12">
        <form @submit.prevent="handleCheck" class="p-6 md:p-8 flex flex-col gap-6">
          <!-- Input: Nomor Pendaftaran -->
          <label class="flex flex-col w-full">
            <p class="text-[#111816] dark:text-gray-200 text-sm font-semibold leading-normal pb-2">Nomor Pendaftaran</p>
            <div class="relative">
              <input 
                v-model="form.nomor_pendaftaran"
                class="form-input w-full rounded-lg text-[#111816] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4 placeholder:text-gray-400 text-base transition-all" 
                placeholder="Masukkan nomor pendaftaran Anda" 
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                 <UIcon name="i-heroicons-identification" class="text-xl" />
              </div>
            </div>
          </label>
          <!-- Input: Tanggal Lahir -->
          <label class="flex flex-col w-full">
            <p class="text-[#111816] dark:text-gray-200 text-sm font-semibold leading-normal pb-2">Tanggal Lahir</p>
            <div class="flex w-full items-stretch rounded-lg group">
              <input 
                v-model="form.tanggal_lahir"
                class="form-input flex-1 w-full rounded-l-lg rounded-r-none text-[#111816] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4 placeholder:text-gray-400 text-base transition-all z-10" 
                placeholder="DD/MM/YYYY" 
                type="text" 
              />
              <div class="flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-800 border border-l-0 border-gray-200 dark:border-gray-700 rounded-r-lg text-gray-500 dark:text-gray-400 group-focus-within:border-primary group-focus-within:ring-2 group-focus-within:ring-primary/50 transition-all">
                 <UIcon name="i-heroicons-calendar" class="text-xl" />
              </div>
            </div>
          </label>
          <!-- Action Button -->
          <button type="submit" class="w-full flex items-center justify-center rounded-lg h-12 bg-primary hover:bg-primary/90 text-white text-base font-bold leading-normal tracking-wide transition-all shadow-md shadow-primary/20 mt-2">
            <span class="mr-2">Lihat Hasil Seleksi</span>
             <UIcon name="i-heroicons-magnifying-glass" class="text-[20px]" />
          </button>
        </form>
      </div>

      <!-- Result State -->
      <div v-else class="max-w-4xl w-full flex flex-col gap-8 items-center">
        
        <!-- Variant 1: LULUS (Pass) -->
        <div v-if="resultStatus === 'lulus'" class="w-full max-w-xl bg-white dark:bg-[#1a2c26] rounded-xl overflow-hidden shadow-xl border border-success/20 relative group">
          <div class="h-2 w-full bg-success"></div>
          <div class="absolute inset-0 confetti-pattern pointer-events-none z-0"></div>
          <div class="p-8 relative z-10 flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4 animate-bounce">
               <UIcon name="i-heroicons-check-circle" class="text-success text-4xl" />
            </div>
            <h3 class="text-2xl font-black text-success mb-2">LULUS</h3>
            <p class="text-[#111816] dark:text-white text-lg font-medium mb-1">
              Selamat! Anda dinyatakan LULUS seleksi.
            </p>
            <p class="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs">
              Silakan lanjutkan ke tahap pendaftaran ulang melalui portal mahasiswa baru.
            </p>
            <button class="flex items-center gap-2 text-success font-bold hover:underline cursor-pointer">
              <span>Unduh Surat Penerimaan</span>
               <UIcon name="i-heroicons-arrow-down-tray" class="text-lg" />
            </button>
            <button @click="reset" class="mt-8 text-sm text-gray-400 hover:text-gray-600">Cek Lagi</button>
          </div>
        </div>

        <!-- Variant 2: TIDAK LULUS (Fail) -->
        <div v-bind:class="{ hidden: resultStatus !== 'tidak_lulus' }" v-if="resultStatus === 'tidak_lulus'" class="w-full max-w-xl bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="h-2 w-full bg-gray-400"></div>
          <div class="p-8 flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-4">
               <UIcon name="i-heroicons-x-circle" class="text-gray-500 text-4xl" />
            </div>
            <h3 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">TIDAK LULUS</h3>
            <p class="text-[#111816] dark:text-white text-lg font-medium mb-1">
              Mohon maaf, Anda belum berhasil.
            </p>
            <p class="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs">
              Jangan patah semangat. Kesempatan lain masih terbuka di periode pendaftaran berikutnya.
            </p>
            <button @click="reset" class="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Kembali ke Halaman Utama
            </button>
          </div>
        </div>

        <!-- Variant 3: BELUM DIPROSES (Pending) -->
        <div v-bind:class="{ hidden: resultStatus !== 'belum_diproses' }" v-if="resultStatus === 'belum_diproses'" class="w-full max-w-xl bg-white dark:bg-[#1a2c26] rounded-xl overflow-hidden shadow-sm border border-amber-200 dark:border-amber-900/30">
          <div class="h-2 w-full bg-amber-400"></div>
          <div class="p-8 flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
               <UIcon name="i-heroicons-clock" class="text-amber-500 text-4xl animate-pulse" />
            </div>
            <h3 class="text-2xl font-bold text-amber-500 mb-2">BELUM DIPROSES</h3>
            <p class="text-[#111816] dark:text-white text-lg font-medium mb-1">
              Hasil seleksi Anda sedang dalam proses.
            </p>
            <p class="text-gray-500 dark:text-gray-400 text-sm mb-0 max-w-xs">
              Silakan cek kembali secara berkala dalam 1x24 jam.
            </p>
            <button @click="reset" class="mt-8 text-sm text-gray-400 hover:text-gray-600">Cek Lagi</button>
          </div>
        </div>

      </div>
    </main>
    <footer class="mt-auto py-8 text-center text-gray-400 text-sm">
      <p>© 2026 UIN K.H. Abdurrahman Wahid Pekalongan. Hak Cipta Dilindungi.</p>
    </footer>
  </div>
</template>

<style scoped>
.confetti-pattern {
    background-image: radial-gradient(#10B981 1px, transparent 1px), radial-gradient(#10B981 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px;
    opacity: 0.1;
}
</style>
