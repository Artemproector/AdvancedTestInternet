const CFG_express = {
    description:'Настройка "Экспресс" позволяет проводить тест быстрее* за счет уменьшения тестируемых ресурсов и времени ожидания каждого сайта (таймаут).<br> *Разница заметнее при плохом соединении, при быстром интернете разница минимальная',
    // ============================================================
    // КАТЕГОРИИ САЙТОВ
    // ============================================================
    categories: {
        ru1: {
            name: 'Отечественные 1',
            sites: [
                "https://web.max.ru/favicon.png?v=2026"
            ]
        },
        ru2: {
            name: 'Отечественные 2',
            sites: [
                'https://yastatic.net/s3/home-static/_/nova/B5CxuyJ3.png',
                'https://gosuslugi.ru/favicon.ico'
            ]
        },
        en1: {
            name: 'Зарубежные 1',
            sites: [
                'https://www.gstatic.com/images/branding/searchlogo/ico/favicon.ico',
                'https://fe-static.deepseek.com/chat/favicon.svg',
            ]
        },
        en2: {
            name: 'Зарубежные 2',
            sites: [
                'https://www.youtube.com/yts/img/favicon-vfl8qSV2F.ico',
                "https://static.whatsapp.net/rsrc.php/y1/r/FJbTMJqMap7.svg"
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
            url: 'http://www.microsoft.com/favicon.ico',
            timeout: 3000
        },
        https: {
            urls: [
                'https://www.microsoft.com/favicon.ico'
            ],
            timeout: 3000
        }
    }
};