import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'json_share_user',
  password: process.env.MYSQL_PASSWORD || 'json_share_password',
  database: process.env.MYSQL_DATABASE || 'json_share',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export default pool 