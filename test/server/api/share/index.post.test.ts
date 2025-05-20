import { describe, it, expect, vi, beforeEach } from 'vitest'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import type { ApiHandler } from '../../../types'
import { createMockDbResult } from '../../../types'

// 模拟依赖
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid')
}))

vi.mock('../../../../server/utils/db', () => ({
  default: {
    execute: vi.fn().mockResolvedValue(createMockDbResult({ affectedRows: 1 }))
  }
}))

// 导入被测试的处理程序
import handler from '../../../../server/api/share/index.post'
import db from '../../../../server/utils/db'

describe('POST /api/share', () => {
  let mockEvent: any

  beforeEach(() => {
    // 重置模拟
    vi.clearAllMocks()
    
    // 创建模拟请求事件
    mockEvent = {
      headers: {
        get: vi.fn().mockImplementation((header) => {
          if (header === 'x-user-id') return 'test-user-id'
          return null
        })
      },
      readBody: vi.fn()
    }
  })

  it('应成功创建永久有效的分享链接', async () => {
    // 准备
    const mockBody = {
      content: { test: 'data' },
      expiration: -1
    }
    
    vi.spyOn(mockEvent, 'readBody').mockResolvedValue(mockBody)
    
    // 执行
    const response = await (handler as ApiHandler)(mockEvent)
    
    // 验证
    expect(response).toEqual({
      success: true,
      id: 'test-uuid'
    })
    
    expect(db.execute).toHaveBeenCalledWith(
      'INSERT INTO shares (id, user_id, content, expiration_date) VALUES (?, ?, ?, ?)',
      ['test-uuid', 'test-user-id', JSON.stringify(mockBody.content), null]
    )
  })

  it('应成功创建有有效期的分享链接', async () => {
    // 准备
    const mockBody = {
      content: { test: 'data' },
      expiration: 7
    }
    
    vi.spyOn(mockEvent, 'readBody').mockResolvedValue(mockBody)
    
    // 模拟日期
    const mockDate = '2023-01-01 00:00:00'
    vi.spyOn(dayjs.prototype, 'format').mockReturnValue(mockDate)
    
    // 执行
    const response = await (handler as ApiHandler)(mockEvent)
    
    // 验证
    expect(response).toEqual({
      success: true,
      id: 'test-uuid'
    })
    
    expect(db.execute).toHaveBeenCalledWith(
      'INSERT INTO shares (id, user_id, content, expiration_date) VALUES (?, ?, ?, ?)',
      ['test-uuid', 'test-user-id', JSON.stringify(mockBody.content), mockDate]
    )
  })

  it('当未提供用户ID时应返回错误', async () => {
    // 准备
    const mockBody = {
      content: { test: 'data' },
      expiration: 7
    }
    
    vi.spyOn(mockEvent, 'readBody').mockResolvedValue(mockBody)
    
    // 模拟未提供用户ID
    mockEvent.headers.get.mockImplementation(() => null)
    
    // 执行
    const response = await (handler as ApiHandler)(mockEvent)
    
    // 验证
    expect(response).toEqual({
      success: false,
      message: '未提供用户 ID'
    })
    
    expect(db.execute).not.toHaveBeenCalled()
  })

  it('当未提供JSON内容时应返回错误', async () => {
    // 准备
    const mockBody = {
      content: null,
      expiration: 7
    }
    
    vi.spyOn(mockEvent, 'readBody').mockResolvedValue(mockBody)
    
    // 执行
    const response = await (handler as ApiHandler)(mockEvent)
    
    // 验证
    expect(response).toEqual({
      success: false,
      message: '未提供 JSON 内容'
    })
    
    expect(db.execute).not.toHaveBeenCalled()
  })

  it('当数据库操作失败时应处理错误', async () => {
    // 准备
    const mockBody = {
      content: { test: 'data' },
      expiration: 7
    }
    
    vi.spyOn(mockEvent, 'readBody').mockResolvedValue(mockBody)
    
    // 模拟数据库错误
    vi.mocked(db.execute).mockRejectedValueOnce(new Error('数据库错误'))
    
    // 模拟控制台错误
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // 执行
    const response = await (handler as ApiHandler)(mockEvent)
    
    // 验证
    expect(response).toEqual({
      success: false,
      message: '服务器错误'
    })
    
    expect(consoleSpy).toHaveBeenCalled()
  })
}) 