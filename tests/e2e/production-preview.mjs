import { existsSync } from 'node:fs'
import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { build, preview } from 'vite'

const host = '127.0.0.1'
const port = 4173
const stopFile = resolve('.playwright-preview-stop')

await rm(stopFile, { force: true })
await build()

const server = await preview({
  preview: { host, port, strictPort: true },
})

let closing = false

async function close() {
  if (closing) return
  closing = true
  await new Promise((resolve) => server.httpServer.close(resolve))
}

const stopMonitor = setInterval(() => {
  if (!existsSync(stopFile)) return
  clearInterval(stopMonitor)
  void close().finally(async () => {
    await rm(stopFile, { force: true })
    process.exit(0)
  })
}, 100)

for (const signal of ['SIGINT', 'SIGTERM', 'SIGBREAK']) {
  process.once(signal, () => {
    void close().finally(() => process.exit(0))
  })
}
