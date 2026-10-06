// @ts-nocheck
// UI strings. Russian first; English second.
// The site name is a WORKING TITLE — replace "siteName" in both languages once chosen.
export const I18N: any = {
  ru: {
    siteName: "Сдай батарейку",
    announce: "«Батарейки, сдавайтесь!» — онлайн-акция для волонтёров, до 30 сентября. Подать заявку",
    nav: { map: "Карта", guide: "Что принимают", why: "Почему это важно", faq: "Вопросы", volunteer: "Волонтёрам", about: "О проекте", feedback: "Обратная связь" },
    menu: { account: "Личный кабинет: мои батарейки, избранные пункты", soon: "скоро" },
    hero: {
      pilot: "Пилотный район: Чертаново, ЮАО",
      title: "Куда сдать батарейки?",
      tagline: "Счастливые батарейки — рядом с домом",
      lead: "Проверенные пункты приёма батареек и аккумуляторов рядом с домом: адрес, часы работы, что принимают и как найти вход.",
      cta: "Показать пункты",
      cta2: "Как подготовить",
      statPoints: "пунктов приёма",
      statVerifiedVal: "Сентябрь 2026",
      statVerified: "последняя проверка"
    },
    map: {
      title: "Пункты приёма",
      sub: "Номера на карте совпадают со списком. Нажмите на адрес, чтобы узнать подробности.",
      all: "Все",
      open24: "Круглосуточно",
      details: "Подробнее",
      approx: "Координаты приблизительные — уточняются.",
      addresses: "адреса",
      near: "Ближайший ко мне",
      noGeo: "Не удалось определить местоположение. Выберите пункт на карте."
    },
    detail: {
      back: "Назад к карте",
      accepts: "Что принимают",
      limit: "Ограничения по количеству",
      hours: "Часы работы",
      address: "Адрес",
      contact: "Контакты",
      bonus: "Бонусы",
      kind: "Тип пункта",
      verified: "Проверено",
      howto: "Как найти пункт",
      photoBuilding: "1. Здание",
      photoEntrance: "2. Вход",
      photoPoint: "3. Сам пункт приёма",
      photoSoon: "Фото скоро",
      photoMore: "Фото",
      steps: "Пошагово",
      route: "Открыть в Яндекс Картах",
      usefulQ: "Была ли информация полезной?",
      yes: "Да",
      no: "Нет",
      planQ: "Планируете сдать батарейки здесь?",
      planYes: "Да, планирую",
      planNo: "Пока нет",
      thanks: "Спасибо! Это помогает нам улучшать сайт.",
      notFound: "Такого пункта нет. Вернитесь к карте."
    },
    more: {
      title: "Ещё полезное",
      items: [
        { href: "guide.html", emoji: "🔋", title: "Что принимают", desc: "Какие батарейки подходят и как их подготовить" },
        { href: "why.html", emoji: "🌱", title: "Почему это важно", desc: "Что происходит с батарейкой на свалке" },
        { href: "faq.html", emoji: "💬", title: "Вопросы", desc: "Бонусы, количество, повреждённые батарейки" },
        { href: "volunteer.html", emoji: "⭐", title: "Волонтёрам", desc: "Акции и события в Чертаново" }
      ]
    },
    problem: {
      title: "В чём проблема?",
      items: [
        "Батарейки содержат тяжёлые металлы — свинец, кадмий, литий. На свалке они попадают в почву и грунтовые воды.",
        "Литий-ионные аккумуляторы легко замыкаются, загораются или взрываются, когда их сдавливают в мусоровозах и прессах.",
        "Электроники и электромобилей становится всё больше — опасных отходов появляется быстрее, чем их успевают переработать.",
        "Люди годами хранят батарейки дома, потому что не знают, куда их отнести, и не находят на это времени."
      ]
    },
    why: {
      title: "Почему важно сдавать батарейки",
      items: [
        "Тяжёлые металлы и токсичные вещества не попадают из свалки в почву и воду.",
        "Нет риска пожара и взрыва повреждённых аккумуляторов в мусоровозах, прессах и на полигонах.",
        "Ценные металлы возвращаются в производство — меньше разрушительной добычи руды.",
        "Переработка требует значительно меньше энергии и даёт меньше выбросов парниковых газов, чем выплавка из руды."
      ]
    },
    guide: {
      title: "Что принимают",
      yesTitle: "Подходят почти любые",
      yes: ["Пальчиковые и мизинчиковые (AA, AAA)", "«Таблетки» и часовые батарейки", "Кроны, C, D и другие бытовые", "Аккумуляторы от телефонов, ноутбуков и инструментов (в отдельных пунктах)"],
      noTitle: "Не принимают",
      no: ["Повреждённые, вздутые, протекающие", "Безымянные или самодельные батарейные блоки", "Автомобильные аккумуляторы (нужен отдельный пункт)"]
    },
    prep: {
      title: "Нужно ли готовить батарейки?",
      items: [
        "Специальная подготовка не нужна. Сложите батарейки в пакет или банку.",
        "Заклейте контакты литиевых аккумуляторов скотчем, чтобы они не замкнулись.",
        "Не храните батарейки рядом с металлическими предметами и не разбирайте их.",
        "Проверьте на карточке пункта, что там принимают именно ваш тип."
      ],
      photoCap: "Так выглядит бокс для батареек в магазине — обычно у входа или у касс."
    },
    bonus: {
      title: "Будут ли бонусы?",
      text: "В пилотном районе пункты пока не начисляют бонусы. Городская программа на recycle.mos.ru и программы лояльности сетей — уточняем условия и добавим сюда."
    },
    faq: {
      title: "Частые вопросы",
      items: [
        { q: "Какие батарейки можно сдать?", a: "Почти любые бытовые батарейки и аккумуляторы: AA, AAA, «таблетки», кроны, аккумуляторы телефонов. Не принимают повреждённые и безымянные батарейные блоки. Перезаряжаемые аккумуляторы принимают не везде — смотрите карточку пункта." },
        { q: "Что не принимают?", a: "Повреждённые, вздутые или протекающие батарейки; безымянные и самодельные батарейные блоки; автомобильные аккумуляторы — для них нужен отдельный пункт." },
        { q: "Что делать с повреждённой или вздутой батарейкой?", a: "Не кладите её в общий бокс. Положите в отдельный пакет, изолируйте контакты и уточните в пункте приёма или у городского эко-центра, примут ли её." },
        { q: "Нужно ли готовить батарейки?", a: "Специальная подготовка не нужна — сложите батарейки в пакет или банку. Литиевым аккумуляторам заклейте контакты скотчем, не храните батарейки рядом с металлом и проверьте на карточке пункта, что там принимают ваш тип." },
        { q: "Есть ли бонусы?", a: "Пока нет. Мы уточняем условия городской программы «Экобаллы» на recycle.mos.ru и программ лояльности сетей." },
        { q: "Почему нельзя выбросить батарейки в обычный мусор?", a: "На свалке тяжёлые металлы попадают в почву и воду, а литиевые аккумуляторы могут загореться при сдавливании в мусоровозе." },
        { q: "Принимают ли мелкую электронику?", a: "В пилотном районе — пока только батарейки и аккумуляторы. Пункты приёма электроники добавим после проверки." },
        { q: "Сколько можно сдать за раз?", a: "Обычно — бытовое количество, один пакет. Точные ограничения указаны на карточке пункта." },
        { q: "Информация устарела или пункта нет?", a: "Напишите нам через форму внизу — мы проверим и исправим в течение нескольких дней." }
      ]
    },
    vol: {
      title: "Волонтёрам",
      sub: "Акции и события, где можно помочь со сбором батареек.",
      events: [
        { name: "Акция «Батарейки, сдавайтесь!»", format: "Онлайн · 1–30 сентября 2026", desc: "Соберите батарейки дома, у соседей и в классе и сдайте их в ближайший пункт приёма. Организатор — Московский дорожный совет по корпоративному волонтёрству ОАО «РЖД».", hours: "Верифицированные волонтёрские часы на Добро.рф", who: "Возраст: 8+", url: "https://dobro.ru/event/11840898", cta: "Подать заявку на Добро.рф" }
      ]
    },
    mission: {
      title: "Наша миссия",
      text: "Сделать так, чтобы каждому жителю Москвы было просто сдать батарейки: мы собираем проверенные пункты приёма, правила и бонусы в одном месте — начиная с Чертаново."
    },
    about: {
      title: "О проекте",
      p1: "Наша цель — сделать так, чтобы каждому жителю Москвы было просто сдать батарейки и мелкую электронику: собрать все проверенные пункты приёма, правила и бонусы на одном сайте, удобном для телефона.",
      p2: "Мы начинаем с одного района — Чертаново — и проверяем каждую точку лично, а не по описанию в интернете. Десять правильных пунктов лучше пятидесяти наполовину неверных: тот, кто придёт к закрытому пункту, не вернётся.",
      p3: "Проект делают школьники и студенты. Информацию о сайте мы распространяем через плакаты с QR-кодом в подъездах и магазинах, а также в Telegram и ВКонтакте."
    },
    fb: {
      title: "Обратная связь",
      sub: "Нашли ошибку, знаете ещё один пункт или сдали батарейки после нашего сайта? Напишите нам.",
      type: "Тема",
      types: ["Ошибка в пункте приёма", "Новый пункт приёма", "Вопрос", "Предложение", "Другое"],
      message: "Сообщение",
      contact: "Как с вами связаться (необязательно)",
      recycled: "Я сдал(а) батарейки после того, как воспользовался(ась) сайтом",
      send: "Отправить",
      thanks: "Спасибо! Сообщение сохранено. Мы ответим или исправим информацию в ближайшие дни.",
      empty: "Пожалуйста, напишите сообщение."
    },
    footer: {
      proto: "Прототип, сентябрь 2026. Данные проверяются ежемесячно.",
      links: "Telegram · ВКонтакте — скоро",
      credits: "Фото"
    }
  },

  en: {
    siteName: "Battery Drop-off",
    announce: "“Batteries, surrender!” — online volunteer campaign, until 30 September. Apply",
    nav: { map: "Map", guide: "What's accepted", why: "Why it matters", faq: "FAQ", volunteer: "Volunteer", about: "About", feedback: "Feedback" },
    menu: { account: "My account: batteries recycled, favourite points", soon: "soon" },
    hero: {
      pilot: "Pilot district: Chertanovo, South Moscow",
      title: "Where can I dispose of my batteries?",
      tagline: "Happy batteries nearby",
      lead: "Verified battery drop-off points near you: address, hours, what they accept, and photos showing how to find the entrance.",
      cta: "Show me where",
      cta2: "How to prepare",
      statPoints: "drop-off points",
      statVerifiedVal: "September 2026",
      statVerified: "last checked"
    },
    map: {
      title: "Drop-off points",
      sub: "Numbers on the map match the list. Tap an address for details.",
      all: "All",
      open24: "24 hours",
      details: "Details",
      approx: "Coordinates are approximate and being confirmed.",
      addresses: "locations",
      near: "Nearest to me",
      noGeo: "Could not get your location. Pick a point on the map."
    },
    detail: {
      back: "Back to map",
      accepts: "What they accept",
      limit: "Quantity limits",
      hours: "Hours",
      address: "Address",
      contact: "Contact",
      bonus: "Bonuses",
      kind: "Point type",
      verified: "Verified",
      howto: "How to find the point",
      photoBuilding: "1. The building",
      photoEntrance: "2. The entrance",
      photoPoint: "3. The drop-off box",
      photoSoon: "Photo coming soon",
      photoMore: "Photo",
      steps: "Step by step",
      route: "Open in Yandex Maps",
      usefulQ: "Was this useful?",
      yes: "Yes",
      no: "No",
      planQ: "Are you planning to drop off batteries here?",
      planYes: "Yes, I plan to",
      planNo: "Not yet",
      thanks: "Thank you! This helps us improve the site.",
      notFound: "No such point. Go back to the map."
    },
    more: {
      title: "More",
      items: [
        { href: "guide.html", emoji: "🔋", title: "What's accepted", desc: "Which batteries are OK and how to prepare them" },
        { href: "why.html", emoji: "🌱", title: "Why it matters", desc: "What happens to a battery in landfill" },
        { href: "faq.html", emoji: "💬", title: "FAQ", desc: "Bonuses, quantities, damaged batteries" },
        { href: "volunteer.html", emoji: "⭐", title: "Volunteer", desc: "Campaigns and events in Chertanovo" }
      ]
    },
    problem: {
      title: "What's the problem?",
      items: [
        "Batteries contain heavy metals — lead, cadmium, lithium — that leach from landfills into soil and groundwater.",
        "Lithium-ion batteries can short-circuit, catch fire or explode when crushed in waste trucks and compactors.",
        "Electronics and electric vehicles are spreading fast, creating dangerous waste faster than current systems can process it.",
        "People store batteries at home for years because they don't know where to take them and can't find the time."
      ]
    },
    why: {
      title: "Why recycling batteries matters",
      items: [
        "Keeps heavy metals and hazardous chemicals from leaching out of landfills into soil and water.",
        "Removes the fire and explosion hazard of damaged batteries in waste trucks, compactors and landfills.",
        "Reclaims finite, valuable metals and reduces destructive raw-material mining.",
        "Processing recycled components uses far less energy and emits fewer greenhouse gases than refining virgin ore."
      ]
    },
    guide: {
      title: "What's accepted",
      yesTitle: "Almost any battery",
      yes: ["AA and AAA cells", "Button and watch cells", "9V, C, D and other household sizes", "Phone, laptop and power-tool batteries (selected points)"],
      noTitle: "Not accepted",
      no: ["Damaged, swollen or leaking batteries", "Unmarked or home-made battery packs", "Car batteries (need a separate facility)"]
    },
    prep: {
      title: "Do I need to prepare them?",
      items: [
        "No special preparation. Collect batteries in a bag or jar.",
        "Tape the terminals of lithium batteries so they cannot short-circuit.",
        "Keep batteries away from metal objects and do not take them apart.",
        "Check the point's card to confirm they accept your battery type."
      ],
      photoCap: "A typical in-store battery box — usually by the entrance or the checkouts."
    },
    bonus: {
      title: "Are there bonuses?",
      text: "Points in the pilot district do not currently give bonuses. We are confirming the city programme at recycle.mos.ru and retailer loyalty schemes and will add them here."
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        { q: "What kind of batteries can I recycle?", a: "Almost any household battery: AA, AAA, button cells, 9V, phone batteries. Damaged batteries and unmarked packs are not accepted. Rechargeable batteries are accepted only at some points — check the card." },
        { q: "What is not accepted?", a: "Damaged, swollen or leaking batteries; unmarked or home-made battery packs; car batteries, which need a separate facility." },
        { q: "Do I need to prepare them?", a: "No special preparation. Collect them in a bag or jar. Tape the terminals of lithium batteries, keep batteries away from metal objects, and check the point's card to confirm they accept your type." },
        { q: "Are there bonuses?", a: "Not yet. We are confirming the city's EcoPoints programme at recycle.mos.ru and retailer loyalty schemes." },
        { q: "Why can't batteries go in ordinary rubbish?", a: "In landfill, heavy metals leach into soil and water, and lithium batteries can catch fire when crushed in a waste truck." },
        { q: "What do I do with a damaged or swollen battery?", a: "Don't put it in the shared box. Bag it separately, tape the terminals, and ask the point or a city eco-centre whether they will take it." },
        { q: "Do they accept small electronics?", a: "In the pilot district, only batteries for now. Electronics points will be added after verification." },
        { q: "How much can I bring at once?", a: "Usually a household amount — one bag. Exact limits are on each point's card." },
        { q: "The information is wrong or the point is gone?", a: "Tell us through the form at the bottom — we'll check and fix it within a few days." }
      ]
    },
    vol: {
      title: "Volunteer",
      sub: "Campaigns and events where you can help collect batteries.",
      events: [
        { name: "“Batteries, surrender!” campaign", format: "Online · 1–30 September 2026", desc: "Collect batteries at home, from neighbours and classmates, and drop them off at the nearest point. Organised by the Moscow Railway corporate volunteering council (Russian Railways).", hours: "Verified volunteer hours on Dobro.rf", who: "Age: 8+", url: "https://dobro.ru/event/11840898", cta: "Apply on Dobro.rf" }
      ]
    },
    mission: {
      title: "Our mission",
      text: "To make it simple for every Moscow resident to recycle batteries by gathering verified drop-off points, rules and incentives in one place, starting with Chertanovo."
    },
    about: {
      title: "About the project",
      p1: "Our goal is to make it simple for Moscow residents to recycle batteries and small electronics by gathering every verified drop-off point, rule and incentive into one mobile-first site.",
      p2: "We start with one district — Chertanovo — and check every point in person rather than from online listings. Ten correct points are worth more than fifty half-wrong ones: a resident who walks to a closed point will not return.",
      p3: "The project is run by school and university students. We spread the word with QR-code posters in building entrances and shops, and through Telegram and VK."
    },
    fb: {
      title: "Feedback",
      sub: "Found a mistake, know another point, or recycled batteries after using this site? Tell us.",
      type: "Topic",
      types: ["Error in a drop-off point", "New drop-off point", "Question", "Suggestion", "Other"],
      message: "Message",
      contact: "How to reach you (optional)",
      recycled: "I recycled batteries after using this site",
      send: "Send",
      thanks: "Thank you! Your message is saved. We'll reply or fix the information within a few days.",
      empty: "Please write a message."
    },
    footer: {
      proto: "Prototype, September 2026. Data is re-checked monthly.",
      links: "Telegram · VK — coming soon",
      credits: "Photo credits"
    }
  }
};

