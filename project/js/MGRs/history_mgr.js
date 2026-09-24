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
        'no': 'Полная блокировка',
        'white': 'Белые списки',
        'black': 'Черные списки',
        'full': 'Полный доступ',
        'vpn':'VPN'
    };
    const targetMode = modeMap[mode];
    if (!targetMode) return history;
    return history.filter(item => item.mode === targetMode);
}

// ============================================================
// ОЧИСТКА
// ============================================================

async function clearHistory() {
    const confirmed = await showConfirm(
        'Очистка истории',
        'Вы уверены, что хотите удалить все записи?<br>Это действие нельзя отменить.'
    );

    if (confirmed) {
        localStorage.removeItem('speedHistory');
        notifySuccess('История очищена')
        historyload();
        calcConnectIndex();
        updateConnectionInfo();
    } else {
        console.log('Очистка отменена');
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
let currentFilter = 'all';

function historyFilter(type) {
    currentFilter = type;
    historyload();
}

function applyFilter(historyData) {
    if (currentFilter === 'all') {
        return historyData;
    }
    const modeMap = {
        'no': 'Полная блокировка',
        'white': 'Белые списки',
        'black': 'Черные списки',
        'full': 'Полный доступ',
        'VPN': 'VPN'
    };
    const targetMode = modeMap[currentFilter];
    if (!targetMode) return historyData;
    return historyData.filter(item => item.mode === targetMode);
}

function handleFilterClick(e) {
    const filterType = e.currentTarget.dataset.filter || 'all';
    historyFilter(filterType);
}

function historyload() {
    fullnavbar.classList.add('show-nav');
    let fullLabel = document.querySelector('.labal-full-menu');
    if (fullLabel) {
        fullLabel.textContent = 'История проверок';
    }

    let area = document.querySelector('.area');
    if (!area) {
        const container = document.createElement('div');
        container.className = 'area';
        fullnavbar.appendChild(container);
        area = container;
    }

    const historyData = getSpeedHistory();
    const filteredData = applyFilter(historyData);

    // Фильтр-бар
    let html = `                    
        <div class="filter-bar">
            <div id="ft-bar-1" class="ft-bar-section ft-bar-1 ${currentFilter === 'all' ? 'ft-bar-section--active' : ''}" data-filter="all">Все</div>
            <div id="ft-bar-2" class="ft-bar-section ft-bar-2 ${currentFilter === 'no' ? 'ft-bar-section--active' : ''}" data-filter="no">Полная блокировка</div>
            <div id="ft-bar-3" class="ft-bar-section ft-bar-3 ${currentFilter === 'white' ? 'ft-bar-section--active' : ''}" data-filter="white">Белые списки</div>
            <div id="ft-bar-4" class="ft-bar-section ft-bar-4 ${currentFilter === 'black' ? 'ft-bar-section--active' : ''}" data-filter="black">Черные списки</div>
            <div id="ft-bar-5" class="ft-bar-section ft-bar-5 ${currentFilter === 'full' ? 'ft-bar-section--active' : ''}" data-filter="full">Полный доступ</div>
            <div id="ft-bar-6" class="ft-bar-section ft-bar-6 ${currentFilter === 'VPN' ? 'ft-bar-section--active' : ''}" data-filter="VPN">VPN</div>
        </div>
        <button onclick="clearHistory()" class="history-clear-btn">
            Очистить историю
        </button>
    `;

    if (filteredData.length === 0) {
        const noDataMessage = historyData.length === 0
            ? 'История проверок пока пуста'
            : 'Нет записей с выбранным фильтром';
        html += `
            <div class="history-empty">
                <p>${noDataMessage}</p>
                <p style="font-size: 12px; color: #8892b0;">${historyData.length === 0 ? 'Проведите первый тест, чтобы появились данные' : 'Попробуйте изменить фильтр'}</p>
            </div>
        `;
        area.innerHTML = html;
        document.querySelectorAll('.ft-bar-section').forEach(el => {
            el.removeEventListener('click', handleFilterClick);
            el.addEventListener('click', handleFilterClick);
        });
        return;
    }

    let listHtml = '<div class="history-list">';
    const reversed = [...filteredData].reverse();

    try {
        let historyID = 0;
        reversed.forEach((item) => {
            historyID += 1;

            const download = item.downloadSpeed !== undefined && item.downloadSpeed !== null ? item.downloadSpeed : '—';
            const upload = item.uploadSpeed !== undefined && item.uploadSpeed !== null ? item.uploadSpeed : '—';
            const ping = item.ping !== undefined && item.ping !== null ? item.ping : '—';
            const mode = item.mode || 'Неизвестно';
            const date = item.date || new Date(item.timestamp).toLocaleString() || 'Дата неизвестна';
            const network = item.network || 'unknown';
            const duration = item.duration || '--';
            const protocols = item.protocols || { dns: false, http: false, https: false };
            const available = Object.values(protocols).filter(v => v === true).length;
            const total = Object.keys(protocols).length;

            // Формируем данные для кнопки "Поделиться"
            const shareData = {
                download: download,
                upload: upload,
                ping: ping,
                mode: mode,
                date: date,
                network: network,
                protocols: protocols,
                duration: duration
            };

            listHtml += `
                <div class="history-item hisID-${historyID}">
                    <div class="history-item-label" onclick="openFullHistory(${historyID})">
                        ${date}<br> ${mode}
                        <svg class='list_arr' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M459-381 314-526q-3-3-4.5-6.5T308-540q0-8 5.5-14t14.5-6h304q9 0 14.5 6t5.5 14q0 2-6 14L501-381q-5 5-10 7t-11 2q-6 0-11-2t-10-7Z"/></svg>
                    </div>
                    <div class="history-item-info" id="historyInfo-${historyID}">
                        <div class='history-item-info__wrapper'>
                            <div class='wrapper__left'>
                                <pre class="history-ping">Пинг: ${ping} мс</pre>
                                <pre class="history-mode-tag">Режим сети: ${mode}</pre>
                                <pre class="history-test-duration">Длительность: ${duration} сек</pre>
                                <pre class="history-proto">Протоколы: ${available}/${total}</pre>
                                <pre class='history-type-net'>Тип соединения: ${network !== 'unknown' ? showNetIkon(network) : 'Неизвестно'}</pre>
                            </div>
                            <div class='wrapper__right'>
                                <div onclick='shareHistoryResult(${JSON.stringify(shareData).replace(/"/g, '&quot;')})' class="share-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm508.5-291.5Q720-743 720-760t-11.5-28.5Q697-800 680-800t-28.5 11.5Q640-777 640-760t11.5 28.5Q663-720 680-720t28.5-11.5ZM680-200ZM200-480Zm480-280Z"/></svg>
                                </div>
                                <div onclick='copyResult(${JSON.stringify(shareData).replace(/"/g, '&quot;')})' class="share-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-520q0-17 11.5-28.5T160-720q17 0 28.5 11.5T200-680v520h400q17 0 28.5 11.5T640-120q0 17-11.5 28.5T600-80H200Zm160-240v-480 480Z"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        // fallback для старых записей
        reversed.forEach((item) => {
            const download = item.downloadSpeed !== undefined && item.downloadSpeed !== null ? item.downloadSpeed : '—';
            const upload = item.uploadSpeed !== undefined && item.uploadSpeed !== null ? item.uploadSpeed : '—';
            const ping = item.ping !== undefined && item.ping !== null ? item.ping : '—';
            const mode = item.mode || 'Неизвестно';
            const date = item.date || new Date(item.timestamp).toLocaleString() || 'Дата неизвестна';

            listHtml += `
                <div class="history-item">
                    <div class="history-item-date">${date}</div>
                    <div class="history-item-row">
                        <span class="history-speed-down">↓ ${download} Мбит/с</span>
                        <span class="history-speed-up">↑ ${upload} Мбит/с</span>
                        <span class="history-ping">${ping} мс</span>
                        <span class="history-mode-tag">${mode}</span>
                    </div>
                </div>
            `;
        });
    }

    listHtml += `</div>`;
    html += listHtml;
    area.innerHTML = html;

    document.querySelectorAll('.ft-bar-section').forEach(el => {
        el.removeEventListener('click', handleFilterClick);
        el.addEventListener('click', handleFilterClick);
    });
}
function openFullHistory(historyID) {
    let historyelement = document.querySelector(`.hisID-${historyID}`);
    let infohistoryelement = historyelement.querySelector('.history-item-info');
    let labelhistoryelement = historyelement.querySelector('.history-item-label');
    historyelement.classList.toggle('history-item--open');
    labelhistoryelement.classList.toggle('history-item-label--open');
    infohistoryelement.classList.toggle('history-item-info--show');
}
function showNetIkon(net_type) {
    if (net_type == 'cellular') {
        return 'Мобильный интернет'
    }
    else {
        return 'WIFI'
    }
}
function saveTestResult({ pingResult, mode, isSuccess, startTime, protocolResults }) {
    const protocolStatus = {
        dns: protocolResults.dns?.success || false,
        http: protocolResults.http?.success || false,
        https: protocolResults.https?.success || false
    };

    const connInfo = getConnectionType();
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);

    // Определяем текст режима
    let modeText;
    if (mode.mode === 'percent') {
        modeText = `${mode.percent}% доступно`;
    } else {
        modeText = getBlockingText(mode.mode);
    }

    addHistoryRecord({
        timestamp: Date.now(),
        ping: pingResult.success ? Math.round(pingResult.average) : '—',
        mode: modeText,
        date: new Date().toLocaleString(),
        success: isSuccess,
        duration: duration,
        protocols: protocolStatus,
        network: connInfo?.type || 'unknown'
    });

    addToLog(`   Длительность: ${duration} сек`);
    addToLog(`   Успешность: ${isSuccess ? 'УСПЕШНО' : 'НЕУДАЧНО'}`);
    calcConnectIndex();

    return endTime;
}