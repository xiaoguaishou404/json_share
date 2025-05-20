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
import handler from '../../../../server/api/share/[id].get'
import db from '../../../../server/utils/db'

describe('GET /api/share/[id]', () => {
  let mockEvent: any

  beforeEach(() => {
    // 重置模拟
    vi.clearAllMocks()
    
    // 创建模拟请求事件
    mockEvent = {
      context: {
        params: {
          id: 'test-share-id'
        }
      }
    }
  })

  it('应成功获取有效的分享内容', async () => {
    // 准备
    const mockShare: MockRowDataPacket = {
      content: JSON.stringify({ test: 'data' }),
      expiration_date: '2099-12-31 23:59:59'
    }
    
    vi.mocked(db.execute).mockResolvedValueOnce(createMockDbResult([mockShare]))
    
    // 执行
    const response = await (handler as ApiHandler)(mockEvent)
    
    // 验证
    expect(response).toEqual({
      success: true,
      content: mockShare.content,
      expirationDate: mockShare.expiration_date
    })
    
    expect(db.execute).toHaveBeenCalledWith(
      'SELECT content, expiration_date FROM shares WHERE id = ? AND (expiration_date IS NULL OR expiration_date > NOW())',
      ['test-share-id']
    )
  })

  it('应成功获取永久有效的分享内容（无有效期）', async () => {
    // 准备
    const mockShare: MockRowDataPacket = {
      content: JSON.stringify({ test: 'data' }),
      expiration_date: null
    }
    
    vi.mocked(db.execute).mockResolvedValueOnce(createMockDbResult([mockShare]))
    
    // 执行
    const response = await (handler as ApiHandler)(mockEvent)
    
    // 验证
    expect(response).toEqual({
      success: true,
      content: mockShare.content,
      expirationDate: null
    })
  })

  it('当分享不存在时应返回错误', async () => {
    // 准备 - 返回空结果
    vi.mocked(db.execute).mockResolvedValueOnce(createMockDbResult([]))
    
    // 执行
    const response = await (handler as ApiHandler)(mockEvent)
    
    // 验证
    expect(response).toEqual({
      success: false,
      message: '分享内容不存在或已过期'
    })
  })

  it('当分享已过期时应返回错误', async () => {
    // 准备 - 由于SQL查询中已经过滤了过期内容，这里模拟返回空结果
    vi.mocked(db.execute).mockResolvedValueOnce(createMockDbResult([]))
    
    // 执行
    const response = await (handler as ApiHandler)(mockEvent)
    
    // 验证
    expect(response).toEqual({
      success: false,
      message: '分享内容不存在或已过期'
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