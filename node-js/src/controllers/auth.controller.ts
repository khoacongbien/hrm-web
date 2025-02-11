import envConfig from '@/config'
import { LoginBodyType, RegisterBodyType } from '@/schemaValidations/auth.schema'
import { comparePassword, hashPassword } from '@/utils/crypto'
import { EntityError } from '@/utils/errors'
import { signSessionToken } from '@/utils/jwt'
import { addMilliseconds } from 'date-fns'
import pool from '@/database/db' // Kết nối đến MS SQL Server
import sql from 'mssql'
import ms from 'ms'

type StringValue = `${number}${'d' | 'h' | 'm' | 's'}`

export const loginController = async (body: LoginBodyType) => {
  const { personID, password } = body

  const accountResult = await pool.request().input('personID', sql.NVarChar(10), personID)
    .query(`SELECT personID, password, personName,departmentID, 'http://192.168.60.13/HRIS_PersonPhoto/'+personID+'.JPG' imgsrc
          FROM dbo.Data_User_App 
          WHERE personID = @personID`)
  const account = accountResult.recordset[0] // Lấy bản ghi đầu tiên
  if (!account) {
    throw new EntityError([{ field: 'personID', message: 'Tài khoản không tồn tại' }])
  }

  // So sánh mật khẩu
  const isPasswordMatch = await comparePassword(password, account.password)
  if (!isPasswordMatch) {
    throw new EntityError([{ field: 'password', message: 'Mật khẩu không đúng' }])
  }

  // Tạo session token
  const sessionToken = signSessionToken({
    userId: account.personID,
    name: account.personName,
    imgsrc: account.imgsrc,
    departmentId: account.departmentID
  })

  // Tính toán thời gian hết hạn của session
  const expiresAt = addMilliseconds(new Date(), ms(envConfig.SESSION_TOKEN_EXPIRES_IN as StringValue))

  // Lưu session vào database
  // await pool
  //   .request()
  //   .input('accountId', sql.Int, account.id)
  //   .input('token', sql.NVarChar(255), sessionToken)
  //   .input('expiresAt', sql.DateTime, expiresAt)
  //   .query(`INSERT INTO Sessions (accountId, token, expiresAt) VALUES (@accountId, @token, @expiresAt)`)

  return {
    account,
    session: {
      token: sessionToken,
      expiresAt
    }
  }
}
