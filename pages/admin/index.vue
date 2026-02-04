<script setup lang="ts">
import type { AdminDashboard, Pendaftar } from '~/types/api'

definePageMeta({
  layout: 'admin'
})

const adminApi = useAdminApi()
const auth = useAuth()

const isLoading = ref(true)
const dashboard = ref<AdminDashboard | null>(null)
const recentPendaftar = ref<Pendaftar[]>([])

// Colors for prodi distribution
const prodiColors = ['bg-primary', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500']

onMounted(async () => {
  auth.initAuth()
  
  try {
    // Fetch dashboard stats
    const dashboardRes = await adminApi.getDashboard()
    if (dashboardRes.success && dashboardRes.data) {
      dashboard.value = dashboardRes.data
    }

    // Fetch recent pendaftar
    const pendaftarRes = await adminApi.getPendaftarList({ per_page: 5 })
    if (pendaftarRes.success && pendaftarRes.data) {
      recentPendaftar.value = pendaftarRes.data
    }
  } catch (error) {
    console.error('Failed to load dashboard:', error)
  } finally {
    isLoading.value = false
  }
})

// Calculate percentage for prodi distribution
const getProdiPercentage = (total: number): number => {
  if (!dashboard.value?.total_pendaftar || dashboard.value.total_pendaftar === 0) return 0
  return Math.round((total / dashboard.value.total_pendaftar) * 100)
}

// Get status badge class
const getStatusClass = (status: string) => {
  switch (status) {
    case 'lulus':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'tidak_lulus':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'belum_diproses':
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'lulus': return 'Lulus'
    case 'tidak_lulus': return 'Tidak Lulus'
    default: return 'Menunggu'
  }
}

// Format date
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// User display name
const userName = computed(() => {
  if (auth.user.value) {
    return (auth.user.value as any).name || 'Administrator'
  }
  return 'Administrator'
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[60vh]">
      <div class="flex flex-col items-center gap-4">
        <span class="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
        <p class="text-gray-500">Memuat dashboard...</p>
      </div>
    </div>

    <template v-else-if="dashboard">
      <!-- Welcome Section -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Selamat Datang, {{ userName }} 👋
          </h1>
          <p class="text-slate-500 mt-2">
            Berikut adalah ringkasan data penerimaan mahasiswa baru 
            <span v-if="dashboard.periode_aktif" class="font-medium text-primary">{{ dashboard.periode_aktif.nama }}</span>
          </p>
        </div>
        <div class="flex gap-3">
          <button class="px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
            <UIcon name="i-heroicons-arrow-down-tray" class="text-[18px]" />
            Unduh Laporan
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
          </div>
          <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Pendaftar</h3>
          <p class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">{{ dashboard.total_pendaftar }}</p>
          <p class="text-xs text-slate-400 mt-1">Periode aktif</p>
        </div>
        
        <!-- Card 2: Prodi -->
        <div class="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform">
              <UIcon name="i-heroicons-building-library" class="text-2xl" />
            </div>
          </div>
          <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium">Program Studi</h3>
          <p class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">{{ dashboard.total_prodi }}</p>
          <p class="text-xs text-slate-400 mt-1">S2 & S3</p>
        </div>
        
        <!-- Card 3: Menunggu -->
        <div class="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
              <UIcon name="i-heroicons-clock" class="text-2xl" />
            </div>
          </div>
          <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium">Menunggu Proses</h3>
          <p class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {{ dashboard.kelulusan_by_status?.belum_diproses || 0 }}
          </p>
          <p class="text-xs text-slate-400 mt-1">Belum diproses</p>
        </div>
        
        <!-- Card 4: Lulus -->
        <div class="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
              <UIcon name="i-heroicons-check-circle" class="text-2xl" />
            </div>
          </div>
          <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium">Lolos Seleksi</h3>
          <p class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {{ dashboard.kelulusan_by_status?.lulus || 0 }}
          </p>
          <p class="text-xs text-slate-400 mt-1">Siap daftar ulang</p>
        </div>
      </div>
            
      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Distribution Card (Spans 2 columns) -->
        <div class="lg:col-span-2 bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">Distribusi per Program Studi</h3>
          <div class="flex flex-col gap-4">
            <div v-for="(prodi, index) in dashboard.pendaftar_by_prodi" :key="index">
              <div class="flex justify-between text-sm mb-2">
                <span class="text-slate-600 dark:text-slate-300">{{ prodi.prodi }} ({{ prodi.jenjang }})</span>
                <span class="font-bold text-slate-900 dark:text-white">{{ prodi.total }} ({{ getProdiPercentage(prodi.total) }}%)</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div 
                  :class="prodiColors[index % prodiColors.length]" 
                  class="h-2.5 rounded-full transition-all duration-500" 
                  :style="{ width: getProdiPercentage(prodi.total) + '%' }"
                ></div>
              </div>
            </div>
            <div v-if="dashboard.pendaftar_by_prodi?.length === 0" class="text-center text-slate-400 py-8">
              Belum ada data pendaftar
            </div>
          </div>
        </div>
              
        <!-- Status Distribution Card -->
        <div class="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">Status Pendaftaran</h3>
          <div class="flex-1 flex flex-col justify-center gap-4">
            <div v-for="(value, key) in dashboard.pendaftar_by_status" :key="key" class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full" 
                   :class="{
                     'bg-primary': key === 'selesai',
                     'bg-blue-500': key === 'jadwal_dipilih',
                     'bg-yellow-500': key === 'biodata_lengkap',
                     'bg-gray-400': key === 'registrasi'
                   }">
              </div>
              <span class="flex-1 text-sm text-slate-600 dark:text-slate-300 capitalize">{{ key.replace(/_/g, ' ') }}</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ value }}</span>
            </div>
          </div>
          <NuxtLink to="/admin/pendaftar" class="w-full mt-6 py-2.5 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20 text-center block">
            Lihat Semua Pendaftar
          </NuxtLink>
        </div>
      </div>
            
      <!-- Recent Activity Table -->
      <div class="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Pendaftar Terbaru</h3>
          <NuxtLink to="/admin/pendaftar" class="text-sm font-medium text-primary hover:text-primary-dark hover:underline">Lihat Semua</NuxtLink>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead class="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th class="px-6 py-4">Nama Pendaftar</th>
                <th class="px-6 py-4">No. Pendaftaran</th>
                <th class="px-6 py-4">Program Studi</th>
                <th class="px-6 py-4">Tanggal Daftar</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="pendaftar in recentPendaftar" :key="pendaftar.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {{ pendaftar.nama_lengkap?.charAt(0).toUpperCase() || '?' }}
                  </div>
                  {{ pendaftar.nama_lengkap }}
                </td>
                <td class="px-6 py-4 font-mono text-xs">{{ pendaftar.nomor_pendaftaran }}</td>
                <td class="px-6 py-4">{{ pendaftar.prodi?.nama || '-' }}</td>
                <td class="px-6 py-4">{{ formatDate(pendaftar.created_at) }}</td>
                <td class="px-6 py-4">
                  <span 
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="getStatusClass(pendaftar.status_kelulusan)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" 
                          :class="{
                            'bg-green-600 dark:bg-green-400': pendaftar.status_kelulusan === 'lulus',
                            'bg-red-600 dark:bg-red-400': pendaftar.status_kelulusan === 'tidak_lulus',
                            'bg-yellow-600 dark:bg-yellow-400': pendaftar.status_kelulusan === 'belum_diproses'
                          }">
                    </span>
                    {{ getStatusLabel(pendaftar.status_kelulusan) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="text-slate-400 hover:text-primary transition-colors">
                    <UIcon name="i-heroicons-ellipsis-vertical" class="text-[20px]" />
                  </button>
                </td>
              </tr>
              <tr v-if="recentPendaftar.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-slate-400">
                  Belum ada pendaftar
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Error State -->
    <div v-else class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <span class="material-symbols-outlined text-6xl text-gray-300">error</span>
        <p class="mt-4 text-gray-500">Gagal memuat dashboard</p>
        <button @click="$router.go(0)" class="mt-4 px-4 py-2 bg-primary text-white rounded-lg">
          Coba Lagi
        </button>
      </div>
    </div>
  </div>
</template>
