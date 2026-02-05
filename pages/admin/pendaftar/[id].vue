<script setup lang="ts">
import type { Pendaftar, Dokumen } from '~/types/api'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const stafApi = useStafApi()
const adminApi = useAdminApi()
const auth = useAuth()
const toast = useToast()

const pendaftarId = computed(() => Number(route.params.id))
const isLoading = ref(true)
const pendaftar = ref<any>(null) // Using any because structure is nested
const documents = ref<Dokumen[]>([])

// Modal state for verification
const verificationModalOpen = ref(false)
const selectedDoc = ref<Dokumen | null>(null)
const selectedDocStatus = ref<'valid' | 'tidak_valid'>('valid')
const verificationNote = ref('')
const isSubmitting = ref(false)

// Modal state for preview
const previewModalOpen = ref(false)
const previewDocUrl = ref('')
const previewDocType = ref<'image' | 'pdf' | 'other'>('other')
const previewDocName = ref('')

// Determine if user is admin or prodi
const isAdmin = computed(() => auth.role.value === 'admin')

// Load data
const loadData = async () => {
  isLoading.value = true
  try {
    let res
    if (isAdmin.value) {
      res = await adminApi.getPendaftarDetail(pendaftarId.value)
    } else {
      res = await stafApi.getPendaftarDetail(pendaftarId.value)
    }

    if (res.success && res.data) {
      pendaftar.value = res.data
      documents.value = res.data.dokumen || []
    } else {
      toast.add({
        title: 'Error', 
        description: res.message || 'Gagal memuat data pendaftar', 
        color: 'error'
      })
      router.push('/admin/pendaftar')
    }
  } catch (error) {
    console.error('Failed to load detail:', error)
    toast.add({ title: 'Error', description: 'Terjadi kesalahan sistem', color: 'error' })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  auth.initAuth()
  loadData()
})

// Helpers
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getDocTypeLabel = (type: string) => {
  switch(type) {
    case 'ijazah': return 'Ijazah'
    case 'transkrip': return 'Transkrip Nilai'
    case 'ktp': return 'KTP'
    case 'pas_foto': return 'Pas Foto'
    case 'surat_rekomendasi': return 'Surat Rekomendasi'
    case 'proposal': return 'Proposal Disertasi/Tesis'
    default: return type.replace(/_/g, ' ').toUpperCase()
  }
}

const getStatusBadge = (status: string) => {
  switch(status) {
    case 'valid': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'tidak_valid': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  }
}

// Actions
const openVerificationModal = (doc: Dokumen) => {
  if (isAdmin.value) return 
  
  selectedDoc.value = doc
  selectedDocStatus.value = doc.status_verifikasi === 'pending' ? 'valid' : (doc.status_verifikasi as any)
  verificationNote.value = doc.catatan || ''
  verificationModalOpen.value = true
}

const submitVerification = async () => {
  if (!selectedDoc.value) return
  
  isSubmitting.value = true
  try {
    const api = useApi() 
    
    // Using generic api call since we know the endpoint
    const res = await api.put(`/prodi/verifikasi/${pendaftarId.value}`, {
      dokumen_id: selectedDoc.value.id,
      status: selectedDocStatus.value,
      catatan: verificationNote.value
    })

    if (res.success) {
      toast.add({
        title: 'Berhasil',
        description: 'Status dokumen berhasil diperbarui',
        color: 'success'
      })
      // Update local state
      const docIndex = documents.value.findIndex(d => d.id === selectedDoc.value?.id)
      if (docIndex !== -1 && documents.value[docIndex]) {
        documents.value[docIndex].status_verifikasi = selectedDocStatus.value
        documents.value[docIndex].catatan = verificationNote.value
      }
      verificationModalOpen.value = false
    } else {
      toast.add({
        title: 'Gagal',
        description: res.message || 'Gagal memverifikasi dokumen',
        color: 'error'
      })
    }
  } catch (error) {
    console.error('Verification error:', error)
    toast.add({ title: 'Error', description: 'Terjadi kesalahan sistem', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

const downloadDoc = (url?: string) => {
  if (url) window.open(url, '_blank')
}

const openPreview = (doc: Dokumen) => {
  if (!doc.file_path && !doc.file_url) return
  
  const url = doc.file_url || doc.file_path
  
  // For S3 URLs or any external URLs, just open in new tab
  // This avoids CORS issues with images and PDFs in iframes
  if (url.includes('s3.') || url.includes('amazonaws.com') || url.startsWith('http')) {
    window.open(url, '_blank')
    return
  }
  
  // For local URLs, use the preview modal
  const extension = doc.file_name?.split('.').pop()?.toLowerCase()
  
  previewDocName.value = doc.file_name
  previewDocUrl.value = url
  
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension || '')) {
    previewDocType.value = 'image'
  } else if (extension === 'pdf') {
    previewDocType.value = 'pdf'
  } else {
    previewDocType.value = 'other'
    window.open(url, '_blank')
    return
  }
  
  previewModalOpen.value = true
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-sm text-slate-500 mb-1">
          <NuxtLink to="/admin/pendaftar" class="hover:text-primary transition-colors">Data Pendaftar</NuxtLink>
          <UIcon name="i-heroicons-chevron-right" class="text-xs" />
          <span>Detail Pendaftar</span>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Detail Pendaftar</h1>
      </div>
      <div v-if="!isLoading" class="flex gap-3">
        <span 
          class="px-3 py-1.5 rounded-lg text-sm font-semibold capitalize"
          :class="pendaftar?.pendaftar?.status_kelulusan === 'lulus' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                  pendaftar?.pendaftar?.status_kelulusan === 'tidak_lulus' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'"
        >
          {{ pendaftar?.pendaftar?.status_kelulusan?.replace('_', ' ') || 'Menunggu' }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
      <div class="flex flex-col items-center gap-3">
        <UIcon name="i-heroicons-arrow-path" class="text-3xl text-primary animate-spin" />
        <span class="text-sm text-slate-500">Memuat data pendaftar...</span>
      </div>
    </div>

    <div v-else-if="pendaftar" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Biodata -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        
        <!-- Identitas Utama -->
        <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 class="font-bold text-slate-900 dark:text-white">Identitas Pendaftar</h3>
          </div>
          <div class="p-6">
            <div class="flex flex-col md:flex-row gap-6">
              <!-- Foto -->
              <div class="flex-shrink-0">
                <div class="w-24 h-32 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img 
                    v-if="pendaftar.pendaftar.foto_path" 
                    :src="pendaftar.pendaftar.foto_path" 
                    alt="Foto Profil" 
                    class="w-full h-full object-cover"
                  >
                  <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
                    <UIcon name="i-heroicons-user" class="text-4xl" />
                  </div>
                </div>
              </div>
              
              <!-- Info -->
              <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <p class="text-slate-500 dark:text-slate-400 mb-1">Nomor Pendaftaran</p>
                  <p class="font-bold text-slate-900 dark:text-white font-mono">{{ pendaftar.pendaftar.nomor_pendaftaran }}</p>
                </div>
                <div>
                  <p class="text-slate-500 dark:text-slate-400 mb-1">Nama Lengkap</p>
                  <p class="font-medium text-slate-900 dark:text-white">{{ pendaftar.pendaftar.nama_lengkap }}</p>
                </div>
                <div>
                  <p class="text-slate-500 dark:text-slate-400 mb-1">Program Studi Pilihan</p>
                  <p class="font-medium text-slate-900 dark:text-white">
                    {{ pendaftar.prodi?.nama }} ({{ pendaftar.prodi?.jenjang }})
                  </p>
                </div>
                <div>
                  <p class="text-slate-500 dark:text-slate-400 mb-1">Nilai Ujian / Status</p>
                  <p class="font-medium text-slate-900 dark:text-white">
                    {{ pendaftar.pendaftar.nilai_ujian !== null ? pendaftar.pendaftar.nilai_ujian : '-' }}
                  </p>
                </div>
                <div>
                  <p class="text-slate-500 dark:text-slate-400 mb-1">No. WhatsApp</p>
                  <p class="font-medium text-slate-900 dark:text-white">{{ pendaftar.pendaftar.no_whatsapp }}</p>
                </div>
                <div>
                  <p class="text-slate-500 dark:text-slate-400 mb-1">Tanggal Lahir</p>
                  <p class="font-medium text-slate-900 dark:text-white">{{ formatDate(pendaftar.pendaftar.tanggal_lahir) }}</p>
                </div>
                <div class="md:col-span-2">
                  <p class="text-slate-500 dark:text-slate-400 mb-1">Alamat</p>
                  <p class="font-medium text-slate-900 dark:text-white">{{ pendaftar.pendaftar.alamat || '-' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dokumen -->
        <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 class="font-bold text-slate-900 dark:text-white">Dokumen Persyaratan</h3>
          </div>
          <div class="divide-y divide-slate-100 dark:divide-slate-800">
            <div 
              v-for="doc in documents" 
              :key="doc.id" 
              class="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <UIcon name="i-heroicons-document-text" class="text-xl" />
                </div>
                <div>
                  <p class="font-medium text-slate-900 dark:text-white text-sm">{{ getDocTypeLabel(doc.jenis_dokumen) }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span 
                      class="text-[10px] px-2 py-0.5 rounded font-semibold capitalize"
                      :class="getStatusBadge(doc.status_verifikasi)"
                    >
                      {{ doc.status_verifikasi.replace('_', ' ') }}
                    </span>
                    <span class="text-xs text-slate-400">{{ (doc.file_size / 1024).toFixed(0) }} KB</span>
                  </div>
                  <p v-if="doc.catatan" class="text-xs text-red-500 mt-1 italic">
                    Catatan: {{ doc.catatan }}
                  </p>
                </div>
              </div>
              
              <div class="flex gap-2">
                <button 
                  @click="openPreview(doc)"
                  class="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  title="Lihat Dokumen"
                >
                  <UIcon name="i-heroicons-eye" class="text-lg" />
                </button>
                <button 
                  @click="openVerificationModal(doc)"
                  class="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                  :title="isAdmin ? 'Lihat Detail (Admin)' : 'Verifikasi (Staf)'"
                >
                   <UIcon v-if="!isAdmin" name="i-heroicons-check-badge" class="text-lg" />
                   <UIcon v-else name="i-heroicons-eye" class="text-lg" />
                </button>
              </div>
            </div>
            
            <div v-if="documents.length === 0" class="p-8 text-center text-slate-400 text-sm">
              Belum ada dokumen yang diunggah
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column: Verification & Info -->
      <div class="flex flex-col gap-6">
        
        <!-- Status Card -->
        <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h3 class="font-bold text-slate-900 dark:text-white mb-4">Informasi Kelulusan</h3>
          
          <div class="space-y-4">
            <div>
              <p class="text-xs text-slate-500 mb-1">Nilai Ujian</p>
              <div class="flex items-center gap-2">
                <span class="text-2xl font-bold" :class="pendaftar.pendaftar.nilai_ujian ? 'text-slate-900 dark:text-white' : 'text-slate-400'">
                  {{ pendaftar.pendaftar.nilai_ujian || '-' }}
                </span>
                <span class="text-xs text-slate-400">/ 100</span>
              </div>
            </div>

             <div>
              <p class="text-xs text-slate-500 mb-1">Status Kelulusan</p>
              <div 
                class="inline-block px-3 py-1.5 rounded-lg text-sm font-bold capitalize"
                :class="pendaftar.pendaftar.status_kelulusan === 'lulus' ? 'bg-green-100 text-green-700' : 
                        pendaftar.pendaftar.status_kelulusan === 'tidak_lulus' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'"
              >
                {{ pendaftar.pendaftar.status_kelulusan.replace('_', ' ') }}
              </div>
            </div>

            <hr class="border-slate-100 dark:border-slate-800" />
            
            <div v-if="pendaftar.jadwal_ujian">
              <p class="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">Jadwal Ujian</p>
              <p class="font-medium text-slate-900 dark:text-white text-sm">{{ formatDate(pendaftar.jadwal_ujian.tanggal) }}</p>
              <p class="text-sm text-slate-600 dark:text-slate-300">
                Sesi: {{ pendaftar.jadwal_ujian.sesi }} <br>
                Ruang: {{ pendaftar.jadwal_ujian.ruang }}
              </p>
            </div>
            <div v-else>
               <p class="text-sm text-slate-500 italic">Jadwal ujian belum dipilih</p>
            </div>
          </div>
        </div>

      </div>
    </div>
    
    <!-- Verification Modal -->
    <div v-if="verificationModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="verificationModalOpen = false"></div>
      <div class="bg-white dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-sm relative z-10 p-6 flex flex-col">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Verifikasi Dokumen</h3>
        
        <div class="mb-4">
          <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dokumen</p>
          <p class="text-sm text-slate-500 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
            {{ getDocTypeLabel(selectedDoc?.jenis_dokumen || '') }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
          <div class="flex gap-2">
            <button 
              @click="selectedDocStatus = 'valid'"
              class="flex-1 py-2 rounded-lg text-sm font-medium border transition-colors"
              :class="selectedDocStatus === 'valid' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'"
            >
              Valid
            </button>
            <button 
              @click="selectedDocStatus = 'tidak_valid'"
              class="flex-1 py-2 rounded-lg text-sm font-medium border transition-colors"
              :class="selectedDocStatus === 'tidak_valid' ? 'bg-red-100 border-red-200 text-red-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'"
            >
              Tidak Valid
            </button>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Catatan <span class="text-xs font-normal text-slate-400">(Opsional jika valid, Wajib jika tidak valid)</span>
          </label>
          <textarea 
            v-model="verificationNote"
            rows="3"
            class="w-full px-3 py-2 bg-white dark:bg-black/20 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
            placeholder="Berikan alasan jika dokumen tidak valid..."
          ></textarea>
        </div>

        <div class="flex gap-3 justify-end">
          <button 
            @click="verificationModalOpen = false"
            class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            Batal
          </button>
          <button 
            @click="submitVerification"
            :disabled="isSubmitting || (selectedDocStatus === 'tidak_valid' && !verificationNote.trim())"
            class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <UIcon v-if="isSubmitting" name="i-heroicons-arrow-path" class="animate-spin" />
            Simpan
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="previewModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="previewModalOpen = false"></div>
      <div class="bg-white dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-4xl h-[85vh] relative z-10 flex flex-col overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark">
          <h3 class="font-bold text-slate-900 dark:text-white truncate pr-4">{{ previewDocName }}</h3>
          <button @click="previewModalOpen = false" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <UIcon name="i-heroicons-x-mark" class="text-2xl" />
          </button>
        </div>
        
        <div class="flex-1 overflow-auto bg-slate-100 dark:bg-black/40 flex items-center justify-center p-4">
          <img v-if="previewDocType === 'image'" :src="previewDocUrl" class="max-w-full max-h-full object-contain shadow-lg rounded" />
          <iframe v-else-if="previewDocType === 'pdf'" :src="previewDocUrl" class="w-full h-full rounded shadow-lg bg-white"></iframe>
          <div v-else class="text-center">
            <p class="text-slate-500 mb-4">Format file tidak didukung untuk preview.</p>
            <a :href="previewDocUrl" target="_blank" class="text-primary hover:underline">Download File</a>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
