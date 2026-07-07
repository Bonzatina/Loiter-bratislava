import { homeUrl, aboutUrl, wikiUrl } from './routes'

export interface LangConfig {
  current: 'ru' | 'en'
  nav?: 'ru' | 'en'   // navigation context; differs from current when EN page has no .en.md
  slug?: string
  hasEn?: boolean
}

function renderLangSwitcher(
  lang: 'ru' | 'en',
  ruHref: string,
  enHref: string,
  enDisabled = false,
): string {
  const ruPart = lang === 'ru'
    ? `<span class="lang-btn lang-active">RU</span>`
    : `<a class="lang-btn lang-link" href="${ruHref}">RU</a>`
  const enPart = lang === 'en'
    ? `<span class="lang-btn lang-active">EN</span>`
    : enDisabled
      ? `<span class="lang-btn lang-off" title="No translation yet">EN</span>`
      : `<a class="lang-btn lang-link" href="${enHref}">EN</a>`
  return `<div class="lang-switcher">${ruPart}${enPart}</div>`
}

export function renderHtmlDocument(opts: {
  lang?: string
  title: string
  styles: string[]
  body: string
}): string {
  const htmlLang = opts.lang ?? 'ru'
  const styleLinks = opts.styles
    .map(href => `  <link rel="stylesheet" href="${href}"/>`)
    .join('\n')
  const updated = new Date().toISOString().slice(0, 10)
  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${opts.title}</title>
${styleLinks}
</head>
<body>
${opts.body}
<footer>© bonzatina · ${updated}</footer>
<script data-goatcounter="https://bonzatina.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
</body>
</html>`
}

export function renderHeader(activePage?: string, langConfig?: LangConfig): string {
  const lang  = langConfig?.current ?? 'ru'
  const nav   = langConfig?.nav ?? lang
  const slug  = langConfig?.slug
  const hasEn = langConfig?.hasEn ?? false

  const homeHref  = homeUrl(nav)
  const aboutHref = aboutUrl(nav)

  let langSwitcher: string
  if (slug) {
    langSwitcher = renderLangSwitcher(lang, wikiUrl(slug, 'ru'), wikiUrl(slug, 'en'), !hasEn)
  } else {
    const ruHref = activePage === 'about' ? aboutUrl('ru') : homeUrl('ru')
    const enHref = activePage === 'about' ? aboutUrl('en') : homeUrl('en')
    langSwitcher = renderLangSwitcher(lang, ruHref, enHref)
  }

  return `<header>
  <div class="header-left">
    <h1><a href="${homeHref}">Loiter: Bratislava</a></h1>
  </div>
  <nav class="header-nav">
    <a href="${aboutHref}"${activePage === 'about' ? ' class="active"' : ''}>${lang === 'en' ? 'About' : 'О проекте'}</a>
    ${langSwitcher}
  </nav>
</header>`
}
