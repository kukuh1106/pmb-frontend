<script setup lang="ts">
import type { PendaftarDashboard } from '~/types/api'

definePageMeta({
  layout: 'pendaftar'
})

const pendaftarApi = usePendaftarApi()
const auth = useAuth()
const router = useRouter()

const isLoading = ref(true)
const dashboard = ref<PendaftarDashboard | null>(null)

// Steps definition
const steps = computed(() => {
  if (!dashboard.value) return []
  
  const status = dashboard.value.pendaftar.status_pendaftaran
  const biodataComplete = dashboard.value.biodata_lengkap
  const dokumenComplete = dashboard.value.dokumen.total > 0 && dashboard.value.dokumen.pending === 0 && dashboard.value.dokumen.tidak_valid === 0
  const jadwalSelected = status === 'jadwal_dipilih' || status === 'selesai'
  const finalized = status === 'selesai'

  return [
    { 
      name: 'Biodata', 
      icon: 'person', 
      completed: biodataComplete,
      active: !biodataComplete,
      route: '/pendaftar/biodata'
    },
    { 
      name: 'Dokumen', 
      icon: 'upload_file', 
      completed: dokumenComplete,
      active: biodataComplete && !dokumenComplete,
      route: '/pendaftar/dokumen'
    },
    { 
      name: 'Jadwal', 
      icon: 'calendar_month', 
      completed: jadwalSelected,
      active: dokumenComplete && !jadwalSelected,
      route: '/pendaftar/jadwal'
    },
    { 
      name: 'Finalisasi', 
      icon: 'badge', 
      completed: finalized,
      active: jadwalSelected && !finalized,
      locked: !jadwalSelected
    }
  ]
})

// Calculate progress percentage
const progressPercentage = computed(() => {
  const completed = steps.value.filter(s => s.completed).length
  return (completed / steps.value.length) * 100
})

// Current active step index
const activeStepIndex = computed(() => {
  return steps.value.findIndex(s => s.active)
})

onMounted(async () => {
  auth.initAuth()
  
  if (!auth.isAuthenticated.value || auth.role.value !== 'pendaftar') {
    router.push('/login')
    return
  }

  try {
    const response = await pendaftarApi.getDashboard()
    if (response.success && response.data) {
      dashboard.value = response.data
    }
  } catch (error) {
    console.error('Failed to load dashboard:', error)
  } finally {
    isLoading.value = false
  }
})

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'belum_diproses': 'Menunggu Proses',
    'lulus': 'LULUS',
    'tidak_lulus': 'Tidak Lulus'
  }
  return labels[status] || status
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'belum_diproses': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'lulus': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'tidak_lulus': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
</script>

<template>
  <div v-if="isLoading" class="flex items-center justify-center min-h-[60vh]">
    <div class="flex flex-col items-center gap-4">
      <span class="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      <p class="text-gray-500">Memuat dashboard...</p>
    </div>
  </div>

  <div v-else-if="dashboard" class="space-y-8">
    <!-- Page Heading -->
    <div class="flex flex-col gap-2">
      <h1 class="text-text-main dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
        Selamat datang, {{ dashboard.pendaftar.nama_lengkap.split(' ')[0] }}
      </h1>
      <p class="text-text-sub dark:text-gray-400 text-base font-normal leading-normal">
        Lengkapi langkah-langkah di bawah ini untuk menyelesaikan proses pendaftaran Anda.
      </p>
    </div>

    <!-- Status Bar -->
    <div v-if="dashboard.pendaftar.status_kelulusan !== 'belum_diproses'" 
         class="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-slate-100 dark:border-white/5">
      <div class="flex items-center gap-4">
        <span class="material-symbols-outlined text-3xl" 
              :class="dashboard.pendaftar.status_kelulusan === 'lulus' ? 'text-green-500' : 'text-red-500'">
          {{ dashboard.pendaftar.status_kelulusan === 'lulus' ? 'check_circle' : 'cancel' }}
        </span>
        <div class="flex-1">
          <p class="text-sm text-gray-500">Status Kelulusan</p>
          <p class="text-xl font-bold" 
             :class="dashboard.pendaftar.status_kelulusan === 'lulus' ? 'text-green-600' : 'text-red-600'">
            {{ getStatusLabel(dashboard.pendaftar.status_kelulusan) }}
          </p>
        </div>
        <div v-if="dashboard.pendaftar.nilai_ujian" class="text-right">
          <p class="text-sm text-gray-500">Nilai Ujian</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ dashboard.pendaftar.nilai_ujian }}</p>
        </div>
      </div>
    </div>
    
    <!-- Prominent Horizontal Stepper -->
    <div class="w-full py-6">
      <div class="relative flex items-start justify-between w-full">
        <!-- Progress Bar Background -->
        <div class="absolute left-0 top-5 md:top-6 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full z-0"></div>
        <!-- Active Progress Bar -->
        <div class="absolute left-0 top-5 md:top-6 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-1000"
             :style="{ width: progressPercentage + '%' }"></div>
        
        <!-- Step indicators -->
        <div v-for="(step, index) in steps" :key="index" 
             class="relative z-10 flex flex-col items-center gap-3 group cursor-pointer">
          <!-- Completed -->
          <div v-if="step.completed" 
               class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform hover:scale-110">
            <span class="material-symbols-outlined text-white text-xl md:text-2xl">check</span>
          </div>
          <!-- Active -->
          <div v-else-if="step.active" 
               class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-background-dark border-4 border-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform hover:scale-110">
            <span class="material-symbols-outlined text-primary text-xl md:text-2xl font-bold">{{ step.icon }}</span>
          </div>
          <!-- Pending/Locked -->
          <div v-else 
               class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400">
            <span class="material-symbols-outlined text-xl md:text-2xl">{{ step.locked ? 'lock' : step.icon }}</span>
          </div>
          
          <span class="text-sm font-medium bg-background-light dark:bg-background-dark px-2 rounded"
                :class="step.completed ? 'text-primary font-bold' : step.active ? 'text-text-main dark:text-white font-bold' : 'text-gray-500'">
            {{ step.name }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Action Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Card 1: Biodata -->
      <div class="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border flex flex-col gap-4 hover:shadow-md transition-shadow relative overflow-hidden group"
           :class="steps[0]?.active ? 'border-primary/20 shadow-lg shadow-primary/5 ring-1 ring-primary/30' : steps[0]?.completed ? 'border-slate-100 dark:border-white/5' : 'border-slate-100 dark:border-white/5 opacity-90'">
        <div class="absolute top-0 right-0 p-4" v-if="steps[0]?.completed">
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-primary">
            <span class="material-symbols-outlined text-sm font-bold">check</span>
          </span>
        </div>
        <div v-if="steps[0]?.active" class="absolute top-0 right-0 p-4">
          <span class="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Aktif</span>
        </div>
        <div class="w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors"
             :class="steps[0]?.completed || steps[0]?.active ? 'bg-green-50 dark:bg-primary/10 text-primary' : 'bg-gray-50 dark:bg-white/5 text-gray-600'">
          <span class="material-symbols-outlined text-2xl">person</span>
        </div>
        <div class="flex flex-col gap-1">
          <h3 class="text-text-main dark:text-white text-lg font-bold leading-tight">Lengkapi Biodata</h3>
          <p class="text-gray-500 text-sm leading-normal">Isi detail pribadi dan akademik Anda.</p>
        </div>
        <div class="mt-auto pt-2">
          <NuxtLink to="/pendaftar/biodata" 
                    class="w-full h-10 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    :class="steps[0]?.active ? 'bg-primary text-white hover:bg-[#0e9f6e] shadow-sm' : 'border border-gray-200 dark:border-white/10 text-primary hover:bg-green-50 dark:hover:bg-white/5'">
            <span>{{ steps[0]?.completed ? 'Edit Data' : 'Lengkapi' }}</span>
            <span v-if="steps[0]?.active" class="material-symbols-outlined text-sm">arrow_forward</span>
          </NuxtLink>
        </div>
      </div>
      
      <!-- Card 2: Dokumen -->
      <div class="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border flex flex-col gap-4 hover:shadow-md transition-shadow relative overflow-hidden group"
           :class="steps[1]?.active ? 'border-primary/20 shadow-lg shadow-primary/5 ring-1 ring-primary/30' : steps[1]?.completed ? 'border-slate-100 dark:border-white/5' : 'border-slate-100 dark:border-white/5 opacity-90'">
        <div class="absolute top-0 right-0 p-4" v-if="steps[1]?.completed">
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-primary">
            <span class="material-symbols-outlined text-sm font-bold">check</span>
          </span>
        </div>
        <div v-if="steps[1]?.active" class="absolute top-0 right-0 p-4">
          <span class="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Aktif</span>
        </div>
        <div class="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
             :class="steps[1]?.active ? 'bg-primary text-white shadow-md shadow-primary/20' : steps[1]?.completed ? 'bg-green-50 dark:bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white' : 'bg-gray-50 dark:bg-white/5 text-gray-600'">
          <span class="material-symbols-outlined text-2xl">upload_file</span>
        </div>
        <div class="flex flex-col gap-1">
          <h3 class="text-text-main dark:text-white text-lg font-bold leading-tight">Upload Dokumen</h3>
          <p class="text-gray-500 text-sm leading-normal">Unggah transkrip, ID, dan surat rekomendasi.</p>
          <div v-if="dashboard.dokumen.total > 0" class="flex gap-2 mt-1 text-xs">
            <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded">{{ dashboard.dokumen.valid }} valid</span>
            <span v-if="dashboard.dokumen.pending > 0" class="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">{{ dashboard.dokumen.pending }} pending</span>
            <span v-if="dashboard.dokumen.tidak_valid > 0" class="bg-red-100 text-red-700 px-2 py-0.5 rounded">{{ dashboard.dokumen.tidak_valid }} ditolak</span>
          </div>
        </div>
        <div class="mt-auto pt-2">
          <NuxtLink to="/pendaftar/dokumen" 
                    class="w-full h-10 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    :class="steps[1]?.active ? 'bg-primary text-white hover:bg-[#0e9f6e] shadow-sm' : 'border border-gray-200 dark:border-white/10 text-primary hover:bg-green-50 dark:hover:bg-white/5'">
            <span>Kelola Dokumen</span>
            <span v-if="steps[1]?.active" class="material-symbols-outlined text-sm">arrow_forward</span>
          </NuxtLink>
        </div>
      </div>
      
      <!-- Card 3: Jadwal -->
      <div class="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border flex flex-col gap-4 hover:shadow-md transition-shadow group"
           :class="steps[2]?.active ? 'border-primary/20 shadow-lg shadow-primary/5 ring-1 ring-primary/30' : steps[2]?.completed ? 'border-slate-100 dark:border-white/5' : 'border-slate-100 dark:border-white/5 opacity-90'">
        <div class="absolute top-0 right-0 p-4" v-if="steps[2]?.completed">
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-primary">
            <span class="material-symbols-outlined text-sm font-bold">check</span>
          </span>
        </div>
        <div v-if="steps[2]?.active" class="absolute top-0 right-0 p-4">
          <span class="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Aktif</span>
        </div>
        <div class="w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-gray-100 dark:group-hover:bg-white/10 transition-colors"
             :class="steps[2]?.active ? 'bg-primary text-white shadow-md shadow-primary/20' : steps[2]?.completed ? 'bg-green-50 dark:bg-primary/10 text-primary' : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400'">
          <span class="material-symbols-outlined text-2xl">calendar_month</span>
        </div>
        <div class="flex flex-col gap-1">
          <h3 class="text-text-main dark:text-white text-lg font-bold leading-tight">Pilih Jadwal</h3>
          <p class="text-gray-500 text-sm leading-normal">Pilih slot ujian masuk atau wawancara Anda.</p>
          <div v-if="dashboard.jadwal_ujian" class="mt-2 text-xs text-gray-600">
            <p><strong>{{ dashboard.jadwal_ujian.tanggal }}</strong></p>
            <p>{{ dashboard.jadwal_ujian.sesi }} - {{ dashboard.jadwal_ujian.ruang }}</p>
          </div>
        </div>
        <div class="mt-auto pt-2">
          <NuxtLink v-if="steps[1]?.completed" to="/pendaftar/jadwal" 
                    class="w-full h-10 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    :class="steps[2]?.active ? 'bg-primary text-white hover:bg-[#0e9f6e] shadow-sm' : 'border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'">
            <span>{{ steps[2]?.completed ? 'Lihat Jadwal' : 'Pesan Slot' }}</span>
          </NuxtLink>
          <button v-else disabled class="w-full h-10 rounded-lg border border-gray-200 dark:border-white/10 text-gray-400 font-bold text-sm cursor-not-allowed">
            Lengkapi Dokumen Dulu
          </button>
        </div>
      </div>
      
      <!-- Card 4: Kartu Pendaftaran -->
      <div class="rounded-xl p-6 shadow-none border flex flex-col gap-4 relative overflow-hidden"
           :class="steps[3]?.locked ? 'bg-gray-50 dark:bg-white/5 border-slate-100 dark:border-white/5 opacity-75' : 'bg-white dark:bg-surface-dark border-slate-100 dark:border-white/5'">
        <div v-if="steps[3]?.locked" class="absolute top-3 right-3 text-gray-400">
          <span class="material-symbols-outlined text-xl">lock</span>
        </div>
        <div v-if="steps[3]?.completed" class="absolute top-0 right-0 p-4">
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-primary">
            <span class="material-symbols-outlined text-sm font-bold">check</span>
          </span>
        </div>
        <div class="w-12 h-12 rounded-full flex items-center justify-center border"
             :class="steps[3]?.completed ? 'bg-green-50 dark:bg-primary/10 text-primary border-transparent' : 'bg-white dark:bg-white/5 text-gray-400 border-gray-100 dark:border-white/5'">
          <span class="material-symbols-outlined text-2xl">badge</span>
        </div>
        <div class="flex flex-col gap-1">
          <h3 :class="steps[3]?.locked ? 'text-gray-600 dark:text-gray-400' : 'text-text-main dark:text-white'" class="text-lg font-bold leading-tight">Kartu Pendaftaran</h3>
          <p class="text-gray-400 text-sm leading-normal">Unduh kartu ujian Anda setelah verifikasi.</p>
        </div>
        <div class="mt-auto pt-2">
          <NuxtLink v-if="steps[3]?.completed" to="/pendaftar/kartu" 
                    class="w-full h-10 rounded-lg bg-primary text-white hover:bg-[#0e9f6e] font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-sm">download</span>
            <span>Unduh Kartu</span>
          </NuxtLink>
          <button v-else class="w-full h-10 rounded-lg bg-gray-200 dark:bg-white/10 text-gray-400 font-bold text-sm cursor-not-allowed" disabled>
            Unduh PDF
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-else class="flex items-center justify-center min-h-[60vh]">
    <div class="text-center">
      <span class="material-symbols-outlined text-6xl text-gray-300">error</span>
      <p class="mt-4 text-gray-500">Gagal memuat data dashboard</p>
      <button @click="$router.go(0)" class="mt-4 px-4 py-2 bg-primary text-white rounded-lg">
        Coba Lagi
      </button>
    </div>
  </div>
</template>
