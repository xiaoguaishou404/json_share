import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ApiHandler, MockRowDataPacket } from '../../../types'
import { createMockDbResult } from '../../../types'

// 模拟依赖
vi.mock('../../../../server/utils/db', () => ({
  default: {
    execute: vi.fn()
  }
}))

// 导入被测试的处理程序
import handler from '../../../../server/api/shares/index.get'
import db from '../../../../server/utils/db'

describe('GET /api/shares', () => {
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
      }
    }
  })

  it('应成功获取用户的分享列表', async () => {
    // 准备
    const mockShares: MockRowDataPacket[] = [
      {
        id: 'share-id-1',
        created_at: '2023-01-01 00:00:00',
        expiration_date: '2099-12-31 23:59:59'
      },
      {
        id: 'share-id-2',
        created_at: '2023-01-02 00:00:00',
        expiration_date: null
      }
    ]
    
    vi.mocked(db.execute).mockResolvedValueOnce(createMockDbResult(mockShares))
    
    // 执行
    const response = await (handler as ApiHandler)(mockEvent)
    
    // 验证
    expect(response).toEqual({
      success: true,
      shares: mockShares
    })
    
    expect(db.execute).toHaveBeenCalledWith(
      'SELECT id, created_at, expiration_date FROM shares WHERE user_id = ? ORDER BY created_at DESC',
      ['test-user-id']
    )
  })

  it('当未提供用户ID时应返回错误', async () => {
    // 准备 - 模拟未提供用户ID
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

  it('当没有分享记录时应返回空数组', async () => {
    // 准备 - 返回空结果
    vi.mocked(db.execute).mockResolvedValueOnce(createMockDbResult([]))
    
    // 执行
    const response = await (handler as ApiHandler)(mockEvent)
    
    // 验证
    expect(response).toEqual({
      success: true,
      shares: []
    })
  })

  it('当数据库操作失败时应处理错误', async () => {
    // 准备
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