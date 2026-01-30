// steps/05-upload-sftp.step.ts
import { Page } from "puppeteer"
import { AutomationContext } from "../types"
import { createLogger } from "../../../../../shared/logger";
import { DeliveryService } from "../../../../../shared/services/delivere.service";

const log = createLogger("shopee-upload-step")

export async function step(
  _page: Page,
  ctx: AutomationContext,
  input: { files: string[]; deliveryService: DeliveryService }
): Promise<void> {
  log.info("RunStep START", { count: input.files.length })

  try {
    await input.deliveryService.send(input.files, ctx.deliveries)
    log.info("RunStep SUCCESS")
  } catch (err) {
    log.error("RunStep ERROR", err)
    throw err
  }
}
