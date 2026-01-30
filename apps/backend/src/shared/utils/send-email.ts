import nodemailer from "nodemailer"
import path from "path"
import { ClientReportDelivery } from "../../infra/db/entities/ClientReportDelivery.entity"
import { createLogger } from "../logger"

const log = createLogger("send-email")

export async function sendEmail(
  files: string[],
  delivery: ClientReportDelivery
): Promise<void> {
  if (!delivery.emailTo) {
    throw new Error("emailTo não configurado")
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const subject =
    delivery.emailSubjectTemplate ?? "Arquivos automação"

  const attachments = files.map(f => ({
    filename: path.basename(f),
    path: f,
  }))

  log.info(`Enviando e-mail para ${delivery.emailTo}`)

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? "rpa@nerus.com",
    to: delivery.emailTo,
    cc: delivery.emailCc ?? undefined,
    subject,
    text: "Segue arquivos gerados pela automação.",
    attachments,
  })

  log.info("Envio de e-mail concluído")
}
