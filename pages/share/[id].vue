<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div v-if="loading" class="text-center py-8">
        加载中...
      </div>
      
      <div v-else-if="error" class="text-center py-8 text-red-500">
        {{ error }}
      </div>

      <div v-else>
        <div class="mb-6 flex justify-between items-center">
          <h2 class="text-xl font-bold">JSON 预览</h2>
          <div class="text-sm text-gray-500">
            有效期至：{{ expirationDate }}
          </div>
        </div>

        <vue-json-pretty
          :height="600"
          :virtual="true"
          :data="jsonContent"
          :show-length="true"
          :show-line-number="true"
          :collapsed-on-click-brackets="true"
          theme="light"
          class="border rounded p-4 max-h-[600px] overflow-auto"
        />

        <div class="mt-6">
          <button
            @click="downloadJson"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            下载 JSON 文件
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import dayjs from 'dayjs'

const route = useRoute()
const jsonContent = ref<any>(null)
const loading = ref(true)
const error = ref('')
const expirationDate = ref('')

onMounted(async () => {
  try {
    const response = await fetch(`/api/share/${route.params.id}`)
    const data = await response.json()
    
    if (data.success) {
      jsonContent.value = data.content
      expirationDate.value = data.expirationDate ? 
        dayjs(data.expirationDate).format('YYYY-MM-DD HH:mm:ss') :
        '永久有效'
    } else {
      error.value = data.message || '分享内容不存在或已过期'
    }
  } catch (err) {
    error.value = '加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
})

const downloadJson = () => {
  const jsonStr = JSON.stringify(jsonContent.value, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `share-${route.params.id}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script> 