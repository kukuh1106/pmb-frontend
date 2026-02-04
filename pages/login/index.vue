<script setup lang="ts">
definePageMeta({ layout: false });

const form = reactive({
  nomor_pendaftaran: "",
  kode_akses: "",
});

const showPassword = ref(false);

function handleLogin() {
  console.log("Login", form);
  // Navigate to /pendaftar
  useRouter().push('/pendaftar');
}
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white min-h-screen flex flex-col justify-center items-center p-4">
    <!-- Centered Card Container -->
    <div class="w-full max-w-[480px] flex flex-col bg-white dark:bg-[#182822] rounded-xl shadow-lg overflow-hidden border border-[#e8f0ed] dark:border-[#2a3e35]">
      <!-- Header Image / Banner -->
      <div class="w-full h-32 bg-center bg-cover relative" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCXEmzRZix0mebfLaDiSpj-N1NZhrcvnbxpkQpZEAluJleuU4mEzBcn5ucLEl0d1oTOE4wBxiBcZ67HiPwLCNa6Jr27b9C8CzYI-leoUspKYc9CsyeEdxiK8raCIbI_YIFgz6d7Tk0az_Ulwz5Tx5zxYC82sbNEj_Xrz_CPTka-XPDVSPmCBnLbep0e2RyEeDM-iDDtdIkINv8wy5yXDQ083zCXZ-XZEzNyyjxPtOwmXkfMmc-VLb2ZcWhh7JwtO1McwDoWIQ3TWms");'>
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6"></div>
      </div>

      <!-- Card Content -->
      <div class="p-6 sm:p-8 flex flex-col gap-6">
        <!-- Headings -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-3 mb-4">
            <img src="~/assets/images/Logo-UIN.webp" alt="Logo UIN" class="h-10 w-auto" />
            <div class="flex flex-col">
              <span class="text-xs font-bold tracking-tight text-[#111816] dark:text-white uppercase leading-tight">UIN K.H. Abdurrahman Wahid</span>
            </div>
          </div>
          <p class="text-primary text-sm font-bold tracking-wide uppercase">Sistem Penerimaan</p>
          <h1 class="text-[#111816] dark:text-white text-[32px] font-bold leading-tight">Masuk Pendaftar</h1>
          <p class="text-[#61897c] dark:text-gray-400 text-sm font-normal leading-normal">Masukkan kredensial Anda untuk mengakses portal pascasarjana.</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
          <!-- Field: Nomor Pendaftaran -->
          <label class="flex flex-col flex-1">
            <p class="text-[#111816] dark:text-gray-200 text-base font-medium leading-normal pb-2">Nomor Pendaftaran</p>
            <input 
              v-model="form.nomor_pendaftaran"
              class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111816] dark:text-white dark:bg-[#23342f] focus:outline-0 focus:ring-1 focus:ring-primary border border-[#dbe6e2] dark:border-[#2a3e35] bg-white focus:border-primary h-14 placeholder:text-[#61897c] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal transition-all" 
              placeholder="e.g., 2023-PG-1029" 
            />
          </label>

          <!-- Field: Kode Akses -->
          <label class="flex flex-col flex-1">
            <div class="flex justify-between items-center pb-2">
              <p class="text-[#111816] dark:text-gray-200 text-base font-medium leading-normal">Kode Akses</p>
            </div>
            <div class="flex w-full flex-1 items-stretch rounded-lg relative">
              <input 
                v-model="form.kode_akses"
                :type="showPassword ? 'text' : 'password'"
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111816] dark:text-white dark:bg-[#23342f] focus:outline-0 focus:ring-1 focus:ring-primary border border-[#dbe6e2] dark:border-[#2a3e35] bg-white focus:border-primary h-14 placeholder:text-[#61897c] dark:placeholder:text-gray-500 p-[15px] pr-12 text-base font-normal leading-normal transition-all" 
                placeholder="••••••••" 
              />
              <div class="absolute right-0 top-0 h-full flex items-center pr-4 z-10">
                <button type="button" @click="showPassword = !showPassword" class="text-[#61897c] hover:text-primary dark:text-gray-400 dark:hover:text-primary flex items-center justify-center transition-colors focus:outline-none">
                  <span class="material-symbols-outlined" style="font-size: 24px;">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>
          </label>

          <!-- Submit Button -->
          <button type="submit" class="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-[#0e9f6e] text-[#111816] dark:text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors shadow-sm mt-2">
            <span class="truncate text-white">Masuk</span>
          </button>
        </form>

        <!-- Footer Links -->
        <div class="flex flex-col items-center gap-4 pt-2">
          <p class="text-[#61897c] dark:text-gray-400 text-sm font-medium">
            Belum punya akun? <NuxtLink to="/register" class="text-primary hover:underline font-bold ml-1">Daftar</NuxtLink>
          </p>
          <div class="w-full border-t border-[#dbe6e2] dark:border-[#2a3e35]"></div>
          <NuxtLink to="/login/admin" class="flex items-center gap-2 text-sm font-medium text-[#61897c] hover:text-[#111816] dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
            <span class="material-symbols-outlined text-lg">admin_panel_settings</span>
            <span>Masuk Staf/Admin</span>
          </NuxtLink>
        </div>
      </div>
    </div>
    <!-- Footer Copyright -->
    <div class="mt-8 text-center">
      <p class="text-[#61897c]/60 text-xs">© 2026 Sistem Penerimaan Pascasarjana. Hak Cipta Dilindungi.</p>
    </div>
  </div>
</template>
