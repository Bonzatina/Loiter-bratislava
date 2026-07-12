import { renderHeader, renderHtmlDocument } from './shared'

export function renderAboutPage(lang: 'ru' | 'en' = 'ru'): string {
  const isEn = lang === 'en'

  const t = {
    pageTitle:   isEn ? 'About — Loiter: Bratislava'                         : 'О проекте — Loiter: Bratislava',
    h1:          isEn ? 'About'                                          : 'О проекте',
    intro1:      isEn
      ? 'Loiter: Bratislava is an interactive encyclopaedia for exploring the city: architecture, history, castles, museums, parks, culture, and specific places worth seeing with your own eyes.'
      : 'Loiter: Bratislava — интерактивная энциклопедия для исследования города: архитектура, история, замки, музеи, парки, культура и конкретные места, которые стоит увидеть своими глазами.',
    intro2:      isEn
      ? 'The project is personal and does not claim completeness or academic rigour. The choice of topics, places, and materials is subjective and reflects the author\'s own interests.'
      : 'Проект ведётся в личных целях и не претендует на полноту или академическую строгость. Выбор тем, мест и материалов субъективен и отражает личные интересы автора.',
    note:        isEn
      ? 'A language model (LLM) is used to process and structure material. Although all information is drawn from open sources, errors of interpretation or inaccuracies are possible. If you notice a mistake — it is probably there.'
      : 'При обработке и структурировании материалов используется языковая модель (LLM). Несмотря на то что все сведения берутся из открытых источников, ошибки интерпретации или неточности возможны. Если вы заметили ошибку — она там, скорее всего, есть.',
    support:     isEn ? 'Support the project:'                           : 'Поддержать проект:',
    h2:          isEn ? 'Sources'                                        : 'Источники',
    sourceIntro: isEn ? 'Open resources used as sources:'                : 'Открытые ресурсы, использованные как источники:',
    images:      isEn
      ? 'Photographs on place pages are taken from the open sources listed below. Copyright on images belongs to their respective owners. If you are a rights holder and wish to request removal of an image, please write to <a href="mailto:martymckul@gmail.com">martymckul@gmail.com</a>.'
      : 'Фотографии на страницах объектов взяты из открытых источников, перечисленных ниже. Авторские права на изображения принадлежат их правообладателям. Если вы правообладатель и хотите запросить удаление изображения, напишите на <a href="mailto:martymckul@gmail.com">martymckul@gmail.com</a>.',
  }

  // Seed list — extend thematically as sources are ingested
  // (tourism portals → Wikipedia → official sites → museums → publications → blogs).
  const descs: Record<string, string> = isEn ? {
    'sk.wikipedia.org':   'Slovak Wikipedia',
    'en.wikipedia.org':   'English Wikipedia',
    'hu.wikipedia.org':   'Hungarian Wikipedia',
    'cs.wikipedia.org':   'Czech Wikipedia',
    'commons.wikimedia.org': 'Wikimedia Commons',
    'visitbratislava.com': 'Official tourism portal',
    'bratislava.sk':      'Official website of the city of Bratislava',
    'register-architektury.sk': 'Register of modern Slovak architecture',
    'muzeum.sk':          'Directory of Slovak museums',
    'bratislavskenoviny.sk': 'Bratislava city newspaper',
    'pozsonyikifli.sk':   'Local-history journal about Bratislava',
    'divadelneprechadzky.theatre.sk': 'Theatre walks project of the Theatre Institute',
    'umeniemesta.sk':     'Database of art in public space',
    'bratislavastory.com': 'Blog of Bratislava city stories',
    'vypadni.sk':         'Slovak trip-ideas portal',
    'dubravka.sk':        'Official website of the Dúbravka borough',
    'bratislava.dnes24.sk': 'Bratislava news portal',
  } : {
    'sk.wikipedia.org':   'Словацкая Википедия',
    'en.wikipedia.org':   'Английская Википедия',
    'hu.wikipedia.org':   'Венгерская Википедия',
    'cs.wikipedia.org':   'Чешская Википедия',
    'commons.wikimedia.org': 'Викисклад',
    'visitbratislava.com': 'Официальный туристический портал',
    'bratislava.sk':      'Официальный сайт города Братислава',
    'register-architektury.sk': 'Реестр современной словацкой архитектуры',
    'muzeum.sk':          'Каталог музеев Словакии',
    'bratislavskenoviny.sk': 'Городская газета Братиславы',
    'pozsonyikifli.sk':   'Краеведческий журнал о Братиславе',
    'divadelneprechadzky.theatre.sk': 'Театральные прогулки Театрального института',
    'umeniemesta.sk':     'База данных искусства в общественном пространстве',
    'bratislavastory.com': 'Блог городских историй Братиславы',
    'vypadni.sk':         'Портал идей для прогулок по Словакии',
    'dubravka.sk':        'Официальный сайт городской части Дубравка',
    'bratislava.dnes24.sk': 'Новостной портал Братиславы',
  }

  const src = (domain: string) => `
    <li>
      <span class="src-domain">${domain}</span>
      <span class="src-desc">${descs[domain] ?? ''}</span>
    </li>`

  return renderHtmlDocument({
    lang,
    title: t.pageTitle,
    styles: ['/styles/shared.css', '/styles/about.css'],
    body: `${renderHeader('about', { current: lang })}
<div class="page-body">
  <h1>${t.h1}</h1>

  <p>${t.intro1}</p>

  <p>${t.intro2}</p>

  <div class="note">${t.note}</div>

  <div class="support-section">
    <p>${t.support}</p>
    <a href="https://ko-fi.com/bonzatina" class="donate-button">Ko-fi</a>
  </div>

  <h2>${t.h2}</h2>

  <p>${t.sourceIntro}</p>

  <p class="images-note">${t.images}</p>

  <ul class="sources-list">
    ${src('visitbratislava.com')}
    ${src('bratislava.sk')}
    ${src('sk.wikipedia.org')}
    ${src('en.wikipedia.org')}
    ${src('hu.wikipedia.org')}
    ${src('cs.wikipedia.org')}
    ${src('commons.wikimedia.org')}
    ${src('register-architektury.sk')}
    ${src('muzeum.sk')}
    ${src('bratislavskenoviny.sk')}
    ${src('pozsonyikifli.sk')}
    ${src('umeniemesta.sk')}
    ${src('bratislavastory.com')}
    ${src('vypadni.sk')}
    ${src('dubravka.sk')}
    ${src('bratislava.dnes24.sk')}
  </ul>
</div>`,
  })
}
