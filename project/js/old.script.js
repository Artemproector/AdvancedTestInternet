// ============================================================
// УТИЛИТЫ
// ============================================================

function formatSpeed(bitsPerSecond) {
    if (bitsPerSecond === 0 || !isFinite(bitsPerSecond)) return '0';
    const mbps = bitsPerSecond / 1024 / 1024;
    return mbps.toFixed(2);
}

function formatPing(ms) {
    if (ms === Infinity || !isFinite(ms)) return '--';
    return Math.round(ms);
}

// ============================================================
// ПРОВЕРКА ДОСТУПНОСТИ САЙТОВ
// ============================================================
async function checkSiteAvailability(url, timeout = CONFIG.TIMEOUT_quickCheck) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const start = performance.now();

    try {
        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            mode: 'no-cors'
        });
        const end = performance.now();
        clearTimeout(timeoutId);
        return { success: true, time: end - start };
    } catch (error) {
        const end = performance.now();
        clearTimeout(timeoutId);

        // Определяем причину ошибки
        let reason = 'ошибка';
            reason = error.message;
        return {
            success: false,
            time: end - start,
            error: reason  // ← сохраняем причину
        };
    }
}

async function checkCategory(categoryKey, sites) {
    const results = await Promise.all(
        sites.map(url => checkSiteAvailability(url, CONFIG.TIMEOUT_quickCheck))
    );
    const successful = results.filter(r => r.success).length;
    const total = results.length;
    return {
        category: categoryKey,
        successRate: successful / total,
        successful,
        total,
        results
    };
}

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
    const typeMap = CONFIG.connectionTypes.labels || {
        'wifi': 'Wi-Fi',
        'cellular': 'Мобильный интернет',
        'ethernet': 'Проводное',
        'bluetooth': 'Bluetooth',
        'none': 'Нет сети',
        'unknown': 'Неизвестно (подробнее в справке)'
    };

    return {
        hasInternet: hasInternet,
        connectionType: connInfo.type,
        connectionLabel: typeMap[connInfo.type] || 'Неизвестно',
        effectiveType: connInfo.effectiveType || 'unknown',
        downlink: connInfo.downlink || 0,
        rtt: connInfo.rtt || 0
    };
}

// ============================================================
// ОБНОВЛЕНИЕ ДАННЫХ В КАТЕГОРИЯХ
// ============================================================

function updateCategoryUI(categoryResults) {
    const categoryKeys = Object.keys(categoryResults);

    categoryKeys.forEach(key => {
        const result = categoryResults[key];
        if (!result) return;

        const categoryEl = document.querySelector(`.cat-${key}`);
        if (!categoryEl) return;

        // Обновляем статус-иконку
        const icon = categoryEl.querySelector('.status-icon');
        if (icon) {
            icon.className = 'status-icon';
            if (result.successRate >= 0.5) {
                icon.classList.add('success');
                icon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#2ed573" stroke-width="2"/>
                    <path d="M7 12L10.5 15.5L17 9" stroke="#2ed573" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
            } else if (result.successRate > 0) {
                icon.classList.add('warning');
                icon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 21H22L12 2Z" stroke="#ffa502" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M12 9V14" stroke="#ffa502" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="12" cy="17" r="1" fill="#ffa502"/>
                </svg>`;
            } else {
                icon.classList.add('error');
                icon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#ff4757" stroke-width="2"/>
                    <path d="M8 8L16 16" stroke="#ff4757" stroke-width="2" stroke-linecap="round"/>
                    <path d="M16 8L8 16" stroke="#ff4757" stroke-width="2" stroke-linecap="round"/>
                </svg>`;
            }
        }

        // Детали
        const detailEl = categoryEl.querySelector(`#detail-${key}`);
        const reasonEl = categoryEl.querySelector(`#reason-${key}`);
        const countEl = categoryEl.querySelector(`#count-${key}`);
        const timeEl = categoryEl.querySelector(`#time-${key}`);
        const sitesListEl = categoryEl.querySelector('.category-list-elem');

        // Общий результат
        if (detailEl) {
            if (result.successRate >= 0.5) {
                detailEl.textContent = 'Доступен';
                detailEl.className = 'detail-value success';
            } else if (result.successRate > 0) {
                detailEl.textContent = 'Частично доступен';
                detailEl.className = 'detail-value warning';
            } else {
                detailEl.textContent = 'Недоступен';
                detailEl.className = 'detail-value error';
            }
        }

        if (reasonEl) {
            reasonEl.textContent = '';
            reasonEl.style.display = 'none';
        }

        if (countEl) {
            countEl.textContent = result.successful + '/' + result.total;
        }

        if (timeEl) {
            const avgTime = result.results
                .filter(r => r.success)
                .reduce((sum, r) => sum + r.time, 0);
            const count = result.results.filter(r => r.success).length;
            if (count > 0) {
                timeEl.textContent = Math.round(avgTime / count) + 'мс';
            } else {
                timeEl.textContent = '—';
            }
        }
        if (sitesListEl) {
            const items = sitesListEl.querySelectorAll('.category-list-elem');
            const shortDomains = CONFIG.categories[key]?.shortDomains || [];

            result.results.forEach((r, index) => {
                if (items[index]) {
                    const reason = r.success ? 'OK' : (r.error || 'ошибка');
                    const domain = shortDomains[index] || 'сайт ' + (index + 1);
                    items[index].innerHTML = `<div class='site_wrapper'><span class='site-domain'>` + domain + `</span>` + ' — ' + reason + '</div>';
                    items[index].style.color = r.success ? '#2ed573' : '#ff4757';
                }
            });
        }
    });
}

// ============================================================
// ОПРЕДЕЛЕНИЕ РЕЖИМА РАБОТЫ СЕТИ
// ============================================================

function determineNetworkMode(categoryResults) {
    const ru1 = categoryResults['ru1']?.successRate || 0;
    const ru2 = categoryResults['ru2']?.successRate || 0;
    const en1 = categoryResults['en1']?.successRate || 0;
    const en2 = categoryResults['en2']?.successRate || 0;

    const ruAvailable = ru1 > 0.5 && ru2 > 0.5;
    const en1Ok = en1 >= 0.3;
    const en2Ok = en2 >= 0.3;
    const enAvailable = en1Ok && en2Ok;

    if (!ru1 && !ru2 && !en1 && !en2) {
        updateDisplay("mode", '1');
        return { mode: 'total' };
    }
    if (en1Ok != en2Ok) {
        updateDisplay("mode", '3');
        return { mode: 'blacklist_OK' };
    }
    if (ruAvailable && enAvailable) {
        updateDisplay("mode", '4');
        return { mode: 'full' };
    }
    if (!ruAvailable && enAvailable) {
        updateDisplay("mode", '3');
        return { mode: 'vpn' };
    }
    if (ruAvailable && !en1Ok && !en2Ok) {
        updateDisplay("mode", '2');
        return { mode: 'whitelist_2OK' };
    }
    if (!ru1 || !ru2 && !enAvailable) {
        updateDisplay("mode", '2');
        return { mode: 'whitelist_1OK' };
    }
    updateDisplay("mode", '0');
    return { mode: 'error' };
}

// ============================================================
// ПРОВЕРКА ТИПА СОЕДИНЕНИЯ
// ============================================================

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
// СВОДКА ДАННЫХ (главная страница)
// ============================================================

function getTodayHistory() {
    const history = JSON.parse(localStorage.getItem('speedHistory') || '[]');
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const todayEnd = todayStart + 24 * 60 * 60 * 1000;

    return history.filter(item => {
        const ts = item.timestamp || new Date(item.date).getTime();
        return ts >= todayStart && ts < todayEnd;
    });
}

function updateConnectIndex() {
    const todayHistory = getTodayHistory();
    const totalTests = todayHistory.length;

    const connectIndexEls = document.querySelectorAll('.connect_index');
    const leftCols = document.querySelectorAll('.summary__left-col');

    if (totalTests === 0) {
        connectIndexEls.forEach(el => el.textContent = '——');
        leftCols.forEach(el => el.style.background = 'transparent');
        return;
    }

    let successCount = 0;
    todayHistory.forEach(item => {
        if (item.success !== false && item.mode !== 'Нет интернета') {
            successCount++;
        }
    });

    const successRate = Math.round((successCount / totalTests) * 100);
    let index = Math.min(Math.round(successRate / 10), 10);

    connectIndexEls.forEach(el => el.textContent = index);

    let bgColor = 'transparent';
    if (index >= 5) {
        bgColor = 'rgba(46, 213, 115, 0.15)';
    } else if (index === 4) {
        bgColor = 'rgba(46, 213, 115, 0.10)';
    } else if (index === 3) {
        bgColor = 'rgba(255, 165, 2, 0.15)';
    } else if (index === 2) {
        bgColor = 'rgba(255, 165, 2, 0.10)';
    } else if (index === 1) {
        bgColor = 'rgba(255, 71, 87, 0.15)';
    } else if (index === 0) {
        bgColor = 'rgba(255, 71, 87, 0.10)';
    }

    leftCols.forEach(el => el.style.background = bgColor);
}

function updateTestsCounter() {
    const todayHistory = getTodayHistory();
    const totalTests = todayHistory.length;

    const testsCounterEls = document.querySelectorAll('.tests_counter');
    const rightCols = document.querySelectorAll('.summary__right-col');

    testsCounterEls.forEach(el => el.textContent = totalTests);

    let bgColor = 'transparent';
    if (totalTests === 0) {
        bgColor = 'transparent';
    } else if (totalTests >= 5) {
        bgColor = 'rgba(46, 213, 115, 0.15)';
    } else if (totalTests === 4) {
        bgColor = 'rgba(46, 213, 115, 0.10)';
    } else if (totalTests === 3) {
        bgColor = 'rgba(255, 165, 2, 0.15)';
    } else if (totalTests === 2) {
        bgColor = 'rgba(255, 165, 2, 0.10)';
    } else if (totalTests === 1) {
        bgColor = 'rgba(255, 71, 87, 0.15)';
    }

    rightCols.forEach(el => el.style.background = bgColor);
}

function calcConnectIndex() {
    updateConnectIndex();
    updateTestsCounter();
}

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
// ОСНОВНОЙ ТЕСТ
// ============================================================

async function runFullTest() {
    addToLog("═══════════════════════════════════════════════════");
    addToLog("НАЧАЛО ТЕСТА");
    addToLog("Пресет: " + currentPreset);
    addToLog("Таймаут: " + currentTime + " (" + CONFIG.TIMEOUT_description + ")");
    addToLog("Блокировка: " + currentblock);
    addToLog("Дизайн: " + currentdsgn);

    const testBtn = document.getElementById('testBtn');
    let startTime = null;
    let endTime = null;
    const startTimeEl = document.querySelector('.start-time');
    const stopTimeEl = document.querySelector('.stop-time');
    const testTimeEl = document.querySelector('.test-time');

    // Сброс таймера
    if (startTimeEl) startTimeEl.textContent = '--:--:--';
    if (stopTimeEl) stopTimeEl.textContent = '--:--:--';
    if (testTimeEl) testTimeEl.textContent = '--';
    startTime = Date.now();
    if (startTimeEl) {
        const date = new Date(startTime);
        startTimeEl.textContent = date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
    }

    updateVisibilityByPreset();

    // Скрываем ненужные прогресс-бары
    if (currentPreset == 'kat') {
        progress_el_3.style.display = 'none';
        progress_el_6.style.display = 'none';
    } else {
        progress_el_3.style.display = 'block';
        progress_el_6.style.display = 'block';
    }

    testBtn.classList.add('loading');
    testBtn.disabled = true;
    updateDisplay("all", 5);

    // Скрываем скорость
    document.querySelector('.dwn-card')?.style?.setProperty('display', 'none');
    document.querySelector('.dwn-card--DSGN2')?.style?.setProperty('display', 'none');
    document.querySelector('.dwn-card--DSGN3')?.style?.setProperty('display', 'none');

    document.getElementById('ping').innerHTML = '--<span class="unit">мс</span>';
    document.getElementById('networkMode').textContent = '--';

    const protoItems = document.querySelectorAll('.proto-test');
    protoItems.forEach(item => {
        item.style.color = '#fff';
        const label = item.textContent.replace(/[✅❌]\s*/, '');
        item.textContent = label;
    });
    const valueEl = document.querySelector('#proto');
    valueEl.innerHTML = `-- <span class="proto-static-test">доступно</span>`;

    const categoryKeys = ['ru1', 'ru2', 'en1', 'en2'];
    for (const key of categoryKeys) {
        const icon = document.getElementById(`cat-${key}`);
        if (icon) {
            icon.className = 'status-icon';
            icon.innerHTML = '';
        }
    }

    progress_el_1.classList.remove('pr-bar-section--pass', 'pr-bar-section--fail', 'pr-bar-section--active');
    progress_el_2.classList.remove('pr-bar-section--pass', 'pr-bar-section--fail', 'pr-bar-section--active');
    progress_el_3.classList.remove('pr-bar-section--pass', 'pr-bar-section--fail', 'pr-bar-section--active');
    progress_el_4.classList.remove('pr-bar-section--pass', 'pr-bar-section--fail', 'pr-bar-section--active');
    progress_el_5.classList.remove('pr-bar-section--pass', 'pr-bar-section--fail', 'pr-bar-section--active');
    progress_el_6.classList.remove('pr-bar-section--pass', 'pr-bar-section--fail', 'pr-bar-section--active');
    scrollToFirst();

    try {
        // ============================================================
        // ЭТАП 1: БЫСТРАЯ ПРОВЕРКА ИНТЕРНЕТА
        // ============================================================
        addToLog("ЭТАП 1: Проверка интернета");
        const quickCheck = await quickInternetCheck();
        progress_el_1.classList.add('pr-bar-section--pass');
        updateConnectionInfo();

        addToLog("Интернет: " + (quickCheck.hasInternet ? "есть" : "нет"));
        addToLog("Тип сети: " + (quickCheck.connectionLabel || 'Неизвестно'));
        addToLog("Эффективный тип: " + (quickCheck.effectiveType || 'unknown'));
        addToLog("Downlink: " + (quickCheck.downlink || 'N/A') + " Мбит/с");
        addToLog("RTT: " + (quickCheck.rtt || 'N/A') + " мс");

        if (!quickCheck.hasInternet) {
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

            progress_el_1.classList.add('pr-bar-section--pass');
            progress_el_2.classList.add('pr-bar-section--fail');
            progress_el_3.classList.add('pr-bar-section--fail');
            progress_el_4.classList.add('pr-bar-section--fail');
            progress_el_5.classList.add('pr-bar-section--pass');
            progress_el_6.classList.add('pr-bar-section--fail');
            progress_el_1.classList.remove('pr-bar-section--active');

            for (const key of categoryKeys) {
                const icon = document.getElementById(`cat-${key}`);
                if (icon) {
                    icon.className = 'status-icon error';
                    icon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="#ff4757" stroke-width="2"/>
                        <path d="M8 8L16 16" stroke="#ff4757" stroke-width="2" stroke-linecap="round"/>
                        <path d="M16 8L8 16" stroke="#ff4757" stroke-width="2" stroke-linecap="round"/>
                    </svg>`;
                }
            }

            calcConnectIndex();
            scrollToLast();
            addToLog("ТЕСТ ПРЕРВАН (нет интернета)");
            addToLog("═══════════════════════════════════════════════════");
            return;
        }

        if (quickCheck.connectionType) {
            const typeLabel = quickCheck.connectionLabel || 'Подключено';
            document.querySelector('.it-bar-1').textContent = typeLabel;
        }

        // ============================================================
        // ЭТАП 2: ПРОВЕРКА КАТЕГОРИЙ
        // ============================================================
        addToLog("ЭТАП 2: Проверка категорий");
        const categoryResults = {};
        progress_el_4.classList.add('pr-bar-section--active');
        scrollToActiveProgress();

        let anyCategoryAvailable = false;

        for (const key of categoryKeys) {
            const sites = CONFIG.categories[key]?.sites || [];
            if (sites.length === 0) {
                categoryResults[key] = { successRate: 0, successful: 0, total: 0 };
                continue;
            }
            addToLog(`Проверка категории ${key} (${sites.length} сайтов)...`);
            const result = await checkCategory(key, sites);
            categoryResults[key] = result;

            addToLog(key + ": " + result.successful + "/" + result.total);
            result.results.forEach((r, i) => {
                const url = sites[i] || 'unknown';
                addToLog("  " + url + " - " + (r.success ? "OK" : "TIMEOUT"));
            });

            if (result.successRate > 0) {
                anyCategoryAvailable = true;
            }

            const icon = document.getElementById(`cat-${key}`);
            if (icon) {
                const threshold = 0.5;
                icon.className = 'status-icon';
                if (result.successRate >= threshold) {
                    icon.classList.add('success');
                    icon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="#2ed573" stroke-width="2"/>
                        <path d="M7 12L10.5 15.5L17 9" stroke="#2ed573" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>`;
                } else if (result.successRate > 0) {
                    icon.classList.add('warning');
                    icon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 21H22L12 2Z" stroke="#ffa502" stroke-width="2" stroke-linejoin="round"/>
                        <path d="M12 9V14" stroke="#ffa502" stroke-width="2" stroke-linecap="round"/>
                        <circle cx="12" cy="17" r="1" fill="#ffa502"/>
                    </svg>`;
                } else {
                    icon.classList.add('error');
                    icon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="#ff4757" stroke-width="2"/>
                        <path d="M8 8L16 16" stroke="#ff4757" stroke-width="2" stroke-linecap="round"/>
                        <path d="M16 8L8 16" stroke="#ff4757" stroke-width="2" stroke-linecap="round"/>
                    </svg>`;
                }
            }
            await sleep(200);
        }

        progress_el_4.classList.add('pr-bar-section--pass');
        progress_el_4.classList.remove('pr-bar-section--active');

        // ============================================================
        // ЭТАП 3: ОПРЕДЕЛЕНИЕ РЕЖИМА
        // ============================================================
        addToLog("ЭТАП 3: Определение режима сети");
        const mode = determineNetworkMode(categoryResults);
        const modeText = getBlockingText(mode.mode);
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
            progress_el_3.classList.add('pr-bar-section--active');
            const pingUrl = getPingUrl(categoryResults);
            addToLog("URL: " + pingUrl);
            pingResult = await testPing(pingUrl, CONFIG.ping.attempts);
            scrollToActiveProgress();

            if (pingResult.success) {
                const pingColor = getPingColor(pingResult.average);
                document.getElementById('ping').innerHTML = `
                    <span style="color: ${pingColor.color}">
                        ${Math.round(pingResult.average)}
                    </span>
                    <span class="unit">мс</span>
                `;
                updateDisplay('ping', pingColor.level);
                progress_el_3.classList.add('pr-bar-section--pass');
                addToLog("Пинг: " + Math.round(pingResult.average) + "ms");
            } else {
                document.getElementById('ping').innerHTML = '-- <span class="unit">мс</span>';
                updateDisplay('ping', 1);
                progress_el_3.classList.add('pr-bar-section--fail');
                addToLog("Пинг: не удался");
            }
            progress_el_3.classList.remove('pr-bar-section--active');
        } else {
            addToLog("ЭТАП 4: Пинг пропущен (полная блокировка)");
            document.getElementById('ping').innerHTML = '-- <span class="unit">мс</span>';
            updateDisplay('ping', 1);
            progress_el_3.classList.add('pr-bar-section--fail');
        }

        // ============================================================
        // ЭТАП 5: ПРОТОКОЛЫ
        // ============================================================
        let protocolResults = { dns: { success: false }, http: { success: false }, https: { success: false } };

        if (isSuccess) {
            addToLog("ЭТАП 5: Проверка протоколов");
            const prBar6 = document.querySelector('.pr-bar-6');
            if (prBar6) {
                prBar6.classList.add('pr-bar-section--active');
                scrollToActiveProgress();
            }

            protocolResults = await runProtocolTest();
            addToLog("DNS: " + (protocolResults.dns.success ? "OK" : "FAIL"));
            addToLog("HTTP: " + (protocolResults.http.success ? "OK" : "FAIL"));
            addToLog("HTTPS: " + (protocolResults.https.success ? "OK" : "FAIL"));

            if (prBar6) {
                const allSuccess = Object.values(protocolResults).every(r => r.success);
                if (allSuccess) {
                    prBar6.classList.add('pr-bar-section--pass');
                } else {
                    prBar6.classList.add('pr-bar-section--fail');
                }
                prBar6.classList.remove('pr-bar-section--active');
            }
        } else {
            addToLog("ЭТАП 5: Протоколы пропущены (полная блокировка)");
            const prBar6 = document.querySelector('.pr-bar-6');
            if (prBar6) {
                prBar6.classList.add('pr-bar-section--fail');
            }
            const protoItems = document.querySelectorAll('.proto-test');
            protoItems.forEach((item, index) => {
                const labels = ['DNS', 'HTTP', 'HTTPS'];
                item.style.color = '#ff4757';
                item.textContent = labels[index] || '—';
            });
            const valueEl = document.querySelector('#proto');
            valueEl.innerHTML = `0/3 <span class="proto-static-test">доступно</span>`;
        }

        // ============================================================
        // ЭТАП 6: СОХРАНЕНИЕ В ИСТОРИЮ
        // ============================================================
        addToLog("ЭТАП 6: Сохранение в историю");
        const protocolStatus = {
            dns: protocolResults.dns?.success || false,
            http: protocolResults.http?.success || false,
            https: protocolResults.https?.success || false
        };

        const connInfo = getConnectionType();
        endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(1);

        addHistoryRecord({
            timestamp: Date.now(),
            ping: pingResult.success ? Math.round(pingResult.average) : '—',
            mode: getBlockingText(mode.mode),
            date: new Date().toLocaleString(),
            success: isSuccess,
            duration: duration,
            protocols: protocolStatus,
            network: connInfo?.type || 'unknown'
        });

        addToLog(`   Длительность: ${duration} сек`);
        addToLog(`   Успешность: ${isSuccess ? 'УСПЕШНО' : 'НЕУДАЧНО'}`);

        calcConnectIndex();

        if (!isSuccess) {
            progress_el_1.classList.add('pr-bar-section--pass');
            progress_el_2.classList.add('pr-bar-section--pass');
            progress_el_3.classList.add('pr-bar-section--fail');
            progress_el_4.classList.add('pr-bar-section--pass');
            progress_el_5.classList.add('pr-bar-section--pass');
            progress_el_6.classList.add('pr-bar-section--pass');
            document.getElementById('networkMode').textContent = 'Полная блокировка';
            updateDisplay('mode', 1);
        }

    } catch (error) {
        addToLog("ОШИБКА: " + error.message);
        console.error('Ошибка в тесте:', error);
    } finally {
        endTime = endTime || Date.now();
        if (stopTimeEl) {
            const date = new Date(endTime);
            stopTimeEl.textContent = date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
        }
        if (testTimeEl && startTime) {
            const duration = Math.floor((endTime - startTime) / 1000);
            testTimeEl.textContent = duration;
        }
        updateConnectionInfo();
        testBtn.classList.remove('loading');
        testBtn.disabled = false;
        await sleep(500);
        progress_el_5.classList.add('pr-bar-section--pass');
        scrollToLast();
        addToLog("ТЕСТ ЗАВЕРШЁН");
        addToLog("═══════════════════════════════════════════════════");
    }
}

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('testBtn');
    btn.addEventListener('click', runFullTest);
    calcConnectIndex();
    updateConnectionInfo();
});