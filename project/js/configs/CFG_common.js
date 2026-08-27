const CFG_common = {
    version: "1.4.0",
    expressTest: {
        enabled: true,
        showDetails: true
    },
    timeout: 5000,
    quickCheckTimeout: 3000,
    history: {
        maxRecords: 999,
        maxFailedRecords: 999,
        failedTestInterval: 15 * 60 * 1000
    },
    speedColors: {
        veryBad: 5,
        bad: 20,
        average: 50,
        good: 100
    },
    pingColors: {
        excellent: 30,
        good: 60,
        average: 100,
        bad: 200
    },
    display: {
        levels: 5
    },
    update: {
        url: 'https://api.github.com/repos/Artemproector/AdvancedTestInternet/releases/latest',
        timeout: 5000
    },
    connectionTypes: {
        labels: {
            'wifi': 'Wi-Fi',
            'cellular': 'Мобильный интернет',
            'ethernet': 'Проводное',
            'bluetooth': 'Bluetooth',
            'none': 'Нет сети',
            'unknown': 'Неизвестно (Подробнее в справке)'
        }
    }
};