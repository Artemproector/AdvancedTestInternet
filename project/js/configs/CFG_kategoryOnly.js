const CFG_kategoryOnly = {
    description: 'Настройка "Только категории" позволяет проводить тест только по категориям, если остальные данные вам не нужны',
    // ============================================================
    // КАТЕГОРИИ САЙТОВ
    // ============================================================
    categories: {
        ru1: {
            sites: [
                "https://web.max.ru/favicon.png?v=2026",
                "https://calls.okcdn.ru",
                'https://i.oneme.ru',
                "https://sdk-api.apptracer.ru"
            ],
            name: 'Мессенджер Макс',
            shortName: 'ru1',
            description: 'Проверка доступности мессенджера',
            shortDomains: [
                'Сайт', 'API звонков', 'API картинок', 'Служебные адреса'
            ]
        },
        ru2: {
            name: 'Отечественные',
            shortName: 'ru2',
            description: 'Проверка доступности популярных российских сервисов',
            sites: [
                'https://yastatic.net/s3/home-static/_/nova/B5CxuyJ3.png',
                'https://gosuslugi.ru/favicon.ico',
                'https://www.avito.st/dstatic/favicon.ico',
                'http://kremlin.ru/static/favicon-32x32.png'
            ],
            shortDomains: [
                'ya.ru', 'gosuslugi.ru', 'avito.ru', 'kremlin.ru'
            ]
        },
        en1: {
            name: 'Зарубежные 1',
            sites: [
                'https://www.gstatic.com/images/branding/searchlogo/ico/favicon.ico',
                'https://fe-static.deepseek.com/chat/favicon.svg',
                "https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon_gmail_2026_v2.ico"
            ],
            shortDomains: [
                'google.com', 'deepseek.ru', 'mail.google.com'
            ],
            shortName: 'en1',
            description: 'Популярные незаблокированные зарубежные сервисы'
        },
        en2: {
            name: 'Зарубежные 2',
            sites: [
                'https://www.youtube.com/yts/img/favicon-vfl8qSV2F.ico',
                'https://soundcloud.com/favicon.ico',
                "https://web.telegram.org/favicon.ico",
                "https://static.whatsapp.net/rsrc.php/y1/r/FJbTMJqMap7.svg"
            ],
            shortDomains: [
                'youtube.com', 'soundcloud.com', 'telegram.org', 'whatsapp.net'
            ],
            shortName: 'en2',
            description: 'Популярные заблокированные зарубежные сервисы'
        }
    },

    // ============================================================
    // ТЕСТ СКОРОСТИ
    // ============================================================
    speedTest: {
        download: 'https://0.0.0.0/',
        upload: 'https://0.0.0.0/',
        uploadSize: 1 * 1024 * 1024,
        attempts: 0,
        timeout: 0
    },

    // ============================================================
    // ТЕСТ ПИНГА
    // ============================================================
    ping: {
        url: 'https://0.0.0.0/',
        attempts: 0,
        timeout: 0
    },
    // ============================================================
    // ПРОВЕРКА ПРОТОКОЛОВ
    // ============================================================
    protocols: {
        dns: {
            url: 'https://0.0.0.0/',
            domain: 'https://0.0.0.0/',
            timeout: 0
        },
        http: {
            url: 'https://0.0.0.0/',
            timeout: 0
        },
        https: {
            urls: [
                'https://0.0.0.0/'
            ],
            timeout: 0
        }
    }
};