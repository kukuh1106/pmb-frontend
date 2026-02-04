<script setup lang="ts">
import type { JadwalUjian } from '~/types/api'

definePageMeta({ layout: "pendaftar" });

const pendaftarApi = usePendaftarApi()
const toast = useToast()
const router = useRouter()

const isLoading = ref(true)
const isSubmitting = ref(false)
const jadwalList = ref<JadwalUjian[]>([])
const selectedJadwal = ref<number | null>(null)
const currentJadwal = ref<JadwalUjian | null>(null)

// Fetch jadwal list
onMounted(async () => {
  try {
    // Get user's current jadwal if any
    const biodataRes = await pendaftarApi.getBiodata()
    if (biodataRes.success && biodataRes.data?.jadwal_ujian_id) {
      currentJadwal.value = biodataRes.data.jadwal_ujian || null
      selectedJadwal.value = biodataRes.data.jadwal_ujian_id
    }

    // Get available jadwal
    const response = await pendaftarApi.getJadwalList()
    if (response.success && response.data) {
      jadwalList.value = response.data
    }
  } catch (error) {
    console.error('Failed to load jadwal:', error)
  } finally {
    isLoading.value = false
  }
})

// Format date
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Handle jadwal selection
async function handleSubmit() {
  if (!selectedJadwal.value) {
    toast.add({
      title: 'Pilih Jadwal',
      description: 'Mohon pilih salah satu jadwal ujian',
      color: 'error'
    })
    return
  }

  isSubmitting.value = true

  try {
    const response = await pendaftarApi.pilihJadwal(selectedJadwal.value)

    if (response.success) {
      toast.add({
        title: 'Berhasil!',
        description: 'Jadwal ujian berhasil dipilih',
        color: 'success'
      })
      router.push('/pendaftar')
    } else {
      toast.add({
        title: 'Gagal',
        description: response.message || 'Gagal memilih jadwal',
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
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col flex-1 w-full gap-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[40vh]">
      <div class="flex flex-col items-center gap-4">
        <span class="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
        <p class="text-gray-500">Memuat jadwal ujian...</p>
      </div>
    </div>

    <template v-else>
      <!-- Breadcrumbs -->
      <div class="flex flex-wrap gap-2 px-4">
        <NuxtLink to="/pendaftar" class="text-primary hover:text-primary/80 text-sm font-medium leading-normal transition-colors">Dashboard</NuxtLink>
        <span class="text-gray-400 text-sm font-medium leading-normal">/</span>
        <span class="text-gray-600 dark:text-gray-300 text-sm font-medium leading-normal">Jadwal Ujian</span>
      </div>

      <!-- Page Heading -->
      <div class="flex flex-col gap-2 px-4">
        <h1 class="text-[#111813] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Pilih Jadwal Ujian</h1>
        <p class="text-gray-500 dark:text-gray-400 text-base font-normal leading-relaxed max-w-2xl">
          Pilih jadwal ujian yang tersedia. Pastikan Anda memilih jadwal yang sesuai dengan waktu Anda.
        </p>
      </div>

      <!-- Current Selection Info -->
      <div v-if="currentJadwal" class="px-4">
        <div class="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
          <div class="p-2 bg-primary/10 rounded-lg text-primary">
            <UIcon name="i-heroicons-check-circle" class="text-xl" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-900 dark:text-white">Jadwal Anda Saat Ini</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatDate(currentJadwal.tanggal) }} • {{ currentJadwal.sesi?.nama }} ({{ currentJadwal.sesi?.jam_mulai }} - {{ currentJadwal.sesi?.jam_selesai }})
            </p>
            <p class="text-xs text-gray-500 mt-1">{{ currentJadwal.ruang?.nama }}</p>
          </div>
        </div>
      </div>

      <!-- Jadwal List -->
      <div class="px-4 py-2">
        <div v-if="jadwalList.length === 0" class="text-center py-12">
          <UIcon name="i-heroicons-calendar-days" class="text-6xl text-gray-300 mb-4" />
          <p class="text-gray-500">Tidak ada jadwal ujian yang tersedia saat ini.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="jadwal in jadwalList" 
            :key="jadwal.id"
            @click="jadwal.sisa_kuota && jadwal.sisa_kuota > 0 ? selectedJadwal = jadwal.id : null"
            class="bg-white dark:bg-surface-dark rounded-xl border shadow-sm overflow-hidden transition-all cursor-pointer"
            :class="{
              'border-primary ring-2 ring-primary/20 shadow-md': selectedJadwal === jadwal.id,
              'border-gray-200 dark:border-gray-800 hover:border-primary/50 hover:shadow-md': selectedJadwal !== jadwal.id && jadwal.sisa_kuota && jadwal.sisa_kuota > 0,
              'border-gray-200 dark:border-gray-800 opacity-60 cursor-not-allowed': !jadwal.sisa_kuota || jadwal.sisa_kuota <= 0
            }"
          >
            <div class="p-5">
              <!-- Date Header -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <p class="text-lg font-bold text-slate-900 dark:text-white">
                    {{ formatDate(jadwal.tanggal) }}
                  </p>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ jadwal.sesi?.nama }}
                  </p>
                </div>
                <div v-if="selectedJadwal === jadwal.id" class="p-2 bg-primary/10 rounded-full text-primary">
                  <UIcon name="i-heroicons-check-circle" class="text-xl" />
                </div>
              </div>

              <!-- Time & Room -->
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <UIcon name="i-heroicons-clock" class="text-lg" />
                  <span>{{ jadwal.sesi?.jam_mulai }} - {{ jadwal.sesi?.jam_selesai }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <UIcon name="i-heroicons-map-pin" class="text-lg" />
                  <span>{{ jadwal.ruang?.nama }}</span>
                </div>
              </div>

              <!-- Kuota -->
              <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">Sisa Kuota</span>
                  <span 
                    class="text-sm font-bold"
                    :class="jadwal.sisa_kuota && jadwal.sisa_kuota > 5 ? 'text-green-600' : jadwal.sisa_kuota && jadwal.sisa_kuota > 0 ? 'text-yellow-600' : 'text-red-600'"
                  >
                    {{ jadwal.sisa_kuota || 0 }} / {{ jadwal.kuota }}
                  </span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2 overflow-hidden">
                  <div 
                    class="h-2 rounded-full transition-all"
                    :class="jadwal.sisa_kuota && jadwal.sisa_kuota > 5 ? 'bg-green-500' : jadwal.sisa_kuota && jadwal.sisa_kuota > 0 ? 'bg-yellow-500' : 'bg-red-500'"
                    :style="{ width: ((jadwal.sisa_kuota || 0) / jadwal.kuota * 100) + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Full Label -->
              <div v-if="!jadwal.sisa_kuota || jadwal.sisa_kuota <= 0" class="mt-3">
                <span class="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  <UIcon name="i-heroicons-x-circle" class="text-sm" />
                  Kuota Penuh
                </span>
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
        <button 
          @click="handleSubmit"
          :disabled="!selectedJadwal || isSubmitting"
          :class="[
            'px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2 w-full sm:w-auto transition-colors',
            selectedJadwal ? 'bg-primary text-white hover:bg-primary/90 shadow-md' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          ]"
        >
          <span v-if="isSubmitting" class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
          <span>{{ isSubmitting ? 'Menyimpan...' : 'Konfirmasi Jadwal' }}</span>
           <UIcon v-if="!isSubmitting" name="i-heroicons-check" class="text-lg" />
        </button>
      </div>
    </template>
  </div>
</template>
