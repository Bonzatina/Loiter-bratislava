import type { WikiPage } from './wiki'
import { renderHeader, renderHtmlDocument, type LangConfig } from './shared'
import { homeUrl, mapHighlightUrl } from './routes'
import { UI_STRINGS } from './constants'

export function renderDetailPage(page: WikiPage, bodyHtml: string, langConfig: LangConfig, displayTitle: string): string {
  const meta = [
    `<span class="badge">${page.type}</span>`,
    page.district ? `<span class="badge">${page.district}</span>` : '',
    page.quarter  ? `<span class="badge">${page.quarter}</span>`  : '',
    page.domain    ? `<span class="badge">${page.domain}</span>`    : '',
    page.coords    ? `<span class="badge">${page.coords[0]}, ${page.coords[1]}</span>` : '',
  ].filter(Boolean).join('')

  const nav    = langConfig.nav ?? langConfig.current
  const ui     = UI_STRINGS[nav]
  const backHref = homeUrl(nav)
  const mapHref  = page.coords ? mapHighlightUrl(page.slug, nav) : undefined

  return renderHtmlDocument({
    lang:   langConfig.current,
    title:  `${displayTitle} — Loiter: Bratislava`,
    styles: ['/styles/shared.css', '/styles/detail.css'],
    body: `${renderHeader(undefined, langConfig)}
  <div class="page-body">
    <div class="page-nav">
      <a class="back" href="${backHref}">${ui.backToMap}</a>
      ${mapHref ? `<a class="show-on-map" href="${mapHref}">${ui.showOnMap}</a>` : ''}
    </div>
    <h1>${displayTitle}</h1>
    <div class="meta">${meta}</div>
    <div class="body">${bodyHtml}</div>
  </div>`,
  })
}
