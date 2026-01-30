// 04-download-by-type.step.ts
import { Page } from "puppeteer"
import { AutomationContext } from "../types"
import { createLogger } from "../../../../../shared/logger"
import { createDownloadBatch, waitForDownloadInBatch } from "../../../../../shared/utils/download-manager"
import { unzipFile } from "../../../../../shared/utils/unzip"


const log = createLogger("shopee-download-step")

export async function step(
  page: Page,
  ctx: AutomationContext,
  input: { invoiceType: string }
): Promise<string[]> {
  log.info("RunStep START", input)

  try {
    // selecionar tipo
    // clicar aplicar
    // clicar baixar XML
    // clicar botão final Baixar

    const batch = createDownloadBatch({
      runId: ctx.runId,
      basePath: "/downloads"
    })

    const file = await waitForDownloadInBatch(batch, 70 * 60 * 1000)

    let files: string[] = []

    if (file.endsWith(".zip")) {
      files = await unzipFile(file, batch.folder)
    } else {
      files = [file]
    }

    log.info("RunStep SUCCESS", { files: files.length })
    return files
  } catch (err) {
    log.error("RunStep ERROR", err)
    throw err
  }
}
