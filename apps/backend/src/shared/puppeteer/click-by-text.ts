import { Page } from 'puppeteer'
import { createLogger } from '../logger'

const log = createLogger('click-by-text')

export type ClickOptions = {
  timeout?: number
  pollInterval?: number
}

export async function clickButtonByText(
  page: Page,
  text: string,
  opts: ClickOptions = {}
): Promise<boolean> {
  const { timeout = 10000, pollInterval = 300 } = opts
  const start = Date.now()

  while (Date.now() - start < timeout) {
    const buttons = await page.$$('button')

    for (const b of buttons) {
      const value = await page.evaluate(el => el.textContent, b)
      const norm = (value || '').replace(/\s+/g, ' ').trim()

      if (norm === text) {
        await b.click()
        log.info(`Botão clicado: "${text}"`)
        return true
      }
    }

    await new Promise(r => setTimeout(r, pollInterval))
  }

  log.error(`Botão não encontrado: "${text}"`)
  return false
}


export async function clickButtonByAnyText(
  page: Page,
  texts: string[],
  opts?: ClickOptions
): Promise<boolean> {
  for (const txt of texts) {
    const ok = await clickButtonByText(page, txt, opts)
    if (ok) return true
  }

  log.error(`Nenhum botão encontrado: ${texts.join(', ')}`)
  return false
}
