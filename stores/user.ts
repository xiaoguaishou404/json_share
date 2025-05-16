import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: ''
  }),
  
  actions: {
    initializeUserId() {
      // 从 localStorage 获取用户 ID，如果不存在则创建新的
      const storedUserId = localStorage.getItem('userId')
      if (storedUserId) {
        this.userId = storedUserId
      } else {
        this.userId = uuidv4()
        localStorage.setItem('userId', this.userId)
      }
    }
  }
}) 