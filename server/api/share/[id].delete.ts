import { defineEventHandler } from 'h3'
import db from '../../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id
    const userId = event.headers.get('x-user-id')

    if (!userId) {
      return {
        success: false,
        message: '未提供用户 ID'
      }
    }

    const [result] = await db.execute(
      'DELETE FROM shares WHERE id = ? AND user_id = ?',
      [id, userId]
    )

    const deleteResult = result as any
    if (deleteResult.affectedRows === 0) {
      return {
        success: false,
        message: '无权删除该分享或分享不存在'
      }
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('删除分享失败:', error)
    return {
      success: false,
      message: '服务器错误'
    }
  }
}) 