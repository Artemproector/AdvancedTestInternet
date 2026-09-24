// ============================================================
// Менеджер сводки
// ============================================================
let connect_index = document.querySelector(".connect_index");
function summaryload() {
    fullnavbar.classList.add('show-nav');
    let fullLabel = document.querySelector('.labal-full-menu');
    if (fullLabel) {
        fullLabel.textContent = 'Сводка данных';
    }
    let area = document.querySelector('.area');
    area.innerHTML = buildSummaryContent();
}
// НОРМАЛИЗАЦИЯ РЕЖИМОВ СЕТИ 
function normalizeMode(modeText) {
    // Карта соответствия: режим из истории → нормализованный режим
    const modeMap = {
        // Блок1 (списки)
        'Белые списки': 'Белые списки',
        'Черные списки': 'Черные списки',
        'Полная блокировка': 'Полная блокировка',
        'Полный доступ': 'Полный доступ',
        'VPN': 'VPN',
        'Ошибка': 'Ошибка',

        // Блок2 (проценты)
        '50% доступно': 'Черные списки',
        '25% доступно': 'Белые списки',
        '75% доступно': 'Черные списки',
        '0% доступно': 'Полная блокировка',
        '100% доступно': 'Полный доступ',

        // Блок3 (словами)
        'Только RU сервисы': 'Белые списки',
        'Только половина RU сервисов': 'Белые списки',
        'Доступны все RU, но половина EN': 'Черные списки',
        'Ничего не доступно': 'Полная блокировка',
        'Доступно все': 'Полный доступ',
        'Включен VPN': 'VPN'
    };

    // Проверяем точное совпадение
    if (modeMap[modeText]) return modeMap[modeText];

    // Проверяем частичные совпадения (на случай, если появятся новые варианты)
    const lower = modeText.toLowerCase();
    if (lower.includes('белый') || lower.includes('white') || lower.includes('только ru')) return 'Белые списки';
    if (lower.includes('черный') || lower.includes('black') || lower.includes('75%') || lower.includes('половина en')) return 'Черные списки';
    if (lower.includes('полный доступ') || lower.includes('100%') || lower.includes('доступно все')) return 'Полный доступ';
    if (lower.includes('vpn') || lower.includes('включен vpn')) return 'VPN';
    if (lower.includes('блокировка') || lower.includes('0%') || lower.includes('ничего не доступно')) return 'Полная блокировка';

    // Если ничего не подошло — возвращаем как есть
    return modeText;
}

// ============================================================
// ПОЛУЧЕНИЕ СПИСКА УНИКАЛЬНЫХ ТИПОВ СЕТИ ИЗ ИСТОРИИ
// ============================================================
function getUniqueNetworkTypes(history) {
    const types = new Set();
    history.forEach(item => {
        if (item.network && item.network !== 'unknown') {
            types.add(item.network);
        }
    });
    return Array.from(types);
}

// ============================================================
// ПОЛУЧЕНИЕ СТАТИСТИКИ ПО ТИПУ СЕТИ
// ============================================================
function getSummaryStats(history, networkFilter = null) {
    // Фильтруем историю по типу сети
    let filteredHistory = history;
    if (networkFilter) {
        filteredHistory = history.filter(item => item.network === networkFilter);
    }

    const total = filteredHistory.length;
    let success = 0;
    let fail = 0;
    let totalPing = 0;
    let pingCount = 0;
    const modes = {};
    const protocols = {
        dns: { total: 0, success: 0 },
        http: { total: 0, success: 0 },
        https: { total: 0, success: 0 }
    };

    filteredHistory.forEach(item => {
        // Определяем нормализованный режим
        const normalizedMode = normalizeMode(item.mode || 'Неизвестно');

        // Успех/неудача
        if (item.success !== false && item.mode !== 'Полная блокировка' && item.mode !== 'Нет интернета') {
            success++;
        } else {
            fail++;
        }

        // Режимы сети — нормализуем названия
        modes[normalizedMode] = (modes[normalizedMode] || 0) + 1;

        // Пинг
        if (item.ping && item.ping !== '—' && !isNaN(item.ping)) {
            const ping = parseFloat(item.ping);
            totalPing += ping;
            pingCount++;
        }

        // Протоколы
        if (item.protocols) {
            for (const [key, value] of Object.entries(item.protocols)) {
                if (protocols[key]) {
                    protocols[key].total++;
                    if (value) protocols[key].success++;
                }
            }
        }
    });

    let successRate = total > 0 ? Math.round((success / total) * 100) : 0;

    // Если среди тестов есть "Белые списки" — процент не должен падать ниже 50
    const hasWhitelist = Object.keys(modes).includes('Белые списки');
    if (hasWhitelist && successRate < 50) {
        successRate = 50;
    }
    const avgPing = pingCount > 0 ? Math.round(totalPing / pingCount) : 0;

    return {
        total,
        success,
        fail,
        successRate,
        avgPing,
        modes,
        protocols,
        networkType: networkFilter || 'Все'
    };
}

// ============================================================
// ПОСТРОЕНИЕ ГРАФИКА ПО ЧАСАМ
// ============================================================
function buildChart(history = null) {
    const data = history || getTodayHistory();

    if (data.length === 0) {
        return `<div style="text-align: center; padding: 20px; color: #8892b0; font-size: 13px;">Нет данных за сегодня</div>`;
    }

    const hourlyData = Array.from({ length: 24 }, () => ({
        total: 0,
        success: 0
    }));

    data.forEach(item => {
        const ts = item.timestamp || new Date(item.date).getTime();
        const hour = new Date(ts).getHours();
        hourlyData[hour].total++;
        const isSuccess = item.success !== false && item.mode !== 'Полная блокировка' && item.mode !== 'Нет интернета';
        if (isSuccess) hourlyData[hour].success++;
    });

    let html = `<div class="chart-container">`;
    html += `<div class="chart-labels">`;
    for (let i = 0; i < 24; i += 2) {
        html += `<span class="chart-label">${i}:00</span>`;
    }
    html += `</div>`;

    html += `<div class="chart-area">`;
    for (let i = 0; i < 24; i++) {
        const total = hourlyData[i].total;
        const success = hourlyData[i].success;
        const percent = total > 0 ? Math.round((success / total) * 100) : 0;

        // Высота = процент надёжности (0-100%)
        // Если нет данных — маленький столбик
        const height = total > 0 ? percent : 0;

        // Цвет как в режимах — оттенки серого с прозрачностью
        let color;
        if (total > 0) {
            const opacity = percent >= 70 ? 1 : percent >= 50 ? 0.6 : 0.3;
            color = `rgba(204, 214, 246, ${opacity})`;
        } else {
            color = '#2a3555';
        }

        html += `
            <div class="chart-bar-wrapper">
                <div class="chart-bar" style="height: ${height - 20}%; background: ${color};">
                    ${total > 0 ? `<span class="chart-bar-value">${percent}%</span>` : ''}
                </div>
                <span class="chart-bar-label">${i}</span>
            </div>
        `;
    }
    html += `</div>`;

    html += `<div class="chart-legend">`;
    html += `<span class="legend-item"><span class="legend-color" style="background: rgba(204, 214, 246, 1);"></span> ≥30%</span>`;
    html += `<span class="legend-item"><span class="legend-color" style="background: rgba(204, 214, 246, 0.6);"></span> 10-29%</span>`;
    html += `<span class="legend-item"><span class="legend-color" style="background: rgba(204, 214, 246, 0.3);"></span> &lt;10%</span>`;
    html += `<span class="legend-item"><span class="legend-color" style="background: #2a3555;"></span> нет данных</span>`;
    html += `</div>`;
    html += `</div>`;

    return html;
}
function buildModeStats(modes) {
    const total = Object.values(modes).reduce((a, b) => a + b, 0);
    if (total === 0) return '<p style="color: #8892b0; text-align: center;">Нет данных</p>';

    // Основные режимы (всегда показываются)
    const mainModes = ['Полный доступ', 'Белые списки', 'Черные списки', 'VPN', 'Полная блокировка'];

    // Собираем все режимы с их количеством
    const allModes = Object.entries(modes).map(([mode, count]) => ({
        mode,
        count,
        isMain: mainModes.includes(mode)
    }));

    // Сортируем по количеству (по убыванию)
    allModes.sort((a, b) => b.count - a.count);

    let html = '';

    // Показываем все режимы с сортировкой
    allModes.forEach(({ mode, count }) => {
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;
        const opacity = percent >= 30 ? 1 : percent >= 10 ? 0.6 : 0.3;
        const color = `rgba(204, 214, 246, ${opacity})`;

        html += `
            <div class="summary-mode-item">
                <div>
                    <span class="summary-mode-name">${mode}</span>
                    <div class="summary-mode-bar">
                        <div class="summary-mode-bar-fill" style="width: ${percent}%; background: ${color};"></div>
                    </div>
                </div>
                <span class="summary-mode-count">${count} (${percent}%)</span>
            </div>
        `;
    });

    return html;
}

// ============================================================
// ПОСТРОЕНИЕ СТАТИСТИКИ ПРОТОКОЛОВ
// ============================================================
function buildProtocolStats(protocols) {
    const labels = {
        dns: 'DNS',
        http: 'HTTP',
        https: 'HTTPS'
    };

    let html = '<div class="protocol-stats">';

    const order = ['dns', 'http', 'https'];
    order.forEach(key => {
        const data = protocols[key] || { total: 0, success: 0 };
        const percent = data.total > 0 ? Math.round((data.success / data.total) * 100) : 0;
        const color = percent >= 70 ? '#2ed573' : percent >= 40 ? '#ffa502' : '#ff4757';

        html += `
            <div class="protocol-item">
                <span class="protocol-label">${labels[key] || key}</span>
                <div class="protocol-bar">
                    <div class="protocol-bar-fill" style="width: ${percent}%; background: ${color};"></div>
                </div>
                <span class="protocol-value" style="color: ${color};">${percent}%</span>
                <span class="protocol-count">${data.success}/${data.total}</span>
            </div>
        `;
    });

    html += '</div>';
    return html;
}

// ============================================================
// ПОСТРОЕНИЕ КНОПОК ВЫБОРА ТИПА СЕТИ
// ============================================================
function buildNetworkTypeButtons(history, currentFilter) {
    const types = getUniqueNetworkTypes(history);

    // Если типов меньше 2 — не показываем переключатель
    if (types.length < 2) return '';

    let html = `<div class="network-type-buttons">`;
    html += `<button class="network-type-btn ${!currentFilter ? 'active' : ''}" data-network="">Все</button>`;

    const labels = {
        'wifi': 'Wi-Fi',
        'cellular': 'Мобильный',
        'ethernet': 'Проводное',
        'bluetooth': 'Bluetooth',
        'none': 'Нет сети'
    };

    types.forEach(type => {
        const label = labels[type] || type;
        html += `<button class="network-type-btn ${currentFilter === type ? 'active' : ''}" data-network="${type}">${label}</button>`;
    });

    html += `</div>`;
    return html;
}

// ============================================================
// ОСНОВНАЯ ФУНКЦИЯ СВОДКИ
// ============================================================
function buildSummaryContent(networkFilter = null) {
    const history = getSpeedHistory();

    if (history.length === 0) {
        return `
            <div style="text-align: center; padding: 40px 20px; color: #8892b0;">
                <p>История проверок пока пуста</p>
                <p style="font-size: 12px; margin-top: 10px;">Проведите первый тест, чтобы появились данные</p>
            </div>
        `;
    }

    // Получаем статистику
    const stats = getSummaryStats(history, networkFilter);

    // Строим HTML
    let html = `<div class="summary-container">`;
    // Кнопки выбора типа сети (только если есть >1 типа)
    html += buildNetworkTypeButtons(history, networkFilter);

    // Информация о фильтре (если выбран конкретный тип)
    if (networkFilter) {
        const filterLabel = CONFIG.connectionTypes.labels[networkFilter] || networkFilter;
        html += `<div class="summary-filter-info">Тип сети: <strong>${filterLabel}</strong></div>`;
    }

    // Карточки
    html += `
        <div class="summary-cards">
            <div class="summary-card">
                <div class="summary-card-value">${stats.total}</div>
                <div class="summary-card-label">Всего тестов</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-value" style="color: #2ed573;">${stats.success}</div>
                <div class="summary-card-label">Успешных</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-value" style="color: #ff4757;">${stats.fail}</div>
                <div class="summary-card-label">Неудачных</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-value" style="color: ${stats.successRate >= 70 ? '#2ed573' : stats.successRate >= 40 ? '#ffa502' : '#ff4757'};">${stats.successRate}%</div>
                <div class="summary-card-label">Надёжность</div>
            </div>
        </div>
    `;

    // Средний пинг
    html += `
        <div class="summary-section ping-summary">
            <h3 class="summary-section-title">Средний пинг</h3>
            <div class="summary-ping-large">
                <span class="summary-ping-value">${stats.avgPing}</span>
                <span class="summary-ping-unit">мс</span>
            </div>
        </div>
    `;

    // График надёжности по часам
    html += `
        <div class="summary-section">
            <h3 class="summary-section-title">Надёжность по часам (сегодня)</h3>
            ${buildChart()}
        </div>
    `;

    // Режимы сети
    html += `
        <div class="summary-section">
            <h3 class="summary-section-title">Режимы сети</h3>
            ${buildModeStats(stats.modes)}
        </div>
    `;

    // Протоколы
    html += `
        <div class="summary-section">
            <h3 class="summary-section-title">Протоколы</h3>
            ${buildProtocolStats(stats.protocols)}
        </div>
    `;

    html += `</div>`;

    return html;
}

// ============================================================
// ЗАГРУЗКА СВОДКИ (вызывается из меню)
// ============================================================
function summaryload() {
    fullnavbar.classList.add('show-nav');
    let fullLabel = document.querySelector('.labal-full-menu');
    if (fullLabel) {
        fullLabel.textContent = 'Сводка данных';
    }
    let area = document.querySelector('.area');

    // Показываем сводку без фильтра
    area.innerHTML = buildSummaryContent();

    // Делегирование событий — ОДИН обработчик
    // Используем именованную функцию, чтобы можно было удалить при повторном вызове
    if (window._summaryClickHandler) {
        area.removeEventListener('click', window._summaryClickHandler);
    }

    window._summaryClickHandler = function (e) {
        const btn = e.target.closest('.network-type-btn');
        if (!btn) return;

        const network = btn.dataset.network || null;

        // Перестраиваем сводку с фильтром
        area.innerHTML = buildSummaryContent(network);
    };

    area.addEventListener('click', window._summaryClickHandler);
}