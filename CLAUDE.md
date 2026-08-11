# Bratislava Wiki — Schema

Part of **Loiter** — a family of city-drift wikis (sibling: `wiki_budapest`); the site brands itself «Loiter: Bratislava».

A personal knowledge base for discovering and documenting the city of **Bratislava** — its architecture, history, castles, museums, parks, viewpoints, cuisine, wine and culture. The scope is the city itself and its **17 boroughs** (mestské časti), grouped into five okres (Bratislava I–V), on both banks of the Danube. This project is a sibling of `wiki_budapest` and reuses the same web engine and conventions (district/quarter axis, RU+EN pages, map with domain-coloured markers).

## Directory Layout

```
wiki_bratislava/
├── CLAUDE.md                   ← this file — LLM schema and conventions
├── raw/                        ← immutable source documents (never modify; git-ignored)
│   ├── assets/                 ← downloaded images and attachments
│   └── *.md / *.pdf / *.txt   ← clipped articles, notes, transcripts
├── web/                        ← the map web app (Express + Leaflet, TypeScript)
└── wiki/                       ← LLM-generated and maintained pages
    ├── index.md                ← catalog of all wiki pages (update on every ingest)
    ├── log.md                  ← append-only activity log
    ├── overview.md             ← high-level synthesis of everything known so far
    ├── districts/              ← one overview page per BOROUGH (mestská časť); type: district
    ├── {district}/             ← one folder per borough (e.g. 1-stare-mesto/)
    │   ├── quarters/           ← named QUARTERS / localities within the borough
    │   └── places/             ← named attractions: churches, castles, museums, bridges, squares
    ├── people/                 ← architects, artists, historical figures (cross-district, flat)
    ├── concepts/               ← recurring themes and categories (cross-district, flat)
    └── sources/                ← kept empty (.gitkeep) — sources do NOT get their own pages
```

### The district axis (important)

The engine speaks **districts** and **quarters** natively (same code as wiki_budapest after the city-scale rename):

- A **district** here is a **borough** (mestská časť) — 17 of them. Its overview page lives in `wiki/districts/` with `type: district`, and its content folder sits at the wiki root (e.g. `wiki/1-stare-mesto/`).
- **District slug convention:** okres digit + Latin name slug, so the list sorts roughly west-centre-east: `1-stare-mesto`; `2-ruzinov`, `2-vrakuna`, `2-podunajske-biskupice`; `3-nove-mesto`, `3-raca`, `3-vajnory`; `4-karlova-ves`, `4-dubravka`, `4-lamac`, `4-devin`, `4-devinska-nova-ves`, `4-zahorska-bystrica`; `5-petrzalka`, `5-jarovce`, `5-rusovce`, `5-cunovo`. Transliterate diacritics in slugs (č→c, š→s, ž→z, á→a…).
- **District naming:** unlike Budapest's numbered kerület, Bratislava boroughs all have proper names — use them in titles: «Старе-Место (Staré Mesto, Bratislava I)». The okres number goes in parentheses, not as the primary name.
- The `district:` frontmatter field on every quarter/place holds the **borough slug**.
- A **quarter / locality** (Blumentál, Koliba, Dvory, Ovsište…) is optional and uses `type: quarter`; on the map these have their own marker colour and legend filter, and the list groups them under their borough. Use them only when a named area is worth its own page.

Add a new borough folder when it gains its first place page. The web app discovers district folders dynamically — no code change needed.

**Transport is out of scope**: no railway/ferry pages, and the tram/bus network is not tracked as map routes. (An individual landmark station that is itself a sight may still be a `place`.)

## Domains Covered

| Domain | Description |
|---|---|
| **Architecture** | Gothic and baroque Old Town, historicism, interwar modernism/functionalism, socialist-era layers (Petržalka panelák, SNP bridge/UFO), contemporary; monuments |
| **History** | Celtic/Roman Gerulata & Devín, medieval and coronation-era Pressburg/Pozsony, Habsburg era, 20th century, 1968, Iron Curtain |
| **Museums** | City, art, applied arts, house-museums, galleries (SNG, Danubiana) |
| **Sights** | Landmarks, squares, viewpoints, statues, hidden gems, ruins |
| **Lookouts** | Hilltop panoramas, towers (UFO, Kamzík), the castles' terraces |
| **Nature & Parks** | City parks, Danube banks and islands, Little Carpathians forest park, Devínska Kobyla — green markers |
| **Religion** | Cathedrals, churches (incl. the Blue Church), monasteries, synagogue heritage |
| **Cuisine** | Dishes, markets, cafés, confectioneries; **wine** — the Little Carpathian vineyards (Rača, Vajnory) |
| **Culture** | Theatres, festivals, crafts, communities |
| **People** | Architects, artists, historical figures who shaped the city |
| **Heraldry** | Coats of arms of the city and its boroughs |
| **Practical** | Seasonality, costs, opening hours, contacts |

Map domain colours (place markers): `museums` (purple), `nature` (cyan), `lookout` (gold); everything else falls under the default `sights` (olive). The `thermal` filter is hidden in this city (no objects); see `web/src/constants.ts` to add or recolour a domain — a new domain needs an entry in both `DOMAIN_COLOR` and `LEGEND_TYPES` plus a label in `UI_STRINGS.*.legend`.

**NOT tracked:** Accommodation (hotels, hostels, camping) — excluded.

## Page Conventions

### Frontmatter (YAML)
Every wiki page should start with:
```yaml
---
title: Page Title
type: district | quarter | place | person | concept | overview
domain: architecture | history | museums | sights | lookout | nature | religion | cuisine | culture | people | heraldry | practical
district: 1-stare-mesto            # BOROUGH slug; required for quarters & places; optional for concepts/people
quarter: blumental                 # optional — named quarter within the borough
coords: [48.14370, 17.10820]       # optional [lat, lon]; always 5 decimal places; never place two markers at identical/near-identical coords (they overlap and become unselectable) — if exact location is unknown, offset by ~0.0008–0.0015° from any nearby marker
tags: [tag1, tag2]
sources: [source-slug-1, source-slug-2]
updated: YYYY-MM-DD
---
```

`district` and `quarter` values are lowercase Latin slugs. They are the primary axes for map filtering.

### Cross-references
- Link to related pages using `[[Page Name]]` (Obsidian wikilink syntax), with optional display text: `[[slug|Отображаемый текст]]`.
- At the bottom of each page include a `## См. также` section with relevant links.
- Link inline on first mention of any entity, place, or concept that has (or should have) its own page. Avoid orphan pages (no inbound links).

### District (borough) pages — `wiki/districts/`
One page per borough, `type: district`, no `district` field:
- Name(s), which okres (Bratislava I–V), which bank of the Danube
- Geographic extent, character, and notable quarters
- What the borough offers (architecture, museums, nature, sights)
- **Coat of arms (герб): REQUIRED when available** — a `## Герб` (`## Coat of Arms` in .en.md) section before the objects list: the image (download to `web/assets/erb-{slug}.png`, usually from Wikimedia Commons) plus a short description of the arms when one can be given
- Links to all quarters and places within it

### Quarter pages — `wiki/{district}/quarters/`
For named localities (`type: quarter`). Keep brief: location, character, what's there, links to places. Use only when a named area warrants it.

### Place pages — `wiki/{district}/places/`
For specific named attractions (`type: place`): castles, museums, churches, bridges, squares, statues, parks, lookouts:
- What it is and why it matters; history and description
- Practical info when available — a `## Практическая информация` / `## Practical Information` section written as a **plain bullet list** (no bold labels), one fact per line in the order `Адрес` / `Часы` / `Билеты` / `Сайт` (`Address` / `Hours` / `Tickets` / `Website`), extra labels (`Группы`, `Доступ`, `Парковка`, `Контакты`) after them. A website is always a markdown link with the bare domain as display text: `- Сайт: [snm.sk](https://snm.sk)`. Same convention as `wiki_berlin`.
- Link to the borough (and quarter, if any)
- **Representative image (REQUIRED for every place):** a map user moving toward an object must see roughly what to expect. Take the image from the source page when it has one; otherwise find one on Wikimedia Commons (verify the file actually depicts THIS building — check the description, not just the filename) or on the cited institution's site; archival photos are fine for demolished buildings. Download it to `web/assets/` with a descriptive filename (e.g. `bratislavsky-hrad.jpg`) using `curl -sL -o web/assets/name.jpg URL`, then embed it after the opening paragraph (before the first `##`): `![Заголовок (оригинальное название)](/assets/filename)`. **Display size is capped globally by CSS** (`web/styles/detail.css`) — do not set per-image dimensions. The same applies to portraits on people pages.

### People pages — `wiki/people/`
Architects, artists, historical figures with a meaningful Bratislava connection: life dates, field/style, works in the city, legacy. Keep focus on the city, not full biography.

### Concept pages — `wiki/concepts/`
Recurring themes (e.g. "coronation city", "functionalism", "Little Carpathian wine"): definition, where observed, examples with links, variations or contradictions.

### Sources — no dedicated pages, no per-page source sections
Sources do **not** get their own wiki pages (`wiki/sources/` stays empty), and entity pages must **NOT** carry a visible `## Источник(и)` / `## Sources` section — pages end with `## См. также`. A source is tracked centrally, which together is sufficient for provenance: (1) the immutable copy in `raw/` when one was saved (e.g. downloaded HTML under `raw/{site}/`); (2) a row `` `slug` | URL | short description `` in the «Источники» table of `wiki/index.md` — the single slug→URL registry; (3) the slug in each page's `sources:` frontmatter (machine-readable linkage only, not rendered as text); (4) the site domain in the about-page list (`web/src/page-about.ts`).

## Operations

### Ingest a new source
1. Read the raw file in `raw/` (or fetch the URL the user gives).
2. Discuss key takeaways with the user; confirm scope/fit before creating many pages.
3. Register the source: pick a slug, add a row (slug | URL | description) to the «Источники» table in `wiki/index.md`, save a raw copy under `raw/` when practical, and add the site domain to `web/src/page-about.ts` if it is new. Do **not** create a page in `wiki/sources/` and do **not** add source sections to entity pages (slug in `sources:` frontmatter is enough).
4. Create or update entity pages for any places mentioned:
   - **Image:** required — see Place pages above.
   - **Geocoding:** for every new quarter or place, resolve coords via Nominatim:
     `https://nominatim.openstreetmap.org/search?q=QUERY&format=json&limit=1`
     Use the street address if known, otherwise `Name, Bratislava`. Round `lat`/`lon` to 5 decimals. Skip if the result is clearly wrong (check the `display_name` — Nominatim may return a same-named station or street elsewhere). Never place two markers at near-identical coords — offset by ~0.0008–0.0015° if needed.
     *Tip (Git Bash):* percent-encode diacritics via `curl -G --data-urlencode "q=..."`, or transliterate to ASCII; space requests ≥1s apart to avoid Nominatim rate-limiting.
5. **Create English translations** for every newly created page (districts, quarters, places, people, concepts). Write the `.en.md` sibling immediately after the Russian base file — same frontmatter with translated `title`, translated body, and `## See Also` instead of `## См. также`.
6. Create or update concept pages for recurring themes.
7. Update `wiki/overview.md` if the big picture changed.
8. Update `wiki/index.md` — make sure the new source row and all created/modified pages are listed.
9. Append to `wiki/log.md`: `## [YYYY-MM-DD] ingest | Source Title`

### Answer a query
1. Read `wiki/index.md` to find relevant pages → read them → synthesize with inline `[[wikilinks]]`.
2. Offer to save non-trivial answers as a new entity/concept page.
3. Append to `wiki/log.md`: `## [YYYY-MM-DD] query | Question summary`

### Lint the wiki
Check for: contradictions, orphan pages, concepts mentioned but lacking a page, stale claims, missing cross-references, data gaps, quarters/places missing a `district` field, quarters/places missing `coords` (note as a gap, not an error), places missing an image, markers at near-identical coords.
Append to `wiki/log.md`: `## [YYYY-MM-DD] lint | brief findings`

## Language

**All wiki pages must be written in Russian** — titles, body, frontmatter `title`, headings, and the `## См. также` section. Tags and `type`/`domain`/`district` values stay in English/Latin.

**English translations** are sibling files with a `.en.md` suffix alongside the Russian base file (e.g. `Bratislavsky-hrad.md` + `Bratislavsky-hrad.en.md`). The web server resolves `?lang=en` (the `/en/...` routes) by checking for `Slug.en.md` first and falling back to `Slug.md`. Translation files share the same frontmatter; only `title` and body are translated, and `## См. также` becomes `## See Also`.

This file (CLAUDE.md) and log-entry prefixes stay in English as LLM operational instructions.

## Filenames

**All filenames must use Latin characters only — no Cyrillic.** Applies to every file in `wiki/`.

- **Borough folders & overview pages:** `N-name` slug (ASCII), e.g. `1-stare-mesto`, `5-petrzalka`, `4-devin`.
- **Quarters:** Slovak name, Latin letters (diacritics allowed): `Blumentál.md`, `Koliba.md`.
- **Places:** descriptive Latin slug from the Slovak name of the object, diacritics stripped for the slug: `Bratislavsky-hrad.md`, `Modry-kostolik.md`, `Most-SNP.md`, `Hrad-Devin.md`, `Stara-radnica.md`.
- **People:** native form of the name: `Jurkovic-Dusan.md`, `Belluš-Emil.md` → `Bellus-Emil.md` (ASCII in slug).
- **Concepts:** descriptive English slug: `coronation-city.md`, `functionalism.md`, `little-carpathian-wine.md`.
- **Source slugs** (identifiers only, no files): lowercase hyphenated, often `{topic}-{site}-{year}`: `bratislavsky-hrad-visitbratislava-2026`.

When a file is renamed, update all `[[wikilinks]]` throughout the wiki, preserving the Russian display text: `[[new-latin-name|Русское отображаемое название]]`.

## Style Notes
- Write in clear, factual prose — not bullet dumps. Short paragraphs with inline wikilinks over long lists.
- Hedge uncertain facts with neutral phrases («считается», «вероятно», «по преданию»), but do **NOT** attribute individual facts inline to named sources — no «По данным [сайта/блога/Википедии], …» / "According to [outlet], …" inserts. Sources live only in the `sources:` frontmatter and the «Источник(и)» section at the bottom of the page. When sources contradict, note it neutrally in the text («по разным данным, 1810 или 1811») and record the specifics in `log.md`.
- **Original names in parentheses:** whenever a named location is referred to by its Russian-translated name, immediately follow it with the original Slovak name in parentheses: «Братиславский град (Bratislavský hrad)», «Голубой костёл (Modrý kostolík)», «Старая ратуша (Stará radnica)». Historic German/Hungarian names (Pressburg, Pozsony) may be added where historically relevant.
- Section heading `## См. также` (not "See Also") at the bottom of every Russian page; `## See Also` in `.en.md`.
- Keep pages focused on what's relevant to visiting and understanding the city.

## Web App (`web/`)

Express + Leaflet app (TypeScript via `tsx`), shared engine with wiki_budapest. Run with `cd web && npm install && npm start` → http://localhost:3002 (port 3002 so both city wikis can run side by side).

- **Map + filterable list:** markers come from page `coords`; the list updates to the visible map area, supports box-select and search. District (`type: district`) markers are large and green, quarter markers are blue-grey; `place` markers are coloured by domain.
- **Dynamic discovery:** `web/src/wiki.ts` treats every top-level `wiki/` folder that isn't `districts/concepts/people/sources` as a **borough**, reading its `quarters/` and `places/` subfolders. No code change is needed to add a borough — just create the folder and a `districts/{slug}.md` overview.
- **Language:** `/` and `/:slug` serve Russian; `/en` and `/en/:slug` serve English (falling back to the Russian file when no `.en.md` exists).
- **Legend / domains:** edit `web/src/constants.ts` (`DOMAIN_COLOR`, `LEGEND_TYPES`, `UI_STRINGS.*.legend`). List section headers under the map are localized per language; only the legend filter buttons above the map stay in English. Map starts centred on Bratislava (`web/scripts/map.js`).
- **About page sources list** (`web/src/page-about.ts`): add new source domains with brief, unqualified descriptions, grouped thematically (tourism portals → Wikipedia → official sites → museums → publications → blogs). Name the resource type without elaboration: «Городской журнал о Братиславе», not «… — история, события, маршруты».
- Transport-specific engine features (railway/ferry routes) are intentionally left empty (`ROUTES = []`) and unused.
- **Visitor notes (`web/src/notes.ts`):** every `type: place` page carries a «Оставить заметку» form (a `<details>` block — no JavaScript involved). `POST /note` validates, then mails the note to the moderator through the Resend HTTP API; nothing is stored. Post/Redirect/Get on success (`?note=ok` renders the thank-you banner); on failure the page re-renders with the form open and the text preserved. Anti-spam: honeypot field, HMAC-signed render timestamp (a post faster than 3 s is rejected), max two links, in-memory rate limit of 3 notes per 10 minutes and 10 per day per IP. Notes go to `loiter.traveler@gmail.com` (the project mailbox, also shown on the about page). Environment: `NOTES_API_KEY`, `NOTES_TO`, `NOTES_SECRET` are required — **without them the button is not rendered and `POST /note` returns 404**, which is the correct state for local work; optional `NOTES_FROM` (defaults to `onboarding@resend.dev`), `NOTES_SUBJECT_PREFIX`, `SITE_URL` (absolute links in the e-mail). Run locally with `NOTES_API_KEY=x NOTES_TO=you@example.com NOTES_SECRET=dev npm start` — a bogus key exercises the failure path without sending anything.
- **Dev-server note (Windows):** before re-running `npm start`, make sure no old process still holds the port — a leftover server keeps serving a stale wiki cache and smoke tests will mislead you. Kill listeners on 3002 via PowerShell `Get-NetTCPConnection -LocalPort 3002 -State Listen | % { Stop-Process -Id $_.OwningProcess -Force }`.
