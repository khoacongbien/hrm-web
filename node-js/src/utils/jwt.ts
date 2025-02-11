import { TokenType } from '@/constants/type'
import { TokenPayload } from '@/types/jwt.type'
import { SignerOptions, createSigner, createVerifier } from 'fast-jwt'
import ms from 'ms'
import envConfig from '@/config'

type StringValue = `${number}${'d' | 'h' | 'm' | 's'}`

export const signSessionToken = (
  payload: Pick<TokenPayload, 'userId'> & {
    name?: string
    imgsrc?: string
    departmentId?: string
  },
  options?: SignerOptions
) => {
  const signSync = createSigner({
    key: envConfig.SESSION_TOKEN_SECRET,
    algorithm: 'HS256',
    expiresIn: ms(envConfig.SESSION_TOKEN_EXPIRES_IN as StringValue),
    ...options
  })
  return signSync({ ...payload, tokenType: TokenType.SessionToken })
}

export const verifySessionToken = (token: string) => {
  const verifySync = createVerifier({
    key: envConfig.SESSION_TOKEN_SECRET
  })
  return verifySync(token) as TokenPayload
}
