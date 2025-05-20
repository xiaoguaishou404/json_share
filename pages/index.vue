<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">JSON Share</h1>
    
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          选择 JSON 文件
        </label>
        <input
          type="file"
          accept=".json"
          @change="handleFileChange"
          class="w-full p-2 border rounded"
        />
      </div>

      <div v-if="jsonContent" class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          预览
        </label>
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
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          有效期
        </label>
        <select
          v-model="expiration"
          class="w-full p-2 border rounded"
        >
          <option value="1">1 天</option>
          <option value="7">7 天</option>
          <option value="-1">永久有效</option>
        </select>
      </div>

      <button
        @click="handleUpload"
        :disabled="!jsonContent"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        生成分享链接
      </button>
    </div>

    <div v-if="shareLink" class="mt-6 bg-green-100 p-4 rounded">
      <p class="font-bold">分享链接已生成：</p>
      <div class="flex items-center mt-2">
        <input
          type="text"
          :value="shareLink"
          readonly
          class="flex-1 p-2 border rounded mr-2"
        />
        <button
          @click="copyLink"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          复制
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import { useUserStore } from '~/stores/user'

const jsonContent = ref<any>(null)
const expiration = ref('7')
const shareLink = ref('')
const userStore = useUserStore()


const handleFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  // 检查文件大小（50MB限制）
  const maxSize = 50 * 1024 * 1024 // 50MB in bytes
  if (file.size > maxSize) {
    alert('文件大小不能超过50MB')
    ;(event.target as HTMLInputElement).value = ''
    return
  }

  try {
    const text = await file.text()
    jsonContent.value = JSON.parse(text)
  } catch (error) {
    alert('无效的 JSON 文件')
    jsonContent.value = null
  }
}

const handleUpload = async () => {
  if (!jsonContent.value) return

  try {
    const response = await fetch('/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userStore.userId
      },
      body: JSON.stringify({
        content: jsonContent.value,
        expiration: parseInt(expiration.value)
      })
    })

    if (response.status === 413) {
      alert('文件太大，请上传小于50MB的文件')
      return
    }

    const data = await response.json()
    if (data.success) {
      shareLink.value = `${window.location.origin}/share/${data.id}`
    } else {
      alert('上传失败：' + data.message)
    }
  } catch (error) {
    alert('上传失败，请稍后重试')
  }
}

const copyLink = () => {
  navigator.clipboard.writeText(shareLink.value)
    .then(() => alert('链接已复制到剪贴板'))
    .catch(() => alert('复制失败，请手动复制'))
}
</script> 