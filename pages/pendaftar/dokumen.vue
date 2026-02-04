<script setup lang="ts">
definePageMeta({ layout: "pendaftar" });

interface DocumentItem {
  id: number;
  title: string;
  desc: string;
  file: string | null;
  size: string | null;
  status: 'valid' | 'pending' | 'rejected';
  type: 'pdf' | 'image';
}

const documents = reactive<DocumentItem[]>([
  { id: 1, title: 'Transkrip Nilai', desc: 'Official academic transcript (front & back)', file: 'transcript_final_v2.pdf', size: '1.2 MB', status: 'valid', type: 'pdf' },
  { id: 2, title: 'Ijazah S1 (Certificate)', desc: 'Original degree certificate scan', file: null, size: null, status: 'pending', type: 'pdf' },
  { id: 3, title: 'Pas Foto (4x6)', desc: 'Red background, formal attire', file: null, size: null, status: 'pending', type: 'image' },
  { id: 4, title: 'KTP / ID Card', desc: 'Valid identity card scan', file: null, size: null, status: 'pending', type: 'image' },
]);

// Helper to calculate progress
const progress = computed(() => {
  const uploaded = documents.filter((d) => d.status === 'valid').length;
  return Math.round((uploaded / documents.length) * 100);
});
</script>

<template>
  <div class="flex flex-col flex-1 w-full gap-6 transition-colors duration-200">
    <!-- Breadcrumbs -->
    <div class="flex flex-wrap gap-2 px-4">
      <NuxtLink to="/pendaftar" class="text-primary hover:text-primary/80 text-sm font-medium leading-normal transition-colors">Home</NuxtLink>
      <span class="text-gray-400 text-sm font-medium leading-normal">/</span>
      <span class="text-primary hover:text-primary/80 text-sm font-medium leading-normal transition-colors">Application</span>
      <span class="text-gray-400 text-sm font-medium leading-normal">/</span>
      <span class="text-gray-600 dark:text-gray-300 text-sm font-medium leading-normal">Documents</span>
    </div>

    <!-- Page Heading -->
    <div class="flex flex-col gap-2 px-4">
      <h1 class="text-[#111813] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Document Requirements</h1>
      <p class="text-gray-500 dark:text-gray-400 text-base font-normal leading-relaxed max-w-2xl">
        Please upload the required documents in PDF or JPG format. Ensure all text is legible. Maximum file size is 2MB per document.
      </p>
    </div>

    <!-- Progress Bar -->
    <div class="flex flex-col gap-3 px-4">
      <div class="flex justify-between items-center">
        <p class="text-[#111813] dark:text-gray-200 text-sm font-medium leading-normal">{{ documents.filter(d => d.status === 'valid').length }} of {{ documents.length }} documents uploaded</p>
        <span class="text-primary text-sm font-bold">{{ progress }}%</span>
      </div>
      <div class="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div class="h-full bg-primary rounded-full transition-all duration-500 ease-out" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>

    <!-- Document List (Card Stack) -->
    <div class="px-4 py-2">
      <div class="flex flex-col gap-4">
        <!-- Header Row (Hidden on mobile) -->
        <div class="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          <div class="col-span-4">Document Type</div>
          <div class="col-span-5">File Upload</div>
          <div class="col-span-3 text-right">Status & Action</div>
        </div>

        <div v-for="doc in documents" :key="doc.id" class="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-all hover:shadow-md bg-white dark:bg-[#111816]">
          <div class="p-5 md:grid md:grid-cols-12 md:gap-4 md:items-center flex flex-col gap-4">
            
            <!-- Column 1: Info -->
            <div class="col-span-4 flex flex-col gap-1">
              <h3 class="text-[#111813] dark:text-white font-semibold text-base">{{ doc.title }}</h3>
              <p class="text-gray-500 dark:text-gray-400 text-xs">{{ doc.desc }}</p>
            </div>

            <!-- Column 2: File Picker / File Info -->
            <div class="col-span-5">
              <div v-if="doc.file" class="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg group cursor-pointer hover:bg-primary/10 transition-colors">
                <div class="bg-white dark:bg-background-dark p-2 rounded text-primary">
                   <UIcon name="i-heroicons-document-text" class="text-2xl" />
                </div>
                <div class="flex flex-col overflow-hidden">
                  <span class="text-sm font-medium text-[#111813] dark:text-white truncate">{{ doc.file }}</span>
                  <span class="text-xs text-gray-500">{{ doc.size }} • Uploaded just now</span>
                </div>
                <div class="ml-auto">
                  <button class="text-gray-400 hover:text-red-500 transition-colors p-1">
                     <UIcon name="i-heroicons-trash" class="text-lg" />
                  </button>
                </div>
              </div>

              <div v-else>
                <label class="relative flex flex-col items-center justify-center w-full h-14 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group">
                  <div class="flex flex-row items-center gap-3">
                     <UIcon v-if="doc.type === 'image'" name="i-heroicons-photo" class="text-gray-400 group-hover:text-primary transition-colors text-xl" />
                     <UIcon v-else-if="doc.title.includes('ID')" name="i-heroicons-identification" class="text-gray-400 group-hover:text-primary transition-colors text-xl" />
                     <UIcon v-else name="i-heroicons-cloud-arrow-up" class="text-gray-400 group-hover:text-primary transition-colors text-xl" />
                    <p class="text-sm text-gray-500 dark:text-gray-400 font-medium group-hover:text-primary transition-colors">Click or drag to upload</p>
                  </div>
                  <input class="hidden" type="file"/>
                </label>
              </div>
            </div>

            <!-- Column 3: Status & Action -->
            <div class="col-span-3 flex items-center justify-between md:justify-end gap-4">
              <div v-if="doc.status === 'valid'">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                   <UIcon name="i-heroicons-check-circle" class="text-sm font-bold" />
                  Valid
                </span>
              </div>
              <div v-else>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                   <UIcon name="i-heroicons-clock" class="text-sm" />
                  Pending
                </span>
              </div>

              <button v-if="doc.status === 'valid'" class="flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5">
                 <UIcon name="i-heroicons-eye" class="text-lg" />
                <span class="hidden lg:inline">View</span>
              </button>
              <button v-else class="flex items-center gap-1 text-gray-300 dark:text-gray-600 font-medium text-sm cursor-not-allowed px-3 py-1.5 rounded-lg">
                 <UIcon name="i-heroicons-eye-slash" class="text-lg" />
                <span class="hidden lg:inline">View</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- Action Footer -->
    <div class="mt-4 px-4 flex flex-col-reverse sm:flex-row justify-end gap-4 pb-12">
      <button class="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-[#111813] dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full sm:w-auto">
        Save Progress
      </button>
      <button :disabled="progress < 100" :class="[
        'px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2 w-full sm:w-auto transition-colors',
        progress === 100 ? 'bg-primary text-white hover:bg-primary/90 shadow-md' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
      ]">
        <span>Submit Application</span>
         <UIcon name="i-heroicons-lock-closed" class="text-sm" />
      </button>
    </div>
  </div>
</template>
