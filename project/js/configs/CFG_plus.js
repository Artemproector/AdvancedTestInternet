const CFG_plus = {
    description: 'Расширенный список тестируемых сайтов в категориях',
    // ============================================================
    // КАТЕГОРИИ САЙТОВ
    // ============================================================
    categories: {
        ru1: {
            name: 'Отечественные 1',
            sites: [
                "https://web.max.ru/favicon.png?v=2026"
            ],
            name: 'Мессенджер Макс',
            shortName: 'ru1',
            description: 'Проверка доступности мессенджера',
            shortDomains: [
                'max.ru'
            ]
        },
        ru2: {
            name: 'Отечественные',
            sites: [
                'https://dzen.ru/logo-redesign-48.ico',
                'https://gosuslugi.ru/favicon.ico',
                'https://st.ozone.ru/s3/frontend-ozon-ru-public/icons/icon-192x192.png',
                'https://www.kinopoisk.ru/favicon.ico',
                'https://www.tbank.ru/favicon.ico',
                'https://a.dns-shop.ru/web-files/manifest/favicon.ico',
            ],
            shortName: 'ru2',
            description: 'Проверка доступности популярных российских сервисов',
            shortDomains: [
                'dzen.ru', 'gosuslugi.ru', 'ozon.ru', 'kinopoisk.ru', 'tbank.ru', 'dns-shop.ru'
            ]
        },
        en1: {
            name: 'Зарубежные 1',
            sites: [
                'https://www.gstatic.com/images/branding/searchlogo/ico/favicon.ico',
                'https://fe-static.deepseek.com/chat/favicon.svg',
                "https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon_gmail_2026_v2.ico",
                'https://www.wikipedia.org/static/favicon/wikipedia.ico',
                'https://www.bing.com/sa/simg/favicon-trans-bg-blue-mg-png.png',
                'https://github.githubassets.com/favicons/favicon-dark.png',
            ],
            shortName: 'en1',
            description: 'Проверка доступности популярных зарубежных сервисов',
            shortDomains: [
                'google.com', 'deepseek.com', 'mail.google.com', 'wikipedia.org', 'bing.com', 'github.com'
            ]
        },
        en2: {
            name: 'Зарубежные 2',
            sites: [
                'https://www.youtube.com/yts/img/favicon-vfl8qSV2F.ico',
                'https://soundcloud.com/favicon.ico',
                "https://web.telegram.org/favicon.ico",
                "https://static.whatsapp.net/rsrc.php/y1/r/FJbTMJqMap7.svg",
                'https://discord.com/favicon.ico',
                "https://instagram.com/favicon.ico"
            ],
            shortName: 'en2',
            description: 'Проверка доступности популярных заблокированных сервисов',
            shortDomains: [
                'youtube.com', 'soundcloud.com', 'telegram.org', 'whatsapp.com', 'discord.com', 'instagram.com'
            ]
        }
    },

    // ============================================================
    // ТЕСТ СКОРОСТИ
    // ============================================================
    speedTest: {
        download: 'https://0.0.0.0/',
        upload: 'https://0.0.0.0/',
        uploadSize: 1 * 1024 * 1024,
        attempts: 3,
        timeout: 5000
    },

    // ============================================================
    // ТЕСТ ПИНГА
    // ============================================================
    ping: {
        url: 'https://web.max.ru/favicon.png?v=2026',
        attempts: 5,
        timeout: 3000
    },
    // ============================================================
    // ПРОВЕРКА ПРОТОКОЛОВ
    // ============================================================
    protocols: {
        dns: {
            url: 'https://cloudflare-dns.com/dns-query',
            domain: 'cloudflare.com',
            timeout: 5000
        },
        http: {
            url: 'http://www.microsoft.com/favicon.ico',
            timeout: 5000
        },
        https: {
            urls: [
                'https://www.microsoft.com/favicon.ico'
            ],
            timeout: 5000
        }
    }
};