import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export default async function stopProductionPreview() {
  if (process.env.PLAYWRIGHT_TEST_BASE_URL) return
  await writeFile(resolve('.playwright-preview-stop'), 'stop')
}
