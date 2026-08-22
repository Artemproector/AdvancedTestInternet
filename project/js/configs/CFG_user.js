//ОСНОВНОЙ КОД ЗАПОЛНЕНИЯ ШАБЛОНА В СЛЕДУЮЩИХ ОБНОВАХ!
const CFG_templates = {
    description: 'Пользовательская настройка',
    // ============================================================
    // КАТЕГОРИИ САЙТОВ
    // ============================================================
    categories: {
        ru1: {
            name: '',
            sites: [
            ]
        },
        ru2: {
            name: '',
            sites: [
            ]
        },
        en1: {
            name: '',
            sites: [
            ]
        },
        en2: {
            name: '',
            sites: [

            ]
        }
    },

    // ============================================================
    // ТЕСТ СКОРОСТИ
    // ============================================================
    speedTest: {
        download: "" || 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js',
        upload: "" || 'https://0.0.0.0/',
        uploadSize: 1 * 1024 * 1024,
        attempts: '' || 5,
        timeout: '' || 3000
    },

    // ============================================================
    // ТЕСТ ПИНГА
    // ============================================================
    ping: {
        url: "" || 'https://web.max.ru/favicon.png?v=2026',
        attempts: "" || 5,
        timeout: "" || 3000
    },
    // ============================================================
    // ПРОВЕРКА ПРОТОКОЛОВ
    // ============================================================
    protocols: {
        dns: {
            url: "" || 'https://cloudflare-dns.com/dns-query',
            domain: "" || 'cloudflare.com',
            timeout: "" || 5000
        },
        http: {
            url: "" || 'http://www.microsoft.com/favicon.ico',
            timeout: "" || 5000
        },
        https: {
            urls: [
                "" || 'https://www.microsoft.com/favicon.ico'
            ],
            timeout: "" || 5000
        }
    }
};
const CFG_user = ''