<script setup lang="ts">
definePageMeta({ layout: "pendaftar" });

const pendaftarApi = usePendaftarApi()
const isLoading = ref(true)
const kartu = ref<any>(null)
const error = ref<string | null>(null)

interface KartuData {
  nomor_pendaftaran: string
  nama_lengkap: string
  tempat_tanggal_lahir: string | null
  jenis_kelamin: string
  prodi: {
    nama: string
    jenjang: string
  } | null
  periode: string | null
  jadwal_ujian: {
    tanggal: string
    sesi: string | null
    jam: string | null
    ruang: string | null
  }
  foto: string | null
}

onMounted(async () => {
  try {
    const response = await pendaftarApi.getKartu()
    if (response.success && response.data) {
      kartu.value = response.data.kartu as KartuData
    } else {
      error.value = response.message || 'Gagal memuat data kartu'
    }
  } catch (e: any) {
    error.value = e.message || 'Gagal memuat data kartu'
  } finally {
    isLoading.value = false
  }
})

// Print function
const printKartu = () => {
  window.print()
}
</script>

<template>
  <div class="flex flex-col flex-1 w-full gap-6 transition-colors duration-200">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[60vh]">
      <div class="flex flex-col items-center gap-4">
        <span class="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
        <p class="text-gray-500">Memuat kartu pendaftaran...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <span class="material-symbols-outlined text-6xl text-red-300">error</span>
        <p class="mt-4 text-gray-600 dark:text-gray-400">{{ error }}</p>
        <NuxtLink to="/pendaftar" class="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          Kembali ke Dashboard
        </NuxtLink>
      </div>
    </div>

    <template v-else-if="kartu">
      <!-- Breadcrumbs -->
      <div class="flex flex-wrap gap-2 px-4 print:hidden">
        <NuxtLink to="/pendaftar" class="text-primary hover:text-primary/80 text-sm font-medium leading-normal transition-colors">Dashboard</NuxtLink>
        <span class="text-gray-400 text-sm font-medium leading-normal">/</span>
        <span class="text-gray-600 dark:text-gray-300 text-sm font-medium leading-normal">Kartu Pendaftaran</span>
      </div>

      <!-- Page Heading -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 print:hidden">
        <div>
          <h1 class="text-[#111813] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Kartu Pendaftaran</h1>
          <p class="text-gray-500 dark:text-gray-400 text-base font-normal leading-relaxed max-w-2xl mt-1">
            Cetak kartu ini dan bawa saat mengikuti ujian.
          </p>
        </div>
        <button 
          @click="printKartu"
          class="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-md print:hidden"
        >
          <span class="material-symbols-outlined">print</span>
          Cetak Kartu
        </button>
      </div>

      <!-- Kartu Pendaftaran -->
      <div class="px-4 pb-8">
        <div class="max-w-3xl mx-auto bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden print:shadow-none print:border-2 print:border-gray-300">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-primary to-emerald-600 text-white p-6 print:bg-primary">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span class="material-symbols-outlined text-3xl">school</span>
                </div>
                <div>
                  <h2 class="text-xl font-bold">KARTU PESERTA UJIAN</h2>
                  <p class="text-sm opacity-90">{{ kartu.periode || 'PMB Pascasarjana' }}</p>
                </div>
              </div>
              <div class="text-right hidden md:block">
                <p class="text-xs opacity-75">Nomor Pendaftaran</p>
                <p class="text-lg font-mono font-bold tracking-wider">{{ kartu.nomor_pendaftaran }}</p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 md:p-8">
            <div class="flex flex-col md:flex-row gap-6">
              <!-- Photo -->
              <div class="flex-shrink-0 flex justify-center md:justify-start">
                <div class="w-32 h-40 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-700 overflow-hidden flex items-center justify-center">
                  <img v-if="kartu.foto" :src="kartu.foto" alt="Foto" class="w-full h-full object-cover" />
                  <div v-else class="text-center text-gray-400">
                    <span class="material-symbols-outlined text-4xl">person</span>
                    <p class="text-xs mt-1">No Photo</p>
                  </div>
                </div>
              </div>

              <!-- Data -->
              <div class="flex-1 space-y-4">
                <!-- Nomor Pendaftaran (Mobile) -->
                <div class="md:hidden bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p class="text-xs text-gray-500 dark:text-gray-400">Nomor Pendaftaran</p>
                  <p class="text-lg font-mono font-bold text-gray-900 dark:text-white">{{ kartu.nomor_pendaftaran }}</p>
                </div>

                <!-- Nama -->
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Lengkap</p>
                  <p class="text-xl font-bold text-gray-900 dark:text-white">{{ kartu.nama_lengkap }}</p>
                </div>

                <!-- Grid Info -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tempat, Tanggal Lahir</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ kartu.tempat_tanggal_lahir || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jenis Kelamin</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ kartu.jenis_kelamin }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Program Studi</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ kartu.prodi?.nama }} ({{ kartu.prodi?.jenjang }})</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Jadwal Ujian Section -->
            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                <span class="material-symbols-outlined text-primary align-middle mr-1">event</span>
                Jadwal Ujian
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/20">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Tanggal</p>
                  <p class="font-bold text-primary">{{ kartu.jadwal_ujian.tanggal }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Sesi / Waktu</p>
                  <p class="font-bold text-gray-900 dark:text-white">{{ kartu.jadwal_ujian.sesi }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ kartu.jadwal_ujian.jam }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Ruang</p>
                  <p class="font-bold text-gray-900 dark:text-white">{{ kartu.jadwal_ujian.ruang }}</p>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div class="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <h4 class="text-sm font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <span class="material-symbols-outlined text-base">info</span>
                Catatan Penting
              </h4>
              <ul class="mt-2 text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>• Harap hadir 30 menit sebelum ujian dimulai</li>
                <li>• Bawa kartu ini dan KTP asli saat ujian</li>
                <li>• Tidak diperkenankan membawa alat komunikasi ke ruang ujian</li>
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Dicetak pada: {{ new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}
            </p>
            <div class="flex items-center gap-2 text-gray-400">
              <span class="material-symbols-outlined text-sm">verified</span>
              <span class="text-xs">Dokumen resmi</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="px-4 pb-8 print:hidden">
        <NuxtLink to="/pendaftar" class="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
          <span class="material-symbols-outlined">arrow_back</span>
          Kembali ke Dashboard
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<style>
@media print {
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  
  .print\:hidden {
    display: none !important;
  }
  
  /* Remove layout elements during print */
  header, nav, aside, footer {
    display: none !important;
  }
}
</style>
