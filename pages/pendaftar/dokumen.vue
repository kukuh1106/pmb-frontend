<script setup lang="ts">
import type { Dokumen } from '~/types/api'

definePageMeta({ layout: "pendaftar" });

const pendaftarApi = usePendaftarApi()
const toast = useToast()

const isLoading = ref(true)
const isUploading = ref<string | null>(null)

interface DocumentType {
  jenis: string
  title: string
  desc: string
}

const documentTypes: DocumentType[] = [
  { jenis: 'ijazah', title: 'Ijazah', desc: 'Scan ijazah S1/S2' },
  { jenis: 'transkrip', title: 'Transkrip Nilai', desc: 'Transkrip akademik resmi' },
  { jenis: 'ktp', title: 'KTP', desc: 'Scan KTP yang masih berlaku' },
  { jenis: 'pas_foto', title: 'Pas Foto', desc: 'Foto 4x6 latar merah' },
]

const uploadedDocs = ref<Dokumen[]>([])

// Fetch existing documents
onMounted(async () => {
  try {
    const response = await pendaftarApi.getBiodata()
    if (response.success && response.data) {
      // Note: We'll need a separate endpoint or include documents in biodata
      // For now, we'll create a mock structure
    }
  } catch (error) {
    console.error('Failed to load documents:', error)
  } finally {
    isLoading.value = false
  }
})

// Get uploaded doc by type
const getDocByType = (jenis: string): Dokumen | undefined => {
  return uploadedDocs.value.find(d => d.jenis_dokumen === jenis)
}

// Get status for a document type
const getDocStatus = (jenis: string): 'valid' | 'pending' | 'tidak_valid' | 'none' => {
  const doc = getDocByType(jenis)
  if (!doc) return 'none'
  return doc.status_verifikasi
}

// Progress calculation
const progress = computed(() => {
  const uploaded = documentTypes.filter(dt => getDocByType(dt.jenis)).length
  return Math.round((uploaded / documentTypes.length) * 100)
})

// Handle file upload
async function handleUpload(event: Event, jenis: string) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    toast.add({
      title: 'File Terlalu Besar',
      description: 'Ukuran file maksimal 2MB',
      color: 'error'
    })
    return
  }

  // Validate file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    toast.add({
      title: 'Format Tidak Didukung',
      description: 'Hanya mendukung format PDF, JPG, atau PNG',
      color: 'error'
    })
    return
  }

  isUploading.value = jenis

  try {
    const response = await pendaftarApi.uploadDokumen(file, jenis)

    if (response.success && response.data) {
      uploadedDocs.value.push(response.data)
      toast.add({
        title: 'Upload Berhasil',
        description: 'Dokumen berhasil diupload',
        color: 'success'
      })
    } else {
      toast.add({
        title: 'Upload Gagal',
        description: response.message || 'Terjadi kesalahan',
        color: 'error'
      })
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Gagal mengupload file',
      color: 'error'
    })
  } finally {
    isUploading.value = null
    input.value = '' // Reset input
  }
}

// Format file size
const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Get status badge class
const getStatusClass = (status: string) => {
  switch (status) {
    case 'valid':
      return 'bg-primary/10 text-primary border-primary/20'
    case 'pending':
      return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
    case 'tidak_valid':
      return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
    default:
      return 'bg-gray-100 text-gray-500 border-gray-200'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'valid': return 'Valid'
    case 'pending': return 'Pending'
    case 'tidak_valid': return 'Ditolak'
    default: return 'Belum Upload'
  }
}
</script>

<template>
  <div class="flex flex-col flex-1 w-full gap-6 transition-colors duration-200">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[40vh]">
      <div class="flex flex-col items-center gap-4">
        <span class="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
        <p class="text-gray-500">Memuat dokumen...</p>
      </div>
    </div>

    <template v-else>
      <!-- Breadcrumbs -->
      <div class="flex flex-wrap gap-2 px-4">
        <NuxtLink to="/pendaftar" class="text-primary hover:text-primary/80 text-sm font-medium leading-normal transition-colors">Dashboard</NuxtLink>
        <span class="text-gray-400 text-sm font-medium leading-normal">/</span>
        <span class="text-gray-600 dark:text-gray-300 text-sm font-medium leading-normal">Dokumen</span>
      </div>

      <!-- Page Heading -->
      <div class="flex flex-col gap-2 px-4">
        <h1 class="text-[#111813] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Upload Dokumen</h1>
        <p class="text-gray-500 dark:text-gray-400 text-base font-normal leading-relaxed max-w-2xl">
          Unggah dokumen yang diperlukan dalam format PDF atau JPG. Pastikan semua teks terbaca dengan jelas. Ukuran file maksimal 2MB per dokumen.
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="flex flex-col gap-3 px-4">
        <div class="flex justify-between items-center">
          <p class="text-[#111813] dark:text-gray-200 text-sm font-medium leading-normal">
            {{ documentTypes.filter(dt => getDocByType(dt.jenis)).length }} dari {{ documentTypes.length }} dokumen diupload
          </p>
          <span class="text-primary text-sm font-bold">{{ progress }}%</span>
        </div>
        <div class="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div class="h-full bg-primary rounded-full transition-all duration-500 ease-out" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>

      <!-- Document List -->
      <div class="px-4 py-2">
        <div class="flex flex-col gap-4">
          <!-- Header Row (Hidden on mobile) -->
          <div class="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            <div class="col-span-4">Jenis Dokumen</div>
            <div class="col-span-5">File</div>
            <div class="col-span-3 text-right">Status</div>
          </div>

          <div v-for="docType in documentTypes" :key="docType.jenis" class="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-all hover:shadow-md bg-white dark:bg-[#111816]">
            <div class="p-5 md:grid md:grid-cols-12 md:gap-4 md:items-center flex flex-col gap-4">
              
              <!-- Column 1: Info -->
              <div class="col-span-4 flex flex-col gap-1">
                <h3 class="text-[#111813] dark:text-white font-semibold text-base">{{ docType.title }}</h3>
                <p class="text-gray-500 dark:text-gray-400 text-xs">{{ docType.desc }}</p>
              </div>

              <!-- Column 2: File Picker / File Info -->
              <div class="col-span-5">
                <!-- Uploaded file -->
                <div v-if="getDocByType(docType.jenis)" class="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div class="bg-white dark:bg-background-dark p-2 rounded text-primary">
                     <UIcon name="i-heroicons-document-text" class="text-2xl" />
                  </div>
                  <div class="flex flex-col overflow-hidden">
                    <span class="text-sm font-medium text-[#111813] dark:text-white truncate">
                      {{ getDocByType(docType.jenis)?.file_name }}
                    </span>
                    <span class="text-xs text-gray-500">
                      {{ formatSize(getDocByType(docType.jenis)?.file_size || 0) }}
                    </span>
                  </div>
                </div>

                <!-- Upload area -->
                <div v-else>
                  <label class="relative flex flex-col items-center justify-center w-full h-14 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group">
                    <div v-if="isUploading === docType.jenis" class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-primary animate-spin">progress_activity</span>
                      <span class="text-sm text-gray-500">Mengupload...</span>
                    </div>
                    <div v-else class="flex flex-row items-center gap-3">
                       <UIcon name="i-heroicons-cloud-arrow-up" class="text-gray-400 group-hover:text-primary transition-colors text-xl" />
                      <p class="text-sm text-gray-500 dark:text-gray-400 font-medium group-hover:text-primary transition-colors">Klik untuk upload</p>
                    </div>
                    <input 
                      class="hidden" 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      @change="(e) => handleUpload(e, docType.jenis)"
                      :disabled="isUploading !== null"
                    />
                  </label>
                </div>
              </div>

              <!-- Column 3: Status -->
              <div class="col-span-3 flex items-center justify-between md:justify-end gap-4">
                <span 
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                  :class="getStatusClass(getDocStatus(docType.jenis))"
                >
                  <UIcon v-if="getDocStatus(docType.jenis) === 'valid'" name="i-heroicons-check-circle" class="text-sm" />
                  <UIcon v-else-if="getDocStatus(docType.jenis) === 'pending'" name="i-heroicons-clock" class="text-sm" />
                  <UIcon v-else-if="getDocStatus(docType.jenis) === 'tidak_valid'" name="i-heroicons-x-circle" class="text-sm" />
                  <UIcon v-else name="i-heroicons-minus" class="text-sm" />
                  {{ getStatusLabel(getDocStatus(docType.jenis)) }}
                </span>
              </div>

            </div>

            <!-- Rejection note -->
            <div v-if="getDocByType(docType.jenis)?.status_verifikasi === 'tidak_valid' && getDocByType(docType.jenis)?.catatan" 
                 class="px-5 pb-4">
              <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p class="text-xs text-red-600 dark:text-red-400">
                  <strong>Catatan:</strong> {{ getDocByType(docType.jenis)?.catatan }}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Action Footer -->
      <div class="mt-4 px-4 flex flex-col-reverse sm:flex-row justify-end gap-4 pb-12">
        <NuxtLink to="/pendaftar" class="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-[#111813] dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full sm:w-auto text-center">
          Kembali
        </NuxtLink>
        <NuxtLink 
          to="/pendaftar/jadwal"
          :class="[
            'px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2 w-full sm:w-auto transition-colors',
            progress === 100 ? 'bg-primary text-white hover:bg-primary/90 shadow-md' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 pointer-events-none'
          ]"
        >
          <span>Lanjut ke Jadwal</span>
           <UIcon name="i-heroicons-arrow-right" class="text-sm" />
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
