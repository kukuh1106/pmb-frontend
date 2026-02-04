<template>
  <div class="bg-background-light dark:bg-background-dark text-slate-800 dark:text-white font-display min-h-screen flex flex-col antialiased selection:bg-primary/30 selection:text-primary-dark">
    <!-- Navbar -->
    <header class="w-full bg-white dark:bg-[#1A2C26] border-b border-gray-100 dark:border-white/5 px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-50">
      <div class="flex items-center gap-3">
        <div class="size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg">
          <UIcon name="i-heroicons-academic-cap" class="text-[24px]" />
        </div>
        <div>
          <h1 class="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase leading-none">University Name</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Postgraduate Admission Portal</p>
        </div>
      </div>
      
      <nav class="hidden md:flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        <NuxtLink to="#" class="hover:text-primary transition-colors">Programs</NuxtLink>
        <NuxtLink to="#" class="hover:text-primary transition-colors">Tuition</NuxtLink>
        <NuxtLink to="#" class="hover:text-primary transition-colors">Help Center</NuxtLink>
      </nav>

      <div class="flex items-center gap-4">
        <NuxtLink to="/login" class="hidden md:flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors">
          <span>Login</span>
          <UIcon name="i-heroicons-arrow-right-on-rectangle" class="text-[20px]" />
        </NuxtLink>
        <button class="md:hidden text-slate-700 dark:text-white">
          <UIcon name="i-heroicons-bars-3" class="text-2xl" />
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="py-6 border-t border-slate-100 dark:border-white/5 text-center text-slate-400 text-xs">
      <p>© 2024 University Name. All rights reserved.</p>
    </footer>
  </div>
</template>
