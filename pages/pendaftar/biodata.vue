<script setup lang="ts">
definePageMeta({ layout: "pendaftar" });

interface EducationItem {
  degree: string;
  university: string;
  major: string;
  gpa: string; // keeping as string for input flexibility, could be number
  year: string;
}

interface BiodataForm {
  fullName: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  phone: string;
  address: string;
  education: EducationItem[];
}

const form = reactive<BiodataForm>({
  fullName: "",
  birthPlace: "",
  birthDate: "",
  gender: "",
  phone: "",
  address: "",
  education: [
    { degree: "", university: "", major: "", gpa: "", year: "" }
  ]
});

function addEducation() {
  form.education.push({ degree: "", university: "", major: "", gpa: "", year: "" });
}

function removeEducation(index: number) {
  form.education.splice(index, 1);
}

function handleSave() {
  console.log("Saving Biodata", form);
  navigateTo('/pendaftar/dokumen');
}
</script>

<template>
  <div class="flex flex-col flex-1 w-full">
    <!-- Breadcrumbs -->
    <nav class="flex flex-wrap gap-2 px-4 pb-4">
      <NuxtLink to="/pendaftar" class="text-[#61897c] hover:text-primary text-sm font-medium leading-normal transition-colors">Postgraduate Admission</NuxtLink>
      <span class="text-[#61897c] text-sm font-medium leading-normal">/</span>
      <span class="text-[#61897c] text-sm font-medium leading-normal">Application Form</span>
      <span class="text-[#61897c] text-sm font-medium leading-normal">/</span>
      <span aria-current="page" class="text-current text-sm font-medium leading-normal">Step 2</span>
    </nav>
    
    <!-- Page Heading -->
    <div class="flex flex-wrap justify-between gap-3 px-4 pb-8">
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-[#111816] dark:text-white">Biodata & Riwayat Pendidikan</h1>
        <div class="flex items-center gap-2">
          <span class="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">Step 2 of 5</span>
          <p class="text-[#61897c] dark:text-gray-400 text-base font-normal leading-normal">Please fill in your personal details accurately.</p>
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
              Biodata Diri (Personal Data)
            </h2>
          </div>

          <!-- Profile Picture Upload -->
          <div class="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-background-light dark:bg-background-dark/30 p-4 rounded-lg border border-border-light dark:border-border-dark border-dashed">
            <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 border-4 border-white dark:border-[#111816] shadow-sm flex-shrink-0" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBuVBb3_rmBTIn9FT_9GJdB95BFL_H9iPJSRmFOqJiCkU1Cxt2dhhVuqbVOH4qb6vn0ixZHdBIK8AtcCmUTG7CUxjV0k-HKP5f-e8vNGDZcD6Punt3PEqj1-Qyb0EWZQFgA4IRFfhX0Iu0O1FnaDF0Rhnn2_QWbxB908J2ORiqhwbdKZHKu2hB6cch2iwD2RBBZ41DY959lbsTgCZaZJq8tq8cUh9Dqi6w6XmnHs8KDvJETdu_UH603yBypv1AWI211VCC0p0cgj8k");'></div>
            <div class="flex flex-col justify-center gap-1 flex-1">
              <p class="text-base font-bold leading-tight text-[#111816] dark:text-white">Profile Picture</p>
              <p class="text-[#61897c] dark:text-gray-400 text-sm font-normal">Min. 400x400px, PNG or JPG.</p>
            </div>
            <div class="flex gap-3 w-full sm:w-auto">
              <button class="flex-1 sm:flex-none cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-white dark:bg-[#1e2e28] border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-[#2a3f36] text-sm font-bold transition-colors text-[#111816] dark:text-white" type="button">Delete</button>
              <button class="flex-1 sm:flex-none cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white hover:bg-primary-dark text-sm font-bold shadow-sm shadow-primary/30 transition-colors" type="button">Upload New</button>
            </div>
          </div>

          <!-- Form Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-2">
            <!-- Name -->
            <div class="col-span-1 md:col-span-2 space-y-2">
              <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                Nama Lengkap (Full Name) <span class="text-red-500">*</span>
              </label>
              <input v-model="form.fullName" class="w-full rounded-lg border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-base placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:bg-[#1e2e28] text-[#111816] dark:text-white" placeholder="e.g. Sarah Kusuma" type="text"/>
            </div>
            <!-- Place of Birth -->
            <div class="space-y-2">
              <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                Tempat Lahir (Place of Birth) <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                 <UIcon name="i-heroicons-map-pin" class="absolute left-3 top-3.5 text-gray-400 text-[20px]" />
                <input v-model="form.birthPlace" class="w-full rounded-lg border border-border-light dark:border-border-dark bg-transparent pl-10 pr-4 py-3 text-base placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:bg-[#1e2e28] text-[#111816] dark:text-white" placeholder="City Name" type="text"/>
              </div>
            </div>
            <!-- Date of Birth -->
            <div class="space-y-2">
              <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                Tanggal Lahir (Date of Birth) <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                 <UIcon name="i-heroicons-calendar" class="absolute left-3 top-3.5 text-gray-400 text-[20px]" />
                <input v-model="form.birthDate" class="w-full rounded-lg border border-border-light dark:border-border-dark bg-transparent pl-10 pr-4 py-3 text-base placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:bg-[#1e2e28] [color-scheme:light] dark:[color-scheme:dark] text-[#111816] dark:text-white" type="date"/>
              </div>
            </div>
            <!-- Gender -->
            <div class="space-y-2">
              <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                Jenis Kelamin (Gender) <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-4 pt-1">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input v-model="form.gender" value="male" class="w-5 h-5 text-primary border-gray-300 focus:ring-primary focus:ring-2 bg-transparent dark:bg-[#1e2e28] dark:border-border-dark" type="radio"/>
                  <span class="text-sm group-hover:text-primary transition-colors text-[#111816] dark:text-white">Male</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input v-model="form.gender" value="female" class="w-5 h-5 text-primary border-gray-300 focus:ring-primary focus:ring-2 bg-transparent dark:bg-[#1e2e28] dark:border-border-dark" type="radio"/>
                  <span class="text-sm group-hover:text-primary transition-colors text-[#111816] dark:text-white">Female</span>
                </label>
              </div>
            </div>
            <!-- Phone -->
            <div class="space-y-2">
              <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                Nomor Telepon (Phone Number) <span class="text-red-500">*</span>
              </label>
              <input v-model="form.phone" class="w-full rounded-lg border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-base placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:bg-[#1e2e28] text-[#111816] dark:text-white" placeholder="+62" type="tel"/>
            </div>
            <!-- Address -->
            <div class="col-span-1 md:col-span-2 space-y-2">
              <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                Alamat Domisili (Residential Address) <span class="text-red-500">*</span>
              </label>
              <textarea v-model="form.address" class="w-full rounded-lg border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-base placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none dark:bg-[#1e2e28] text-[#111816] dark:text-white" placeholder="Full street address..." rows="3"></textarea>
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
          <div class="border-b border-border-light dark:border-border-dark pb-4 flex justify-between items-end">
            <div>
              <h2 class="text-xl font-bold leading-tight flex items-center gap-2 text-[#111816] dark:text-white">
                 <UIcon name="i-heroicons-academic-cap" class="text-primary text-2xl" />
                Riwayat Pendidikan (Education History)
              </h2>
              <p class="text-sm text-[#61897c] mt-1 ml-8">Please list your most recent degree first.</p>
            </div>
          </div>

          <!-- Education Entries -->
          <div v-for="(edu, index) in form.education" :key="index" class="bg-background-light dark:bg-background-dark/30 rounded-xl p-6 border border-border-light dark:border-border-dark relative group">
            <button @click="removeEducation(index)" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors" title="Remove Entry">
               <UIcon name="i-heroicons-trash" class="text-xl" />
            </button>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Degree -->
              <div class="space-y-2">
                <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                  Jenjang Pendidikan (Degree) <span class="text-red-500">*</span>
                </label>
                <select v-model="edu.degree" class="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-[#1e2e28] px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer text-[#111816] dark:text-white">
                  <option disabled value="">Select Degree</option>
                  <option value="S1">Bachelor (S1)</option>
                  <option value="S2">Master (S2)</option>
                  <option value="S3">Doctoral (S3)</option>
                </select>
              </div>
              <!-- University -->
              <div class="space-y-2">
                <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                  Nama Universitas (University) <span class="text-red-500">*</span>
                </label>
                <input v-model="edu.university" class="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-[#1e2e28] px-4 py-3 text-base placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-[#111816] dark:text-white" placeholder="e.g. Universitas Indonesia" type="text"/>
              </div>
              <!-- Major -->
              <div class="space-y-2">
                <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                  Program Studi (Major) <span class="text-red-500">*</span>
                </label>
                <input v-model="edu.major" class="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-[#1e2e28] px-4 py-3 text-base placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-[#111816] dark:text-white" placeholder="e.g. Computer Science" type="text"/>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <!-- GPA -->
                <div class="space-y-2">
                  <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                    IPK (GPA) <span class="text-red-500">*</span>
                  </label>
                  <input v-model="edu.gpa" class="w-full rounded-lg border border-red-300 dark:border-red-900 bg-white dark:bg-[#1e2e28] px-4 py-3 text-base placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all text-[#111816] dark:text-white" max="4.00" min="0" placeholder="0.00" step="0.01" type="number"/>
                </div>
                <!-- Grad Year -->
                <div class="space-y-2">
                  <label class="text-sm font-medium flex items-center gap-1 text-[#111816] dark:text-white">
                    Tahun Lulus <span class="text-red-500">*</span>
                  </label>
                  <input v-model="edu.year" class="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-[#1e2e28] px-4 py-3 text-base placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-[#111816] dark:text-white" placeholder="YYYY" type="number"/>
                </div>
              </div>
            </div>
          </div>

          <!-- Add More Button -->
          <button @click="addEducation" class="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group" type="button">
             <UIcon name="i-heroicons-plus-circle" class="text-xl group-hover:scale-110 transition-transform" />
            <span class="font-medium">Add Another Degree</span>
          </button>
        </div>
      </section>

      <!-- Footer Actions -->
      <div class="bg-gray-50 dark:bg-[#1e2e28] p-6 md:p-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 border-t border-border-light dark:border-border-dark">
        <button class="w-full sm:w-auto px-6 py-3 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-[#111816] dark:hover:text-white transition-colors">Cancel</button>
        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button class="w-full sm:w-auto px-6 py-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-[#111816] text-[#111816] dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-[#2a3f36] transition-colors shadow-sm">Save Draft</button>
          <button @click="handleSave" class="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2">
             <UIcon name="i-heroicons-check" class="text-[18px]" />
            Save & Continue
          </button>
        </div>
      </div>
    </main>
    
    <!-- Helper Footer -->
    <div class="mt-8 text-center text-sm text-[#61897c]">
      <p>Need help filling out this form? <a class="font-medium underline hover:text-primary" href="#">Contact Admissions Support</a></p>
    </div>
  </div>
</template>
