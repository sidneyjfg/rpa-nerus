// shared/services/delivery.service.ts
import { ClientReportDelivery } from "../../infra/db/entities/ClientReportDelivery.entity"

import { createLogger } from "../logger"
import { sendEmail } from "../utils/send-email"
import { sendSftp } from "../utils/send-sftp"

const log = createLogger("delivery-service")

export class DeliveryService {
  async send(
    files: string[],
    deliveries: ClientReportDelivery[]
  ): Promise<void> {

    for (const delivery of deliveries) {
      const channel = delivery.deliveryChannel.code

      log.info(`Enviando via ${channel}`)

      if (channel === "SFTP" || channel === "DIRECTORY") {
        await sendSftp(files, delivery)
      }

      if (channel === "EMAIL") {
        await sendEmail(files, delivery)
      }
    }
  }
}
