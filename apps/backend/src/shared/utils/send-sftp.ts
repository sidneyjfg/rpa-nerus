import SftpClient from "ssh2-sftp-client"
import path from "path"
import { ClientReportDelivery } from "../../infra/db/entities/ClientReportDelivery.entity"
import { createLogger } from "../logger"

const log = createLogger("send-sftp")

export async function sendSftp(
  files: string[],
  delivery: ClientReportDelivery
): Promise<void> {
  const sftp = new SftpClient()

  const {
    sftpHost,
    sftpPort,
    sftpUser,
    sftpPassword,
    sftpRemotePath,
  } = delivery

  if (!sftpHost || !sftpUser || !sftpPassword || !sftpRemotePath) {
    throw new Error("Configuração SFTP incompleta")
  }

  try {
    log.info(`Conectando no SFTP ${sftpHost}:${sftpPort ?? 22}`)

    await sftp.connect({
      host: sftpHost,
      port: sftpPort ?? 22,
      username: sftpUser,
      password: sftpPassword,
    })

    for (const file of files) {
      const remote = path.posix.join(
        sftpRemotePath,
        path.basename(file)
      )

      log.info(`Enviando ${file} → ${remote}`)
      await sftp.put(file, remote)
    }

    log.info("Envio SFTP concluído")
  } finally {
    await sftp.end()
  }
}
