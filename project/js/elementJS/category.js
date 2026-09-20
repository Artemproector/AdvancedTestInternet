// ============================================================
// КАТЕГОРИИ
// ============================================================
let categories = document.querySelector('.categories');
let isMSGR_MAXLOGO = true
// Скроллим к конкретной категории
function scrollToOpenCategory(category) {
    setTimeout(() => {
        const targetElement = document.querySelector(`.cat-${category}`);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, 100);
}
function openCategory(category) {
    scrollToOpenCategory(category)
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
function showcategories() {
    let categories = document.querySelector('.categories');
    const categoryKeys = Object.keys(CONFIG.categories);
    const categoryObjects = categoryKeys.map(key => CONFIG.categories[key]);
    categories.innerHTML = '';
    categoryObjects.forEach((obj, index) => {
        const isFirst = index === 0;
        const isMax = isFirst && (obj.name == 'Мессенджер Макс');

        let html = '';

        if (isMax) {
            html = `
            <div class="category-item max-category cat-${obj.shortName}" data-category="${obj.shortName}" onclick='openCategory("${obj.shortName}")'>
                <svg class="max-logo" version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" width="80" height="80">
                    <g transform="translate(0.000000,250.000000) scale(0.100000,-0.100000)" fill="#2a3555" stroke="none">
                        <path d="M1104 2196 c-300 -49 -553 -222 -687 -468 -95 -174 -134 -348 -124 -552 8 -146 22 -229 76 -446 23 -91 47 -210 52 -265 13 -117 22 -140 60 -156 79 -32 210 2 316 82 l52 39 70 -44 c112 -69 167 -81 361 -80 149 1 173 3 253 27 153 47 270 119 398 247 350 349 373 900 52 1292 -118 145 -307 266 -483 308 -110 26 -290 34 -396 16z m295 -497 c205 -71 331 -241 331 -448 0 -155 -63 -277 -188 -368 -160 -115 -330 -133 -491 -53 l-55 27 -57 -44 c-33 -26 -65 -43 -76 -41 -39 7 -93 220 -93 371 0 247 113 453 295 538 110 52 218 58 334 18z"/>
                    </g>
                </svg>
                <div class="main-info-category">
                    <div class="name">
                        ${obj.name}
                        <span class="sub">Нажмите для деталей</span>
                    </div>
                    <div class="status-icon" id="cat-${obj.shortName}"></div>
                    <svg class="category-arrow" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#2a3555">
                        <path d="M459-381 314-526q-3-3-4.5-6.5T308-540q0-8 5.5-14t14.5-6h304q9 0 14.5 6t5.5 14q0 2-6 14L501-381q-5 5-10 7t-11 2q-6 0-11-2t-10-7Z"/>
                    </svg>
                </div>
                <div class="hide-info-category">
                    <span class="sub">${obj.description || ''}</span>
                    <div class="detail-row">
                        <span class="detail-label">Результат:</span>
                        <span class="detail-value" id="detail-${obj.shortName}">—</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Доступно:</span>
                        <span class="detail-value" id="count-${obj.shortName}">—</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Время ответа:</span>
                        <span class="detail-value" id="time-${obj.shortName}">—</span>
                    </div>
                    ${domainListGenerate(obj)}
                </div>
            </div>`;
        } else {
            html = `
            <div class="category-item cat-${obj.shortName}" data-category="${obj.shortName}" onclick='openCategory("${obj.shortName}")'>
                <div class="main-info-category">
                    <div class="name">
                        ${obj.name}
                        <span class="sub">Нажмите для деталей</span>
                    </div>
                    <div class="status-icon" id="cat-${obj.shortName}"></div>
                    <svg class="category-arrow" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#2a3555">
                        <path d="M459-381 314-526q-3-3-4.5-6.5T308-540q0-8 5.5-14t14.5-6h304q9 0 14.5 6t5.5 14q0 2-6 14L501-381q-5 5-10 7t-11 2q-6 0-11-2t-10-7Z"/>
                    </svg>
                </div>
                <div class="hide-info-category">
                    <span class="sub">${obj.description || ''}</span>
                    <div class="detail-row">
                        <span class="detail-label">Результат:</span>
                        <span class="detail-value" id="detail-${obj.shortName}">—</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Доступно:</span>
                        <span class="detail-value" id="count-${obj.shortName}">0/0</span>
                    </div>
                    ${domainListGenerate(obj)}
                    <span class="sub">Подробнее с ошибками можно ознакомиться в справке</span>
                </div>
            </div>`;
        }

        categories.innerHTML += html;
    });
}

function domainListGenerate(obj) {
    if (!obj.shortDomains || !Array.isArray(obj.shortDomains)) {
        return '';
    }

    let result = '';
    result += `<div class="detail-row">`;
    result += `<span class="detail-label">Адреса:</span>`;
    result += `<span class="detail-value">`;
    result += `<ol class='category-list-elem'>`;
    obj.shortDomains.forEach((element, index) => {
        result += `<li class='category-list-elem elem-${index}'><span class='site-domain'>${element}</span></li>`;
    });
    result += `</ol>`;
    result += `</span>`;
    result += `</div>`;
    return result;
}
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
