// ============================================================
// ЭЛЕМЕНТЫ UI
// ============================================================

let connect_index = document.querySelector(".connect_index");
let app_ver = document.querySelectorAll('.app_ver');
let progress_el_1 = document.querySelector('.pr-bar-1');
let progress_el_2 = document.querySelector('.pr-bar-2');
let progress_el_3 = document.querySelector('.pr-bar-3');
let progress_el_4 = document.querySelector('.pr-bar-4');
let progress_el_5 = document.querySelector('.pr-bar-5');
let progress_el_6 = document.querySelector('.pr-bar-6');
let navbar = document.querySelector('.nav-bar');
let fullnavbar = document.querySelector('.full-nav-bar');
let header__left_col_btn = document.querySelector('.header__left-col-btn');

// Устанавливаем версию из конфига
app_ver.forEach(e => {
    e.textContent = `Версия: ${CONFIG.version}`;
});

// ============================================================
// ПРОКРУТКА ПРОГРЕСС-БАРА
// ============================================================

function scrollToActiveProgress() {
    const progressBar = document.querySelector('.progress-bar');
    const activeElement = progressBar.querySelector('.pr-bar-section--active');
    if (activeElement) {
        const containerWidth = progressBar.offsetWidth;
        const elementOffset = activeElement.offsetLeft;
        const elementWidth = activeElement.offsetWidth;
        progressBar.scrollLeft = elementOffset - (containerWidth / 2) + (elementWidth / 2);
    }
}

function scrollToLast() {
    const progressBar = document.querySelector('.progress-bar');
    const element = progressBar.querySelectorAll('.pr-bar-section');
    if (element.length) {
        const containerWidth = progressBar.offsetWidth;
        const elementOffset = element[element.length - 1].offsetLeft;
        const elementWidth = element[element.length - 1].offsetWidth;
        progressBar.scrollLeft = elementOffset - (containerWidth / 2) + (elementWidth / 2);
    }
}

function scrollToFirst() {
    const progressBar = document.querySelector('.progress-bar');
    const element = progressBar.querySelectorAll('.pr-bar-section');
    if (element.length) {
        const containerWidth = progressBar.offsetWidth;
        const elementOffset = element[0].offsetLeft;
        const elementWidth = element[0].offsetWidth;
        progressBar.scrollLeft = elementOffset - (containerWidth / 2) + (elementWidth / 2);
    }
}

// ============================================================
// МЕНЮ И НАВИГАЦИЯ
// ============================================================

header__left_col_btn.addEventListener('click', function (e) {
    e.stopPropagation();
    navbar.classList.toggle('show-nav');
});

document.addEventListener('click', function (e) {
    const isClickOnNavbar = navbar.contains(e.target);
    const isClickOnFullNavbar = fullnavbar.contains(e.target);
    const isClickOnButton = header__left_col_btn.contains(e.target);
    if (navbar.classList.contains('show-nav')) {
        if (!isClickOnNavbar && !isClickOnFullNavbar && !isClickOnButton) {
            navbar.classList.remove('show-nav');
        }
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navbar.classList.contains('show-nav')) {
        navbar.classList.remove('show-nav');
    }
});

function closemenu() {
    navbar.classList.remove('show-nav');
}

function closefullmenu() {
    fullnavbar.classList.remove('show-nav');
}

// ============================================================
// ЗАГЛУШКИ И НАСТРОЙКИ
// ============================================================

function probka_zaglushka() {
    fullnavbar.classList.add('show-nav');
    let fullLabel = document.querySelector('.labal-full-menu');
    if (fullLabel) {
        fullLabel.textContent = 'Упс...';
    }
    let area = document.querySelector('.area');
    area.innerHTML = `<pre> 
    ┌─────────────────────────────────────┐
    │   Обновления будут... когда-нибудь  │
    │              ¯\\_(ツ)_/¯             │
    └─────────────────────────────────────┘
    </pre> А пока просто пользуйся тестом. Он и без этого не плохой (наверное)`;
}
function summaryload() {
    //fullnavbar.classList.add('show-nav');
    //let fullLabel = document.querySelector('.labal-full-menu');
    //if (fullLabel) {
    //    fullLabel.textContent = 'Сводка данных';
    //}
    //let area = document.querySelector('.area');
    //area.innerHTML = buildSummaryContent();
    //НА ДОРАБОТКЕ!!!!
    probka_zaglushka()
}
function openupdate() {
    fullnavbar.classList.add('show-nav');
    let fullLabel = document.querySelector('.labal-full-menu');
    if (fullLabel) {
        fullLabel.textContent = 'Проверка обновлений';
    }
    let area = document.querySelector('.area');
    area.innerHTML = `<div style="text-align: center; padding: 40px 20px;"><p style="color: #8892b0;">⏳ Проверка обновлений...</p></div>`;

    checkupdate().then(result => {
        if (result.status === 'developer') {
            // 🎉 Пасхалка для разработчиков
            const devMessage = result.isDev
                ? 'Ты используешь dev-версию! Не забудь выкатить релиз, когда всё будет готово.'
                : 'Ты впереди всех! Видимо, ты разработчик, который ещё не выложил релиз.';
            area.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <p style="font-size: 48px; margin-bottom: 10px;">🔥</p>
                    <p style="color: #4facfe; font-size: 24px; font-weight: 700;">Привет, разработчик!</p>
                    <p style="color: #8892b0; margin-top: 10px;">${devMessage}</p>
                    <p style="color: #8892b0; margin-top: 10px;">
                        Твоя версия: <strong style="color: #ccd6f6;">${result.version}</strong>
                        ${result.latestVersion ? `| Последняя на GitHub: <strong style="color: #8892b0;">${result.latestVersion}</strong>` : ''}
                    </p>
                    <p style="color: #5a6a8a; font-size: 12px; margin-top: 15px;">
                        Эта страница видна только разработчикам
                    </p>
                </div>
            `;
        } else if (result.status === 'up_to_date') {
            area.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <p style="color: #2ed573; font-size: 20px; font-weight: 600;">Установлена последняя версия</p>
                    <p style="color: #8892b0; margin-top: 10px;">Версия: ${result.version}</p>
                    ${result.isDev ? '<p style="color: #ffa502; font-size: 14px; margin-top: 10px;">📌 dev-версия</p>' : ''}
                </div>
            `;
        } else if (result.status === 'outdated') {
            area.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <p style="color: #ffa502; font-size: 20px; font-weight: 600;">Доступна новая версия!</p>
                    <p style="color: #8892b0; margin-top: 10px;">Текущая версия: ${result.currentVersion}</p>
                    <p style="color: #8892b0;">Последняя версия: ${result.latestVersion}</p>
                    <br>
                    <a href="${result.url}" target="_blank" style="display: inline-block; padding: 12px 30px; background: #4facfe; color: #0a0e1a; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 15px;">Перейти к загрузке</a>
                </div>
            `;
        } else {
            area.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <p style="color: #ff4757; font-size: 18px; font-weight: 600;">${result.message}</p>
                    <p style="color: #8892b0; margin-top: 10px;">Проверьте подключение к интернету и повторите попытку.</p>
                    <button onclick="openupdate()" style="display: inline-block; padding: 10px 25px; background: #2a3555; color: #fff; border: none; border-radius: 8px; cursor: pointer; margin-top: 15px; font-size: 14px;">Повторить проверку</button>
                </div>
            `;
        }
    });
}
function openSettings() {
    fullnavbar.classList.add('show-nav');
    let fullLabel = document.querySelector('.labal-full-menu');
    if (fullLabel) {
        fullLabel.textContent = 'Настройки';
    }
    let area = document.querySelector('.area');
    area.innerHTML = `
        <h3 class='setting_name'>Выбор конфигурации:</h3>
        <div class='settings_wrapper'>
        <ol class='selecter'>
            <li class="select cfg cfg_base ${currentPreset === 'base' ? 'selected' : ''}" data-preset="base">Базовая</li>
            <li class="select cfg cfg_exp ${currentPreset === 'exp' ? 'selected' : ''}" data-preset="exp">Экспресс</li>
            <li class="select cfg cfg_kat ${currentPreset === 'kat' ? 'selected' : ''}" data-preset="kat">Только категории</li>
            <li class="select cfg cfg_pls ${currentPreset === 'pls' ? 'selected' : ''}" data-preset="pls">Расширенная</li>
        </ol>
        <p id="configDescription"><span class='desclabel'>Описание конфигурации:</span><br> ${loadDescConfigs()}</p></div>
        <h3 class='setting_name'>Дизайн:</h3>
        <ol class='selecter'>
            <li class="select dsgn dsgn1 ${currentdsgn === 'dsgn1' ? 'selected' : ''}" data-dsgn="dsgn1">Стандартный</li>
            <li class="select dsgn dsgn2 ${currentdsgn === 'dsgn2' ? 'selected' : ''}" data-dsgn="dsgn2">Горизонтальный</li>
            <li class="select dsgn dsgn3 ${currentdsgn === 'dsgn3' ? 'selected' : ''}" data-dsgn="dsgn3">Точечный</li>
        </ol>
    `;
    document.querySelectorAll('.cfg').forEach(el => {
        el.addEventListener('click', function () {
            const presetName = this.dataset.preset;
            selectCFG(presetName);
            document.querySelectorAll('.cfg').forEach(item => {
                item.classList.remove('selected');
            });
            this.classList.add('selected');

            // Обновляем описание
            const descEl = document.getElementById('configDescription');
            if (descEl) {
                descEl.innerHTML = `<span class='desclabel'>Описание конфигурации:</span><br> ${loadDescConfigs()}`;
            }
        });
    });
    document.querySelectorAll('.dsgn').forEach(el => {
        el.addEventListener('click', function () {
            const dsgnName = this.dataset.dsgn;
            console.log(dsgnName);
            selectDSGN(dsgnName);
            document.querySelectorAll('.dsgn').forEach(item => {
                item.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
}
function openlink() {
    fullnavbar.classList.add('show-nav');
    let fullLabel = document.querySelector('.labal-full-menu');
    if (fullLabel) {
        fullLabel.textContent = 'Переход на другой сайт';
    }
    let area = document.querySelector('.area');
    area.innerHTML = 'Внимание, данная кнопка ведет на другой сайт (github.com). Если вы действительно хотите перейти нажмите далее<br> <a href="https://github.com/Artemproector/AdvancedTestInternet">Далее</a>';
}

// ============================================================
// ДИСПЛЕЙ И ЦВЕТА
// ============================================================



function updateDisplay(type, value = 0) {
    const dwnElements = document.querySelectorAll('.dwn');
    const upElements = document.querySelectorAll('.up');
    const pingElements = document.querySelectorAll('.ping');
    const modeElements = document.querySelectorAll('.mode');
    const level = Math.min(Math.max(Math.round(value), 0), 5);
    let elements = [];
    if (type === 'dwn') elements = dwnElements;
    else if (type === 'up') elements = upElements;
    else if (type === 'ping') elements = pingElements;
    else if (type === 'mode') elements = modeElements;
    else if (type === 'all') {
        updateDisplay('dwn', value);
        updateDisplay('up', value);
        updateDisplay('ping', value);
        updateDisplay('mode', value);
        return;
    } else {
        console.warn(`Неизвестный тип дисплея: ${type}`);
        return;
    }
    elements.forEach((el, index) => {
        const isActive = index >= (5 - level);
        el.classList.remove('show', 'hide', 'active', 'inactive');
        if (isActive) {
            el.classList.add('show');
        } else {
            el.classList.add('hide');
        }
    });
}

function getSpeedColor(speedMbps) {
    const { veryBad, bad, average, good } = CONFIG.speedColors;
    if (speedMbps < veryBad) {
        return { color: '#ff4757', level: 1 };
    } else if (speedMbps < bad) {
        return { color: '#ff6b35', level: 2 };
    } else if (speedMbps < average) {
        return { color: '#ffa502', level: 3 };
    } else if (speedMbps < good) {
        return { color: '#2ed573', level: 4 };
    } else {
        return { color: '#2ed573', level: 5 };
    }
}

function getPingColor(pingMs) {
    const { excellent, good, average, bad } = CONFIG.pingColors;
    if (pingMs < excellent) {
        return { color: '#2ed573', level: 5 };
    } else if (pingMs < good) {
        return { color: '#7bed9f', level: 4 };
    } else if (pingMs < average) {
        return { color: '#ffa502', level: 3 };
    } else if (pingMs < bad) {
        return { color: '#ff6b35', level: 2 };
    } else {
        return { color: '#ff4757', level: 1 };
    }
}

// ============================================================
// ИСТОРИЯ И ФИЛЬТРЫ
// ============================================================

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
        'no': 'Нет интернета',
        'white': 'Белые списки',
        'black': 'Черные списки',
        'full': 'Полный доступ'
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
            <div id="ft-bar-2" class="ft-bar-section ft-bar-2 ${currentFilter === 'no' ? 'ft-bar-section--active' : ''}" data-filter="no">Нет интернета</div>
            <div id="ft-bar-3" class="ft-bar-section ft-bar-3 ${currentFilter === 'white' ? 'ft-bar-section--active' : ''}" data-filter="white">Белые списки</div>
            <div id="ft-bar-4" class="ft-bar-section ft-bar-4 ${currentFilter === 'black' ? 'ft-bar-section--active' : ''}" data-filter="black">Черные списки</div>
            <div id="ft-bar-5" class="ft-bar-section ft-bar-5 ${currentFilter === 'full' ? 'ft-bar-section--active' : ''}" data-filter="full">Полный доступ</div>
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
        reversed.forEach((item) => {
            const download = item.downloadSpeed !== undefined && item.downloadSpeed !== null ? item.downloadSpeed : '—';
            const upload = item.uploadSpeed !== undefined && item.uploadSpeed !== null ? item.uploadSpeed : '—';
            const ping = item.ping !== undefined && item.ping !== null ? item.ping : '—';
            const mode = item.mode || 'Неизвестно';
            const date = item.date || new Date(item.timestamp).toLocaleString() || 'Дата неизвестна';
            const network = item.network || ''
            const duration = item.duration || '--'
            const proto = (Object.values(item.protocols)).length || '--'
            console.log(item.protocols);
            listHtml += `
            <div class="history-item">
                <div class="history-item-date">${date} ${network != 'unknown' ? showNetIkon(network) : '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M584-637q0-43-28.5-69T480-732q-29 0-52.5 12.5T387-683q-16 23-43.5 26.5T296-671q-14-13-15.5-32t9.5-36q32-48 81.5-74.5T480-840q97 0 157.5 55T698-641q0 45-19 81t-70 85q-37 35-50 54.5T542-376q-4 24-20.5 40T482-320q-23 0-39.5-15.5T426-374q0-39 17-71.5t57-68.5q51-45 67.5-69.5T584-637ZM480-80q-33 0-56.5-23.5T400-160q0-33 23.5-56.5T480-240q33 0 56.5 23.5T560-160q0 33-23.5 56.5T480-80Z"/></svg>'}</div>
                <div class="history-item-row">
                    <span class="history-speed-down">↓ ${download} Мбит/с</span>
                    <!--<span class="history-speed-up">↑ ${upload} Мбит/с</span>-->
                    <span class="history-ping">${ping} мс</span>
                    <span class="history-mode-tag">${mode}</span>
                    <span class="history-test-duration">${duration} сек</span>
                    <span class="history-proto">${proto}/3</span>
                </div>
            </div>
        `;
        });
    }
    catch {
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
    listHtml += `
        </div>
    `;
    html += listHtml;
    area.innerHTML = html;

    document.querySelectorAll('.ft-bar-section').forEach(el => {
        el.removeEventListener('click', handleFilterClick);
        el.addEventListener('click', handleFilterClick);
    });
}
function showNetIkon(net_type) {
    if (net_type == 'cellular') {
        return '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M60-220v-200q0-25 17.5-42.5T120-480q25 0 42.5 17.5T180-420v200q0 25-17.5 42.5T120-160q-25 0-42.5-17.5T60-220Zm240 0v-300q0-25 17.5-42.5T360-580q25 0 42.5 17.5T420-520v300q0 25-17.5 42.5T360-160q-25 0-42.5-17.5T300-220Zm240 0v-400q0-25 17.5-42.5T600-680q25 0 42.5 17.5T660-620v400q0 25-17.5 42.5T600-160q-25 0-42.5-17.5T540-220Zm240 0v-520q0-25 17.5-42.5T840-800q25 0 42.5 17.5T900-740v520q0 25-17.5 42.5T840-160q-25 0-42.5-17.5T780-220Z" /></svg>'
    }
    else {
        return '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-380q-38 0-74 10t-68 30q-18 11-39 10.5T263-345q-15-15-14-35t18-32q47-33 101-50.5T480-480q58 0 112 17.5T693-412q17 12 18 32t-14 35q-15 15-36 15.5T622-340q-32-20-68-30t-74-10ZM283.5-666Q189-632 111-569q-17 14-37.5 13.5T38-571q-15-15-14.5-35.5T40-641q93-78 206-118.5T480-800q121 0 234 40.5T920-641q16 14 16.5 34.5T922-571q-15 15-35.5 15.5T849-569q-78-63-172.5-97T480-700q-102 0-196.5 34ZM480-540q-70 0-135 21.5T224-455q-17 13-37.5 12.5T151-458q-14-15-13.5-35t16.5-33q70-56 153.5-85T481-640q90 0 173 29t153 84q16 13 17 33.5T810-458q-15 15-36 15.5T736-455q-56-42-121.5-63.5T480-540Zm-56.5 356.5Q400-207 400-240t23.5-56.5Q447-320 480-320t56.5 23.5Q560-273 560-240t-23.5 56.5Q513-160 480-160t-56.5-23.5Z"/></svg>'
    }
}
function updateProtocolUI(results) {
    const protoItems = document.querySelectorAll('.proto-test');
    const valueEl = document.querySelector('#proto');

    let successCount = 0;
    const labels = ['dns', 'http', 'https'];
    const displayLabels = ['DNS', 'HTTP', 'HTTPS'];

    protoItems.forEach((item, index) => {
        if (index >= labels.length) return;
        const key = labels[index];
        const result = results[key];
        const label = displayLabels[index];

        if (result && result.success) {
            successCount++;
            item.style.color = '#2ed573';
            item.textContent = label;
        } else {
            item.style.color = '#ff4757';
            item.textContent = label;
        }
    });

    if (valueEl) {
        valueEl.innerHTML = `${successCount}/3 <span class="proto-static-test">доступно</span>`;
    }
}
function updateConnectionInfo() {
    const info = getConnectionType();
    const typeEl = document.querySelector('.it-bar-1');
    const cgfEl = document.querySelector('.it-bar-2');
    if (!info) {
        typeEl.textContent = 'Сеть: Неизвестно';
        return;
    }
    cgfEl.textContent = presetNames[currentPreset];
    const typeMap = CONFIG.connectionTypes.labels
    const typeLabel = typeMap[info.type] || 'Неизвестно';
    typeEl.textContent = `Сеть: ${typeLabel}`;
    if (info.type === 'none') {
        typeEl.style.color = '#ff4757';
    } else {
        typeEl.style.color = '#2ed573';
    }
}
function updateVisibilityByPreset() {
    const allCards = document.querySelectorAll('.dwn-card, .ping-card, .proto-card, .dwn-card--DSGN2, .ping-card--DSGN2, .proto-card--DSGN2, .dwn-card--DSGN3, .ping-card--DSGN3, .proto-card--DSGN3');
    allCards.forEach(el => el.style.display = '');
    console.log(currentdsgn);
    // 2. Если пресет "kat" — скрываем нужные
    if (currentPreset === 'kat') {
        // Для DSGN2
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
// ============================================================
// СПРАВКА (openwiki) — ВСЕГДА В КОНЦЕ!
// ============================================================

function openwiki() {
    fullnavbar.classList.add('show-nav');
    let fullLabel = document.querySelector('.labal-full-menu');
    if (fullLabel) {
        fullLabel.textContent = 'Справка';
    }
    let area = document.querySelector('.area');
    area.innerHTML = `
        <div class="help-container">
            <div class="help-section">
                <h3>Что такое скорость интернета?</h3>
                <p>Скорость интернета — это объём данных, который ваше устройство может получить (скачать) или отправить (загрузить) за единицу времени. Измеряется в <strong>Мбит/с</strong> (мегабитах в секунду).</p>
                <ul>
                    <li><strong>Входящая скорость</strong> — скорость скачивания. Важно для просмотра видео, игр и загрузки файлов.</li>
                    <li><strong>Исходящая скорость</strong> — скорость отправки. Важно для видеозвонков, отправки фото и стримов.</li>
                </ul>
                <div class="tip">
                    Чем выше скорость — тем быстрее грузятся сайты и видео. Для 4K нужно от 30 Мбит/с.
                </div>
            </div>

            <div class="help-section">
                <h3>Что такое пинг?</h3>
                <p><strong>Пинг</strong> — это время, за которое сигнал доходит от вашего устройства до сервера и обратно. Измеряется в <strong>мс</strong> (миллисекундах).</p>
                <ul>
                    <li><strong>0-30 мс</strong> — отлично, идеально для игр и звонков</li>
                    <li><strong>30-60 мс</strong> — хорошо, комфортный серфинг</li>
                    <li><strong>60-100 мс</strong> — средне, заметные задержки</li>
                    <li><strong>100-200 мс</strong> — плохо, видео тормозит, игры некомфортны</li>
                    <li><strong>200+ мс</strong> — очень плохо, сайты грузятся долго</li>
                </ul>
                <div class="tip">
                    Низкий пинг важен для онлайн-игр. Чем меньше пинг — тем быстрее реакция.
                </div>
            </div>

            <div class="help-section">
                <h3>Что такое ТСПУ?</h3>
                <p><strong>ТСПУ</strong> (Технические средства противодействия угрозам) — это оборудование, которое устанавливается на сетях российских операторов по закону «Яровой» (ФЗ-374). Оно анализирует весь трафик и может:</p>
                <ul>
                    <li><strong>Блокировать</strong> доступ к запрещённым сайтам</li>
                    <li><strong>Замедлять</strong> скорость для определённых сервисов</li>
                    <li><strong>Обрывать</strong> соединения (если сайт в чёрном списке)</li>
                    <li><strong>Перенаправлять</strong> на страницы-заглушки</li>
                </ul>
                <div class="tip">
                    ТСПУ может влиять на работу YouTube, Discord и других зарубежных сервисов.
                </div>
            </div>

            <div class="help-section">
                <h3>Варианты обхода ограничений</h3>
                <p>Если тест показывает наличие ограничений, могут помочь следующие методы:</p>
                <ul>
                    <li><strong>VPN</strong> — шифрует трафик и позволяет менять регион</li>
                    <li><strong>Прокси-серверы</strong> — перенаправляют запросы через другой узел</li>
                    <li><strong>DNS-over-HTTPS</strong> — защищает DNS-запросы от подмены</li>
                    <li><strong>Зеркала сайтов</strong> — альтернативные адреса ресурсов</li>
                    <li><strong>Защищённые протоколы</strong> — шифрование SNI (ECH)</li>
                </ul>
                <div class="tip">
                    Эффективность методов зависит от конкретной сети и уровня фильтрации.
                </div>
            </div>

            <div class="help-section">
                <h3>Режимы работы сети</h3>
                <p>Наш тест определяет 4 основных режима работы интернета:</p>
                <div class="mode-item">
                    <strong>Полный доступ</strong>
                    <p>Все категории сайтов доступны. Интернет работает в штатном режиме без ограничений.</p>
                </div>
                <div class="mode-item">
                    <strong>Белые списки</strong>
                    <p>Доступны только отечественные ресурсы. Зарубежные сайты заблокированы.</p>
                </div>
                <div class="mode-item">
                    <strong>Черные списки</strong>
                    <p>Доступны все сайты, кроме конкретных заблокированных. Например, работает Google, но заблокирован YouTube.</p>
                </div>
                <div class="mode-item">
                    <strong>Нет интернета</strong>
                    <p>Ни один сайт не доступен.</p>
                </div>
            </div>

<div class="help-section">
    <h3>Индикаторы состояния сети</h3>
    <p>В интерфейсе приложения используются три индикатора, которые показывают состояние доступности сайтов в каждой категории:</p>

    <div class="mode-item">
        <strong>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle; margin-right: 6px;">
                <circle cx="12" cy="12" r="10" stroke="#2ed573" stroke-width="2"/>
                <path d="M7 12L10.5 15.5L17 9" stroke="#2ed573" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            - ОК
        </strong>
        <p><strong>Все сайты в этой категории доступны и работают в штатном режиме.</strong> При открытии страницы проблем не возникает. Это означает, что ваш провайдер или сетевое оборудование не ограничивает доступ к данным ресурсам.</p>
    </div>

    <div class="mode-item">
        <strong>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle; margin-right: 6px;">
                <path d="M12 2L2 21H22L12 2Z" stroke="#ffa502" stroke-width="2" stroke-linejoin="round"/>
                <path d="M12 9V14" stroke="#ffa502" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="17" r="1" fill="#ffa502"/>
            </svg>
            - Проблема
        </strong>
        <p><strong>Некоторые сайты в категории недоступны, но часть работает.</strong> Это может указывать на то, что провайдер или администратор сети заблокировал только определённые ресурсы (черные списки).</p>
    </div>

    <div class="mode-item">
        <strong>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#ff4757" stroke-width="2"/>
            <path d="M8 8L16 16" stroke="#ff4757" stroke-width="2" stroke-linecap="round"/>
            <path d="M16 8L8 16" stroke="#ff4757" stroke-width="2" stroke-linecap="round"/>
        </svg>

            - Неисправность
        </strong>
        <p><strong>Все сайты в категории недоступны.</strong> Это может указывать на полную блокировку категории провайдером (например, ТСПУ).</p>
    </div>
        <div class="tip">
            Если у вас красный круг в категории "Зарубежные 1" и "Зарубежные 2", это часто означает, что провайдер или администратор сети применяет "белые списки" (О режимах сети читайте в справке).
        </div>
</div>

            <div class="help-section">
                <h3>Как пользоваться тестом?</h3>
                <ol>
                    <li>Нажмите кнопку <strong>"Запустить тест"</strong></li>
                    <li>Дождитесь завершения проверки (обычно 5-10 секунд)</li>
                    <li>Посмотрите результаты:</li>
                    <p>Скорость скачивания (входящая)</p>
                    <p>Скорость отправки (исходящая)</p>
                    <p>Пинг (задержка)</p>
                    <li>Проверьте доступность категорий сайтов (отечественные и зарубежные)</li>
                </ol>
                <div class="tip">
                    Если тест показал "Белые списки" — скорее всего, ваш провайдер блокирует зарубежные сайты.
                </div>
            </div>
        </div>
    `;
}
// ============================================================
// СПРАВКА (openwiki) — ВСЕГДА В КОНЦЕ!!
// ============================================================