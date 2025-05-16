<template>
  <div class="min-h-screen bg-gray-100">
    <TheNavigation />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

// 在应用启动时初始化用户 ID
onMounted(() => {
  userStore.initializeUserId()
})
</script>
