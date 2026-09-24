// ============================================================
// ПРОВЕРКА ОБНОВЛЕНИЙ
// ============================================================
function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const p1 = parts1[i] || 0;
        const p2 = parts2[i] || 0;
        if (p1 > p2) return 1;
        if (p1 < p2) return -1;
    }
    return 0;
}

// ============================================================
// ПРОВЕРКА ОБНОВЛЕНИЙ
// ============================================================
async function checkupdate() {
    try {
        const response = await fetch(CONFIG.update.url, {
            signal: AbortSignal.timeout(5000)
        });
        if (!response.ok) throw new Error('Ошибка загрузки');
        const data = await response.json();
        const latestVersion = data.tag_name.replace('v', '');
        const comparison = compareVersions(CONFIG.version, latestVersion);

        if (comparison > 0) {
            return {
                status: 'developer',
                version: CONFIG.version,
                latestVersion: latestVersion
            };
        }

        if (latestVersion === CONFIG.version) {
            return {
                status: 'up_to_date',
                version: CONFIG.version
            };
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

// ГЕНЕРАЦИЯ HTML ДЛЯ ПРОВЕРКИ ОБНОВЛЕНИЙ
function checkupdateUI(result) {
    // Ошибка
    if (result.status === 'error') {
        return `
            <div style="text-align: center; padding: 40px 20px;">
                <p style="color: #ff4757; font-size: 18px; font-weight: 600;">${result.message}</p>
                <p style="color: #8892b0; margin-top: 10px;">Проверьте подключение к интернету и повторите попытку.</p>
                <button onclick="openupdate()" style="display: inline-block; padding: 10px 25px; background: #2a3555; color: #fff; border: none; border-radius: 8px; cursor: pointer; margin-top: 15px; font-size: 14px;">
                    Повторить проверку
                </button>
            </div>
        `;
    }

    // Разработчик (версия впереди GitHub)
    if (result.status === 'developer') {
        return `
            <div style="text-align: center; padding: 40px 20px;">
                <p style="color: #4facfe; font-size: 24px; font-weight: 700;">Ты разработчик!</p>
                <p style="color: #8892b0; margin-top: 10px;">Ты впереди всех! Видимо, ты разработчик, который ещё не выложил релиз.</p>
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
    }

    // Последняя версия
    if (result.status === 'up_to_date') {
        return `
            <div style="text-align: center; padding: 40px 20px;">
                <p style="color: #2ed573; font-size: 20px; font-weight: 600;">Установлена последняя версия</p>
                <p style="color: #8892b0; margin-top: 10px;">Версия: ${result.version}</p>
            </div>
        `;
    }

    // Доступна новая версия
    if (result.status === 'outdated') {
        return `
            <div style="text-align: center; padding: 40px 20px;">
                <p style="color: #ffa502; font-size: 20px; font-weight: 600;">Доступна новая версия!</p>
                <p style="color: #8892b0; margin-top: 10px;">Текущая версия: ${result.currentVersion}</p>
                <p style="color: #8892b0;">Последняя версия: ${result.latestVersion}</p>
                <br>
                <a href="${result.url}" target="_blank" style="display: inline-block; padding: 12px 30px; background: #4facfe; color: #0a0e1a; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 15px;">
                    Перейти к загрузке
                </a>
            </div>
        `;
    }

    // Fallback
    return `<p style="color: #ff4757; text-align: center;">Неизвестный статус: ${result.status}</p>`;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ГЕНЕРАЦИЯ СООБЩЕНИЙ ДЛЯ ПРОВЕРКИ ОБНОВЛЕНИЙ
async function notifiToUpdate() {
    await sleep(1000)
    let check = await checkupdate()
    if (check.status === 'outdated') {
        notifyWarning("Доступно обновление!")
    }
}

// ============================================================
// ОТКРЫТИЕ МЕНЮ ПРОВЕРКИ ОБНОВЛЕНИЙ
// ============================================================
function openupdate() {
    fullnavbar.classList.add('show-nav');
    let fullLabel = document.querySelector('.labal-full-menu');
    if (fullLabel) {
        fullLabel.textContent = 'Проверка обновлений';
    }
    let area = document.querySelector('.area');

    // Показываем индикатор загрузки
    area.innerHTML = `<div style="text-align: center; padding: 40px 20px;"><p style="color: #8892b0;">Проверка обновлений...</p></div>`;

    // Проверяем обновления
    checkupdate().then(result => {
        area.innerHTML = checkupdateUI(result);
        if (result.status === 'developer') {
            const logger = document.querySelector('.logger_btn');
            if (logger) {
                logger.addEventListener('click', changeLogPolicy);

                if (localStorage.getItem('logger')) {
                    logger.classList.add('logger--on');
                    logger.textContent = 'Выключить логирование';
                    checkLog();
                } else {
                    localStorage.removeItem('logger');
                    localStorage.removeItem('logInfo');
                    logger.classList.remove('logger--on');
                    logger.textContent = 'Включить логирование';
                    checkLog();
                }
            }
        }
    });
}