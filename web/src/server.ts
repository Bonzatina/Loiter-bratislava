import express from 'express'
import compression from 'compression'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import { marked } from 'marked'
import { loadWikiPages } from './wiki'
import { renderPage, renderDetailPage, renderAboutPage } from './templates'
import { wikiPrefix, wikiUrl } from './routes'
import { notesEnabled, validateNote, sendNote } from './notes'
import type { NoteState } from './page-detail'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS_ROOT  = path.resolve(__dirname, '../assets')
const STYLES_ROOT  = path.resolve(__dirname, '../styles')
const SCRIPTS_ROOT = path.resolve(__dirname, '../scripts')

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 3002

// Render (and any other proxy host) forwards the visitor IP in X-Forwarded-For;
// without this the note rate limiter would see one address for everyone.
app.set('trust proxy', 1)

app.use(compression())
app.use('/assets',  express.static(ASSETS_ROOT))
app.use('/styles',  express.static(STYLES_ROOT))
app.use('/scripts', express.static(SCRIPTS_ROOT))

// The detail template already renders the frontmatter `title` as the page <h1>.
// Every page body also opens with a `# Title` heading (nice when reading the raw
// .md), which would render a second, duplicate <h1> after the meta badges —
// strip that leading H1 so the title isn't shown twice.
function stripLeadingH1(text: string): string {
  return text.replace(/^\s*#\s+.*(\r?\n)+/, '')
}

function processWikilinks(text: string, prefix = ''): string {
  return text
    .replace(/\[\[([^\]|]+?)\\?\|([^\]]+)\]\]/g, (_, slug, label) => `[${label}](${prefix}/${encodeURIComponent(slug.trim())})`)
    .replace(/\[\[([^\]]+)\]\]/g, (_, slug) => `[${slug}](${prefix}/${encodeURIComponent(slug.trim())})`)
}

async function serveWikiPage(
  slug: string,
  nav: 'ru' | 'en',
  res: express.Response,
  noteState?: NoteState,
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
  const bodyHtml = marked.parse(processWikilinks(stripLeadingH1(content), prefix)) as string
  const displayTitle = (data.title as string) || page.title

  res.send(renderDetailPage(page, bodyHtml, { current: effectiveLang, nav, slug, hasEn }, displayTitle, noteState))
}

// ── Visitor notes ────────────────────────────────────────────────────────────
// One endpoint for every page: the slug travels in the form body. Post/Redirect/Get
// on success so a refresh cannot send the note twice; on failure the page is
// re-rendered with the form open and the typed text preserved.

app.post('/note', express.urlencoded({ extended: false, limit: '32kb' }), async (req, res) => {
  if (!notesEnabled()) { res.status(404).send('Not found'); return }

  const body = (req.body ?? {}) as Record<string, unknown>
  const nav: 'ru' | 'en' = body.lang === 'en' ? 'en' : 'ru'
  const slug = String(body.slug ?? '')

  const pages = await loadWikiPages()
  const page = pages.find(p => p.slug.toLowerCase() === slug.toLowerCase())
  if (!page || page.type !== 'place') { res.status(400).send('Bad request'); return }

  const check = validateNote(body, req.ip ?? 'unknown')
  if (!check.ok) {
    await serveWikiPage(page.slug, nav, res, { status: 'err', code: check.code, values: check.values })
    return
  }

  try {
    await sendNote({
      page,
      displayTitle: page.title,
      lang: nav,
      values: check.values,
      ip: req.ip ?? 'unknown',
      userAgent: String(req.get('user-agent') ?? ''),
    })
    res.redirect(303, `${wikiUrl(page.slug, nav)}?note=ok`)
  } catch (err) {
    console.error('[note] send failed:', err)
    await serveWikiPage(page.slug, nav, res, { status: 'err', code: 'mail', values: check.values })
  }
})

// `?note=ok` after the redirect that follows a successful submission.
function noteBanner(req: express.Request): NoteState | undefined {
  return req.query.note === 'ok' ? { status: 'ok' } : undefined
}

// ── EN routes (must come before /:slug to avoid /en being captured as slug) ──

app.get('/en/about', (_req, res) => res.send(renderAboutPage('en')))

app.get('/en', async (_req, res) => {
  const pages = await loadWikiPages()
  res.send(renderPage(pages, 'en'))
})

app.get('/en/:slug', async (req, res) => {
  await serveWikiPage(decodeURIComponent(req.params.slug), 'en', res, noteBanner(req))
})

// ── RU routes ────────────────────────────────────────────────────────────────

app.get('/about', (_req, res) => res.send(renderAboutPage('ru')))

app.get('/', async (_req, res) => {
  const pages = await loadWikiPages()
  res.send(renderPage(pages, 'ru'))
})

app.get('/:slug', async (req, res) => {
  await serveWikiPage(decodeURIComponent(req.params.slug), 'ru', res, noteBanner(req))
})

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`)
  loadWikiPages().then(pages => console.log(`Wiki cache warm: ${pages.length} pages`))
})
