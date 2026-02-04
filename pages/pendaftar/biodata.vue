<script setup lang="ts">
import type { Pendaftar } from '~/types/api'

definePageMeta({ layout: "pendaftar" });

const pendaftarApi = usePendaftarApi()
const toast = useToast()
const router = useRouter()

const isLoading = ref(true)
const isSaving = ref(false)

interface BiodataForm {
  nama_lengkap: string
  tempat_lahir: string
  tanggal_lahir: string
  jenis_kelamin: string
  no_whatsapp: string
  alamat: string
  pendidikan_terakhir: string
  asal_institusi: string
}

const form = reactive<BiodataForm>({
  nama_lengkap: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  jenis_kelamin: "",
  no_whatsapp: "",
  alamat: "",
  pendidikan_terakhir: "",
  asal_institusi: ""
})

// Load current biodata
onMounted(async () => {
  try {
    const response = await pendaftarApi.getBiodata()
    if (response.success && response.data) {
      const data = response.data
      form.nama_lengkap = data.nama_lengkap || ""
      form.tempat_lahir = data.tempat_lahir || ""
      form.tanggal_lahir = data.tanggal_lahir || ""
      form.jenis_kelamin = data.jenis_kelamin || ""
      form.no_whatsapp = data.no_whatsapp || ""
      form.alamat = data.alamat || ""
      form.pendidikan_terakhir = data.pendidikan_terakhir || ""
      form.asal_institusi = data.asal_institusi || ""
    }
  } catch (error) {
    console.error('Failed to load biodata:', error)
  } finally {
    isLoading.value = false
  }
})

async function handleSave() {
  // Validate required fields
  if (!form.nama_lengkap || !form.tanggal_lahir || !form.jenis_kelamin || !form.no_whatsapp) {
    toast.add({
      title: 'Validasi Gagal',
      description: 'Mohon lengkapi semua field yang wajib diisi',
      color: 'error'
    })
    return
  }

  isSaving.value = true

  try {
    const response = await pendaftarApi.updateBiodata({
      nama_lengkap: form.nama_lengkap,
      tempat_lahir: form.tempat_lahir,
      tanggal_lahir: form.tanggal_lahir,
      jenis_kelamin: form.jenis_kelamin as 'L' | 'P',
      no_whatsapp: form.no_whatsapp,
      alamat: form.alamat,
      pendidikan_terakhir: form.pendidikan_terakhir,
      asal_institusi: form.asal_institusi
    })

    if (response.success) {
      toast.add({
        title: 'Berhasil!',
        description: 'Biodata berhasil disimpan',
        color: 'success'
      })
      router.push('/pendaftar/dokumen')
    } else {
      toast.add({
        title: 'Gagal Menyimpan',
        description: response.message || 'Terjadi kesalahan',
        color: 'error'
      })
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Gagal terhubung ke server',
      color: 'error'
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="flex flex-col flex-1 w-full">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[60vh]">
      <div class="flex flex-col items-center gap-4">
        <span class="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
        <p class="text-gray-500">Memuat biodata...</p>
      </div>
    </div>

    <template v-else>
      <!-- Breadcrumbs -->
      <nav class="flex flex-wrap gap-2 px-4 pb-4">
        <NuxtLink to="/pendaftar" class="text-[#61897c] hover:text-primary text-sm font-medium leading-normal transition-colors">Dashboard</NuxtLink>
        <span class="text-[#61897c] text-sm font-medium leading-normal">/</span>
        <span aria-current="page" class="text-current text-sm font-medium leading-normal">Biodata</span>
      </nav>
      
      <!-- Page Heading -->
      <div class="flex flex-wrap justify-between gap-3 px-4 pb-8">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-[#111816] dark:text-white">Biodata Pendaftar</h1>
          <div class="flex items-center gap-2">
            <span class="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">Step 1</span>
            <p class="text-[#61897c] dark:text-gray-400 text-base font-normal leading-normal">Lengkapi data diri Anda dengan benar.</p>
          </div>
        </div>
      </div>

      <!-- Main Form Card -->
      <main class="bg-white dark:bg-[#111816] rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
        <!-- Section 1: Biodata -->
        <section class="p-6 md:p-8">
          <div class="flex flex-col gap-6">
            <!-- Section Header inside Card -->
            <div class="border-b border-border-light dark:border-border-dark pb-4">
              <h2 class="text-xl font-bold leading-tight flex items-center gap-2 text-[#111816] dark:text-white">
                 <UIcon name="i-heroicons-user" class="text-primary text-2xl" />
                Data Diri
              </h2>
            </div>

            <!-- Form Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-2">
              <!-- Name -->
              <div class="col-span-1 md:col-span-2 space-y-2">
                <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                  Nama Lengkap <span class="text-red-500">*</span>
                </label>
                <input v-model="form.nama_lengkap" class="w-full rounded-lg border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-base placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:bg-[#1e2e28] text-[#111816] dark:text-white" placeholder="Masukkan nama lengkap Anda" type="text" required/>
              </div>
              
              <!-- Place of Birth -->
              <div class="space-y-2">
                <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                  Tempat Lahir
                </label>
                <div class="relative">
                   <UIcon name="i-heroicons-map-pin" class="absolute left-3 top-3.5 text-gray-400 text-[20px]" />
                  <input v-model="form.tempat_lahir" class="w-full rounded-lg border border-border-light dark:border-border-dark bg-transparent pl-10 pr-4 py-3 text-base placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:bg-[#1e2e28] text-[#111816] dark:text-white" placeholder="Kota tempat lahir" type="text"/>
                </div>
              </div>
              
              <!-- Date of Birth -->
              <div class="space-y-2">
                <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                  Tanggal Lahir <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                   <UIcon name="i-heroicons-calendar" class="absolute left-3 top-3.5 text-gray-400 text-[20px]" />
                  <input v-model="form.tanggal_lahir" class="w-full rounded-lg border border-border-light dark:border-border-dark bg-transparent pl-10 pr-4 py-3 text-base placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:bg-[#1e2e28] [color-scheme:light] dark:[color-scheme:dark] text-[#111816] dark:text-white" type="date" required/>
                </div>
              </div>
              
              <!-- Gender -->
              <div class="space-y-2">
                <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                  Jenis Kelamin <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-4 pt-1">
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input v-model="form.jenis_kelamin" value="L" class="w-5 h-5 text-primary border-gray-300 focus:ring-primary focus:ring-2 bg-transparent dark:bg-[#1e2e28] dark:border-border-dark" type="radio"/>
                    <span class="text-sm group-hover:text-primary transition-colors text-[#111816] dark:text-white">Laki-laki</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input v-model="form.jenis_kelamin" value="P" class="w-5 h-5 text-primary border-gray-300 focus:ring-primary focus:ring-2 bg-transparent dark:bg-[#1e2e28] dark:border-border-dark" type="radio"/>
                    <span class="text-sm group-hover:text-primary transition-colors text-[#111816] dark:text-white">Perempuan</span>
                  </label>
                </div>
              </div>
              
              <!-- Phone -->
              <div class="space-y-2">
                <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                  Nomor WhatsApp <span class="text-red-500">*</span>
                </label>
                <input v-model="form.no_whatsapp" class="w-full rounded-lg border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-base placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:bg-[#1e2e28] text-[#111816] dark:text-white" placeholder="081234567890" type="tel" required/>
              </div>
              
              <!-- Address -->
              <div class="col-span-1 md:col-span-2 space-y-2">
                <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                  Alamat Domisili
                </label>
                <textarea v-model="form.alamat" class="w-full rounded-lg border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-base placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none dark:bg-[#1e2e28] text-[#111816] dark:text-white" placeholder="Alamat lengkap..." rows="3"></textarea>
              </div>
            </div>
          </div>
        </section>

        <!-- Divider -->
        <hr class="border-t border-border-light dark:border-border-dark mx-8"/>

        <!-- Section 2: Education -->
        <section class="p-6 md:p-8">
          <div class="flex flex-col gap-6">
            <!-- Section Header -->
            <div class="border-b border-border-light dark:border-border-dark pb-4">
              <h2 class="text-xl font-bold leading-tight flex items-center gap-2 text-[#111816] dark:text-white">
                 <UIcon name="i-heroicons-academic-cap" class="text-primary text-2xl" />
                Riwayat Pendidikan
              </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Last Education -->
              <div class="space-y-2">
                <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                  Pendidikan Terakhir
                </label>
                <input v-model="form.pendidikan_terakhir" class="w-full rounded-lg border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-base placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:bg-[#1e2e28] text-[#111816] dark:text-white" placeholder="S1 Teknik Informatika" type="text"/>
              </div>
              
              <!-- Institution -->
              <div class="space-y-2">
                <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                  Asal Institusi
                </label>
                <input v-model="form.asal_institusi" class="w-full rounded-lg border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-base placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:bg-[#1e2e28] text-[#111816] dark:text-white" placeholder="Universitas Indonesia" type="text"/>
              </div>
            </div>
          </div>
        </section>

        <!-- Footer Actions -->
        <div class="bg-gray-50 dark:bg-[#1e2e28] p-6 md:p-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 border-t border-border-light dark:border-border-dark">
          <NuxtLink to="/pendaftar" class="w-full sm:w-auto px-6 py-3 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-[#111816] dark:hover:text-white transition-colors text-center">Kembali</NuxtLink>
          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button 
              @click="handleSave" 
              :disabled="isSaving"
              class="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSaving" class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              <UIcon v-else name="i-heroicons-check" class="text-[18px]" />
              <span>{{ isSaving ? 'Menyimpan...' : 'Simpan & Lanjutkan' }}</span>
            </button>
          </div>
        </div>
      </main>
      
      <!-- Helper Footer -->
      <div class="mt-8 text-center text-sm text-[#61897c]">
        <p>Butuh bantuan? <a class="font-medium underline hover:text-primary" href="#">Hubungi Admissions Support</a></p>
      </div>
    </template>
  </div>
</template>
