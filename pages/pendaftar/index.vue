<script setup lang="ts">
definePageMeta({
  layout: 'pendaftar'
})
</script>

<template>
  <!-- Page Heading -->
  <div class="flex flex-col gap-2">
    <h1 class="text-text-main dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Selamat datang, Pendaftar</h1>
    <p class="text-text-sub dark:text-gray-400 text-base font-normal leading-normal">Lengkapi langkah-langkah di bawah ini untuk menyelesaikan proses pendaftaran Anda.</p>
  </div>
  
  <!-- Prominent Horizontal Stepper -->
  <div class="w-full py-6">
    <div class="relative flex items-start justify-between w-full">
      <!-- Progress Bar Background -->
      <div class="absolute left-0 top-5 md:top-6 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full z-0"></div>
      <!-- Active Progress Bar (Fill ~50% for step 2 active) -->
      <div class="absolute left-0 top-5 md:top-6 -translate-y-1/2 w-[40%] h-1 bg-primary rounded-full z-0 transition-all duration-1000"></div>
      
      <!-- Step 1: Completed -->
      <div class="relative z-10 flex flex-col items-center gap-3 group cursor-pointer">
        <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform hover:scale-110">
          <span class="material-symbols-outlined text-white text-xl md:text-2xl">check</span>
        </div>
        <span class="text-sm font-bold text-primary bg-background-light dark:bg-background-dark px-2 rounded">Biodata</span>
      </div>
      
      <!-- Step 2: Active -->
      <div class="relative z-10 flex flex-col items-center gap-3 group cursor-pointer">
        <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-background-dark border-4 border-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform hover:scale-110">
          <span class="material-symbols-outlined text-primary text-xl md:text-2xl font-bold">upload_file</span>
        </div>
        <span class="text-sm font-bold text-text-main dark:text-white bg-background-light dark:bg-background-dark px-2 rounded">Dokumen</span>
      </div>
      
      <!-- Step 3: Pending -->
      <div class="relative z-10 flex flex-col items-center gap-3 group cursor-pointer">
        <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dropdown-colors">
          <span class="material-symbols-outlined text-xl md:text-2xl">calendar_month</span>
        </div>
        <span class="text-sm font-medium text-gray-500 bg-background-light dark:bg-background-dark px-2 rounded">Jadwal</span>
      </div>
      
      <!-- Step 4: Pending -->
      <div class="relative z-10 flex flex-col items-center gap-3 group cursor-pointer">
        <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 transition-colors">
          <span class="material-symbols-outlined text-xl md:text-2xl">badge</span>
        </div>
        <span class="text-sm font-medium text-gray-500 bg-background-light dark:bg-background-dark px-2 rounded">Finalisasi</span>
      </div>
    </div>
  </div>
  
  <!-- Action Cards Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Card 1: Completed -->
    <div class="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-slate-100 dark:border-white/5 flex flex-col gap-4 hover:shadow-md transition-shadow relative overflow-hidden group">
      <div class="absolute top-0 right-0 p-4">
        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-primary">
          <span class="material-symbols-outlined text-sm font-bold">check</span>
        </span>
      </div>
      <div class="w-12 h-12 rounded-full bg-green-50 dark:bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
        <span class="material-symbols-outlined text-2xl">person</span>
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="text-text-main dark:text-white text-lg font-bold leading-tight">Lengkapi Biodata</h3>
        <p class="text-gray-500 text-sm leading-normal">Isi detail pribadi dan akademik Anda.</p>
      </div>
      <div class="mt-auto pt-2">
        <button class="w-full h-10 rounded-lg border border-gray-200 dark:border-white/10 text-primary hover:bg-green-50 dark:hover:bg-white/5 font-bold text-sm transition-colors">
          Edit Data
        </button>
      </div>
    </div>
    
    <!-- Card 2: Active -->
    <div class="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-lg shadow-primary/5 border border-primary/20 flex flex-col gap-4 relative overflow-hidden ring-1 ring-primary/30">
      <div class="absolute top-0 right-0 p-4">
        <span class="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Aktif</span>
      </div>
      <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
        <span class="material-symbols-outlined text-2xl">upload_file</span>
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="text-text-main dark:text-white text-lg font-bold leading-tight">Upload Dokumen</h3>
        <p class="text-gray-500 text-sm leading-normal">Unggah transkrip, ID, dan surat rekomendasi.</p>
      </div>
      <div class="mt-auto pt-2">
        <NuxtLink to="/pendaftar/dokumen" class="w-full h-10 rounded-lg bg-primary text-white hover:bg-[#0e9f6e] font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2">
          <span>Kelola Dokumen</span>
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </NuxtLink>
      </div>
    </div>
    
    <!-- Card 3: Pending -->
    <div class="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-slate-100 dark:border-white/5 flex flex-col gap-4 hover:shadow-md transition-shadow group opacity-90">
      <div class="w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 flex items-center justify-center group-hover:bg-gray-100 dark:group-hover:bg-white/10 transition-colors">
        <span class="material-symbols-outlined text-2xl">calendar_month</span>
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="text-text-main dark:text-white text-lg font-bold leading-tight">Pilih Jadwal</h3>
        <p class="text-gray-500 text-sm leading-normal">Pilih slot ujian masuk atau wawancara Anda.</p>
      </div>
      <div class="mt-auto pt-2">
        <button class="w-full h-10 rounded-lg border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 font-bold text-sm transition-colors">
          Pesan Slot
        </button>
      </div>
    </div>
    
    <!-- Card 4: Locked -->
    <div class="bg-gray-50 dark:bg-white/5 rounded-xl p-6 shadow-none border border-slate-100 dark:border-white/5 flex flex-col gap-4 relative overflow-hidden opacity-75">
      <div class="absolute top-3 right-3 text-gray-400">
        <span class="material-symbols-outlined text-xl">lock</span>
      </div>
      <div class="w-12 h-12 rounded-full bg-white dark:bg-white/5 text-gray-400 flex items-center justify-center border border-gray-100 dark:border-white/5">
        <span class="material-symbols-outlined text-2xl">badge</span>
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="text-gray-600 dark:text-gray-400 text-lg font-bold leading-tight">Kartu Pendaftaran</h3>
        <p class="text-gray-400 text-sm leading-normal">Unduh kartu ujian Anda setelah verifikasi.</p>
      </div>
      <div class="mt-auto pt-2">
        <button class="w-full h-10 rounded-lg bg-gray-200 dark:bg-white/10 text-gray-400 font-bold text-sm cursor-not-allowed" disabled>
          Unduh PDF
        </button>
      </div>
    </div>
  </div>
</template>
