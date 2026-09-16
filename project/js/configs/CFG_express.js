const CFG_express = {
    description:'Настройка "Экспресс" позволяет проводить тест быстрее* за счет уменьшения тестируемых ресурсов и времени ожидания каждого сайта (таймаут).<br> *Разница заметнее при плохом соединении, при быстром интернете разница минимальная',
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
            sites: [
                'https://yastatic.net/s3/home-static/_/nova/B5CxuyJ3.png',
                'https://gosuslugi.ru/favicon.ico'
            ],
            shortName: 'ru2',
            description: 'Проверка популярных российских сервисов',
            shortDomains: [
                'ya.ru','gosuslugi.ru'
            ]
        },
        en1: {
            name: 'Зарубежные 1',
            sites: [
                'https://www.gstatic.com/images/branding/searchlogo/ico/favicon.ico',
                'https://fe-static.deepseek.com/chat/favicon.svg',
            ],
            shortName: 'en1',
            description: 'Проверка популярных зарубежых сервисов',
            shortDomains: [
                'google.com', 'deepseek.ru'
            ]
        },
        en2: {
            name: 'Зарубежные 2',
            sites: [
                'https://www.youtube.com/yts/img/favicon-vfl8qSV2F.ico',
                "https://static.whatsapp.net/rsrc.php/y1/r/FJbTMJqMap7.svg"
            ],
            shortName: 'en2',
            description: 'Проверка популярных заблокированых сервисов',
            shortDomains: [
                'youtube.com', 'whatapp.com'
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
        timeout: 3000
    },

    // ============================================================
    // ТЕСТ ПИНГА
    // ============================================================
    ping: {
        url: 'https://web.max.ru/favicon.png?v=2026',
        attempts: 3,
        timeout: 1000
    },
    // ============================================================
    // ПРОВЕРКА ПРОТОКОЛОВ
    // ============================================================
    protocols: {
        dns: {
            url: 'https://cloudflare-dns.com/dns-query',
            domain: 'cloudflare.com',
            timeout: 3000
        },
        http: {
            url: 'http://web.max.ru/favicon.png',
            timeout: 3000
        },
        https: {
            urls: [
                'https://web.max.ru/favicon.png'
            ],
            timeout: 3000
        }
    }
};