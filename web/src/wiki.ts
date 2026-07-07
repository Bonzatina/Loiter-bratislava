import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export interface WikiPage {
  slug: string
  filePath: string
  title: string
  enTitle?: string
  type: string
  district?: string
  quarter?: string
  coords?: [number, number]
  domain?: string
  tags?: string[]
}

const WIKI_ROOT = path.resolve(__dirname, '../../wiki')

// Flat cross-district directories — not nested under a district folder.
// `districts/` holds the district (kerület) overview pages.
const FLAT_DIRS = ['districts', 'concepts', 'people', 'sources']
// Type subdirectories expected inside each district folder.
// `quarters` are named neighbourhoods (grouped by district in the list);
// `places` are specific attractions. Transport is out of scope.
const TYPE_DIRS = ['quarters', 'places']

async function readDir(dir: string): Promise<WikiPage[]> {
  const pages: WikiPage[] = []
  let entries: string[]
  try {
    entries = await fs.readdir(dir)
  } catch {
    return pages
  }
  for (const entry of entries) {
    if (!entry.endsWith('.md')) continue
    if (entry.endsWith('.en.md')) continue
    const raw = await fs.readFile(path.join(dir, entry), 'utf-8')
    const { data } = matter(raw)
    if (!data.title) continue
    let enTitle: string | undefined
    try {
      const enRaw = await fs.readFile(path.join(dir, entry.replace(/\.md$/, '.en.md')), 'utf-8')
      const { data: enData } = matter(enRaw)
      enTitle = enData.title as string | undefined
    } catch {}
    pages.push({
      slug: entry.replace(/\.md$/, ''),
      filePath: path.join(dir, entry),
      title: data.title as string,
      enTitle,
      type: (data.type as string) ?? 'unknown',
      district: data.district as string | undefined,
      quarter: data.quarter as string | undefined,
      coords: data.coords as [number, number] | undefined,
      domain: data.domain as string | undefined,
      tags: data.tags as string[] | undefined,
    })
  }
  return pages
}

let _cache: WikiPage[] | null = null

// Invalidate cache whenever any .md file in the wiki changes
fs.watch(WIKI_ROOT, { recursive: true }, (_event, filename) => {
  if (typeof filename === 'string' && filename.endsWith('.md')) _cache = null
})

async function _loadWikiPages(): Promise<WikiPage[]> {
  // Load flat cross-district directories
  const flatPages = (await Promise.all(
    FLAT_DIRS.map(d => readDir(path.join(WIKI_ROOT, d)))
  )).flat()

  // Discover district directories (any top-level dir not in FLAT_DIRS)
  let topEntries: string[]
  try {
    topEntries = await fs.readdir(WIKI_ROOT)
  } catch {
    return flatPages
  }
  const districtDirs: string[] = []
  for (const entry of topEntries) {
    if (FLAT_DIRS.includes(entry)) continue
    const fullPath = path.join(WIKI_ROOT, entry)
    const stat = await fs.stat(fullPath).catch(() => null)
    if (stat?.isDirectory()) districtDirs.push(fullPath)
  }

  // Load type subdirs within each district directory
  const districtPages = (await Promise.all(
    districtDirs.flatMap(dd => TYPE_DIRS.map(t => readDir(path.join(dd, t))))
  )).flat()

  return [...flatPages, ...districtPages]
}

export async function loadWikiPages(): Promise<WikiPage[]> {
  if (_cache) return _cache
  _cache = await _loadWikiPages()
  return _cache
}
