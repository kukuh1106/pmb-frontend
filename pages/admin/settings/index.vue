<script setup lang="ts">
import type { SesiUjian, RuangUjian } from '~/types/api'

definePageMeta({
  layout: 'admin'
})

const adminApi = useAdminApi()
const toast = useToast()
const auth = useAuth()
const router = useRouter()

// Tabs configuration
const activeTab = ref<'sesi' | 'ruang'>('sesi')
const tabs = [
  { id: 'sesi', label: 'Sesi Ujian' },
  { id: 'ruang', label: 'Ruang Ujian' }
]

// Data State
const isLoading = ref(true)
const sesiList = ref<SesiUjian[]>([])
const ruangList = ref<RuangUjian[]>([])

// Modal State
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSubmitting = ref(false)
const deleteConfirmationOpen = ref(false)
const itemToDelete = ref<any>(null)

// Generic Form Data
const formData = reactive({
  id: 0,
  // Sesi
  nama: '',
  jam_mulai: '',
  jam_selesai: '',
  // Ruang
  kode: '',
  kapasitas: 0,
  is_active: true
})

const errors = ref<Record<string, string[]>>({})

// Fetch Data
const loadSesi = async () => {
  try {
    const res = await adminApi.getSesiList()
    if (res.success && res.data) {
      sesiList.value = res.data
    }
  } catch (error) {
    toast.add({ title: 'Error', description: 'Gagal memuat sesi ujian', color: 'error' })
  }
}

const loadRuang = async () => {
  try {
    const res = await adminApi.getRuangList()
    if (res.success && res.data) {
      ruangList.value = res.data
    }
  } catch (error) {
    toast.add({ title: 'Error', description: 'Gagal memuat ruang ujian', color: 'error' })
  }
}

const loadData = async () => {
  isLoading.value = true
  await Promise.all([loadSesi(), loadRuang()])
  isLoading.value = false
}

onMounted(() => {
  if (auth.role.value !== 'admin') {
    router.push('/admin')
    return
  }
  loadData()
})

// Actions
const openCreateModal = () => {
  modalMode.value = 'create'
  formData.id = 0
  formData.nama = ''
  formData.jam_mulai = '08:00'
  formData.jam_selesai = '10:00'
  formData.kode = ''
  formData.kapasitas = 20
  formData.is_active = true
  errors.value = {}
  isModalOpen.value = true
}

const openEditModal = (item: any) => {
  modalMode.value = 'edit'
  formData.id = item.id
  formData.nama = item.nama
  formData.is_active = item.is_active || true
  
  if (activeTab.value === 'sesi') {
    formData.jam_mulai = item.jam_mulai ? item.jam_mulai.slice(0, 5) : ''
    formData.jam_selesai = item.jam_selesai ? item.jam_selesai.slice(0, 5) : ''
  } else {
    formData.kode = item.kode
    formData.kapasitas = item.kapasitas
  }
  
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
    
    if (activeTab.value === 'sesi') {
      const payload = {
        nama: formData.nama,
        jam_mulai: formData.jam_mulai,
        jam_selesai: formData.jam_selesai,
        is_active: formData.is_active
      }
      if (modalMode.value === 'create') {
        res = await adminApi.createSesi(payload)
      } else {
        res = await adminApi.updateSesi(formData.id, payload)
      }
    } else {
      const payload = {
        kode: formData.kode,
        nama: formData.nama,
        kapasitas: formData.kapasitas,
        is_active: formData.is_active
      }
      if (modalMode.value === 'create') {
        res = await adminApi.createRuang(payload)
      } else {
        res = await adminApi.updateRuang(formData.id, payload)
      }
    }

    if (res.success) {
      toast.add({
        title: 'Berhasil',
        description: `Data berhasil ${modalMode.value === 'create' ? 'ditambahkan' : 'diupdate'}`,
        color: 'success'
      })
      if (activeTab.value === 'sesi') await loadSesi()
      else await loadRuang()
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

const confirmDelete = (item: any) => {
  itemToDelete.value = item
  deleteConfirmationOpen.value = true
}

const handleDelete = async () => {
  if (!itemToDelete.value) return
  
  try {
    let res
    if (activeTab.value === 'sesi') {
      res = await adminApi.deleteSesi(itemToDelete.value.id)
    } else {
      res = await adminApi.deleteRuang(itemToDelete.value.id)
    }

    if (res.success) {
      toast.add({
        title: 'Berhasil',
        description: 'Data berhasil dihapus',
        color: 'success'
      })
      if (activeTab.value === 'sesi') await loadSesi()
      else await loadRuang()
      deleteConfirmationOpen.value = false
      itemToDelete.value = null
    } else {
      toast.add({
        title: 'Gagal',
        description: res.message || 'Gagal menghapus data',
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
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Pengaturan Sistem</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Kelola data master referensi untuk ujian
        </p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="openCreateModal"
          class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2 shadow-sm shadow-primary/30"
        >
          <UIcon name="i-heroicons-plus" class="text-lg" />
          {{ activeTab === 'sesi' ? 'Tambah Sesi' : 'Tambah Ruang' }}
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200 dark:border-gray-800">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id as any"
        class="px-6 py-3 text-sm font-medium transition-colors relative"
        :class="activeTab === tab.id ? 'text-primary' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'"
      >
        {{ tab.label }}
        <div 
          v-if="activeTab === tab.id"
          class="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"
        ></div>
      </button>
    </div>

    <!-- Content -->
    <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
      
      <!-- Table: Sesi Ujian -->
      <div v-if="activeTab === 'sesi'" class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead class="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th class="px-6 py-4">Nama Sesi</th>
              <th class="px-6 py-4">Jam Mulai</th>
              <th class="px-6 py-4">Jam Selesai</th>
              <th class="px-6 py-4 text-center">Status</th>
              <th class="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <template v-if="isLoading">
               <tr v-for="i in 3" :key="i">
                 <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-32"></div></td>
                 <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-16"></div></td>
                 <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-16"></div></td>
                 <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-16 mx-auto"></div></td>
                 <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-16 ml-auto"></div></td>
               </tr>
            </template>
            <template v-else-if="sesiList.length > 0">
              <tr v-for="item in sesiList" :key="item.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">{{ item.nama }}</td>
                <td class="px-6 py-4 font-mono">{{ item.jam_mulai?.slice(0, 5) }}</td>
                <td class="px-6 py-4 font-mono">{{ item.jam_selesai?.slice(0, 5) }}</td>
                <td class="px-6 py-4 text-center">
                  <span v-if="item.is_active" class="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Aktif</span>
                  <span v-else class="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-500">Non-aktif</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openEditModal(item)" class="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"><UIcon name="i-heroicons-pencil-square" class="text-lg" /></button>
                    <button @click="confirmDelete(item)" class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><UIcon name="i-heroicons-trash" class="text-lg" /></button>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else>
               <td colspan="5" class="px-6 py-12 text-center text-slate-400">Tidak ada data sesi ujian</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table: Ruang Ujian -->
      <div v-if="activeTab === 'ruang'" class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead class="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th class="px-6 py-4">Kode Ruang</th>
              <th class="px-6 py-4">Nama Ruang</th>
              <th class="px-6 py-4 text-center">Kapasitas</th>
              <th class="px-6 py-4 text-center">Status</th>
              <th class="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <template v-if="isLoading">
               <tr v-for="i in 3" :key="i">
                 <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-16"></div></td>
                 <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-48"></div></td>
                 <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-12 mx-auto"></div></td>
                 <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-16 mx-auto"></div></td>
                 <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-16 ml-auto"></div></td>
               </tr>
            </template>
            <template v-else-if="ruangList.length > 0">
              <tr v-for="item in ruangList" :key="item.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">{{ item.kode }}</td>
                <td class="px-6 py-4 font-medium">{{ item.nama }}</td>
                <td class="px-6 py-4 text-center font-bold">{{ item.kapasitas }}</td>
                <td class="px-6 py-4 text-center">
                  <span v-if="item.is_active" class="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Aktif</span>
                  <span v-else class="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-500">Non-aktif</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openEditModal(item)" class="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"><UIcon name="i-heroicons-pencil-square" class="text-lg" /></button>
                    <button @click="confirmDelete(item)" class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><UIcon name="i-heroicons-trash" class="text-lg" /></button>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else>
               <td colspan="5" class="px-6 py-12 text-center text-slate-400">Tidak ada data ruang ujian</td>
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
            {{ modalMode === 'create' ? 'Tambah' : 'Edit' }} {{ activeTab === 'sesi' ? 'Sesi Ujian' : 'Ruang Ujian' }}
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <UIcon name="i-heroicons-x-mark" class="text-xl" />
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            
            <!-- Sesi Fields -->
            <template v-if="activeTab === 'sesi'">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Sesi</label>
                <input 
                  v-model="formData.nama"
                  type="text" 
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white dark:bg-black/20"
                  :class="errors.nama ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'"
                  placeholder="Contoh: Sesi 1 (Pagi)"
                />
                <p v-if="errors.nama" class="text-red-500 text-xs mt-1">{{ errors.nama[0] }}</p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jam Mulai</label>
                  <input type="time" v-model="formData.jam_mulai" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-black/20 bg-slate-50" />
                  <p v-if="errors.jam_mulai" class="text-red-500 text-xs mt-1">{{ errors.jam_mulai[0] }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jam Selesai</label>
                  <input type="time" v-model="formData.jam_selesai" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-black/20 bg-slate-50" />
                  <p v-if="errors.jam_selesai" class="text-red-500 text-xs mt-1">{{ errors.jam_selesai[0] }}</p>
                </div>
              </div>
            </template>

            <!-- Ruang Fields -->
            <template v-else>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kode Ruang</label>
                <input 
                  v-model="formData.kode"
                  type="text" 
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white dark:bg-black/20"
                  :class="errors.kode ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'"
                  placeholder="Contoh: R-101"
                />
                <p v-if="errors.kode" class="text-red-500 text-xs mt-1">{{ errors.kode[0] }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Ruang</label>
                <input 
                  v-model="formData.nama"
                  type="text" 
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white dark:bg-black/20"
                  :class="errors.nama ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'"
                  placeholder="Contoh: Lab Komputer 1"
                />
                <p v-if="errors.nama" class="text-red-500 text-xs mt-1">{{ errors.nama[0] }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kapasitas</label>
                <input 
                  v-model.number="formData.kapasitas"
                  type="number" 
                  min="1"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white dark:bg-black/20"
                  :class="errors.kapasitas ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'"
                />
                <p v-if="errors.kapasitas" class="text-red-500 text-xs mt-1">{{ errors.kapasitas[0] }}</p>
              </div>
            </template>

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
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus Data?</h3>
        <p class="text-sm text-slate-500 mb-6">
          Anda akan menghapus data ini. Tindakan ini tidak dapat dibatalkan.
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
