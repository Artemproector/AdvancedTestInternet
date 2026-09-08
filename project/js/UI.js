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
    //area.innerHTML = '<p>Данная функция пока находиться на стадии разработки! </p>';
    //area.innerHTML += buildSummaryContent();
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
            const devMessage = result.isDev
                ? 'Ты используешь dev-версию! Не забудь выкатить релиз, когда всё будет готово.'
                : 'Ты впереди всех! Видимо, ты разработчик, который ещё не выложил релиз.';
            area.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <p style="font-size: 48px; margin-bottom: 10px;"></p>
                    <p style="color: #4facfe; font-size: 24px; font-weight: 700;">Ты разработчик!</p>
                    <p style="color: #8892b0; margin-top: 10px;">${devMessage}</p>
                    <p style="color: #8892b0; margin-top: 10px;">
                        Твоя версия: <strong style="color: #ccd6f6;">${result.version}</strong>
                        ${result.latestVersion ? `| Последняя на GitHub: <strong style="color: #8892b0;">${result.latestVersion}</strong>` : ''}
                    </p>
                    <p style="color: #5a6a8a; font-size: 12px; margin-top: 15px;">
                        Эта страница видна только разработчикам
                    </p>
                    <div class='button logger_btn'>Включить логирование</div>
                </div>
            `;
            let logger = document.querySelector('.logger_btn');
            logger.addEventListener('click', changeLogPolicy)
            if (localStorage.getItem('logger')) {
                logger.classList.add('logger--on')
                logger.textContent = 'Выключить логирование'
                checkLog()
            }
            else {
                localStorage.removeItem('logger');
                localStorage.removeItem('logInfo');
                logger.classList.remove('logger--on')
                logger.textContent = 'Включить логирование'
                checkLog()
            }
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
        <h3 class='setting_name'>Режим отображения блокировок:</h3>
        <ol class='selecter'>
            <li class="select blocking block1 ${currentblock === 'block1' ? 'selected' : ''}" data-blocking="block1">Списками</li>
            <li class="select blocking block2 ${currentblock === 'block2' ? 'selected' : ''}" data-blocking="block2">В процентах</li>
            <li class="select blocking block3 ${currentblock === 'block3' ? 'selected' : ''}" data-blocking="block3">Словами</li>
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
    document.querySelectorAll('.blocking').forEach(el => {
        el.addEventListener('click', function () {
            const blockingName = this.dataset.blocking;
            console.log(blockingName);
            selectblocking(blockingName);
            document.querySelectorAll('.blocking').forEach(item => {
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
    area.innerHTML = 'Внимание, данная кнопка ведет на другой сайт (github.com). Если вы действительно хотите перейти нажмите далее<br> <a href="https://github.com/Artemproector/AdvancedTestInternet" target="_blank">Далее</a>';
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
                        ${date} ${mode}
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
function openCategory(category) {
    let categoryelement = document.querySelector(`.cat-${category}`);
    let maincategoryelement = categoryelement.querySelector('.main-info-category');
    let hidecategoryelement = categoryelement.querySelector('.hide-info-category');
    if (category == 'ru1') {
        let max_logo = categoryelement.querySelector('.max-logo')
        max_logo.classList.toggle('max-logo--big')
    }
    categoryelement.classList.toggle('category-item--open');
    maincategoryelement.classList.toggle('main-info-category--open');
    hidecategoryelement.classList.toggle('hide-info-category--show');
}
function showNetIkon(net_type) {
    if (net_type == 'cellular') {
        return 'Мобильный интернет'
    }
    else {
        return 'WIFI'
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
function checkNetworkAPI() {
    let message = 'Состояние модуля определения сети:<br>';
    let hasInfo = false;

    if ('connection' in navigator) {
        hasInfo = true;
        const conn = navigator.connection;
        message += '✅ Network Information API доступен<br>';
        message += `   Тип: ${conn.type || 'не определён'}<br>`;
        message += `   Эффективный тип: ${conn.effectiveType || 'не определён'}<br>`;
        message += `   Скорость: ${conn.downlink || 'не определена'} Мбит/с<br>`;
        message += `   RTT: ${conn.rtt || 'не определён'} мс<br>`;
        message += `   Сохранение данных: ${conn.saveData ? 'включено' : 'выключено'}<br>`;
    } else {
        message += '❌ Network Information API НЕ доступен<br>';
        message += '   Ваш браузер не поддерживает эту функцию.<br>';
        message += '   Возможные причины:<br>';
        message += '   • Старая версия браузера<br>';
        message += '   • Браузер на базе WebKit (Safari)<br>';
        message += '   • Отключено в настройках безопасности<br>';
    }

    message += '<br>─────────────────────────────<br>';
    message += `Тип сети: ${getConnectionType()?.type || 'Неизвестно'}`;
    message += `<br>User Agent: ${navigator.userAgent.substring(0, 60)}...`;

    showConfirm("Проверка модуля", message, false)
}
