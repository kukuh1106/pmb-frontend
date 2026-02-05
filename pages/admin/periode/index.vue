<script setup lang="ts">
import type { PeriodePendaftaran } from '~/types/api'

definePageMeta({
  layout: 'admin'
})

const adminApi = useAdminApi()
const toast = useToast()

const isLoading = ref(true)
const periodeList = ref<PeriodePendaftaran[]>([])
const searchQuery = ref('')

// Modal State
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSubmitting = ref(false)
const deleteConfirmationOpen = ref(false)
const itemToDelete = ref<PeriodePendaftaran | null>(null)

// Form Data - Using strings for dates as expected by most HTML date inputs
const formData = reactive({
  id: 0,
  nama: '',
  tanggal_buka: '',
  tanggal_tutup: '',
  is_active: true
})

const errors = ref<Record<string, string[]>>({})

// Fetch Data
const loadData = async () => {
  isLoading.value = true
  try {
    const res = await adminApi.getPeriodeList()
    if (res.success && res.data) {
      periodeList.value = res.data
    }
  } catch (error) {
    toast.add({ title: 'Error', description: 'Gagal memuat data periode pendaftaran', color: 'error' })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

// Filtered Data
const filteredPeriode = computed(() => {
  if (!searchQuery.value) return periodeList.value
  const query = searchQuery.value.toLowerCase()
  return periodeList.value.filter(item => 
    item.nama.toLowerCase().includes(query)
  )
})

// Formatting Helpers
const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Actions
const openCreateModal = () => {
  modalMode.value = 'create'
  formData.id = 0
  formData.nama = ''
  formData.tanggal_buka = ''
  formData.tanggal_tutup = ''
  formData.is_active = true
  errors.value = {}
  isModalOpen.value = true
}

const openEditModal = (item: PeriodePendaftaran) => {
  modalMode.value = 'edit'
  formData.id = item.id
  formData.nama = item.nama
  // Extract only YYYY-MM-DD for date input compatibility
  formData.tanggal_buka = item.tanggal_buka ? item.tanggal_buka.slice(0, 10) : ''
  formData.tanggal_tutup = item.tanggal_tutup ? item.tanggal_tutup.slice(0, 10) : ''
  formData.is_active = item.is_active
  errors.value = {}
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  errors.value = {}
}

const handleSubmit = async () => {
  isSubmitting.value = true
  errors.value = {}
  
  try {
    let res
    const payload = {
      nama: formData.nama,
      tanggal_buka: formData.tanggal_buka,
      tanggal_tutup: formData.tanggal_tutup,
      is_active: formData.is_active
    }

    if (modalMode.value === 'create') {
      res = await adminApi.createPeriode(payload)
    } else {
      res = await adminApi.updatePeriode(formData.id, payload)
    }

    if (res.success) {
      toast.add({
        title: 'Berhasil',
        description: `Periode pendaftaran berhasil ${modalMode.value === 'create' ? 'ditambahkan' : 'diupdate'}`,
        color: 'success'
      })
      await loadData()
      closeModal()
    } else {
      if (res.errors) {
        errors.value = res.errors
      } else {
        toast.add({
          title: 'Gagal',
          description: res.message || 'Terjadi kesalahan saat menyimpan data',
          color: 'error'
        })
      }
    }
  } catch (error: any) {
    console.error('Submit error:', error)
    toast.add({
      title: 'Error',
      description: 'Terjadi kesalahan sistem',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (item: PeriodePendaftaran) => {
  itemToDelete.value = item
  deleteConfirmationOpen.value = true
}

const handleDelete = async () => {
  if (!itemToDelete.value) return
  
  try {
    const res = await adminApi.deletePeriode(itemToDelete.value.id)
    if (res.success) {
      toast.add({
        title: 'Berhasil',
        description: 'Periode pendaftaran berhasil dihapus',
        color: 'success'
      })
      await loadData()
      deleteConfirmationOpen.value = false
      itemToDelete.value = null
    } else {
      toast.add({
        title: 'Gagal',
        description: res.message || 'Gagal menghapus periode pendaftaran',
        color: 'error'
      })
    }
  } catch (error) {
    console.error('Delete error:', error)
    toast.add({
      title: 'Error',
      description: 'Terjadi kesalahan saat menghapus data',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Periode Pendaftaran</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Kelola jadwal pembukaan pendaftaran mahasiswa baru
        </p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="openCreateModal"
          class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2 shadow-sm shadow-primary/30"
        >
          <UIcon name="i-heroicons-plus" class="text-lg" />
          Tambah Periode
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
      
      <!-- Search & Toolbar -->
      <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex gap-4">
        <div class="relative flex-1 max-w-md">
           <UIcon name="i-heroicons-magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
           <input 
             v-model="searchQuery"
             type="text" 
             placeholder="Cari nama periode..." 
             class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white transition-all"
           />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead class="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th class="px-6 py-4">Nama Periode</th>
              <th class="px-6 py-4">Tanggal Buka</th>
              <th class="px-6 py-4">Tanggal Tutup</th>
              <th class="px-6 py-4 text-center w-24">Status</th>
              <th class="px-6 py-4 text-center w-32">Pendaftar</th>
              <th class="px-6 py-4 text-right w-32">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <template v-if="isLoading">
              <tr v-for="i in 3" :key="i">
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-48"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-32"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-32"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-16 mx-auto"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-8 mx-auto"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-16 ml-auto"></div></td>
              </tr>
            </template>
            <template v-else-if="filteredPeriode.length > 0">
              <tr v-for="item in filteredPeriode" :key="item.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {{ item.nama }}
                </td>
                <td class="px-6 py-4">
                  {{ formatDateDisplay(item.tanggal_buka) }}
                </td>
                <td class="px-6 py-4">
                  {{ formatDateDisplay(item.tanggal_tutup) }}
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="flex justify-center">
                    <span 
                      v-if="item.is_active" 
                      class="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    >
                      Aktif
                    </span>
                    <span 
                      v-else 
                      class="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                    >
                      Non-aktif
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-center font-medium text-slate-900 dark:text-white">
                  {{ item.pendaftar_count || 0 }}
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      @click="openEditModal(item)"
                      class="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <UIcon name="i-heroicons-pencil-square" class="text-lg" />
                    </button>
                    <button 
                      @click="confirmDelete(item)"
                      class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <UIcon name="i-heroicons-trash" class="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else>
               <td colspan="6" class="px-6 py-12 text-center text-slate-400">
                 Tidak ada data periode pendaftaran
               </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Modal Form -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>
      <div class="bg-white dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">
            {{ modalMode === 'create' ? 'Tambah Periode' : 'Edit Periode' }}
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <UIcon name="i-heroicons-x-mark" class="text-xl" />
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Nama -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Periode</label>
              <input 
                v-model="formData.nama"
                type="text" 
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white dark:bg-black/20"
                :class="errors.nama ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'"
                placeholder="Contoh: Gelombang I Tahun 2026"
              />
              <p v-if="errors.nama" class="text-red-500 text-xs mt-1">{{ errors.nama[0] }}</p>
            </div>

            <!-- Tanggal Buka -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Buka</label>
              <input 
                v-model="formData.tanggal_buka"
                type="date" 
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white dark:bg-black/20"
                :class="errors.tanggal_buka ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'"
              />
              <p v-if="errors.tanggal_buka" class="text-red-500 text-xs mt-1">{{ errors.tanggal_buka[0] }}</p>
            </div>

            <!-- Tanggal Tutup -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Tutup</label>
              <input 
                v-model="formData.tanggal_tutup"
                type="date" 
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white dark:bg-black/20"
                :class="errors.tanggal_tutup ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'"
              />
              <p v-if="errors.tanggal_tutup" class="text-red-500 text-xs mt-1">{{ errors.tanggal_tutup[0] }}</p>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-3 pt-2">
               <button 
                 type="button" 
                 role="switch" 
                 :aria-checked="formData.is_active"
                 @click="formData.is_active = !formData.is_active"
                 class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                 :class="formData.is_active ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'"
               >
                 <span 
                   aria-hidden="true" 
                   class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                   :class="formData.is_active ? 'translate-x-5' : 'translate-x-0'"
                 ></span>
               </button>
               <span class="text-sm text-slate-700 dark:text-slate-300">
                 {{ formData.is_active ? 'Aktif' : 'Non-aktif' }}
               </span>
            </div>
          </form>
        </div>

        <div class="px-6 py-4 bg-slate-50 dark:bg-black/20 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <button 
            type="button" 
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            Batal
          </button>
          <button 
            type="button" 
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-600 disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
          >
            <UIcon v-if="isSubmitting" name="i-heroicons-arrow-path" class="animate-spin" />
            {{ modalMode === 'create' ? 'Simpan' : 'Update' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="deleteConfirmationOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="deleteConfirmationOpen = false"></div>
      <div class="bg-white dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-sm relative z-10 p-6 text-center">
        <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-heroicons-exclamation-triangle" class="text-2xl" />
        </div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus Periode?</h3>
        <p class="text-sm text-slate-500 mb-6">
          Anda akan menghapus periode <strong>{{ itemToDelete?.nama }}</strong>. Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="flex gap-3 justify-center">
          <button 
            @click="deleteConfirmationOpen = false"
            class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            Batal
          </button>
          <button 
            @click="handleDelete"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
