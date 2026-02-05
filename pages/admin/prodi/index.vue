<script setup lang="ts">
import type { Prodi } from '~/types/api'

definePageMeta({
  layout: 'admin'
})

const prodiApi = useProdiApi()
const toast = useToast()

const isLoading = ref(true)
const prodiList = ref<Prodi[]>([])
const searchQuery = ref('')

// Modal State
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSubmitting = ref(false)
const deleteConfirmationOpen = ref(false)
const itemToDelete = ref<Prodi | null>(null)

// Form Data
const formData = reactive({
  id: 0,
  kode: '',
  nama: '',
  jenjang: 'S2' as 'S2' | 'S3',
  is_active: true
})

const errors = ref<Record<string, string[]>>({})

// Fetch Data
const loadData = async () => {
  isLoading.value = true
  try {
    const res = await prodiApi.getProdiAll()
    if (res.success && res.data) {
      prodiList.value = res.data
    }
  } catch (error) {
    toast.add({ title: 'Error', description: 'Gagal memuat data program studi', color: 'error' })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

// Filtered Data
const filteredProdi = computed(() => {
  if (!searchQuery.value) return prodiList.value
  const query = searchQuery.value.toLowerCase()
  return prodiList.value.filter(item => 
    item.nama.toLowerCase().includes(query) || 
    item.kode.toLowerCase().includes(query)
  )
})

// Actions
const openCreateModal = () => {
  modalMode.value = 'create'
  formData.id = 0
  formData.kode = ''
  formData.nama = ''
  formData.jenjang = 'S2'
  formData.is_active = true
  errors.value = {}
  isModalOpen.value = true
}

const openEditModal = (item: Prodi) => {
  modalMode.value = 'edit'
  formData.id = item.id
  formData.kode = item.kode
  formData.nama = item.nama
  formData.jenjang = item.jenjang
  formData.is_active = item.is_active ?? true
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
      kode: formData.kode,
      nama: formData.nama,
      jenjang: formData.jenjang,
      is_active: formData.is_active
    }

    if (modalMode.value === 'create') {
      res = await prodiApi.createProdi(payload)
    } else {
      res = await prodiApi.updateProdi(formData.id, payload)
    }

    if (res.success) {
      toast.add({
        title: 'Berhasil',
        description: `Program study berhasil ${modalMode.value === 'create' ? 'ditambahkan' : 'diupdate'}`,
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

const confirmDelete = (item: Prodi) => {
  itemToDelete.value = item
  deleteConfirmationOpen.value = true
}

const handleDelete = async () => {
  if (!itemToDelete.value) return
  
  try {
    const res = await prodiApi.deleteProdi(itemToDelete.value.id)
    if (res.success) {
      toast.add({
        title: 'Berhasil',
        description: 'Program studi berhasil dihapus',
        color: 'success'
      })
      await loadData()
      deleteConfirmationOpen.value = false
      itemToDelete.value = null
    } else {
      toast.add({
        title: 'Gagal',
        description: res.message || 'Gagal menghapus program studi',
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
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Program Studi</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Kelola data program studi pascasarjana
        </p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="openCreateModal"
          class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2 shadow-sm shadow-primary/30"
        >
          <UIcon name="i-heroicons-plus" class="text-lg" />
          Tambah Prodi
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
             placeholder="Cari program studi..." 
             class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white transition-all"
           />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead class="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th class="px-6 py-4 w-16">Kode</th>
              <th class="px-6 py-4">Nama Program Studi</th>
              <th class="px-6 py-4 w-24">Jenjang</th>
              <th class="px-6 py-4 text-center w-24">Status</th>
              <th class="px-6 py-4 text-center w-32">Pendaftar</th>
              <th class="px-6 py-4 text-right w-32">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <template v-if="isLoading">
              <tr v-for="i in 3" :key="i">
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-12"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-48"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-8"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-16 mx-auto"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-8 mx-auto"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-16 ml-auto"></div></td>
              </tr>
            </template>
            <template v-else-if="filteredProdi.length > 0">
              <tr v-for="item in filteredProdi" :key="item.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">
                  {{ item.kode }}
                </td>
                <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {{ item.nama }}
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {{ item.jenjang }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="flex justify-center">
                    <span 
                      v-if="item.is_active" 
                      class="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      title="Aktif"
                    >
                      <UIcon name="i-heroicons-check" class="text-sm" />
                    </span>
                    <span 
                      v-else 
                      class="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                      title="Non-aktif"
                    >
                      <UIcon name="i-heroicons-minus" class="text-sm" />
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
                 Tidak ada data program studi
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
            {{ modalMode === 'create' ? 'Tambah Program Studi' : 'Edit Program Studi' }}
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <UIcon name="i-heroicons-x-mark" class="text-xl" />
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Kode -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kode Prodi</label>
              <input 
                v-model="formData.kode"
                type="text" 
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white dark:bg-black/20"
                :class="errors.kode ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'"
                placeholder="Contoh: TI, MI"
              />
              <p v-if="errors.kode" class="text-red-500 text-xs mt-1">{{ errors.kode[0] }}</p>
            </div>

            <!-- Nama -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Program Studi</label>
              <input 
                v-model="formData.nama"
                type="text" 
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white dark:bg-black/20"
                :class="errors.nama ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'"
                placeholder="Contoh: Magister Informatika"
              />
              <p v-if="errors.nama" class="text-red-500 text-xs mt-1">{{ errors.nama[0] }}</p>
            </div>

            <!-- Jenjang -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jenjang</label>
              <div class="grid grid-cols-2 gap-3">
                <label 
                  class="cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all"
                  :class="formData.jenjang === 'S2' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                >
                  <input type="radio" v-model="formData.jenjang" value="S2" class="sr-only">
                  <div class="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                    <div v-if="formData.jenjang === 'S2'" class="w-2.5 h-2.5 rounded-full bg-primary"></div>
                  </div>
                  <span class="text-sm font-medium text-slate-900 dark:text-white">S2 (Magister)</span>
                </label>
                <label 
                  class="cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all"
                  :class="formData.jenjang === 'S3' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                >
                  <input type="radio" v-model="formData.jenjang" value="S3" class="sr-only">
                  <div class="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                    <div v-if="formData.jenjang === 'S3'" class="w-2.5 h-2.5 rounded-full bg-primary"></div>
                  </div>
                  <span class="text-sm font-medium text-slate-900 dark:text-white">S3 (Doktor)</span>
                </label>
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-3 pt-2">
               <button 
                 type="button" 
                 role="switch" 
                 :aria-checked="formData.is_active"
                 @click="formData.is_active = !formData.is_active"
                 class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                 :class="formData.is_active ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'"
               >
                 <span 
                   aria-hidden="true" 
                   class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                   :class="formData.is_active ? 'translate-x-5' : 'translate-x-0'"
                 ></span>
               </button>
               <span class="text-sm text-slate-700 dark:text-slate-300">
                 {{ formData.is_active ? 'Aktif (Menerima Pendaftaran)' : 'Non-aktif' }}
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
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus Program Studi?</h3>
        <p class="text-sm text-slate-500 mb-6">
          Anda akan menghapus prodi <strong>{{ itemToDelete?.nama }}</strong>. Tindakan ini tidak dapat dibatalkan.
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
