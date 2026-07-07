// Marker colours by page type. `district` is a Bratislava borough (mestská časť)
// overview marker; `quarter` is a named neighbourhood; `place` is a specific
// attraction.
export const MARKER_COLOR: Record<string, string> = {
  district: '#2e7d32',
  quarter:  '#607d8b',
  place:    '#a0b930',
}

// Domain colours for `place` markers. A place's first matching domain wins.
export const DOMAIN_COLOR: Record<string, string> = {
  nature:  '#00acc1',
  thermal: '#e8743b',
  museums: '#8e6c9e',
  lookout: '#c49a2a',
}

// Legend filter buttons. The key MUST equal either a page `type` (district/quarter)
// or a place `domain` (sights/museums/nature/thermal/lookout) for filtering
// to work. `sights` is the default bucket for places without a filtered domain.
export const LEGEND_TYPES: Record<string, string> = {
  district: '#2e7d32',
  quarter:  '#607d8b',
  sights:   '#a0b930',
  museums:  '#8e6c9e',
  nature:   '#00acc1',
  // thermal hidden — no thermal objects in Bratislava yet; re-add if one appears.
  lookout:  '#c49a2a',
}

export const UI_STRINGS = {
  ru: {
    open:            'Открыть →',
    startStation:    'начальная станция',
    terminus:        'конечная',
    // Заголовки разделов списка — локализованы; всегда по-английски остаётся
    // только легенда-фильтры над картой (см. `legend` ниже).
    districts:       'Районы',
    quarters:        'Кварталы',
    places:          'Достопримечательности',
    railways:        'Железные дороги',
    ferries:         'Паромы',
    concepts:        'Концепции',
    people:          'Персоналии',
    noItems:         'Нет объектов в текущей области — переместите карту или уменьшите масштаб.',
    clearSel:        '✕ Сбросить выделение',
    drawActive:      '◻ Рисуйте область…',
    drawIdle:        '⬚ Выделить зону',
    whereAmI:        '⊕ Где я?',
    locating:        '⊙ Определяю…',
    iAmHere:         '⊙ Я здесь',
    noGeo:           'Геолокация не поддерживается вашим браузером.',
    helpNavTitle:    'Навигация',
    helpNavBody:     'Список обновляется по видимой области при перемещении и зуме.',
    helpSelTitle:    'Выделение зоны',
    helpDesktop:     'Десктоп:',
    helpMobile:      'Мобильный:',
    helpMobileHint:  'кнопка «⬚ Выделить зону» → провести пальцем.',
    helpEsc:         '— сбросить.',
    backToMap:           '← Карта',
    showOnMap:           'Показать на карте →',
    searchPlaceholder:   'Поиск по названию, тегу, району…',
    legend: {
      district: 'districts',
      quarter:  'quarters',
      sights:   'sights',
      museums:  'museums',
      nature:   'nature',
      thermal:  'baths',
      lookout:  'lookouts',
    } as Record<string, string>,
  },
  en: {
    open:            'Open →',
    startStation:    'start station',
    terminus:        'terminus',
    districts:       'Districts',
    quarters:        'Quarters',
    places:          'Sights',
    railways:        'Railways',
    ferries:         'Ferries',
    concepts:        'Concepts',
    people:          'People',
    noItems:         'No items in the current view — pan or zoom out.',
    clearSel:        '✕ Clear selection',
    drawActive:      '◻ Draw area…',
    drawIdle:        '⬚ Select area',
    whereAmI:        '⊕ Where am I?',
    locating:        '⊙ Locating…',
    iAmHere:         '⊙ I\'m here',
    noGeo:           'Geolocation is not supported by your browser.',
    helpNavTitle:    'Navigation',
    helpNavBody:     'The list updates to show items in the current map view as you pan and zoom.',
    helpSelTitle:    'Area selection',
    helpDesktop:     'Desktop:',
    helpMobile:      'Mobile:',
    helpMobileHint:  'tap «⬚ Select area» button → drag.',
    helpEsc:         '— clear.',
    backToMap:           '← Map',
    showOnMap:           'Show on map →',
    searchPlaceholder:   'Search by name, tag, district…',
    legend: {
      district: 'districts',
      quarter:  'quarters',
      sights:   'sights',
      museums:  'museums',
      nature:   'nature',
      thermal:  'baths',
      lookout:  'lookouts',
    } as Record<string, string>,
  },
} as const
export type UIStrings = typeof UI_STRINGS.ru

// No heritage railways / ferries in the city wiki — transport is out of scope.
export const ROUTES: { slug: string; type: 'railway' | 'ferry'; points: [number, number][]; terminus: string }[] = []
