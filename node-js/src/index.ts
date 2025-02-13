import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyAuth from '@fastify/auth'
import fastifyHelmet from '@fastify/helmet'
import fastifyCookie from '@fastify/cookie'
import validatorCompilerPlugin from '@/plugins/validatorCompiler.plugins'
import { errorHandlerPlugin } from '@/plugins/errorHandler.plugins'
import envConfig, { API_URL } from '@/config'
import authRoutes from './routers/auth.route'
import departmentRoutes from './routers/department.route'

const fastify = Fastify({
  logger: true
})

const start = async () => {
  try {
    // createFolder(path.resolve(envConfig.UPLOAD_FOLDER))
    const whitelist = ['*']
    fastify.register(cors, {
      origin: whitelist, // Cho phép tất cả các domain gọi API
      credentials: true // Cho phép trình duyệt gửi cookie đến server
    })

    fastify.register(fastifyAuth, {
      defaultRelation: 'and'
    })

    fastify.register(fastifyHelmet, {
      crossOriginResourcePolicy: {
        policy: 'cross-origin'
      }
    })

    fastify.register(fastifyCookie)

    fastify.register(validatorCompilerPlugin)

    fastify.register(errorHandlerPlugin)

    fastify.register(authRoutes, {
      prefix: '/auth'
    })

    fastify.register(departmentRoutes, {
      prefix: '/department'
    })

    await fastify.listen({
      port: envConfig.PORT,
      host: envConfig.IS_PRODUCTION ? '0.0.0.0' : 'localhost'
    })
    console.log(`Server đang chạy dưới local tại: ${API_URL}`)
    if (envConfig.IS_PRODUCTION) {
      console.log(`Đang ở mode production với domain: ${envConfig.PRODUCTION_URL}`)
    }
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

start()
