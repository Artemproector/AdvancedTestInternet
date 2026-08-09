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
    │   Настройки будут... когда-нибудь   │
    │              ¯\\_(ツ)_/¯             │
    └─────────────────────────────────────┘
    </pre> А пока просто пользуйся тестом. Он и без этого не плохой (наверное)`;
}

function openSettings() {
    fullnavbar.classList.add('show-nav');
    let fullLabel = document.querySelector('.labal-full-menu');
    if (fullLabel) {
        fullLabel.textContent = 'Настройки';
    }
    let area = document.querySelector('.area');
    area.innerHTML = `<ul>
        <li><div onclick="ShowSettings('general')">Общие</div></li>
        <li><div onclick="ShowSettings('tests')">Управление тестированием</div></li>
        <li><div onclick="ShowSettings('history')">Управление историей</div></li>
        <li><div onclick="ShowSettings('profi')">Только для профессионалов!</div></li>
    </ul>`;
}

function ShowSettings(type) {
    probka_zaglushka();
}

function summaryload() {
    probka_zaglushka();
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

const dwnElements = document.querySelectorAll('.dwn');
const upElements = document.querySelectorAll('.up');
const pingElements = document.querySelectorAll('.ping');
const modeElements = document.querySelectorAll('.mode');

function updateDisplay(type, value = 0) {
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
