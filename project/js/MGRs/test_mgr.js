// ============================================================
// МЕНЕДЖЕР ТЕСТА
// ============================================================
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const ERROR_ICON_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#ff4757" stroke-width="2"/>
    <path d="M8 8L16 16" stroke="#ff4757" stroke-width="2" stroke-linecap="round"/>
    <path d="M16 8L8 16" stroke="#ff4757" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const SUCCESS_ICON_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#2ed573" stroke-width="2"/>
    <path d="M7 12L10.5 15.5L17 9" stroke="#2ed573" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const WARNING_ICON_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 21H22L12 2Z" stroke="#ffa502" stroke-width="2" stroke-linejoin="round"/>
    <path d="M12 9V14" stroke="#ffa502" stroke-width="2" stroke-linecap="round"/>
    <circle cx="12" cy="17" r="1" fill="#ffa502"/>
</svg>`;

// ============================================================
// ТЕСТ ПИНГА
// ============================================================
async function testPing(url = CONFIG.ping.url, attempts = CONFIG.ping.attempts) {
    const pings = [];
    for (let i = 0; i < attempts; i++) {
        const result = await checkSiteAvailability(url, CONFIG.TIMEOUT_ping);
        if (result.success) {
            pings.push(result.time);
        }
        await sleep(200);
    }
    if (pings.length === 0) {
        return { success: false, average: Infinity, min: Infinity, max: Infinity };
    }
    const average = pings.reduce((a, b) => a + b, 0) / pings.length;
    const min = Math.min(...pings);
    const max = Math.max(...pings);
    const pingLevel = average <= 30 ? 5 : average <= 60 ? 4 : average <= 100 ? 3 : average <= 200 ? 2 : 1;
    updateDisplay("ping", pingLevel);
    return { success: true, average, min, max, attempts: pings.length };
}

// ============================================================
// БЫСТРАЯ ПРОВЕРКА ИНТЕРНЕТА
// ============================================================
async function quickInternetCheck() {
    const connInfo = getConnectionType();
    const hasInternet = connInfo.type !== 'none';
    const typeMap = CONFIG.connectionTypes.labels

    return {
        hasInternet: hasInternet,
        connectionType: connInfo.type,
        connectionLabel: typeMap[connInfo.type] || 'Неизвестно',
        effectiveType: connInfo.effectiveType || 'unknown',
        downlink: connInfo.downlink || 0,
        rtt: connInfo.rtt || 0
    };
}

function getConnectionType() {
    if ('connection' in navigator) {
        const conn = navigator.connection;
        return {
            type: conn.type || 'unknown',
            effectiveType: conn.effectiveType || 'unknown',
            downlink: conn.downlink || 0,
            rtt: conn.rtt || 0
        };
    }
    return null;
}

// ============================================================
// ПРОВЕРКА ПРОТОКОЛОВ
// ============================================================
async function testProtocols() {
    const results = {
        dns: { success: false, label: 'DNS' },
        http: { success: false, label: 'HTTP' },
        https: { success: false, label: 'HTTPS' }
    };

    // DNS
    try {
        const url = `${CONFIG.protocols.dns.url}?name=${CONFIG.protocols.dns.domain}&type=A`;
        const resp = await fetch(url, {
            headers: { 'Accept': 'application/dns-json' },
            signal: AbortSignal.timeout(CONFIG.TIMEOUT_protocols)
        });
        const data = await resp.json();
        results.dns.success = data.Answer && data.Answer.length > 0;
    } catch (e) {
        results.dns.success = false;
    }

    // HTTP
    try {
        const resp = await fetch(CONFIG.protocols.http.url, {
            signal: AbortSignal.timeout(CONFIG.TIMEOUT_protocols)
        });
        results.http.success = resp.ok;
    } catch (e) {
        results.http.success = false;
    }

    // HTTPS
    for (const url of CONFIG.protocols.https.urls) {
        try {
            const resp = await fetch(url, {
                method: 'HEAD',
                signal: AbortSignal.timeout(CONFIG.TIMEOUT_protocols)
            });
            if (resp.ok || resp.status === 418) {
                results.https.success = true;
                break;
            }
        } catch (e) { }
    }

    return results;
}

async function runProtocolTest() {
    const protoItems = document.querySelectorAll('.proto-test');
    protoItems.forEach(item => {
        item.style.color = '#8892b0';
        const label = item.textContent.replace(/[✅❌]\s*/, '');
        item.textContent = label;
    });

    const results = await testProtocols();
    updateProtocolUI(results);
    return results;
}

// ============================================================
// ВЫБОР URL ДЛЯ ПИНГА
// ============================================================
function getPingUrl(categoryResults) {
    const ru1Ok = categoryResults['ru1']?.successRate > 0.5;
    const ru2Ok = categoryResults['ru2']?.successRate > 0.5;
    const en1Ok = categoryResults['en1']?.successRate > 0.5;
    const en2Ok = categoryResults['en2']?.successRate > 0.5;
    const ruAvailable = ru1Ok && ru2Ok;
    const enAvailable = en1Ok && en2Ok;

    if (ruAvailable) {
        addToLog("Пинг: RU (Макс)");
        return 'https://web.max.ru/favicon.png?v=2026';
    }
    if (enAvailable) {
        addToLog("Пинг: EN (Google)");
        return 'https://www.google.com/favicon.ico';
    }
    addToLog("Пинг: fallback на Макс");
    return 'https://web.max.ru/favicon.png?v=2026';
}

// ============================================================
// ОБРАБОТКА "НЕТ ИНТЕРНЕТА"
// ============================================================
function handleNoInternet(quickCheck, startTime, testBtn, categoryKeys) {
    addToLog("ИНТЕРНЕТ ОТСУТСТВУЕТ — тест прерван");

    document.getElementById('ping').innerHTML = '--<span class="unit">мс</span>';
    document.getElementById('networkMode').textContent = 'Нет сети';
    updateDisplay('ping', 1);
    updateDisplay('mode', 1);

    const endTime = Date.now();
    addHistoryRecord({
        timestamp: Date.now(),
        ping: '—',
        mode: 'Полная блокировка',
        date: new Date().toLocaleString(),
        success: false,
        duration: Math.floor((endTime - startTime) / 1000),
        protocols: { dns: false, http: false, https: false },
        network: quickCheck.connectionType || 'unknown'
    });

    testBtn.classList.remove('loading');
    testBtn.disabled = false;

    // Прогресс-бар
    setProgressState(1, 'pass');
    setProgressState(2, 'fail');
    setProgressState(3, 'fail');
    setProgressState(4, 'fail');
    setProgressState(5, 'pass');
    setProgressState(6, 'fail');

    for (const key of categoryKeys) {
        const icon = document.getElementById(`cat-${key}`);
        if (icon) {
            icon.className = 'status-icon error';
            icon.innerHTML = ERROR_ICON_SVG;
        }
    }

    calcConnectIndex();
    scrollToLast();
    addToLog("ТЕСТ ПРЕРВАН (нет интернета)");
    addToLog("═══════════════════════════════════════════════════");
}

// ============================================================
// ОБНОВЛЕНИЕ UI ПИНГА
// ============================================================
function updatePingUI(pingResult) {
    if (pingResult.success) {
        const pingColor = getPingColor(pingResult.average);
        document.getElementById('ping').innerHTML = `
            <span style="color: ${pingColor.color}">${Math.round(pingResult.average)}</span>
            <span class="unit">мс</span>
        `;
        updateDisplay('ping', pingColor.level);
        setProgressState(3, 'pass');
        addToLog("Пинг: " + Math.round(pingResult.average) + "ms");
    } else {
        document.getElementById('ping').innerHTML = '-- <span class="unit">мс</span>';
        updateDisplay('ping', 1);
        setProgressState(3, 'fail');
        addToLog("Пинг: не удался");
    }
}

// ============================================================
// ОБРАБОТКА "ПОЛНАЯ БЛОКИРОВКА"
// ============================================================
function handleFullBlock() {
    setProgressState(1, 'pass');
    setProgressState(2, 'pass');
    setProgressState(3, 'fail');
    setProgressState(4, 'pass');
    setProgressState(5, 'pass');
    setProgressState(6, 'pass');
    document.getElementById('networkMode').textContent = 'Полная блокировка';
    updateDisplay('mode', 1);
}

// ============================================================
// ОБРАБОТКА ОДНОЙ КАТЕГОРИИ
// ============================================================
function processCategory(key, result) {
    addToLog(key + ": " + result.successful + "/" + result.total);

    const sites = CONFIG.categories[key]?.sites || [];
    result.results.forEach((r, i) => {
        addToLog("  " + (sites[i] || 'unknown') + " - " + (r.success ? "OK" : "TIMEOUT"));
    });

    const icon = document.getElementById(`cat-${key}`);
    if (!icon) return;

    icon.className = 'status-icon';
    if (result.successRate >= 0.5) {
        icon.classList.add('success');
        icon.innerHTML = SUCCESS_ICON_SVG;
    } else if (result.successRate > 0) {
        icon.classList.add('warning');
        icon.innerHTML = WARNING_ICON_SVG;
    } else {
        icon.classList.add('error');
        icon.innerHTML = ERROR_ICON_SVG;
    }
}

// ============================================================
// СБРОС UI
// ============================================================
function resetTestUI(testBtn, startTimeEl, stopTimeEl, testTimeEl) {
    // Таймер
    if (startTimeEl) startTimeEl.textContent = '--:--:--';
    if (stopTimeEl) stopTimeEl.textContent = '--:--:--';
    if (testTimeEl) testTimeEl.textContent = '--';

    // Кнопка
    testBtn.classList.add('loading');
    testBtn.disabled = true;
    updateDisplay("all", 5);

    // Скрываем скорость
    document.querySelector('.dwn-card')?.style?.setProperty('display', 'none');
    document.querySelector('.dwn-card--DSGN2')?.style?.setProperty('display', 'none');
    document.querySelector('.dwn-card--DSGN3')?.style?.setProperty('display', 'none');

    // Пинг
    document.getElementById('ping').innerHTML = '--<span class="unit">мс</span>';
    document.getElementById('networkMode').textContent = '--';

    // Протоколы
    const protoItems = document.querySelectorAll('.proto-test');
    protoItems.forEach(item => {
        item.style.color = '#fff';
        item.textContent = item.textContent.replace(/[✅❌]\s*/, '');
    });
    document.querySelector('#proto').innerHTML = `-- <span class="proto-static-test">доступно</span>`;

    // Иконки категорий
    Object.keys(CONFIG.categories).forEach(key => {
        const icon = document.getElementById(`cat-${key}`);
        if (icon) {
            icon.className = 'status-icon';
            icon.innerHTML = '';
        }
    });

    // Прогресс-бар
    resetProgressBar();
}

// ============================================================
// ФИНАЛИЗАЦИЯ ТЕСТА
// ============================================================
async function finalizeTest({ testBtn, startTime, stopTimeEl, testTimeEl }) {
    const endTime = Date.now();

    if (stopTimeEl) {
        const date = new Date(endTime);
        stopTimeEl.textContent = date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
    }
    if (testTimeEl && startTime) {
        testTimeEl.textContent = Math.floor((endTime - startTime) / 1000);
    }

    updateConnectionInfo();
    testBtn.classList.remove('loading');
    testBtn.disabled = false;

    await sleep(500);
    setProgressState(5, 'pass');
    scrollToLast();
    addToLog("ТЕСТ ЗАВЕРШЁН");
    addToLog("═══════════════════════════════════════════════════");
}

// ============================================================
// ОСНОВНОЙ ТЕСТ
// ============================================================
async function runFullTest() {
    addToLog("═══════════════════════════════════════════════════");
    addToLog("НАЧАЛО ТЕСТА");
    addToLog("Пресет: " + currentPreset);
    addToLog("Таймаут: " + currentTime);
    addToLog("Блокировка: " + currentblock);
    addToLog("Дизайн: " + currentdsgn);

    const testBtn = document.getElementById('testBtn');
    const startTimeEl = document.querySelector('.start-time');
    const stopTimeEl = document.querySelector('.stop-time');
    const testTimeEl = document.querySelector('.test-time');
    const categoryKeys = Object.keys(CONFIG.categories);
    const startTime = Date.now();
    if (startTimeEl) {
        console.log('data');
        const date = new Date(startTime);
        startTimeEl.textContent = date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
    }
    showcategories()
    updateVisibilityByPreset();

    // Прогресс-бары
    if (currentPreset == 'kat') {
        setProgressState(3, 'hide');
        setProgressState(6, 'hide');
    } else {
        setProgressState(3, 'show');
        setProgressState(6, 'show');
    }

    // Сброс UI
    resetTestUI(testBtn, startTimeEl, stopTimeEl, testTimeEl);

    try {
        // ============================================================
        // ЭТАП 1: ПРОВЕРКА ИНТЕРНЕТА
        // ============================================================
        addToLog("ЭТАП 1: Проверка интернета");
        const quickCheck = await quickInternetCheck();
        setProgressState(1, 'pass');
        updateConnectionInfo();

        addToLog("Интернет: " + (quickCheck.hasInternet ? "есть" : "нет"));
        addToLog("Тип сети: " + (quickCheck.connectionLabel || 'Неизвестно'));

        if (!quickCheck.hasInternet) {
            handleNoInternet(quickCheck, startTime, testBtn, categoryKeys);
            return;
        }

        if (quickCheck.connectionType) {
            document.querySelector('.it-bar-1').innerHTML = quickCheck.connectionLabel || 'Подключено';
        }

        // ============================================================
        // ЭТАП 2: ПРОВЕРКА КАТЕГОРИЙ
        // ============================================================
        addToLog("ЭТАП 2: Проверка категорий");
        const categoryResults = {};
        setProgressState(4, 'active');
        scrollToActiveProgress();

        let anyCategoryAvailable = false;

        for (const key of categoryKeys) {
            const sites = CONFIG.categories[key]?.sites || [];
            if (sites.length === 0) {
                categoryResults[key] = { successRate: 0, successful: 0, total: 0 };
                continue;
            }
            const result = await checkCategory(key, sites);
            categoryResults[key] = result;
            processCategory(key, result);

            if (result.successRate > 0) anyCategoryAvailable = true;
            await sleep(200);
        }

        setProgressState(4, 'pass');

        // ============================================================
        // ЭТАП 3: ОПРЕДЕЛЕНИЕ РЕЖИМА
        // ============================================================
        addToLog("ЭТАП 3: Определение режима сети");
        const mode = determineNetworkMode(categoryResults);
        let modeText;
        if (mode.mode === 'percent') {
            modeText = `${mode.percent}% доступно`;
        } else {
            modeText = getBlockingText(mode.mode);
        }
        document.getElementById('networkMode').textContent = modeText;
        addToLog("Режим: " + modeText + " (" + mode.mode + ")");

        const isFullBlock = mode.title === 'Полная блокировка';
        const isSuccess = !isFullBlock && anyCategoryAvailable;
        updateCategoryUI(categoryResults);

        // ============================================================
        // ЭТАП 4: ПИНГ
        // ============================================================
        let pingResult = { success: false, average: Infinity };

        if (isSuccess) {
            addToLog("ЭТАП 4: Тест пинга");
            setProgressState(3, 'active');
            scrollToActiveProgress();
            const pingUrl = getPingUrl(categoryResults);
            addToLog("URL: " + pingUrl);
            pingResult = await testPing(pingUrl, CONFIG.ping.attempts);
            updatePingUI(pingResult);
        } else {
            addToLog("ЭТАП 4: Пинг пропущен");
            document.getElementById('ping').innerHTML = '-- <span class="unit">мс</span>';
            updateDisplay('ping', 1);
            setProgressState(3, 'fail');
        }

        // ============================================================
        // ЭТАП 5: ПРОТОКОЛЫ
        // ============================================================
        let protocolResults = { dns: { success: false }, http: { success: false }, https: { success: false } };

        if (isSuccess) {
            addToLog("ЭТАП 5: Проверка протоколов");
            setProgressState(6, 'active');
            scrollToActiveProgress();

            protocolResults = await runProtocolTest();
            addToLog("DNS: " + (protocolResults.dns.success ? "OK" : "FAIL"));
            addToLog("HTTP: " + (protocolResults.http.success ? "OK" : "FAIL"));
            addToLog("HTTPS: " + (protocolResults.https.success ? "OK" : "FAIL"));

            const allSuccess = Object.values(protocolResults).every(r => r.success);
            setProgressState(6,'pass');
        } else {
            addToLog("ЭТАП 5: Протоколы пропущены");
            setProgressState(6, 'fail');

            document.querySelectorAll('.proto-test').forEach((item, index) => {
                const labels = ['DNS', 'HTTP', 'HTTPS'];
                item.style.color = '#ff4757';
                item.textContent = labels[index] || '—';
            });
            document.querySelector('#proto').innerHTML = `0/3 <span class="proto-static-test">доступно</span>`;
        }

        // ============================================================
        // ЭТАП 6: СОХРАНЕНИЕ В ИСТОРИЮ
        // ============================================================
        addToLog("ЭТАП 6: Сохранение в историю");
        saveTestResult({ pingResult, mode, isSuccess, startTime, protocolResults });

        if (!isSuccess) handleFullBlock();

    } catch (error) {
        addToLog("ОШИБКА: " + error.message);
        console.error('Ошибка в тесте:', error);
    } finally {
        await finalizeTest({ testBtn, startTime, stopTimeEl, testTimeEl });
    }
}