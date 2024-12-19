import mysql from "mysql2/promise"

// Cấu hình kết nối an toàn
export const dbConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Tạo connection pool
export const pool = mysql.createPool(dbConfig)

// Hàm query dùng chung
export async function executeQuery(query: string, values?: unknown[]) {
  try {
    const [results] = await pool.execute(query, values)
    return results
  } catch (error) {
    console.error("Database Query Error:", error)
    throw error
  }
}
