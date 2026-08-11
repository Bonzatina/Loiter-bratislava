import type { WikiPage } from './wiki'
import { renderHeader, renderHtmlDocument, type LangConfig } from './shared'
import { homeUrl, mapHighlightUrl } from './routes'
import { UI_STRINGS } from './constants'
import { notesEnabled, stamp, notesContact, NOTE_MAX, type NoteErrorCode, type NoteValues } from './notes'

/** State of the visitor-note form after a submission attempt. */
export interface NoteState {
  status: 'ok' | 'err'
  code?: NoteErrorCode
  values?: NoteValues
}

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

/** Both language blocks share these keys; widen the literal types to string. */
type NoteStrings = { [K in keyof (typeof UI_STRINGS)['ru']['notes']]: string }

function errorText(n: NoteStrings, code?: NoteErrorCode): string {
  switch (code) {
    case 'short': return n.errShort
    case 'long':  return n.errLong
    case 'links': return n.errLinks
    case 'bot':   return n.errBot
    case 'rate':  return n.errRate
    case 'mail':  return n.errMail
    default:      return n.errBad
  }
}

function renderNoteForm(
  page: WikiPage,
  displayTitle: string,
  nav: 'ru' | 'en',
  noteState?: NoteState,
): string {
  // Notes are for objects a visitor can actually stand in front of: `place`
  // pages only — not districts, quarters, concepts or people.
  if (page.type !== 'place' || !notesEnabled()) return ''

  const ui = UI_STRINGS[nav].notes
  const { ts, sig } = stamp()
  const v = noteState?.values
  const isErr = noteState?.status === 'err'

  let banner = ''
  if (noteState?.status === 'ok') {
    banner = `<p class="note-banner note-ok">${ui.ok}</p>`
  } else if (isErr) {
    const contact = notesContact()
    const fallback = noteState?.code === 'mail' && contact
      ? ` <a href="mailto:${esc(contact)}?subject=${encodeURIComponent(`${displayTitle} — ${ui.button}`)}">${esc(contact)}</a>`
      : ''
    banner = `<p class="note-banner note-err">${errorText(ui, noteState?.code)}${fallback}</p>`
  }

  return `
    ${banner}
    <details class="note-box"${isErr ? ' open' : ''}>
      <summary>${ui.button}</summary>
      <form class="note-form" method="post" action="/note">
        <input type="hidden" name="slug" value="${esc(page.slug)}">
        <input type="hidden" name="lang" value="${nav}">
        <input type="hidden" name="ts" value="${ts}">
        <input type="hidden" name="sig" value="${sig}">
        <div class="nf-hp" aria-hidden="true">
          <label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
        </div>
        <p class="nf-intro">${ui.intro}</p>
        <label class="nf-label" for="nf-note">${ui.noteLabel}</label>
        <textarea id="nf-note" name="note" rows="6" maxlength="${NOTE_MAX}" required
                  placeholder="${esc(ui.notePh)}">${v ? esc(v.note) : ''}</textarea>
        <div class="nf-row">
          <label class="nf-field">${ui.visited} <span class="nf-opt">${ui.optional}</span>
            <input type="date" name="visited" value="${v ? esc(v.visited) : ''}">
          </label>
          <label class="nf-field">${ui.name} <span class="nf-opt">${ui.optional}</span>
            <input type="text" name="name" maxlength="80" value="${v ? esc(v.name) : ''}">
          </label>
          <label class="nf-field">${ui.email} <span class="nf-opt">${ui.optional}</span>
            <input type="email" name="email" maxlength="120" value="${v ? esc(v.email) : ''}">
          </label>
        </div>
        <button class="nf-submit" type="submit">${ui.submit}</button>
        <p class="nf-privacy">${ui.privacy}</p>
      </form>
    </details>`
}

export function renderDetailPage(
  page: WikiPage,
  bodyHtml: string,
  langConfig: LangConfig,
  displayTitle: string,
  noteState?: NoteState,
): string {
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
    ${renderNoteForm(page, displayTitle, nav, noteState)}
  </div>`,
  })
}
