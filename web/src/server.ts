import express from 'express'
import compression from 'compression'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import { marked } from 'marked'
import { loadWikiPages } from './wiki'
import { renderPage, renderDetailPage, renderAboutPage } from './templates'
import { wikiPrefix } from './routes'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS_ROOT  = path.resolve(__dirname, '../assets')
const STYLES_ROOT  = path.resolve(__dirname, '../styles')
const SCRIPTS_ROOT = path.resolve(__dirname, '../scripts')

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 3002

app.use(compression())
app.use('/assets',  express.static(ASSETS_ROOT))
app.use('/styles',  express.static(STYLES_ROOT))
app.use('/scripts', express.static(SCRIPTS_ROOT))

function processWikilinks(text: string, prefix = ''): string {
  return text
    .replace(/\[\[([^\]|]+?)\\?\|([^\]]+)\]\]/g, (_, slug, label) => `[${label}](${prefix}/${encodeURIComponent(slug.trim())})`)
    .replace(/\[\[([^\]]+)\]\]/g, (_, slug) => `[${slug}](${prefix}/${encodeURIComponent(slug.trim())})`)
}

async function serveWikiPage(
  slug: string,
  nav: 'ru' | 'en',
  res: express.Response
): Promise<void> {
  const pages = await loadWikiPages()
  const slugLower = slug.toLowerCase()
  const page = pages.find(p => p.slug.toLowerCase() === slugLower)
  if (!page) { res.status(404).send(`Page not found: ${slug}`); return }

  const enPath = page.filePath.replace(/\.md$/, '.en.md')
  let hasEn = false
  try { await fs.access(enPath); hasEn = true } catch {}

  const effectiveLang = (nav === 'en' && hasEn) ? 'en' : 'ru'
  const filePath = effectiveLang === 'en' ? enPath : page.filePath

  const raw = await fs.readFile(filePath, 'utf-8')
  const { content, data } = matter(raw)
  const prefix = wikiPrefix(nav)
  const bodyHtml = marked.parse(processWikilinks(content, prefix)) as string
  const displayTitle = (data.title as string) || page.title

  res.send(renderDetailPage(page, bodyHtml, { current: effectiveLang, nav, slug, hasEn }, displayTitle))
}

// ── EN routes (must come before /:slug to avoid /en being captured as slug) ──

app.get('/en/about', (_req, res) => res.send(renderAboutPage('en')))

app.get('/en', async (_req, res) => {
  const pages = await loadWikiPages()
  res.send(renderPage(pages, 'en'))
})

app.get('/en/:slug', async (req, res) => {
  await serveWikiPage(decodeURIComponent(req.params.slug), 'en', res)
})

// ── RU routes ────────────────────────────────────────────────────────────────

app.get('/about', (_req, res) => res.send(renderAboutPage('ru')))

app.get('/', async (_req, res) => {
  const pages = await loadWikiPages()
  res.send(renderPage(pages, 'ru'))
})

app.get('/:slug', async (req, res) => {
  await serveWikiPage(decodeURIComponent(req.params.slug), 'ru', res)
})

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`)
  loadWikiPages().then(pages => console.log(`Wiki cache warm: ${pages.length} pages`))
})
