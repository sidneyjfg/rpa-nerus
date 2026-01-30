import { Page } from 'puppeteer'
import { createLogger } from '../../logger'
import {
  resolveTotpFromEmail,
  TotpEmailConfig,
} from './totp-email.provider'
import {
  resolveTotpFromSecret,
  TotpSecretConfig,
} from './totp-secret.provider'

const log = createLogger('totp-service')

export type TotpConfig =
  | TotpEmailConfig
  | TotpSecretConfig
  | { type: 'NONE' }

export const totpService = {
  async resolve(
    page: Page,
    config: TotpConfig,
    inputSelector: string
  ): Promise<string | null> {

    if (config.type === 'NONE') {
      log.info('Plataforma sem TOTP')
      return null
    }

    let token: string | null = null

    if (config.type === 'AUTHENTICATOR') {
      token = await resolveTotpFromSecret(config)
    }

    if (config.type === 'EMAIL') {
      token = await resolveTotpFromEmail(
        page,
        inputSelector,
        config
      )
    }

    if (!token) {
      throw new Error('Falha ao resolver TOTP')
    }

    log.info('TOTP resolvido com sucesso')
    return token
  },
}
