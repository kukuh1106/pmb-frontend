<script setup lang="ts">
import type { User, Prodi } from '~/types/api'

definePageMeta({
  layout: 'admin'
})

const adminApi = useAdminApi()
const prodiApi = useProdiApi()
const toast = useToast()

const isLoading = ref(true)
const userList = ref<User[]>([])
const prodiList = ref<Prodi[]>([])
const searchQuery = ref('')
const roleFilter = ref<string>('')

// Modal State
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSubmitting = ref(false)
const deleteConfirmationOpen = ref(false)
const itemToDelete = ref<User | null>(null)

// Form Data
const formData = reactive({
  id: 0,
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'admin' as 'admin' | 'prodi',
  prodi_id: 0,
  is_active: true
})

const errors = ref<Record<string, string[]>>({})

// Load Master Data (Prodi)
const loadMasterData = async () => {
  try {
    const res = await prodiApi.getProdiAll()
    if (res.success && res.data) {
      prodiList.value = res.data
    }
  } catch (error) {
    console.error('Failed to load prodi:', error)
  }
}

// Fetch Users
const loadData = async () => {
  isLoading.value = true
  try {
    const res = await adminApi.getUserList(roleFilter.value || undefined)
    if (res.success && res.data) {
      userList.value = res.data
    }
  } catch (error) {
    toast.add({ title: 'Error', description: 'Gagal memuat data user', color: 'error' })
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadMasterData()
  await loadData()
})

// Filtered Data
const filteredUsers = computed(() => {
  let result = userList.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.username.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query)
    )
  }

  return result
})

// Watch Filters
watch(roleFilter, () => {
  loadData()
})

// Actions
const openCreateModal = () => {
  modalMode.value = 'create'
  formData.id = 0
  formData.name = ''
  formData.username = ''
  formData.email = ''
  formData.password = ''
  formData.role = 'admin'
  formData.prodi_id = 0
  formData.is_active = true
  errors.value = {}
  isModalOpen.value = true
}

const openEditModal = (item: User) => {
  modalMode.value = 'edit'
  formData.id = item.id
  formData.name = item.name
  formData.username = item.username
  formData.email = item.email
  formData.password = '' // Don't fill password on edit
  formData.role = item.role
  formData.prodi_id = item.prodi_id || 0
  formData.is_active = true // Assuming active if loaded
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
    const payload: any = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      role: formData.role,
      is_active: formData.is_active
    }

    if (formData.password) {
      payload.password = formData.password
    }

    if (formData.role === 'prodi') {
      payload.prodi_id = formData.prodi_id
    } else {
      payload.prodi_id = null
    }

    if (modalMode.value === 'create') {
      res = await adminApi.createUser(payload)
    } else {
      res = await adminApi.updateUser(formData.id, payload)
    }

    if (res.success) {
      toast.add({
        title: 'Berhasil',
        description: `User berhasil ${modalMode.value === 'create' ? 'ditambahkan' : 'diupdate'}`,
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

const confirmDelete = (item: User) => {
  itemToDelete.value = item
  deleteConfirmationOpen.value = true
}

const handleDelete = async () => {
  if (!itemToDelete.value) return
  
  try {
    const res = await adminApi.deleteUser(itemToDelete.value.id)
    if (res.success) {
      toast.add({
        title: 'Berhasil',
        description: 'User berhasil dihapus',
        color: 'success'
      })
      await loadData()
      deleteConfirmationOpen.value = false
      itemToDelete.value = null
    } else {
      toast.add({
        title: 'Gagal',
        description: res.message || 'Gagal menghapus user',
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
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Manajemen User</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Kelola akun administrator dan staf prodi
        </p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="openCreateModal"
          class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2 shadow-sm shadow-primary/30"
        >
          <UIcon name="i-heroicons-plus" class="text-lg" />
          Tambah User
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
      
      <!-- Toolbar -->
      <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4">
        <div class="relative flex-1 max-w-md">
           <UIcon name="i-heroicons-magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
           <input 
             v-model="searchQuery"
             type="text" 
             placeholder="Cari user..." 
             class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white transition-all"
           />
        </div>
        <select 
          v-model="roleFilter"
          class="px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-700 dark:text-slate-200 min-w-[150px]"
        >
          <option value="">Semua Role</option>
          <option value="admin">Administrator</option>
          <option value="prodi">Staf Prodi</option>
        </select>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead class="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th class="px-6 py-4">Nama User</th>
              <th class="px-6 py-4">Username / Email</th>
              <th class="px-6 py-4">Role</th>
              <th class="px-6 py-4">Prodi (Jika ada)</th>
              <th class="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <template v-if="isLoading">
              <tr v-for="i in 3" :key="i">
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-32"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-48"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-24"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-32"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-16 ml-auto"></div></td>
              </tr>
            </template>
            <template v-else-if="filteredUsers.length > 0">
              <tr v-for="item in filteredUsers" :key="item.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {{ item.name }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-mono text-slate-900 dark:text-white">{{ item.username }}</span>
                    <span class="text-xs text-slate-500">{{ item.email }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span 
                    class="px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                    :class="item.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'"
                  >
                    {{ item.role === 'prodi' ? 'Staf Prodi' : 'Administrator' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span v-if="item.prodi" class="text-slate-900 dark:text-white">
                    {{ item.prodi.nama }} <span class="text-slate-400 text-xs">({{ item.prodi.jenjang }})</span>
                  </span>
                  <span v-else class="text-slate-400">-</span>
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
               <td colspan="5" class="px-6 py-12 text-center text-slate-400">
                 Tidak ada data user
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
            {{ modalMode === 'create' ? 'Tambah User' : 'Edit User' }}
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <UIcon name="i-heroicons-x-mark" class="text-xl" />
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Nama -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
              <input 
                v-model="formData.name"
                type="text" 
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white dark:bg-black/20"
                :class="errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'"
              />
              <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name[0] }}</p>
            </div>

            <!-- Username -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
              <input 
                v-model="formData.username"
                type="text" 
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white dark:bg-black/20"
                :class="errors.username ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'"
              />
              <p v-if="errors.username" class="text-red-500 text-xs mt-1">{{ errors.username[0] }}</p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input 
                v-model="formData.email"
                type="email" 
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white dark:bg-black/20"
                :class="errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'"
              />
              <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email[0] }}</p>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password {{ modalMode === 'edit' ? '(Kosongkan jika tidak diubah)' : '' }}
              </label>
              <input 
                v-model="formData.password"
                type="password" 
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white dark:bg-black/20"
                :class="errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'"
              />
              <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password[0] }}</p>
            </div>

            <!-- Role -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
              <select 
                v-model="formData.role"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white dark:bg-black/20"
                :class="errors.role ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'"
              >
                <option value="admin">Administrator</option>
                <option value="prodi">Staf Prodi</option>
              </select>
              <p v-if="errors.role" class="text-red-500 text-xs mt-1">{{ errors.role[0] }}</p>
            </div>

            <!-- Prodi Selection (Only for Staf Prodi) -->
            <div v-if="formData.role === 'prodi'">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Program Studi</label>
              <select 
                v-model="formData.prodi_id"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white dark:bg-black/20"
                :class="errors.prodi_id ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'"
              >
                <option value="0" disabled>Pilih Program Studi</option>
                <option v-for="p in prodiList" :key="p.id" :value="p.id">
                  {{ p.nama }} ({{ p.jenjang }})
                </option>
              </select>
              <p v-if="errors.prodi_id" class="text-red-500 text-xs mt-1">{{ errors.prodi_id[0] }}</p>
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
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus User?</h3>
        <p class="text-sm text-slate-500 mb-6">
          Anda akan menghapus user <strong>{{ itemToDelete?.name }}</strong>. Tindakan ini tidak dapat dibatalkan.
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
