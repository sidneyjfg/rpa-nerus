import fs from 'fs'
import path from 'path'
import unzipper from 'unzipper'
import { createLogger } from '../logger'

const log = createLogger('unzip')

export async function unzipFile(
  zipPath: string,
  targetDir: string
): Promise<string[]> {
  log.info(`Descompactando: ${zipPath}`)

  await fs
    .createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: targetDir }))
    .promise()

  const files = fs
    .readdirSync(targetDir)
    .map(f => path.join(targetDir, f))
    .filter(f => !f.endsWith('.zip'))

  log.info(`Arquivos extraídos: ${files.length}`)
  return files
}
