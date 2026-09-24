const CFG_common = {
    version: "1.7.0",
    expressTest: {
        enabled: true,
        showDetails: true
    },
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
        url: 'https://api.github.com/repos/Artemproector/AdvancedTestInternet/releases/latest'
    },
    connectionTypes: {
        labels: {
            'wifi': 'Wi-Fi',
            'cellular': 'Мобильный интернет',
            'ethernet': 'Проводное',
            'bluetooth': 'Bluetooth',
            'none': 'Нет сети',
            'unknown': 'Неизвестно <svg onclick="wikiLink(5)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M508.5-291.5Q520-303 520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280q17 0 28.5-11.5Zm0-320Q520-623 520-640t-11.5-28.5Q497-680 480-680t-28.5 11.5Q440-657 440-640t11.5 28.5Q463-600 480-600t28.5-11.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>'
        }
    },
    autoCloseModal: 7000,
    DYN_summary: true,
    DYN_prBar: true,
    DYN_tmBar: true,
    DYN_categories: true,
};