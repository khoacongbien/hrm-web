// db.js
import sql from 'mssql'

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  },
  pool: {
    max: 100, // Số lượng kết nối tối đa trong pool
    min: 0,
    idleTimeoutMillis: 30000 // Thời gian chờ khi không có hoạt động
  }
}

// Khởi tạo connection pool
const pool = new sql.ConnectionPool(config)

// Kết nối đến database
pool.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message)
  } else {
    console.log('Connected to the database successfully!')
  }
})

export default pool
