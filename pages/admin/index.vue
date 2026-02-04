<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})
</script>

<template>

  <div class="flex flex-col gap-8">
    <!-- Welcome Section -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Selamat Datang, Administrator 👋</h1>
        <p class="text-slate-500 mt-2">Berikut adalah ringkasan data penerimaan mahasiswa baru periode 2024/2025.</p>
      </div>
      <div class="flex gap-3">
        <button class="px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
          <UIcon name="i-heroicons-arrow-down-tray" class="text-[18px]" />
          Unduh Laporan
        </button>
        <button class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
          <UIcon name="i-heroicons-plus" class="text-[18px]" />
          Tambah Pendaftar
        </button>
      </div>
    </div>
          
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <!-- Card 1: Total -->
      <div class="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <UIcon name="i-heroicons-user-plus" class="text-2xl" />
          </div>
          <span class="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
            <UIcon name="i-heroicons-arrow-trending-up" class="text-[14px]" />
            +12%
          </span>
        </div>
        <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Pendaftar</h3>
        <p class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">1,240</p>
        <p class="text-xs text-slate-400 mt-1">vs 1,108 bulan lalu</p>
      </div>
      <!-- Card 2: Verified -->
      <div class="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform">
            <UIcon name="i-heroicons-shield-check" class="text-2xl" />
          </div>
          <span class="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
            <UIcon name="i-heroicons-arrow-trending-up" class="text-[14px]" />
            +5%
          </span>
        </div>
        <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium">Terverifikasi</h3>
        <p class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">850</p>
        <p class="text-xs text-slate-400 mt-1">Menunggu review akhir</p>
      </div>
      <!-- Card 3: Rejected -->
      <div class="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
            <UIcon name="i-heroicons-x-circle" class="text-2xl" />
          </div>
          <span class="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
            <UIcon name="i-heroicons-arrow-trending-down" class="text-[14px]" />
            -2%
          </span>
        </div>
        <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium">Ditolak</h3>
        <p class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">45</p>
        <p class="text-xs text-slate-400 mt-1">Dokumen tidak lengkap</p>
      </div>
      <!-- Card 4: Passed -->
      <div class="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
            <UIcon name="i-heroicons-check-circle" class="text-2xl" />
          </div>
          <span class="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
            <UIcon name="i-heroicons-arrow-trending-up" class="text-[14px]" />
            +8%
          </span>
        </div>
        <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium">Lolos Seleksi</h3>
        <p class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">320</p>
        <p class="text-xs text-slate-400 mt-1">Siap untuk pendaftaran ulang</p>
      </div>
    </div>
          
    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chart Section (Spans 2 columns) -->
      <div class="lg:col-span-2 bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[400px]">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Rekap Pendaftaran</h3>
            <p class="text-sm text-slate-500">Tren pendaftaran mahasiswa baru 2024</p>
          </div>
          <select class="bg-slate-50 dark:bg-slate-800 border-none text-sm rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300 cursor-pointer focus:ring-1 focus:ring-primary">
            <option>Mingguan</option>
            <option>Bulanan</option>
            <option>Tahunan</option>
          </select>
        </div>
        <!-- CSS-Only Bar Chart Construction -->
        <div class="flex-1 flex items-end justify-between gap-2 md:gap-4 w-full px-2 relative">
          <!-- Horizontal Grid Lines -->
          <div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
            <div class="w-full h-px border-t border-dashed border-slate-200 dark:border-slate-700"></div>
            <div class="w-full h-px border-t border-dashed border-slate-200 dark:border-slate-700"></div>
            <div class="w-full h-px border-t border-dashed border-slate-200 dark:border-slate-700"></div>
            <div class="w-full h-px border-t border-dashed border-slate-200 dark:border-slate-700"></div>
            <div class="w-full h-px border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <!-- Bar Items -->
          <div class="relative flex flex-col items-center gap-2 group w-full h-full justify-end z-10">
            <div class="w-full bg-primary/20 dark:bg-primary/20 rounded-t-md hover:bg-primary transition-all duration-300 relative" style="height: 35%;">
              <div class="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-20">35 Applicants</div>
            </div>
            <span class="text-xs text-slate-400 font-medium">M1</span>
          </div>
          <div class="relative flex flex-col items-center gap-2 group w-full h-full justify-end z-10">
            <div class="w-full bg-primary/20 dark:bg-primary/20 rounded-t-md hover:bg-primary transition-all duration-300 relative" style="height: 45%;">
              <div class="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-20">45 Applicants</div>
            </div>
            <span class="text-xs text-slate-400 font-medium">M2</span>
          </div>
          <div class="relative flex flex-col items-center gap-2 group w-full h-full justify-end z-10">
            <div class="w-full bg-primary/20 dark:bg-primary/20 rounded-t-md hover:bg-primary transition-all duration-300 relative" style="height: 25%;">
              <div class="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-20">25 Applicants</div>
            </div>
            <span class="text-xs text-slate-400 font-medium">M3</span>
          </div>
          <div class="relative flex flex-col items-center gap-2 group w-full h-full justify-end z-10">
            <div class="w-full bg-primary/20 dark:bg-primary/20 rounded-t-md hover:bg-primary transition-all duration-300 relative" style="height: 60%;">
              <div class="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-20">60 Applicants</div>
            </div>
            <span class="text-xs text-slate-400 font-medium">M4</span>
          </div>
          <div class="relative flex flex-col items-center gap-2 group w-full h-full justify-end z-10">
            <div class="w-full bg-primary/20 dark:bg-primary/20 rounded-t-md hover:bg-primary transition-all duration-300 relative" style="height: 55%;">
              <div class="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-20">55 Applicants</div>
            </div>
            <span class="text-xs text-slate-400 font-medium">M5</span>
          </div>
          <div class="relative flex flex-col items-center gap-2 group w-full h-full justify-end z-10">
            <div class="w-full bg-primary/20 dark:bg-primary/20 rounded-t-md hover:bg-primary transition-all duration-300 relative" style="height: 75%;">
              <div class="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-20">75 Applicants</div>
            </div>
            <span class="text-xs text-slate-400 font-medium">M6</span>
          </div>
          <div class="relative flex flex-col items-center gap-2 group w-full h-full justify-end z-10">
            <div class="w-full bg-primary/20 dark:bg-primary/20 rounded-t-md hover:bg-primary transition-all duration-300 relative" style="height: 40%;">
              <div class="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-20">40 Applicants</div>
            </div>
            <span class="text-xs text-slate-400 font-medium">M7</span>
          </div>
          <div class="relative flex flex-col items-center gap-2 group w-full h-full justify-end z-10">
            <div class="w-full bg-primary/20 dark:bg-primary/20 rounded-t-md hover:bg-primary transition-all duration-300 relative" style="height: 80%;">
              <div class="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-20">80 Applicants</div>
            </div>
            <span class="text-xs text-slate-400 font-medium">M8</span>
          </div>
          <div class="relative flex flex-col items-center gap-2 group w-full h-full justify-end z-10">
            <div class="w-full bg-primary rounded-t-md hover:bg-primary-dark transition-all duration-300 relative shadow-lg shadow-primary/30" style="height: 95%;">
              <div class="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-20">95 Pendaftar (Saat Ini)</div>
            </div>
            <span class="text-xs text-primary font-bold">M9</span>
          </div>
        </div>
      </div>
            
      <!-- Progress / Distribution Card -->
      <div class="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">Distribusi Status</h3>
        <div class="flex-1 flex flex-col justify-center gap-6">
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-slate-600 dark:text-slate-300">Magister Manajemen</span>
              <span class="font-bold text-slate-900 dark:text-white">45%</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div class="bg-primary h-2.5 rounded-full" style="width: 45%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-slate-600 dark:text-slate-300">Magister Hukum</span>
              <span class="font-bold text-slate-900 dark:text-white">32%</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div class="bg-blue-500 h-2.5 rounded-full" style="width: 32%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-slate-600 dark:text-slate-300">Magister Psikologi</span>
              <span class="font-bold text-slate-900 dark:text-white">15%</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div class="bg-purple-500 h-2.5 rounded-full" style="width: 15%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-slate-600 dark:text-slate-300">Doktoral</span>
              <span class="font-bold text-slate-900 dark:text-white">8%</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div class="bg-orange-500 h-2.5 rounded-full" style="width: 8%"></div>
            </div>
          </div>
        </div>
        <button class="w-full mt-6 py-2.5 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20">
          Lihat Detail Distribusi
        </button>
      </div>
    </div>
          
    <!-- Recent Activity Table -->
    <div class="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Pendaftar Terbaru</h3>
        <a class="text-sm font-medium text-primary hover:text-primary-dark hover:underline" href="#">Lihat Semua</a>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead class="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th class="px-6 py-4">Nama Pendaftar</th>
              <th class="px-6 py-4">Program Studi</th>
              <th class="px-6 py-4">Tanggal Daftar</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-slate-200 bg-center bg-cover" data-alt="Applicant Avatar" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAEQ3N1nVIJbP8Q3kzYGGKbkhTho7FT1b6zMDecayGmnRiLMUyV_mqIq27T7Rfr2mIlNXnlnKF-WZGMzT_GW0c8pra_DEDxFvoiKwQg8Vw9vAB7hK9QSNRyYnMW071_xsIENBkc9Zggtyre3tPdeRnMQs7Zq-HLHCOM7Ks4l_HUMvtgtrIkDJPrUNDdqIbShhnqUHykFqgAEyiviA-hjXfKU5hhMiU6kAZWcxpL2SfHBOWBXQFS1jMg9gDTqF9oi4QvF_wGIZlp1jc");'></div>
                Budi Santoso
              </td>
              <td class="px-6 py-4">Magister Manajemen</td>
              <td class="px-6 py-4">24 Mar 2024</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
                  Lolos
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-slate-400 hover:text-primary transition-colors">
                  <UIcon name="i-heroicons-ellipsis-vertical" class="text-[20px]" />
                </button>
              </td>
            </tr>
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-slate-200 bg-center bg-cover" data-alt="Applicant Avatar" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuB09OMP2FFnqfqdAtYGOCascH9xCbwLYgYiQPbCzYyCmS3C9Pl9gqXUYM1ZSf6WP4YjKPycnhfxhdRGMCCcrhG7Ef1aTpqDL6PNNi49cczoa5rjfisJy5SeHN6WotizzrmsNtOJzXCaZ15-Z_Hgd0XQM-118rveyi434CQmaAwlCXdJO0sEH9D-hB2vccgKwVBTGxmoti6x4ic2kfESvwnWGG7bFIngz0qFb-mwbJdUQkV9DDvTbDEphHUUJRf4un1YfQeEooHoqKs");'></div>
                Siti Aminah
              </td>
              <td class="px-6 py-4">Magister Hukum</td>
              <td class="px-6 py-4">23 Mar 2024</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  <span class="w-1.5 h-1.5 rounded-full bg-yellow-600 dark:bg-yellow-400"></span>
                  Terverifikasi
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-slate-400 hover:text-primary transition-colors">
                  <UIcon name="i-heroicons-ellipsis-vertical" class="text-[20px]" />
                </button>
              </td>
            </tr>
            <!-- More rows... -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
