import { generate } from 'otplib'
import { createLogger } from '../../logger'

export type TotpSecretConfig = {
  type: 'AUTHENTICATOR'
  secret: string
}

const log = createLogger('totp-secret')

export async function resolveTotpFromSecret(
  config: TotpSecretConfig
): Promise<string> {
  const token = generate({
    secret: config.secret,
  })

  log.info('TOTP gerado via generate()')
  return token
}
