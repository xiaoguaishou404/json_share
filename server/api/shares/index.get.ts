import { defineEventHandler } from 'h3'
import db from '../../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const userId = event.headers.get('x-user-id')

    if (!userId) {
      return {
        success: false,
        message: '未提供用户 ID'
      }
    }

    const [rows] = await db.execute(
      'SELECT id, created_at, expiration_date FROM shares WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    )

    return {
      success: true,
      shares: (rows as any[]).map(row => ({
        id: row.id,
        createdAt: row.created_at,
        expirationDate: row.expiration_date
      }))
    }
  } catch (error) {
    console.error('获取分享列表失败:', error)
    return {
      success: false,
      message: '服务器错误'
    }
  }
}) 