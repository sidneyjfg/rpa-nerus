import { google } from 'googleapis'
import { createLogger } from '../../logger'

const log = createLogger('gmail-reader')

export async function getLatestOTPFromEmailAdvanced(
  listQuery: string,
  codeRegex: RegExp,
  opts: {
    sinceTimestamp?: number
    maxResults?: number
  } = {}
): Promise<string | null> {
  const { sinceTimestamp = 0, maxResults = 10 } = opts

  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    oAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    })

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client })

    log.info('Buscando e-mails via Gmail API...')

    const res = await gmail.users.messages.list({
      userId: 'me',
      q: listQuery,
      maxResults,
    })

    if (!res.data.messages?.length) {
      log.info(`Nenhum e-mail encontrado para query: ${listQuery}`)
      return null
    }

    const getBodyFromPart = (part: any): string => {
      if (!part) return ''
      if (part.body?.data) {
        return Buffer.from(part.body.data, 'base64').toString('utf-8')
      }
      if (part.parts) {
        return part.parts.map(getBodyFromPart).join('\n')
      }
      return ''
    }

    for (const m of res.data.messages) {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: m.id!,
        format: 'full',
      })

      if (
        sinceTimestamp &&
        Number(msg.data.internalDate) <= sinceTimestamp
      ) {
        log.debug('Email ignorado por ser antigo')
        continue
      }

      const headers = Object.fromEntries(
        msg.data.payload!.headers!.map((h: any) => [
          h.name.toLowerCase(),
          h.value,
        ])
      )

      const from = headers['from'] || ''
      log.info(`Analisando email de: ${from}`)

      let match =
        (msg.data.snippet || '').match(codeRegex)

      if (!match) {
        log.debug('Código não no snippet, lendo corpo...')
        match = getBodyFromPart(msg.data.payload).match(codeRegex)
      }

      if (match) {
        const otp = match[1]
        log.info(`OTP encontrado: ${otp}`)

        await gmail.users.messages.modify({
          userId: 'me',
          id: m.id!,
          requestBody: { removeLabelIds: ['UNREAD'] },
        })

        log.debug('Email marcado como lido')
        return otp
      }
    }

    log.warn('OTP não encontrado em nenhum email válido')
    return null
  } catch (err) {
    log.error('Falha ao ler emails via Gmail', err)
    return null
  }
}
