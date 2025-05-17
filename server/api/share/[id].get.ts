import { defineEventHandler } from 'h3'
import db from '../../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id

    const [rows] = await db.execute(
      'SELECT content, expiration_date FROM shares WHERE id = ? AND (expiration_date IS NULL OR expiration_date > NOW())',
      [id]
    )

    if (!Array.isArray(rows) || rows.length === 0) {
      return {
        success: false,
        message: '分享内容不存在或已过期'
      }
    }

    const share = rows[0] as any
    return {
      success: true,
      content: share.content,
      expirationDate: share.expiration_date
    }
  } catch (error) {
    console.error('获取分享内容失败:', error)
    return {
      success: false,
      message: '服务器错误'
    }
  }
}) 