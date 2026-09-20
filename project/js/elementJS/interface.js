// ============================================================
//  ИНТЕРФЕЙС
// ============================================================
function updateConnectionInfo() {
    const info = getConnectionType();
    const typeEl = document.querySelector('.it-bar-1');
    const cgfEl = document.querySelector('.it-bar-2');
    if (!info) {
        typeEl.textContent = 'Неизвестно';
        return;
    }
    cgfEl.textContent = presetNames[currentPreset];
    const typeMap = CONFIG.connectionTypes.labels
    const typeLabel = typeMap[info.type] || 'Неизвестно';
    typeEl.textContent = `${typeLabel}`;
    if (info.type === 'none') {
        typeEl.style.color = '#ff4757';
    } else {
        typeEl.style.color = '#2ed573';
    }
}
function updateVisibilityByPreset() {
    const allCards = document.querySelectorAll('.dwn-card, .ping-card, .proto-card, .dwn-card--DSGN2, .ping-card--DSGN2, .proto-card--DSGN2, .dwn-card--DSGN3, .ping-card--DSGN3, .proto-card--DSGN3');
    allCards.forEach(el => el.style.display = '');
    if (currentPreset === 'kat') {
        if (currentdsgn === 'dsgn2') {
            document.querySelector('.dwn-card--DSGN2').style.display = 'none';
            document.querySelector('.ping-card--DSGN2').style.display = 'none';
            document.querySelector('.proto-card--DSGN2').style.display = 'none';
        }
        else {
            document.querySelector('.dwn-card').style.display = 'none';
            document.querySelector('.ping-card').style.display = 'none';
            document.querySelector('.proto-card').style.display = 'none';
        }
    }
}

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
    ['ru1', 'ru2', 'en1', 'en2'].forEach(key => {
        const icon = document.getElementById(`cat-${key}`);
        if (icon) {
            icon.className = 'status-icon';
            icon.innerHTML = '';
        }
    });

    // Прогресс-бары
    [progress_el_1, progress_el_2, progress_el_3, progress_el_4, progress_el_5, progress_el_6].forEach(el => {
        el.classList.remove('pr-bar-section--pass', 'pr-bar-section--fail', 'pr-bar-section--active');
    });
    scrollToFirst();
}
function handleFullBlock() {
    progress_el_1.classList.add('pr-bar-section--pass');
    progress_el_2.classList.add('pr-bar-section--pass');
    progress_el_3.classList.add('pr-bar-section--fail');
    progress_el_4.classList.add('pr-bar-section--pass');
    progress_el_5.classList.add('pr-bar-section--pass');
    progress_el_6.classList.add('pr-bar-section--pass');
    document.getElementById('networkMode').textContent = 'Полная блокировка';
    updateDisplay('mode', 1);
}
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
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('testBtn');
    btn.addEventListener('click', runFullTest);
    calcConnectIndex();
    updateConnectionInfo();
});
