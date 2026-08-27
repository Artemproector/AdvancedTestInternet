// ============================================================
// ИСТОРИЯ (логика хранения и обработки)
// ============================================================
const HISTORY_KEY = 'speedHistory';

// ============================================================
// ПОЛУЧЕНИЕ ДАННЫХ
// ============================================================

function getSpeedHistory() {
    const history = localStorage.getItem(HISTORY_KEY);
    if (history === null) return [];
    try {
        return JSON.parse(history);
    } catch (e) {
        return [];
    }
}

function saveHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// ============================================================
// ДОБАВЛЕНИЕ ЗАПИСИ
// ============================================================

function addHistoryRecord(data) {
    let history = getSpeedHistory();

    // Проверяем, нужно ли сохранять неудачный тест
    // Теперь проверяем все режимы, которые считаются "неудачными"
    const failedModes = ['Нет интернета', 'Полная блокировка'];
    const isFailed = data.mode === 'Нет интернета' ||
        data.mode === 'Полная блокировка' ||
        data.success === false;

    if (isFailed) {
        const lastTest = history.length > 0 ? history[history.length - 1] : null;
        if (lastTest) {
            const lastMode = lastTest.mode;
            const lastTime = lastTest.timestamp || new Date(lastTest.date).getTime();
            const now = Date.now();
            // Проверяем, был ли предыдущий тест тоже неудачным
            const lastWasFailed = lastMode === 'Нет интернета' || lastMode === 'Полная блокировка';
            if (lastWasFailed && (now - lastTime) < CONFIG.history.failedTestInterval) {
                console.log(`Неудачный тест пропущен (менее ${CONFIG.history.failedTestInterval / 60000} минут с предыдущего)`);
                return;
            }
        }
    }

    // Добавляем запись
    history.push({
        timestamp: data.timestamp || Date.now(),
        downloadSpeed: data.downloadSpeed || '—',
        uploadSpeed: data.uploadSpeed || '—',
        ping: data.ping || '—',
        mode: data.mode || 'Неизвестно',
        date: data.date || new Date().toLocaleString(),
        success: data.success !== undefined ? data.success : true,
        duration: data.duration || 0,
        protocols: data.protocols || null,
        network: data.network || 'unknown'
    });

    // Ограничиваем количество записей
    const maxRecords = data.success !== false ? CONFIG.history.maxRecords : CONFIG.history.maxFailedRecords;
    if (history.length > maxRecords) {
        history = history.slice(-maxRecords);
    }

    saveHistory(history);
    return history;
}
// ============================================================
// ПОЛУЧЕНИЕ ТОЛЬКО СЕГОДНЯШНИХ ЗАПИСЕЙ
// ============================================================

function getTodayHistory() {
    const history = getSpeedHistory();
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const todayEnd = todayStart + 24 * 60 * 60 * 1000;

    return history.filter(item => {
        const ts = item.timestamp || new Date(item.date).getTime();
        return ts >= todayStart && ts < todayEnd;
    });
}

// ============================================================
// СТАТИСТИКА
// ============================================================

function getHistoryStats(history = null) {
    const data = history || getSpeedHistory();
    const total = data.length;
    let successCount = 0;
    let failCount = 0;
    let totalDuration = 0;
    let protocolsStats = {
        dns: { total: 0, success: 0 },
        http: { total: 0, success: 0 },
        https: { total: 0, success: 0 }
    };

    data.forEach(item => {
        if (item.success !== false && item.mode !== 'Нет интернета') {
            successCount++;
        } else {
            failCount++;
        }

        if (item.duration) totalDuration += item.duration;

        if (item.protocols && typeof item.protocols === 'object') {
            for (const [key, value] of Object.entries(item.protocols)) {
                if (protocolsStats[key]) {
                    protocolsStats[key].total++;
                    if (value === true) protocolsStats[key].success++;
                }
            }
        }
    });

    return {
        total,
        success: successCount,
        fail: failCount,
        avgDuration: total > 0 ? Math.round(totalDuration / total) : 0,
        protocols: protocolsStats
    };
}

// ============================================================
// ФИЛЬТРАЦИЯ
// ============================================================

function filterHistoryByMode(history, mode) {
    if (mode === 'all') return history;
    const modeMap = {
        'no': 'Нет интернета',
        'white': 'Белые списки',
        'black': 'Черные списки',
        'full': 'Полный доступ'
    };
    const targetMode = modeMap[mode];
    if (!targetMode) return history;
    return history.filter(item => item.mode === targetMode);
}

// ============================================================
// ОЧИСТКА
// ============================================================

function clearHistory() {
    // Проверяем, есть ли вообще записи
    const history = getSpeedHistory();
    if (history.length === 0) {
        alert('История уже пуста.');
        return;
    }

    // Запрашиваем подтверждение
    if (confirm('Вы уверены, что хотите удалить всю историю проверок?\nЭто действие нельзя отменить.')) {
        localStorage.removeItem('speedHistory');
        historyload();
        calcConnectIndex();
        updateConnectionInfo();
    }
}

// ============================================================
// ЭКСПОРТ / ИМПОРТ
// ============================================================

function exportHistory() {
    const history = getSpeedHistory();
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `history_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importHistory(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        if (!Array.isArray(data)) throw new Error('Неверный формат');
        saveHistory(data);
        return data;
    } catch (e) {
        console.error('Ошибка импорта:', e);
        return null;
    }
}
function openFullHistory(historyID) {
    let historyelement = document.querySelector(`.hisID-${historyID}`);
    let infohistoryelement = historyelement.querySelector('.history-item-info');
    let labelhistoryelement = historyelement.querySelector('.history-item-label');
    historyelement.classList.toggle('history-item--open');
    labelhistoryelement.classList.toggle('history-item-label--open');
    infohistoryelement.classList.toggle('history-item-info--show');
}