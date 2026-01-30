// steps/03-select-date.step.ts
import { Page } from "puppeteer"
import { AutomationContext } from "../types"
import { createLogger } from "../../../../../shared/logger"
import { delay } from "../../../../../shared/puppeteer/wait"

const log = createLogger("shopee-date-step")

export async function step(page: Page, ctx: AutomationContext): Promise<void> {
  log.info("RunStep START")

  try {
    await page.evaluate(() => {
      const el = [...document.querySelectorAll(".eds-selector")]
        .find(x => x.textContent?.includes("Data"))

      ;(el as HTMLElement | null)?.click()
    })

    await delay(500)

    const start = ctx.dateRange.start
    const end = ctx.dateRange.end

    await page.evaluate(
      ({ startDay, endDay }) => {
        const panels = document.querySelectorAll(".eds-date-picker-panel__date")

        const clickDay = (panel: any, day: number) => {
          const cells = [...panel.querySelectorAll(".eds-date-table__cell-inner")]
          const btn = cells.find((e: any) =>
            e.textContent?.trim() === String(day)
          )

          ;(btn as HTMLElement | null)?.click()
        }

        clickDay(panels[0], startDay)
        clickDay(panels[0], endDay)
      },
      { startDay: start.getDate(), endDay: end.getDate() }
    )

    log.info("RunStep SUCCESS")
  } catch (err) {
    log.error("RunStep ERROR", err)
    throw err
  }
}
