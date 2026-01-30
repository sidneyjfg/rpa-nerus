import { Page } from 'puppeteer'
import { createLogger } from '../../logger'
import { getLatestOTPFromEmailAdvanced } from './gmail-reader';

const log = createLogger('totp-email')

export type TotpEmailConfig = {
  type: 'EMAIL'
  from: string
  regex: RegExp
  sinceMs: number
  maxAttempts?: number
  intervalMs?: number
}

export async function resolveTotpFromEmail(
  page: Page,
  triggerSelector: string,
  config: TotpEmailConfig
): Promise<string> {
  const {
    from,
    regex,
    sinceMs,
    maxAttempts = 12,
    intervalMs = 5000,
  } = config

  log.info('Solicitando envio de OTP por e-mail')

  if (!(await page.$(triggerSelector))) {
    throw new Error('Botão de envio OTP não encontrado')
  }

  await page.click(triggerSelector)
  await new Promise(r => setTimeout(r, 3000))

  const query = `is:unread from:"${from}"`
  let otp: string | null = null

  for (let i = 0; i < maxAttempts; i++) {
    otp = await getLatestOTPFromEmailAdvanced(
      query,
      regex,
      { sinceTimestamp: sinceMs }
    )

    log.info(`Tentativa OTP ${i + 1}: ${otp || 'não chegou'}`)

    if (otp) break
    await new Promise(r => setTimeout(r, intervalMs))
  }

  if (!otp) {
    throw new Error('OTP não recebido por e-mail')
  }

  const inputs = await page.$$('.simple-otp input')

  for (let i = 0; i < otp.length; i++) {
    await inputs[i].type(otp[i], { delay: 100 })
  }

  log.info('OTP preenchido com sucesso')
  return otp
}
