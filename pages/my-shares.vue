<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">我的分享</h1>

    <div class="bg-white rounded-lg shadow-lg p-6">
      <div v-if="loading" class="text-center py-8">
        加载中...
      </div>

      <div v-else-if="error" class="text-center py-8 text-red-500">
        {{ error }}
      </div>

      <div v-else-if="shares.length === 0" class="text-center py-8 text-gray-500">
        暂无分享记录
      </div>

      <div v-else class="space-y-4">
        <div v-for="share in shares" :key="share.id" class="border rounded p-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-bold mb-2">分享 ID: {{ share.id }}</h3>
              <p class="text-sm text-gray-600 mb-1">
                创建时间：{{ formatDate(share.createdAt) }}
              </p>
              <p class="text-sm text-gray-600 mb-2">
                有效期至：{{ share.expirationDate ? formatDate(share.expirationDate) : '永久有效' }}
              </p>
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  :value="getShareLink(share.id)"
                  readonly
                  class="text-sm p-1 border rounded flex-1"
                />
                <button
                  @click="copyLink(share.id)"
                  class="text-sm bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                >
                  复制
                </button>
              </div>
            </div>

            <div class="flex space-x-2">
              <button
                @click="previewShare(share.id)"
                class="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                预览
              </button>
              <button
                @click="deleteShare(share.id)"
                class="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useUserStore } from '~/stores/user'
import { useRouter } from 'vue-router'

interface Share {
  id: string
  createdAt: string
  expirationDate: string | null
}

const router = useRouter()
const userStore = useUserStore()
const shares = ref<Share[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  await fetchShares()
})

const fetchShares = async () => {
  try {
    const response = await fetch('/api/shares', {
      headers: {
        'X-User-ID': userStore.userId
      }
    })
    const data = await response.json()
    
    if (data.success) {
      shares.value = data.shares
    } else {
      error.value = data.message || '获取分享列表失败'
    }
  } catch (err) {
    error.value = '加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

const getShareLink = (id: string) => {
  return `${window.location.origin}/share/${id}`
}

const copyLink = (id: string) => {
  const link = getShareLink(id)
  navigator.clipboard.writeText(link)
    .then(() => alert('链接已复制到剪贴板'))
    .catch(() => alert('复制失败，请手动复制'))
}

const previewShare = (id: string) => {
  router.push(`/share/${id}`)
}

const deleteShare = async (id: string) => {
  if (!confirm('确定要删除这个分享吗？')) return

  try {
    const response = await fetch(`/api/share/${id}`, {
      method: 'DELETE',
      headers: {
        'X-User-ID': userStore.userId
      }
    })
    const data = await response.json()
    
    if (data.success) {
      shares.value = shares.value.filter(share => share.id !== id)
    } else {
      alert(data.message || '删除失败')
    }
  } catch (err) {
    alert('删除失败，请稍后重试')
  }
}
</script> 