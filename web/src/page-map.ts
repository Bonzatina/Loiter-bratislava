import type { WikiPage } from './wiki'
import { MARKER_COLOR, DOMAIN_COLOR, LEGEND_TYPES, ROUTES, UI_STRINGS } from './constants'
import { renderHeader, renderHtmlDocument } from './shared'

export function renderPage(pages: WikiPage[], lang: 'ru' | 'en' = 'ru'): string {
  return renderHtmlDocument({
    lang,
    title:  'Loiter: Bratislava',
    styles: [
      'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
      '/styles/shared.css',
      '/styles/map.css',
    ],
    body: `
${renderHeader(undefined, { current: lang })}

<div class="legend">
  ${Object.entries(LEGEND_TYPES).map(([type, color]) =>
    `<button class="legend-btn" data-type="${type}"><span class="dot" style="background:${color}"></span>${UI_STRINGS[lang].legend[type] ?? type}</button>`
  ).join('')}
</div>

<div id="map"></div>

<div class="search-wrap">
  <input type="search" id="search-input" placeholder="${UI_STRINGS[lang].searchPlaceholder}" autocomplete="off">
  <button id="search-clear" aria-label="Clear" style="display:none">✕</button>
</div>

<div class="content" id="list-content"></div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  window.DATA = {
    pages: ${JSON.stringify(pages)},
    routes: ${JSON.stringify(ROUTES)},
    colors: ${JSON.stringify(MARKER_COLOR)},
    domainColors: ${JSON.stringify(DOMAIN_COLOR)},
    legendTypes: ${JSON.stringify(Object.keys(LEGEND_TYPES))},
    legendColors: ${JSON.stringify(LEGEND_TYPES)},
    lang: ${JSON.stringify(lang)},
    ui: ${JSON.stringify(UI_STRINGS[lang])}
  }
</script>
<script src="/scripts/map.js"></script>`,
  })
}
