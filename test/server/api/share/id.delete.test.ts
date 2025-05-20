import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ApiHandler } from '../../../types'
import { createMockDbResult } from '../../../types'

// 模拟依赖
vi.mock('../../../../server/utils/db', () => ({
  default: {
    execute: vi.fn()
  }
}))

// 导入被测试的处理程序
import handler from '../../../../server/api/share/[id].delete'
import db from '../../../../server/utils/db'

describe('DELETE /api/share/[id]', () => {
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
      },
      headers: {
        get: vi.fn().mockImplementation((header) => {
          if (header === 'x-user-id') return 'test-user-id'
          return null
        })
      }
    }
  })

  it('应成功删除用户的分享', async () => {
    // 准备 - 模拟删除成功（影响了一行）
    vi.mocked(db.execute).mockResolvedValueOnce(createMockDbResult({ affectedRows: 1 }))
    
    // 执行
    const response = await (handler as ApiHandler)(mockEvent)
    
    // 验证
    expect(response).toEqual({
      success: true
    })
    
    expect(db.execute).toHaveBeenCalledWith(
      'DELETE FROM shares WHERE id = ? AND user_id = ?',
      ['test-share-id', 'test-user-id']
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

  it('当没有权限删除或分享不存在时应返回错误', async () => {
    // 准备 - 模拟删除失败（未影响任何行）
    vi.mocked(db.execute).mockResolvedValueOnce(createMockDbResult({ affectedRows: 0 }))
    
    // 执行
    const response = await (handler as ApiHandler)(mockEvent)
    
    // 验证
    expect(response).toEqual({
      success: false,
      message: '无权删除该分享或分享不存在'
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