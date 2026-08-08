function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
// СПРАВКА (openwiki)
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
                        - Неисправность
                    </strong>
                    <p><strong>Все сайты в категории недоступны.</strong> Это может указывать на полную блокировку категории провайдером (например, ТСПУ).</p>
                </div>
                <div class="mode-item">
                    <strong>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle; margin-right: 6px;">
                            <circle cx="12" cy="12" r="10" stroke="#ff4757" stroke-width="2"/>
                            <path d="M12 7V13" stroke="#ff4757" stroke-width="2" stroke-linecap="round"/>
                            <circle cx="12" cy="16" r="1" fill="#ff4757"/>
                        </svg>
                        - Проблема
                    </strong>
                    <p><strong>Некоторые сайты в категории недоступны, но часть работает.</strong> Это может указывать на то, что провайдер или администратор сети заблокировал только определённые ресурсы (черные списки).</p>
                    <div class="tip">
                        Если у вас жёлтый треугольник в категории "Зарубежные 1" и "Зарубежные 2", это часто означает, что провайдер или администратор сети применяет "белые списки" (О режимах сети читайте в справке).
                    </div>
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
// ПРОВЕРКА ОБНОВЛЕНИЙ
// ============================================================

async function checkupdate() {
    try {
        const response = await fetch(CONFIG.update.url, {
            signal: AbortSignal.timeout(CONFIG.update.timeout)
        });
        if (!response.ok) throw new Error('Ошибка загрузки');
        const data = await response.json();
        const latestVersion = data.tag_name.replace('v', '');
        if (latestVersion === CONFIG.version) {
            return { status: 'up_to_date', version: CONFIG.version };
        } else {
            return {
                status: 'outdated',
                currentVersion: CONFIG.version,
                latestVersion: latestVersion,
                url: data.html_url
            };
        }
    } catch (error) {
        return { status: 'error', message: 'Не удалось проверить обновления' };
    }
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
        if (result.status === 'up_to_date') {
            area.innerHTML = `<div style="text-align: center; padding: 40px 20px;">
                <p style="color: #2ed573; font-size: 20px; font-weight: 600;">Установлена последняя версия</p>
                <p style="color: #8892b0; margin-top: 10px;">Версия: ${result.version}</p>
            </div>`;
        } else if (result.status === 'outdated') {
            area.innerHTML = `<div style="text-align: center; padding: 40px 20px;">
                <p style="color: #ffa502; font-size: 20px; font-weight: 600;">Доступна новая версия!</p>
                <p style="color: #8892b0; margin-top: 10px;">Текущая версия: ${result.currentVersion}</p>
                <p style="color: #8892b0;">Последняя версия: ${result.latestVersion}</p>
                <br><a href="${result.url}" target="_blank" style="display: inline-block; padding: 12px 30px; background: #4facfe; color: #0a0e1a; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 15px;">Перейти к загрузке</a>
            </div>`;
        } else {
            area.innerHTML = `<div style="text-align: center; padding: 40px 20px;">
                <p style="color: #ff4757; font-size: 18px; font-weight: 600;">${result.message}</p>
                <p style="color: #8892b0; margin-top: 10px;">Проверьте подключение к интернету и повторите попытку.</p>
                <button onclick="openupdate()" style="display: inline-block; padding: 10px 25px; background: #2a3555; color: #fff; border: none; border-radius: 8px; cursor: pointer; margin-top: 15px; font-size: 14px;">Повторить проверку</button>
            </div>`;
        }
    });
}

// ============================================================
// ПРОВЕРКА ДОСТУПНОСТИ САЙТОВ
// ============================================================

async function checkSiteAvailability(url, timeout = CONFIG.timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const start = performance.now();
        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            mode: 'no-cors'
        });
        const end = performance.now();
        clearTimeout(timeoutId);
        return { success: true, time: end - start };
    } catch (error) {
        clearTimeout(timeoutId);
        return { success: false, time: timeout };
    }
}

async function checkCategory(categoryKey, sites) {
    const results = await Promise.all(
        sites.map(url => checkSiteAvailability(url, CONFIG.quickCheckTimeout))
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
// ТЕСТ СКОРОСТИ
// ============================================================

async function testDownloadSpeed(url = CONFIG.speedTest.download, attempts = CONFIG.speedTest.attempts) {
    const results = [];
    let totalBytes = 0;
    let successfulAttempts = 0;
    try {
        for (let i = 0; i < attempts; i++) {
            try {
                const start = performance.now();
                const response = await fetch(url, {
                    signal: AbortSignal.timeout(CONFIG.speedTest.timeout)
                });
                if (!response.ok) throw new Error(`Download failed: ${response.status}`);
                const data = await response.arrayBuffer();
                const end = performance.now();
                const durationSeconds = (end - start) / 1000;
                const bitsLoaded = data.byteLength * 8;
                const speedBps = bitsLoaded / durationSeconds;
                results.push({ success: true, speedBps, bytes: data.byteLength, time: durationSeconds });
                totalBytes += data.byteLength;
                successfulAttempts++;
                await sleep(300);
            } catch (error) {
                results.push({ success: false, speedBps: 0, error: error.message });
            }
        }
        if (successfulAttempts === 0) {
            return { success: false, speedBps: 0, error: 'Все попытки загрузки провалились', results };
        }
        const successfulResults = results.filter(r => r.success);
        const totalSpeed = successfulResults.reduce((sum, r) => sum + r.speedBps, 0);
        const averageSpeedBps = totalSpeed / successfulResults.length;
        const speeds = successfulResults.map(r => r.speedBps).sort((a, b) => a - b);
        const medianSpeed = speeds[Math.floor(speeds.length / 2)];
        const variance = speeds.reduce((sum, speed) => sum + Math.pow(speed - averageSpeedBps, 2), 0) / speeds.length;
        const stdDev = Math.sqrt(variance);
        const stability = Math.max(0, 1 - (stdDev / averageSpeedBps));
        return {
            success: true,
            speedBps: averageSpeedBps,
            medianSpeed,
            bytes: totalBytes,
            attempts,
            successfulAttempts,
            results,
            stability,
            quality: stability > 0.8 ? 'Стабильно' : stability > 0.5 ? 'Нестабильно' : 'Очень нестабильно',
            stdDev
        };
    } catch (error) {
        return { success: false, speedBps: 0, error: error.message };
    }
}

async function testUploadSpeed(url = CONFIG.speedTest.upload, attempts = CONFIG.speedTest.attempts) {
    const results = [];
    let successfulAttempts = 0;
    const testDataSize = CONFIG.speedTest.uploadSize;
    try {
        for (let i = 0; i < attempts; i++) {
            try {
                const testData = new Uint8Array(testDataSize);
                for (let j = 0; j < testData.length; j++) {
                    testData[j] = Math.floor(Math.random() * 256);
                }
                const formData = new FormData();
                formData.append('file', new Blob([testData]), 'test.bin');
                const start = performance.now();
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData,
                    signal: AbortSignal.timeout(CONFIG.speedTest.timeout * 2)
                });
                const end = performance.now();
                if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
                const durationSeconds = (end - start) / 1000;
                const bitsLoaded = testDataSize * 8;
                const speedBps = bitsLoaded / durationSeconds;
                results.push({ success: true, speedBps, bytes: testDataSize, time: durationSeconds });
                successfulAttempts++;
                await sleep(300);
            } catch (error) {
                results.push({ success: false, speedBps: 0, error: error.message });
            }
        }
        if (successfulAttempts === 0) {
            return { success: false, speedBps: 0, error: 'Все попытки загрузки провалились', results };
        }
        const successfulResults = results.filter(r => r.success);
        const totalSpeed = successfulResults.reduce((sum, r) => sum + r.speedBps, 0);
        const averageSpeedBps = totalSpeed / successfulResults.length;
        return {
            success: true,
            speedBps: averageSpeedBps,
            bytes: testDataSize * successfulAttempts,
            attempts,
            successfulAttempts,
            results
        };
    } catch (error) {
        return { success: false, speedBps: 0, error: error.message };
    }
}

// ============================================================
// ТЕСТ ПИНГА
// ============================================================

async function testPing(url = CONFIG.ping.url, attempts = CONFIG.ping.attempts) {
    const pings = [];
    for (let i = 0; i < attempts; i++) {
        const result = await checkSiteAvailability(url, CONFIG.ping.timeout);
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
    const testUrls = CONFIG.express_test;
    const results = await Promise.all(
        testUrls.map(url => checkSiteAvailability(url, CONFIG.quickCheckTimeout))
    );
    const successCount = results.filter(r => r.success).length;
    const total = results.length;
    const successRate = successCount / total;
    return {
        hasInternet: successRate >= 0.01,
        successRate,
        successCount,
        total,
        results
    };
}

// ============================================================
// ОПРЕДЕЛЕНИЕ РЕЖИМА РАБОТЫ СЕТИ
// ============================================================

function determineNetworkMode(categoryResults) {
    const ru1 = categoryResults['ru1']?.successRate || 0;
    const ru2 = categoryResults['ru2']?.successRate || 0;
    const en1 = categoryResults['en1']?.successRate || 0;
    const en2 = categoryResults['en2']?.successRate || 0;
    const ruAvailable = ru1 && ru2;
    const enAvailable = en1 && en2;
    const ru1Ok = ru1;
    const ru2Ok = ru2;
    const en1Ok = en1;
    const en2Ok = en2;
    if (!ru1Ok && !ru2Ok && !en1Ok && !en2Ok) {
        updateDisplay("mode", '1');
        return {
            mode: 'Нет интернета',
            title: 'Нет интернета',
            description: 'Проверьте доступ в интернет.',
            emoji: ''
        };
    }
    if (ruAvailable && enAvailable) {
        updateDisplay("mode", '5');
        return {
            mode: 'Полный доступ',
            title: 'Полный доступ',
            description: 'Все сайты доступны.',
            emoji: ''
        };
    }
    if (ruAvailable && !en1Ok && !en2Ok) {
        updateDisplay("mode", '2');
        return {
            mode: 'Белые списки',
            title: 'Белые списки',
            description: 'Доступны только отечественные ресурсы.',
            emoji: ''
        };
    }
    if (!ru1Ok || !ru2Ok && !enAvailable) {
        updateDisplay("mode", '2');
        return {
            mode: 'Белые списки',
            title: 'Белые списки',
            description: 'Доступны только отечественные ресурсы.',
            emoji: ''
        };
    }
    if (ruAvailable && en1Ok && !en2Ok) {
        updateDisplay("mode", '3');
        return {
            mode: 'Черные списки',
            title: 'Черные списки',
            description: 'Разрешено все, кроме заблокированного.',
            emoji: ''
        };
    }
    updateDisplay("mode", '0');
    return {
        mode: '???',
        title: 'Частичный доступ',
        description: 'Часть сайтов недоступна.',
        emoji: ''
    };
}

// ============================================================
// UI ОБНОВЛЕНИЯ
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
// ИСТОРИЯ
// ============================================================

function saveFailedTest() {
    let speedHistory = JSON.parse(localStorage.getItem('speedHistory') || '[]');
    speedHistory.push({
        timestamp: Date.now(),
        downloadSpeed: '—',
        uploadSpeed: '—',
        ping: '—',
        mode: 'Нет интернета',
        date: new Date().toLocaleString(),
        success: false
    });
    if (speedHistory.length > CONFIG.history.maxFailedRecords) {
        speedHistory = speedHistory.slice(-CONFIG.history.maxFailedRecords);
    }
    localStorage.setItem('speedHistory', JSON.stringify(speedHistory));
}

function getSpeedHistory() {
    const history = localStorage.getItem('speedHistory');
    if (history === null) return [];
    try {
        return JSON.parse(history);
    } catch (e) {
        return [];
    }
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
    if (historyData.length === 0) {
        area.innerHTML = `
            <div class="history-empty">
                <p>История проверок пока пуста</p>
                <p style="font-size: 12px; color: #8892b0;">Проведите первый тест, чтобы появились данные</p>
            </div>
        `;
        return;
    }
    let html = '<div class="history-list">';
    const reversed = [...historyData].reverse();
    reversed.forEach((item) => {
        const download = item.downloadSpeed !== undefined && item.downloadSpeed !== null ? item.downloadSpeed : '—';
        const upload = item.uploadSpeed !== undefined && item.uploadSpeed !== null ? item.uploadSpeed : '—';
        const ping = item.ping !== undefined && item.ping !== null ? item.ping : '—';
        const mode = item.mode || 'Неизвестно';
        const date = item.date || new Date(item.timestamp).toLocaleString() || 'Дата неизвестна';
        html += `
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
    html += `
        </div>
        <button onclick="clearHistory()" class="history-clear-btn">
            Очистить историю
        </button>
    `;
    area.innerHTML = html;
}

function clearHistory() {
    if (confirm('Удалить всю историю проверок?')) {
        localStorage.removeItem('speedHistory');
        historyload();
    }
}

// ============================================================
// СВОДКА ДАННЫХ
// ============================================================

function updateConnectIndex() {
    const history = JSON.parse(localStorage.getItem('speedHistory') || '[]');
    const totalTests = history.length;
    const connectIndexEl = document.querySelector('.connect_index');
    const leftCol = document.querySelector('.summary__left-col');
    if (!connectIndexEl || !leftCol) return;
    if (totalTests === 0) {
        connectIndexEl.textContent = '——';
        leftCol.style.background = 'transparent';
        return;
    }
    let successCount = 0;
    history.forEach(item => {
        if (item.success !== false && item.mode !== 'Нет интернета') {
            successCount++;
        }
    });
    const successRate = Math.round((successCount / totalTests) * 100);
    let index = Math.min(Math.round(successRate / 10), 10);
    connectIndexEl.textContent = index;
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
    leftCol.style.background = bgColor;
}

function updateTestsCounter() {
    const history = JSON.parse(localStorage.getItem('speedHistory') || '[]');
    const totalTests = history.length;
    const testsCounterEl = document.querySelector('.tests_counter');
    const rightCol = document.querySelector('.summary__right-col');
    if (!testsCounterEl || !rightCol) return;
    testsCounterEl.textContent = totalTests;
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
    rightCol.style.background = bgColor;
}

function calcConnectIndex() {
    updateConnectIndex();
    updateTestsCounter();
}

calcConnectIndex();

// ============================================================
// ОСНОВНОЙ ТЕСТ
// ============================================================

async function runFullTest() {
    const testBtn = document.getElementById('testBtn');
    testBtn.classList.add('loading');
    testBtn.disabled = true;
    updateDisplay("all", 5);
    document.getElementById('downloadSpeed').innerHTML = '--<span class="unit">Мбит/с</span>';
    document.getElementById('uploadSpeed').innerHTML = '--<span class="unit">Мбит/с</span>';
    document.getElementById('ping').innerHTML = '--<span class="unit">мс</span>';
    document.getElementById('networkMode').textContent = '--';
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
    scrollToFirst();
    try {
        const quickCheck = await quickInternetCheck();
        progress_el_1.classList.add('pr-bar-section--active');
        if (!quickCheck.hasInternet) {
            document.getElementById('downloadSpeed').innerHTML = '--<span class="unit">Мбит/с</span>';
            document.getElementById('uploadSpeed').innerHTML = '--<span class="unit">Мбит/с</span>';
            document.getElementById('ping').innerHTML = '--<span class="unit">мс</span>';
            document.getElementById('networkMode').textContent = 'Нет сети';
            updateDisplay('dwn', 1);
            updateDisplay('up', 1);
            updateDisplay('ping', 1);
            updateDisplay('mode', 1);
            saveFailedTest();
            testBtn.classList.remove('loading');
            testBtn.disabled = false;
            progress_el_1.classList.add('pr-bar-section--fail');
            progress_el_2.classList.add('pr-bar-section--fail');
            progress_el_3.classList.add('pr-bar-section--fail');
            progress_el_4.classList.add('pr-bar-section--fail');
            progress_el_5.classList.add('pr-bar-section--fail');
            progress_el_1.classList.remove('pr-bar-section--active');
            // Показываем заглушки для категорий
            for (const key of categoryKeys) {
                const icon = document.getElementById(`cat-${key}`);
                if (icon) {
                    icon.className = 'status-icon';
                    icon.classList.add('warning');
                    icon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 21H22L12 2Z" stroke="#ffa502" stroke-width="2" stroke-linejoin="round"/>
                        <path d="M12 9V14" stroke="#ffa502" stroke-width="2" stroke-linecap="round"/>
                        <circle cx="12" cy="17" r="1" fill="#ffa502"/>
                    </svg>`;
                }
            }
            scrollToLast();
            return;
        }
        progress_el_1.classList.remove('pr-bar-section--active');
        progress_el_1.classList.add('pr-bar-section--pass');
        progress_el_2.classList.add('pr-bar-section--active');
        await sleep(500);
        scrollToActiveProgress();
        const downloadResult = await testDownloadSpeed(CONFIG.speedTest.download, CONFIG.speedTest.attempts);
        const uploadResult = await testUploadSpeed(CONFIG.speedTest.upload, CONFIG.speedTest.attempts);
        const pingResult = await testPing(CONFIG.ping.url, CONFIG.ping.attempts);
        progress_el_3.classList.add('pr-bar-section--active');
        scrollToActiveProgress();
        if (downloadResult.success) {
            const speedMbps = downloadResult.speedBps / 1024 / 1024;
            const dwnColor = getSpeedColor(speedMbps);
            document.getElementById('downloadSpeed').innerHTML = `
                <span style="color: ${dwnColor.color}">
                    ${speedMbps.toFixed(2)}
                </span>
                <span class="unit">Мбит/с</span>
                <span style="color: ${dwnColor.color}; font-size: 12px; margin-left: 8px;"></span>
            `;
            updateDisplay('dwn', dwnColor.level);
        } else {
            document.getElementById('downloadSpeed').innerHTML = '-- <span class="unit">Мбит/с</span>';
            updateDisplay('dwn', 1);
            progress_el_2.classList.add('pr-bar-section--fail');
            progress_el_2.classList.remove('pr-bar-section--active');

        }
        if (uploadResult.success) {
            const speedMbps = uploadResult.speedBps / 1024 / 1024;
            const upColor = getSpeedColor(speedMbps);
            document.getElementById('uploadSpeed').innerHTML = `
                <span style="color: ${upColor.color}">
                    ${speedMbps.toFixed(2)}
                </span>
                <span class="unit">Мбит/с</span>
                <span style="color: ${upColor.color}; font-size: 12px; margin-left: 8px;"></span>
            `;
            updateDisplay('up', upColor.level);
            progress_el_2.classList.add('pr-bar-section--pass');
            progress_el_2.classList.remove('pr-bar-section--active');
        } else {
            document.getElementById('uploadSpeed').innerHTML = '-- <span class="unit">Мбит/с</span>';
            updateDisplay('up', 1);
            progress_el_2.classList.add('pr-bar-section--fail');
            progress_el_2.classList.remove('pr-bar-section--active');


        }
        if (pingResult.success) {
            const pingColor = getPingColor(pingResult.average);
            document.getElementById('ping').innerHTML = `
                <span style="color: ${pingColor.color}">
                    ${Math.round(pingResult.average)}
                </span>
                <span class="unit">мс</span>
                <span style="color: ${pingColor.color}; font-size: 12px; margin-left: 8px;"></span>
            `;
            updateDisplay('ping', pingColor.level);
            progress_el_3.classList.add('pr-bar-section--pass');
            progress_el_3.classList.remove('pr-bar-section--active');
        } else {
            document.getElementById('ping').innerHTML = '-- <span class="unit">мс</span>';
            updateDisplay('ping', 1);
            progress_el_3.classList.add('pr-bar-section--fail');
            progress_el_3.classList.remove('pr-bar-section--active');
        }
        const categoryResults = {};
        progress_el_4.classList.add('pr-bar-section--active');
        scrollToActiveProgress();
        for (const key of categoryKeys) {
            const sites = CONFIG.categories[key]?.sites || [];
            if (sites.length === 0) {
                categoryResults[key] = { successRate: 0, successful: 0, total: 0 };
                continue;
            }
            const result = await checkCategory(key, sites);
            categoryResults[key] = result;
            // ============================================================
            // ОТОБРАЖЕНИЕ ИКОНОК В КАТЕГОРИЯХ
            // ============================================================

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
        const mode = determineNetworkMode(categoryResults);
        document.getElementById('networkMode').textContent = mode.mode;
        if (downloadResult.success) {
            let speedHistory = JSON.parse(localStorage.getItem('speedHistory') || '[]');
            speedHistory.push({
                timestamp: Date.now(),
                downloadSpeed: Math.floor(downloadResult.speedBps / 1024 / 1024),
                uploadSpeed: uploadResult.success ? Math.floor(uploadResult.speedBps / 1024 / 1024) : null,
                ping: pingResult.success ? Math.round(pingResult.average) : null,
                mode: mode.mode,
                date: new Date().toLocaleString()
            });
            if (speedHistory.length > CONFIG.history.maxRecords) {
                speedHistory = speedHistory.slice(-CONFIG.history.maxRecords);
            }
            localStorage.setItem('speedHistory', JSON.stringify(speedHistory));
            calcConnectIndex();
        }
    } catch (error) {
        console.error('Ошибка в тесте:', error);
    } finally {
        testBtn.classList.remove('loading');
        testBtn.disabled = false;
        await sleep(500);
        progress_el_5.classList.add('pr-bar-section--pass');
        scrollToLast();
    }
}

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('testBtn');
    btn.addEventListener('click', runFullTest);
    calcConnectIndex();
});
