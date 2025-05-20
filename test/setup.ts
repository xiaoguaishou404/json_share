import { vi } from 'vitest'

// 模拟环境变量
process.env = {
  ...process.env,
  MYSQL_HOST: 'localhost',
  MYSQL_PORT: '3306',
  MYSQL_USER: 'test',
  MYSQL_PASSWORD: 'test',
  MYSQL_DATABASE: 'test_db',
}

// 全局模拟
vi.mock('h3', () => ({
  defineEventHandler: (handler: any) => handler,
  readBody: vi.fn(async (event) => {
    if (event.readBody) {
      return event.readBody()
    }
    return {}
  }),
}))

// 模拟控制台错误，避免测试输出太多错误信息
vi.spyOn(console, 'error').mockImplementation(() => {}) 