import prog1 from "./assets/abcd.jpg?inline"
import prog2 from "./assets/abce.jpg?inline"

export const svgIcons = {
  1: '<svg viewBox="0 0 36 36" fill="none"><rect x="4" y="4" width="28" height="28" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M4 14h28M14 4v28" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" opacity="0.5"/><circle cx="18" cy="18" r="4" fill="currentColor" opacity="0.3"/><circle cx="10" cy="10" r="2" fill="currentColor"/><circle cx="26" cy="26" r="2" fill="currentColor"/></svg>',
  2: '<svg viewBox="0 0 36 36" fill="none"><path d="M6 28L14 18L20 24L26 14L30 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="4" y="4" width="28" height="24" rx="2" stroke="currentColor" stroke-width="1.5"/></svg>',
  3: '<svg viewBox="0 0 36 36" fill="none"><path d="M8 28V16M16 28V10M24 28V18M32 28V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="14" r="2" fill="currentColor"/><circle cx="16" cy="8" r="2" fill="currentColor"/><circle cx="24" cy="16" r="2" fill="currentColor"/><circle cx="32" cy="6" r="2" fill="currentColor"/><path d="M8 14L16 8L24 16L32 6" stroke="currentColor" stroke-width="1" opacity="0.4"/></svg>',
  4: '<svg viewBox="0 0 36 36" fill="none"><path d="M18 6L30 12V24L18 30L6 24V12L18 6Z" stroke="currentColor" stroke-width="1.5"/><path d="M18 6V30M6 12L30 12M6 24L30 24" stroke="currentColor" stroke-width="0.75" opacity="0.4"/></svg>',
  5: '<svg viewBox="0 0 36 36" fill="none"><path d="M8 28C8 28 10 20 18 20C26 20 28 28 28 28" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 22C6 22 8 10 18 10C28 10 30 22 30 22" stroke="currentColor" stroke-width="1" opacity="0.4" stroke-linecap="round"/><circle cx="18" cy="10" r="3" fill="currentColor" opacity="0.3"/><path d="M14 28L18 22L22 28" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  6: '<svg viewBox="0 0 36 36" fill="none"><rect x="6" y="8" width="24" height="20" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M6 14h24M12 8V6M24 8V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M11 20h6M11 24h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  7: '<svg viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="12" stroke="currentColor" stroke-width="1.5"/><path d="M18 6V18L26 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 18h24M18 6a12 12 0 010 24M18 6a12 12 0 000 24" stroke="currentColor" stroke-width="0.75" opacity="0.35"/></svg>',
  8: '<svg viewBox="0 0 36 36" fill="none"><path d="M10 28L6 22L10 10L18 6L26 10L30 22L26 28H10Z" stroke="currentColor" stroke-width="1.5"/><path d="M6 22L18 20L30 22M10 10L18 20L26 10" stroke="currentColor" stroke-width="0.75" opacity="0.4"/></svg>',
  9: '<svg viewBox="0 0 36 36" fill="none"><path d="M18 4L32 12V24L18 32L4 24V12L18 4Z" stroke="currentColor" stroke-width="1.5"/><path d="M18 10L26 15V21L18 26L10 21V15L18 10Z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1"/><circle cx="18" cy="18" r="3" fill="currentColor"/></svg>'
};

const cardsData = [
  {
    text: 'Комплексная ГИС предприятия',
    description: 'Единая платформа для сбора, хранения и анализа горно-геологических данных. Объединяет все службы предприятия в цифровом пространстве.',
    link: '/gis',
    works: [
      'Создание цифровых планов горных работ',
      'Использование единой СУБД',
      'Разработка программных приложений',
    ],
    benefits: [
      'Повышение безопасности',
      'Обеспечение электронного документооборота',
      'Исключение ошибок',
    ],
    icon: svgIcons[1],
    images: [prog1, prog2],
  },
  {
    text: 'Картографические материалы в цифровом виде',
    description: 'Оцифровка архивных планов и карт. Создание точных векторных цифровых копий для быстрого доступа и анализа.',
    link: '/maps',
    works: [
      'Сканирование карт',
      'Создание цифровых копий',
      'Анализ данных',
    ],
    benefits: [
      'Удобство использования',
      'Сохранность данных',
      'Доступность информации',
    ],
    icon: svgIcons[2],
    images: [prog2, prog1],
  },
  {
    text: 'Интеграция с современными ГИС',
    description: 'Бесшовная интеграция наших решений с уже используемыми на предприятии геоинформационными системами.',
    link: '/integration',
    works: [
      'Анализ требований',
      'Разработка API',
      'Тестирование интеграций',
    ],
    benefits: [
      'Улучшение взаимодействия систем',
      'Повышение эффективности',
      'Снижение затрат',
    ],
    icon: svgIcons[3],
    images: [prog1],
  },
  {
    text: 'Автоматизация маркшейдерских работ',
    description: 'Инструменты для быстрой обработки данных маркшейдерских съемок, построения моделей и автоматической генерации отчетов.',
    link: '/survey',
    works: [
      'Сбор данных',
      'Анализ информации',
      'Создание отчётов',
    ],
    benefits: [
      'Повышение точности',
      'Снижение затрат',
      'Ускорение процессов',
    ],
    icon: svgIcons[4],
    images: [prog2, prog1],
  },
  {
    text: 'Автоматизация геологических работ',
    description: 'Управление базами данных скважин, опробования и автоматический подсчет запасов полезных ископаемых.',
    link: '/geology',
    works: [
      'Сбор геологических данных',
      'Анализ информации',
      'Создание отчётов',
    ],
    benefits: [
      'Повышение точности',
      'Снижение затрат',
      'Ускорение процессов',
    ],
    icon: svgIcons[5],
    images: [prog1, prog2],
  },
  {
    text: 'Электронное формирование документов',
    description: 'Автоматическая генерация стандартизированной отчетности, актов и журналов на основе данных из системы.',
    link: '/documents',
    works: [
      'Сбор данных',
      'Создание электронных документов',
      'Анализ информации',
    ],
    benefits: [
      'Удобство использования',
      'Сохранность данных',
      'Доступность информации',
    ],
    icon: svgIcons[6],
    images: [prog2],
  },
  {
    text: 'Автоматизация горных работ',
    description: 'Цифровое планирование горных работ, оптимизация процессов бурения, взрывания и транспортировки руды.',
    link: '/mining',
    works: [
      'Сбор данных о горных работах',
      'Анализ информации',
      'Создание моделей',
    ],
    benefits: [
      'Улучшение качества данных',
      'Снижение затрат',
      'Повышение эффективности',
    ],
    icon: svgIcons[7],
    images: [prog1, prog2],
  },
  {
    text: 'Геофизика и месторождения углеводородного сырья',
    description: 'Специализированные решения для геофизики и нефтегазового сектора: 3D-моделирование и обработка данных.',
    link: '/oil',
    works: [
      'Сбор данных о месторождениях',
      'Анализ информации',
      'Создание моделей',
    ],
    benefits: [
      'Улучшение качества данных',
      'Снижение затрат',
      'Повышение эффективности',
    ],
    icon: svgIcons[8],
    images: [prog1],
  },
  {
    text: 'Партнёрство и разработка под заказ',
    description: 'Разрабатываем уникальные модули под специфику вашего предприятия. Совместные проекты с отраслевыми институтами.',
    link: '/custom',
    works: [
      'Анализ требований',
      'ИТ-разработка',
      'Интеграция',
    ],
    benefits: [
      'Кастомное решение под задачу',
      'Точечный подход',
      'Адаптивность',
    ],
    icon: svgIcons[9],
    images: [prog2, prog1],
  },
];

const productsCardsData = [
  {
    text: 'Расчёт плановых нормативов потерь',
    description: 'Автоматизированная система для точного расчета и контроля плановых потерь полезных ископаемых. Помогает минимизировать издержки и соблюдать законодательные нормы.',
    link: '/gissol/planloss',
    works: [
      'Анализ данных о потерях',
      'Разработка моделей расчёта',
      'Оптимизация процессов учёта потерь',
    ],
    benefits: [
      'Снижение потерь ресурсов',
      'Повышение точности расчётов',
      'Улучшение контроля процессов',
    ],
    images: [
      prog1
    ]
  },
  {
    text: 'Модуль "3D-Рудник"',
    description: 'Интерактивный цифровой двойник рудника в 3D. Обеспечивает наглядную визуализацию горных выработок, геологической среды и инфраструктуры для планирования и контроля.',
    link: '/gissol/',
    works: [
      'Создание 3D-моделей рудников',
      'Визуализация данных',
      'Интеграция с ГИС',
    ],
    benefits: [
      'Улучшение планирования работ',
      'Повышение безопасности',
      'Оптимизация использования ресурсов',
    ],
    images: [
      prog2
    ],
    captions: [
      "Модуль '3D Рудник'"
    ]
  },
]

export { cardsData, productsCardsData };