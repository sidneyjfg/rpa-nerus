import path from 'path'
import fs from 'fs'
import { createLogger } from '../logger'

const log = createLogger('download-manager')

export type DownloadContext = {
  runId: string
  basePath: string
}

export type DownloadBatch = {
  folder: string
  startedAt: Date
}

function formatHourFolder(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')

  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const h = pad(date.getHours())

  return `${y}-${m}-${d}_${h}`
}

export function createDownloadBatch(
  ctx: DownloadContext,
  now: Date = new Date()
): DownloadBatch {
  const folderName = formatHourFolder(now)
  const folder = path.join(ctx.basePath, ctx.runId, folderName)

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true })
    log.info(`Batch criado: ${folder}`)
  }

  return {
    folder,
    startedAt: now,
  }
}

export async function waitForDownloadInBatch(
  batch: DownloadBatch,
  timeoutMs: number,
  pollMs = 1000
): Promise<string> {
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    const files = fs
      .readdirSync(batch.folder)
      .filter(f => !f.endsWith('.crdownload'))

    if (files.length > 0) {
      const filePath = path.join(batch.folder, files[0])
      log.info(`Download finalizado: ${filePath}`)
      return filePath
    }

    await new Promise(r => setTimeout(r, pollMs))
  }

  throw new Error(
    `Timeout aguardando download em ${batch.folder}`
  )
}
