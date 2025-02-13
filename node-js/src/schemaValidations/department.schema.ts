import z from 'zod'

export const DepartmentSchema = z
  .object({
    Department_ID: z.string(),
    Department_Name: z.string(),
    CARD_PHOTO: z.string(),
    Factory: z.string(),
    Choose_Department: z.boolean()
  })
  .strict()

export const DepartmentRes = z.object({
  data: DepartmentSchema,
  message: z.string()
})

export type DepartmentResType = z.TypeOf<typeof DepartmentRes>

export const DepartmentListRes = z.object({
  data: z.array(DepartmentSchema),
  message: z.string()
})

export type DepartmentListResType = z.TypeOf<typeof DepartmentListRes>
