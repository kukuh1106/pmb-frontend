<script setup lang="ts">
import type { Pendaftar, Prodi, PaginatedResponse } from '~/types/api'

definePageMeta({
  layout: 'admin'
})

const adminApi = useAdminApi()
const prodiApi = useProdiApi()
const auth = useAuth()
const router = useRouter()

// State
const isLoading = ref(true)
const pendaftarList = ref<Pendaftar[]>([])
const prodiList = ref<Prodi[]>([])
const pagination = ref({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  perPage: 10
})

// Filters
const search = ref('')
const selectedProdi = ref<number | ''>('')
const selectedStatus = ref<string>('')
const debouncedSearch = ref(search.value)

// Load data
const loadData = async () => {
  isLoading.value = true
  try {
    const params: any = {
      page: pagination.value.currentPage,
      per_page: pagination.value.perPage,
      search: debouncedSearch.value,
    }

    if (auth.role.value === 'prodi') {
      // For Prodi role, backend automatically handles prodi_id
      // But we can filter by status
    } else {
      // For Admin role, we can filter by prodi explicitely
      if (selectedProdi.value) params.prodi_id = selectedProdi.value
    }
    
    if (selectedStatus.value) params.status_kelulusan = selectedStatus.value

    let res
    if (auth.role.value === 'prodi') {
       const stafApi = useStafApi()
       res = await stafApi.getPendaftarList(params)
    } else {
       res = await adminApi.getPendaftarList(params)
    }
    
    if (res.success && res.data) {
      pendaftarList.value = res.data
      
      if (res.meta) {
        pagination.value.currentPage = res.meta.current_page
        pagination.value.lastPage = res.meta.last_page
        pagination.value.total = res.meta.total
        pagination.value.perPage = res.meta.per_page
      }
    }
  } catch (error) {
    console.error('Failed to load pendaftar:', error)
  } finally {
    isLoading.value = false
  }
}

// Initial load
onMounted(async () => {
  auth.initAuth()
  
  // Load Prodi for filter (Only for Admin)
  if (auth.role.value === 'admin') {
    try {
      const prodiRes = await prodiApi.getProdiAll()
      if (prodiRes.success && prodiRes.data) {
        prodiList.value = prodiRes.data
      }
    } catch (e) {
      console.error('Failed to load prodi list', e)
    }
  }

  await loadData()
})

// Watchers for filters
let searchTimeout: NodeJS.Timeout

watch(search, (newVal) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = newVal
    pagination.value.currentPage = 1
    loadData()
  }, 500)
})

watch([selectedProdi, selectedStatus], () => {
  pagination.value.currentPage = 1
  loadData()
})

// Pagination handlers
const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    pagination.value.currentPage = page
    loadData()
  }
}

// Helpers
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

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

const viewDetail = (id: number) => {
  router.push(`/admin/pendaftar/${id}`)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Header & Actions -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Data Pendaftar</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Kelola data pendaftar mahasiswa baru
        </p>
      </div>
      <div class="flex gap-3">
        <button class="px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm">
          <UIcon name="i-heroicons-arrow-down-tray" class="text-lg" />
          Export Excel
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
      <div class="flex-1 relative">
        <UIcon name="i-heroicons-magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
        <input 
          v-model="search"
          type="text" 
          placeholder="Cari nama, email, atau nomor pendaftaran..." 
          class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
        />
      </div>
      
      <div class="flex gap-4">
        <select 
          v-if="auth.role.value === 'admin'"
          v-model="selectedProdi"
          class="px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-700 dark:text-slate-200 min-w-[200px]"
        >
          <option value="">Semua Program Studi</option>
          <option v-for="prodi in prodiList" :key="prodi.id" :value="prodi.id">
            {{ prodi.nama }} ({{ prodi.jenjang }})
          </option>
        </select>

        <select 
          v-model="selectedStatus"
          class="px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-700 dark:text-slate-200 min-w-[150px]"
        >
          <option value="">Semua Status</option>
          <option value="belum_diproses">Menunggu</option>
          <option value="lulus">Lulus</option>
          <option value="tidak_lulus">Tidak Lulus</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
      <div v-if="isLoading" class="flex-1 flex items-center justify-center">
        <div class="flex flex-col items-center gap-3">
          <UIcon name="i-heroicons-arrow-path" class="text-3xl text-primary animate-spin" />
          <span class="text-sm text-slate-500">Memuat data...</span>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead class="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th class="px-6 py-4 w-10">No</th>
              <th class="px-6 py-4">Pendaftar</th>
              <th class="px-6 py-4">Nomor & Prodi</th>
              <th class="px-6 py-4">Tanggal Daftar</th>
              <th class="px-6 py-4 text-center">Status</th>
              <th class="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr 
              v-for="(item, index) in pendaftarList" 
              :key="item.id" 
              class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <td class="px-6 py-4 text-xs font-mono">
                {{ (pagination.currentPage - 1) * pagination.perPage + index + 1 }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm ring-1 ring-white dark:ring-slate-800">
                    {{ item.nama_lengkap?.charAt(0).toUpperCase() || '?' }}
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-900 dark:text-white">{{ item.nama_lengkap }}</span>
                    <span class="text-xs text-slate-500">{{ item.no_whatsapp || '-' }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col">
                   <span class="font-mono text-xs font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded w-fit mb-1">
                     {{ item.nomor_pendaftaran }}
                   </span>
                   <span class="text-xs">{{ item.prodi?.nama || '-' }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-xs">
                {{ formatDate(item.created_at) }}
              </td>
              <td class="px-6 py-4 text-center">
                 <span 
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="getStatusClass(item.status_kelulusan)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" 
                          :class="{
                            'bg-green-600 dark:bg-green-400': item.status_kelulusan === 'lulus',
                            'bg-red-600 dark:bg-red-400': item.status_kelulusan === 'tidak_lulus',
                            'bg-yellow-600 dark:bg-yellow-400': item.status_kelulusan === 'belum_diproses'
                          }">
                    </span>
                    {{ getStatusLabel(item.status_kelulusan) }}
                  </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button 
                  @click="viewDetail(item.id)"
                  class="p-2 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors group"
                  title="Lihat Detail"
                >
                  <UIcon name="i-heroicons-eye" class="text-lg" />
                </button>
              </td>
            </tr>
            <tr v-if="pendaftarList.length === 0">
              <td colspan="6" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center justify-center">
                  <UIcon name="i-heroicons-document-magnifying-glass" class="text-4xl text-slate-300 mb-2" />
                  <p class="text-slate-500 font-medium">Tidak ada data pendaftar</p>
                  <p class="text-slate-400 text-sm">Coba sesuaikan filter pencarian Anda</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between" v-if="pendaftarList.length > 0">
        <p class="text-sm text-slate-500">
          Menampilkan <span class="font-bold text-slate-700 dark:text-slate-300">{{ (pagination.currentPage - 1) * pagination.perPage + 1 }}</span> 
          sampai <span class="font-bold text-slate-700 dark:text-slate-300">{{ Math.min(pagination.currentPage * pagination.perPage, pagination.total) }}</span> 
          dari <span class="font-bold text-slate-700 dark:text-slate-300">{{ pagination.total }}</span> data
        </p>
        
        <div class="flex gap-2">
          <button 
            @click="changePage(pagination.currentPage - 1)"
            :disabled="pagination.currentPage === 1"
            class="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button 
             @click="changePage(pagination.currentPage + 1)"
             :disabled="pagination.currentPage === pagination.lastPage"
             class="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
