<template>
  <nav class="bg-gray-800 text-white">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <NuxtLink
            to="/"
            class="text-xl font-bold"
          >
            JSON Share
          </NuxtLink>
        </div>

        <div class="flex items-center space-x-4">
          <NuxtLink
            to="/"
            class="hover:text-gray-300"
            :class="{ 'text-blue-400': route.path === '/' }"
          >
            上传
          </NuxtLink>
          <NuxtLink
            to="/my-shares"
            class="hover:text-gray-300"
            :class="{ 'text-blue-400': route.path === '/my-shares' }"
          >
            我的分享
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
</script> 