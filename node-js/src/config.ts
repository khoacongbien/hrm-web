import fs from 'fs'
import path from 'path'
import z from 'zod'
import { config } from 'dotenv'

config({
  path: '.env'
})

const checkEnv = async () => {
  const chalk = (await import('chalk')).default
  if (!fs.existsSync(path.resolve('.env'))) {
    console.log(chalk.red(`Không tìm thấy file môi trường .env`))
    process.exit(1)
  }
}
checkEnv()

const configSchema = z.object({
  // Server configuration
  PORT: z.coerce.number().default(4000),
  DOMAIN: z.string(),
  PROTOCOL: z.string(),
  IS_PRODUCTION: z.enum(['true', 'false']).transform((val) => val === 'true'),
  PRODUCTION_URL: z.string(),

  // Session configuration
  SESSION_TOKEN_SECRET: z.string(),
  SESSION_TOKEN_EXPIRES_IN: z.string(),

  // File upload configuration
  UPLOAD_FOLDER: z.string(),

  // Cookie configuration
  COOKIE_MODE: z.enum(['true', 'false']).transform((val) => val === 'true'),

  // MS SQL Server configuration
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_SERVER: z.string(),
  DB_PORT: z.coerce.number().default(1433),
  DB_NAME: z.string(),
  DB_ENCRYPT: z.enum(['true', 'false']).transform((val) => val === 'true'),
  DB_TRUST_SERVER_CERTIFICATE: z.enum(['true', 'false']).transform((val) => val === 'true')
})

// Validate các biến môi trường
const configServer = configSchema.safeParse(process.env)
if (!configServer.success) {
  console.error(configServer.error.issues)
  throw new Error('Các giá trị khai báo trong file .env không hợp lệ')
}

// Export các giá trị đã được validate
const envConfig = configServer.data

// Tạo URL API dựa trên môi trường
export const API_URL = envConfig.IS_PRODUCTION
  ? envConfig.PRODUCTION_URL
  : `${envConfig.PROTOCOL}://${envConfig.DOMAIN}:${envConfig.PORT}`
export default envConfig

// Khai báo global type cho ProcessEnv
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof configSchema> {}
  }
}
