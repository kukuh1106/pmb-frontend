<script setup lang="ts">
import type { Pendaftar } from '~/types/api'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const adminApi = useAdminApi()

const isLoading = ref(true)
const pendaftar = ref<any>(null) // Using any because the structure is nested with prodi, documents, etc.
const activeTab = ref(0)
const tabs = [
  { label: 'Biodata', icon: 'i-heroicons-user' },
  { label: 'Dokumen', icon: 'i-heroicons-document-text' },
  { label: 'Akademik', icon: 'i-heroicons-academic-cap' }
]

const loadData = async () => {
  isLoading.value = true
  try {
    const id = Number(route.params.id)
    if (!id) {
      router.push('/admin/pendaftar')
      return
    }

    const res = await adminApi.getPendaftarDetail(id)
    if (res.success && res.data) {
      pendaftar.value = res.data
    }
  } catch (error) {
    console.error('Failed to load pendaftar detail:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

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

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Check document status
const getDocStatusClass = (status: string) => {
  switch (status) {
    case 'valid': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
    case 'tidak_valid': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
    default: return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20'
  }
}

const getDocStatusLabel = (status: string) => {
  switch (status) {
    case 'valid': return 'Valid'
    case 'tidak_valid': return 'Tidak Valid'
    default: return 'Menunggu Verifikasi'
  }
}

const downloadDoc = async (doc: any) => {
  if (!doc.file_path) return
  // Logic to download file or open in new tab
  // Assuming file_path is relative to storage/app/public or similar and accessible via public URL or proxy
  // This depends on how file serving is set up. 
  // If useAdminApi returns a signed URL or public URL, use that.
  // The API controller returns `file_path`.
  // Usually this needs a backend endpoint to download protected files or serve them publicly.
  // For now, let's just alert strictly implementing "view" not fully interactive download without clearer context
  alert('Download feature requires file URL configuration')
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <button 
        @click="router.back()"
        class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
      >
        <UIcon name="i-heroicons-arrow-left" class="text-xl" />
      </button>
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Detail Pendaftar</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm">
          Informasi lengkap calon mahasiswa
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
      <div class="flex flex-col items-center gap-3">
        <UIcon name="i-heroicons-arrow-path" class="text-3xl text-primary animate-spin" />
        <span class="text-sm text-slate-500">Memuat data pendaftar...</span>
      </div>
    </div>

    <template v-else-if="pendaftar">
      <!-- Profile Summary Card -->
      <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <!-- Photo -->
          <div class="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg">
             <img 
               v-if="pendaftar.pendaftar.foto_path"
               :src="pendaftar.pendaftar.foto_path" 
               alt="Foto Pendaftar" 
               class="w-full h-full object-cover"
             />
             <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
               <UIcon name="i-heroicons-user" class="text-6xl" />
             </div>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {{ pendaftar.pendaftar.nama_lengkap }}
                </h2>
                <div class="flex flex-wrap gap-2">
                  <span class="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                    {{ pendaftar.pendaftar.nomor_pendaftaran }}
                  </span>
                  <span 
                    class="text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                    :class="getStatusClass(pendaftar.pendaftar.status_kelulusan)"
                  >
                    {{ getStatusLabel(pendaftar.pendaftar.status_kelulusan) }}
                  </span>
                </div>
              </div>

              <div class="space-y-3 pt-2">
                <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <UIcon name="i-heroicons-envelope" class="text-slate-400 text-lg" />
                   <!-- Assuming email is not in the object based on controller, using Phone/WA instead -->
                  <span>{{ pendaftar.pendaftar.no_whatsapp }}</span>
                </div>
                <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <UIcon name="i-heroicons-calendar" class="text-slate-400 text-lg" />
                  <span>Daftar: {{ formatDate(pendaftar.pendaftar.created_at) }}</span>
                </div>
              </div>
            </div>

            <div class="bg-slate-50 dark:bg-white/5 rounded-xl p-5 border border-slate-100 dark:border-white/5">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <UIcon name="i-heroicons-academic-cap" class="text-primary" />
                Program Studi Pilihan
              </h3>
              <div v-if="pendaftar.prodi" class="space-y-2">
                 <p class="text-lg font-semibold text-slate-800 dark:text-slate-200">
                   {{ pendaftar.prodi.nama }}
                 </p>
                 <div class="flex items-center gap-2 text-sm text-slate-500">
                   <span class="bg-white dark:bg-black/20 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10">
                     {{ pendaftar.prodi.jenjang }}
                   </span>
                   <span>Periode: {{ pendaftar.periode || '-' }}</span>
                 </div>
              </div>
              <div v-else class="text-slate-400 text-sm italic">
                Belum memilih program studi
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="border-b border-slate-200 dark:border-slate-800">
        <nav class="flex gap-6" aria-label="Tabs">
          <button 
            v-for="(tab, index) in tabs" 
            :key="index"
            @click="activeTab = index"
            class="flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all"
            :class="activeTab === index 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:hover:text-slate-300'"
          >
            <UIcon :name="tab.icon" class="text-lg" />
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        
        <!-- Tab 0: Biodata -->
        <div v-if="activeTab === 0" class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
           <div>
             <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
               Data Diri
             </h3>
             <dl class="space-y-4">
               <div class="grid grid-cols-3 gap-4">
                 <dt class="text-sm font-medium text-slate-500">Tempat Lahir</dt>
                 <dd class="text-sm text-slate-900 dark:text-white col-span-2">{{ pendaftar.pendaftar.tempat_lahir || '-' }}</dd>
               </div>
               <div class="grid grid-cols-3 gap-4">
                 <dt class="text-sm font-medium text-slate-500">Tanggal Lahir</dt>
                 <dd class="text-sm text-slate-900 dark:text-white col-span-2">{{ formatDate(pendaftar.pendaftar.tanggal_lahir) }}</dd>
               </div>
               <div class="grid grid-cols-3 gap-4">
                 <dt class="text-sm font-medium text-slate-500">Jenis Kelamin</dt>
                 <dd class="text-sm text-slate-900 dark:text-white col-span-2">
                   {{ pendaftar.pendaftar.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                 </dd>
               </div>
               <div class="grid grid-cols-3 gap-4">
                 <dt class="text-sm font-medium text-slate-500">Alamat</dt>
                 <dd class="text-sm text-slate-900 dark:text-white col-span-2">{{ pendaftar.pendaftar.alamat || '-' }}</dd>
               </div>
             </dl>
           </div>
           
           <div>
             <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
               Pendidikan Terakhir
             </h3>
             <dl class="space-y-4">
               <div class="grid grid-cols-3 gap-4">
                 <dt class="text-sm font-medium text-slate-500">Jenjang</dt>
                 <dd class="text-sm text-slate-900 dark:text-white col-span-2">{{ pendaftar.pendaftar.pendidikan_terakhir || '-' }}</dd>
               </div>
               <div class="grid grid-cols-3 gap-4">
                 <dt class="text-sm font-medium text-slate-500">Institusi</dt>
                 <dd class="text-sm text-slate-900 dark:text-white col-span-2">{{ pendaftar.pendaftar.asal_institusi || '-' }}</dd>
               </div>
             </dl>
           </div>
        </div>

        <!-- Tab 1: Dokumen -->
        <div v-else-if="activeTab === 1">
          <div class="overflow-x-auto">
             <table class="w-full text-left text-sm text-slate-600 dark:text-slate-400">
               <thead class="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500">
                 <tr>
                   <th class="px-4 py-3">Jenis Dokumen</th>
                   <th class="px-4 py-3">Nama File</th>
                   <th class="px-4 py-3">Status</th>
                   <th class="px-4 py-3">Catatan</th>
                   <th class="px-4 py-3 text-right">Aksi</th>
                 </tr>
               </thead>
               <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                 <tr v-for="doc in pendaftar.dokumen" :key="doc.id">
                   <td class="px-4 py-3 font-medium text-slate-900 dark:text-white capitalize">
                     {{ doc.jenis_dokumen.replace(/_/g, ' ') }}
                   </td>
                   <td class="px-4 py-3 font-mono text-xs truncate max-w-[200px]" :title="doc.file_name">
                     {{ doc.file_name }}
                   </td>
                   <td class="px-4 py-3">
                     <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="getDocStatusClass(doc.status_verifikasi)">
                       {{ getDocStatusLabel(doc.status_verifikasi) }}
                     </span>
                   </td>
                   <td class="px-4 py-3 text-xs italic">
                     {{ doc.catatan || '-' }}
                   </td>
                   <td class="px-4 py-3 text-right">
                     <button title="Unduh" @click="downloadDoc(doc)" class="text-primary hover:text-primary-dark font-medium text-xs">
                       Unduh
                     </button>
                   </td>
                 </tr>
                 <tr v-if="!pendaftar.dokumen || pendaftar.dokumen.length === 0">
                   <td colspan="5" class="px-4 py-8 text-center text-slate-400 italic">
                     Belum ada dokumen yang diunggah
                   </td>
                 </tr>
               </tbody>
             </table>
          </div>
        </div>

        <!-- Tab 2: Akademik / Ujian -->
        <div v-else-if="activeTab === 2">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Jadwal Ujian Info -->
            <div class="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30">
              <h3 class="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                <UIcon name="i-heroicons-calendar-days" />
                Jadwal Ujian Masuk
              </h3>
              
              <div v-if="pendaftar.jadwal_ujian" class="space-y-4">
                 <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-lg bg-white/60 flex flex-col items-center justify-center text-blue-600 font-bold shadow-sm">
                     <span class="text-xs uppercase">Tgl</span>
                     <span class="text-xl leading-none">{{ new Date(pendaftar.jadwal_ujian.tanggal).getDate() }}</span>
                   </div>
                   <div>
                     <p class="font-medium text-blue-900 dark:text-blue-100">{{ formatDate(pendaftar.jadwal_ujian.tanggal) }}</p>
                     <p class="text-sm text-blue-600 dark:text-blue-400">{{ pendaftar.jadwal_ujian.sesi }}</p>
                   </div>
                 </div>
                 <div class="flex items-center gap-3 text-sm text-blue-800 dark:text-blue-300 p-3 bg-white/40 dark:bg-black/20 rounded-lg">
                   <UIcon name="i-heroicons-map-pin" class="text-lg" />
                   <span>Ruang: <span class="font-bold">{{ pendaftar.jadwal_ujian.ruang }}</span></span>
                 </div>
              </div>
              <div v-else class="text-blue-600/60 dark:text-blue-400/60 italic text-center py-6">
                Belum memilih jadwal ujian
              </div>
            </div>

            <!-- Nilai & Hasil -->
            <div class="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/5">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <UIcon name="i-heroicons-clipboard-document-check" />
                Hasil Seleksi
              </h3>

              <div class="space-y-5">
                 <div>
                   <label class="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">Nilai Ujian</label>
                   <div class="text-3xl font-bold font-mono text-slate-800 dark:text-slate-200">
                     {{ pendaftar.pendaftar.nilai_ujian !== null ? pendaftar.pendaftar.nilai_ujian : '-' }}
                   </div>
                 </div>
                 
                 <div>
                   <label class="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">Status Akhir</label>
                   <div class="flex items-center gap-2">
                     <span 
                        class="text-sm font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-2"
                        :class="getStatusClass(pendaftar.pendaftar.status_kelulusan)"
                     >
                       <span class="w-2 h-2 rounded-full bg-current"></span>
                       {{ getStatusLabel(pendaftar.pendaftar.status_kelulusan) }}
                     </span>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </template>

    <!-- Error State -->
    <div v-else class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <UIcon name="i-heroicons-exclamation-circle" class="text-5xl text-slate-300 mb-4" />
        <h3 class="text-lg font-medium text-slate-900 dark:text-white">Data Tidak Ditemukan</h3>
        <p class="text-slate-500 mb-6">Maaf, data pendaftar yang Anda cari tidak ditemukan.</p>
        <button @click="router.push('/admin/pendaftar')" class="text-primary hover:underline font-medium">
          Kembali ke Daftar
        </button>
      </div>
    </div>
  </div>
</template>
