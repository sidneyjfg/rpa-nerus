// steps/02-navigate-nfe.step.ts
import { Page } from "puppeteer"
import { AutomationContext } from "../types"
import { createLogger } from "../../../../../shared/logger"
import { delay } from "../../../../../shared/puppeteer/wait"


const log = createLogger("shopee-navigate-step")

export async function step(page: Page, ctx: AutomationContext): Promise<void> {
    log.info("RunStep START")

    try {
        await page.waitForSelector('button.shopee-button--link span')
        await page.evaluate(() => {
            [...document.querySelectorAll('button.shopee-button--link span')]
                .find(e => e.textContent?.trim() === "Detalhes")
                ?.parentElement?.click()
        })
        await delay(3000)

        await page.evaluate(() => {
            [...document.querySelectorAll('button.shopee-button--link span')]
                .find(e => e.textContent?.trim() === "Abrir em Central de Vendas")
                ?.parentElement?.click()
        })

        await delay(4000)
        const pages = await page.browser().pages()
        page = pages[pages.length - 1]

        await page.click('a[test-id="my income"]')
        await delay(4000)

        await page.type(
            'input[type="password"][placeholder="Senha"]',
            ctx.platformConfig.password
        )

        await page.evaluate(() => {
            [...document.querySelectorAll('button span')]
                .find(e => e.textContent?.trim() === "Verificar")
                ?.closest("button")?.click()
        })

        await delay(6000)

        await page.evaluate(() => {
            [...document.querySelectorAll('a.invoice-entry .invoice-name')]
                .find(e => e.textContent?.includes("Notas Fiscais"))
                ?.closest("a")?.click()
        })

        await delay(4000)

        await page.evaluate(() => {
            const el = [...document.querySelectorAll('.eds-tabs__nav-tab')]
                .find(e => e.textContent?.includes("Notas de Venda"))

                ; (el as HTMLElement | null)?.click()
        })


        await delay(3000)

        log.info("RunStep SUCCESS")
    } catch (err) {
        log.error("RunStep ERROR", err)
        throw err
    }
}
