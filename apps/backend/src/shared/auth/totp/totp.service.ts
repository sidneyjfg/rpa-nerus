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

// totp.service.ts
export type TotpConfig =
  | TotpEmailConfig
  | TotpSecretConfig
  | { type: 'NONE' }

export const TotpService = {
  async resolve(page: Page, config: TotpConfig, inputSelector: string) {
    if (config.type === 'NONE') return null

    let token: string | null = null

    // aceitar APP como sinônimo
    if (config.type === 'AUTHENTICATOR') {
      token = await resolveTotpFromSecret(config as TotpSecretConfig)
    }

    if (config.type === 'EMAIL') {
      token = await resolveTotpFromEmail(page, inputSelector, config as TotpEmailConfig)
    }
    if (!token) {
      throw new Error('Falha ao resolver TOTP')
    }

    log.info('TOTP resolvido com sucesso')
    return token
  },
}
