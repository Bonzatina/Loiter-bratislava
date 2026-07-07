export const homeUrl    = (lang: 'ru' | 'en'): string => lang === 'en' ? '/en' : '/'
export const aboutUrl   = (lang: 'ru' | 'en'): string => lang === 'en' ? '/en/about' : '/about'
export const wikiPrefix = (lang: 'ru' | 'en'): string => lang === 'en' ? '/en' : ''
export const wikiUrl    = (slug: string, lang: 'ru' | 'en'): string =>
  `${wikiPrefix(lang)}/${encodeURIComponent(slug)}`
export const mapHighlightUrl = (slug: string, lang: 'ru' | 'en'): string =>
  `${homeUrl(lang)}?highlight=${encodeURIComponent(slug)}`
