import { getDepartmentList } from '@/controllers/department.controller'
import { DepartmentListRes, DepartmentListResType } from '@/schemaValidations/department.schema'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default async function departmentRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get<{ Reply: DepartmentListResType }>(
    '/',
    {
      schema: {
        response: {
          200: DepartmentListRes
        }
      }
    },
    async (request, reply) => {
      const products = await getDepartmentList()
      reply.send({
        data: products,
        message: 'Lấy danh sách đơn vị thành công!'
      })
    }
  )
}
