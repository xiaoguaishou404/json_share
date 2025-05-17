import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { defineEventHandler, readBody } from 'h3'
import db from '../../utils/db'

interface ShareRequest {
  content: any
  expiration: number
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<ShareRequest>(event)
    const userId = event.headers.get('x-user-id')

    if (!userId) {
      return {
        success: false,
        message: '未提供用户 ID'
      }
    }

    if (!body.content) {
      return {
        success: false,
        message: '未提供 JSON 内容'
      }
    }

    const id = uuidv4()
    const expirationDate = body.expiration === -1 ? 
      null : 
      dayjs().add(body.expiration, 'day').format('YYYY-MM-DD HH:mm:ss')

    await db.execute(
      'INSERT INTO shares (id, user_id, content, expiration_date) VALUES (?, ?, ?, ?)',
      [id, userId, JSON.stringify(body.content), expirationDate]
    )

    return {
      success: true,
      id
    }
  } catch (error) {
    console.error('创建分享失败:', error)
    return {
      success: false,
      message: '服务器错误'
    }
  }
}) 