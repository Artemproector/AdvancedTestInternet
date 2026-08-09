// ============================================================
// КОНФИГУРАЦИЯ ПРИЛОЖЕНИЯ
// ============================================================
const CONFIG = {
    version: "1.2.0",
    express_test: [
        'https://www.gstatic.com/images/branding/searchlogo/ico/favicon.ico',
        'https://yastatic.net/s3/home-static/_/nova/B5CxuyJ3.png',
        'https://www.avito.st/dstatic/favicon.ico'
    ],
    categories: {
        ru1: {
            name: 'Отечественные 1',
            sites: [
                'https://home.imgsmail.ru/resplash/816229/i/meta/favicon.ico',
                "https://web.max.ru/favicon.png?v=2026"
            ]
        },
        ru2: {
            name: 'Отечественные 2',
            sites: [
                'https://yastatic.net/s3/home-static/_/nova/B5CxuyJ3.png',
                'https://gosuslugi.ru/favicon.ico',
                'https://www.avito.st/dstatic/favicon.ico',
                'http://kremlin.ru/static/favicon-32x32.png'
            ]
        },
        en1: {
            name: 'Зарубежные 1',
            sites: [
                'https://www.gstatic.com/images/branding/searchlogo/ico/favicon.ico',
                'https://fe-static.deepseek.com/chat/favicon.svg',
                "https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon_gmail_2026_v2.ico"
            ]
        },
        en2: {
            name: 'Зарубежные 2',
            sites: [
                'https://www.youtube.com/yts/img/favicon-vfl8qSV2F.ico',
                'https://soundcloud.com/favicon.ico',
                "https://web.telegram.org/favicon.ico",
                "https://static.whatsapp.net/rsrc.php/y1/r/FJbTMJqMap7.svg"
            ]
        }
    },
    speedTest: {
        download: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js',
        upload: 'https://0.0.0.0/',// ПУСТОЙ АДРЕС-ЗАГЛУШКА
        uploadSize: 1 * 1024 * 1024, // 1 МБ
        attempts: 3,
        timeout: 5000
    },
    ping: {
        url: 'https://www.avito.st/dstatic/favicon.ico',
        attempts: 5,
        timeout: 3000
    },
    timeout: 5000,
    quickCheckTimeout: 3000,
    history: {
        maxRecords: 50,
        maxFailedRecords: 100,
        failedTestInterval: 15 * 60 * 1000 
    },
    speedColors: {
        veryBad: 5,     // < 5 Мбит/с 
        bad: 20,        // < 20 Мбит/с 
        average: 50,    // < 50 Мбит/с
        good: 100       // < 100 Мбит/с 
    },
    pingColors: {
        excellent: 30,  // < 30 мс
        good: 60,       // < 60 мс 
        average: 100,   // < 100 мс 
        bad: 200        // < 200 мс 
    },
    display: {
        levels: 5
    },
    update: {
        url: 'https://api.github.com/repos/Artemproector/AdvancedTestInternet/releases/latest',
        timeout: 5000
    }
};
