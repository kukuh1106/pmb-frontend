<template>
  <div class="bg-gray-100 dark:bg-[#0b100e] text-slate-900 dark:text-white font-display overflow-hidden h-[100dvh]">
    <div class="flex h-full w-full p-4 md:gap-4">
      <!-- Sidebar -->
      <aside class="w-64 flex-shrink-0 bg-white dark:bg-[#111816] rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col transition-all duration-300 z-20 hidden md:flex h-full shadow-xl shadow-gray-200/50 dark:shadow-none">
        <!-- Sidebar Header -->
        <div class="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800/50 flex-shrink-0">
          <div class="flex items-center gap-3">
            <img src="~/assets/images/Logo-UIN.webp" alt="Logo UIN" class="h-9 w-auto" />
            <div class="flex flex-col">
              <h1 class="text-slate-900 dark:text-white text-xs font-bold leading-tight tracking-tight">UIN Gusdur</h1>
              <p class="text-slate-500 dark:text-gray-400 text-[10px] font-medium">Admin Panel</p>
            </div>
          </div>
        </div>
        
        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
          <!-- Navigation -->
          <div class="px-4 py-6">
            <nav>
              <ul class="flex flex-col gap-1.5">
                <li>
                  <div class="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 px-2">Main Menu</div>
                </li>
                <li>
                  <NuxtLink to="/admin" class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-200 group font-medium text-sm" active-class="bg-primary/5 text-primary ring-1 ring-primary/10">
                    <UIcon name="i-heroicons-squares-2x2" class="text-lg group-hover:text-primary transition-colors" />
                    <span>Dashboard</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/admin/pendaftar" class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-200 group font-medium text-sm" active-class="bg-primary/5 text-primary ring-1 ring-primary/10">
                    <UIcon name="i-heroicons-user-group" class="text-lg group-hover:text-primary transition-colors" />
                    <span>Data Pendaftar</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/admin/prodi" class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-200 group font-medium text-sm" active-class="bg-primary/5 text-primary ring-1 ring-primary/10">
                    <UIcon name="i-heroicons-book-open" class="text-lg group-hover:text-primary transition-colors" />
                    <span>Program Studi</span>
                  </NuxtLink>
                </li>
                
                <li class="mt-4">
                  <div class="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 px-2">System</div>
                </li>
                <li>
                  <NuxtLink to="/admin/laporan" class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-200 group font-medium text-sm" active-class="bg-primary/5 text-primary ring-1 ring-primary/10">
                    <UIcon name="i-heroicons-document-text" class="text-lg group-hover:text-primary transition-colors" />
                    <span>Laporan</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/admin/settings" class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-200 group font-medium text-sm" active-class="bg-primary/5 text-primary ring-1 ring-primary/10">
                    <UIcon name="i-heroicons-cog-6-tooth" class="text-lg group-hover:text-primary transition-colors" />
                    <span>Pengaturan</span>
                  </NuxtLink>
                </li>
              </ul>
            </nav>
          </div>

        </div>

        <!-- Sidebar Footer (Fixed at bottom) -->
        <div class="p-4 mx-4 mb-4 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-white/5 rounded-xl flex-shrink-0">
          <div class="flex items-center gap-3 mb-4 px-1">
            <div class="relative">
              <div class="w-9 h-9 rounded-full bg-slate-200 bg-center bg-cover ring-2 ring-white dark:ring-gray-800 shadow-sm" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_KB1HjXw2-ufRZd_eg5JswGvEBKe97kl71EbHf68vLx8kpNBPYX9FvsBCWejc4kokk64eJs9EKK2iBiVV711zThWOxGZ8qqrfDrhn2kvQ6AnOkO0ivFMa-2MRTFYd_-GrrjAYuyNENPchFWGBNjeREP1kzJEpNnYIYcp8s8pJ-xz1Y_st47kfgVM6UoOnEXppzDhgA4RUe1n6S6Dxvd2S77D-5vB9-OqzVJmmFOzxy0wrVcz7g4ObxVT8HjfCQ5j4s5DyJLFpSy4");'></div>
              <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-sm font-bold text-slate-900 dark:text-white truncate">Administrator</span>
              <span class="text-[10px] text-slate-500 truncate">admin@uin-gusdur.ac.id</span>
            </div>
          </div>
          <button class="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/10 dark:hover:text-red-400 dark:hover:border-red-900/30 transition-all duration-200 shadow-sm">
            <UIcon name="i-heroicons-arrow-right-start-on-rectangle" class="text-[14px]" />
            Sign Out
          </button>
        </div>
      </aside>

      <!-- Main Content Wrapper -->
      <main class="flex-1 flex flex-col min-w-0 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 md:rounded-xl overflow-hidden relative h-full shadow-sm">
        <!-- Top Header -->
        <header class="h-16 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 px-6 flex items-center justify-between shrink-0 z-10">
          <!-- Mobile Menu Button -->
          <button class="md:hidden p-2 text-slate-600">
             <UIcon name="i-heroicons-bars-3" class="text-2xl" />
          </button>

          <!-- Breadcrumbs & Title Area -->
          <div class="hidden md:flex flex-col gap-1">
            <div class="flex items-center gap-2 text-xs font-medium text-slate-500">
              <NuxtLink to="/admin" class="hover:text-primary">Home</NuxtLink>
              <span>/</span>
              <span class="text-slate-800 dark:text-slate-200">Dashboard</span>
            </div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h2>
          </div>

          <!-- Right Actions -->
          <div class="flex items-center gap-4">
            <div class="hidden md:flex items-center bg-gray-50 dark:bg-white/5 rounded-lg px-3 py-2 w-64 border border-transparent focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
               <UIcon name="i-heroicons-magnifying-glass" class="text-slate-400 text-[20px]" />
              <input class="bg-transparent border-none text-sm ml-2 w-full focus:ring-0 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none" placeholder="Cari data pendaftar..." type="text" />
            </div>
            <button class="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
               <UIcon name="i-heroicons-bell" class="text-xl" />
              <span class="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
          </div>
        </header>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <slot />
          
          <!-- Footer -->
          <footer class="mt-8 mb-6 text-center text-xs text-slate-400">
            © 2026 UIN K.H. Abdurrahman Wahid Pekalongan. Hak Cipta Dilindungi.
          </footer>
        </div>
      </main>
    </div>
  </div>
</template>
