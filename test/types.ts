import type { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise'

// 数据库结果类型
export type QueryResult = OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][]
export type DbResult = [QueryResult, FieldPacket[]]

// 处理器返回类型
export type ApiHandler = (event: any) => Promise<any>

// 模拟MySQL行数据
export interface MockRowDataPacket {
  [key: string]: any
}

// 创建MySQL结果模拟函数
export function createMockDbResult(data: any): DbResult {
  return [data, [] as FieldPacket[]]
} 