function __showNewOptions(area) {
    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;';

    // Кнопка "Тест 1: HEAD с no-cors (как сейчас)"
    const btn1 = createTestButton('Тест 1: HEAD no-cors', 'HEAD', 'no-cors');
    btnContainer.appendChild(btn1);

    // Кнопка "Тест 2: HEAD с cors"
    const btn2 = createTestButton('Тест 2: HEAD cors', 'HEAD', 'cors');
    btnContainer.appendChild(btn2);

    // Кнопка "Тест 3: GET с no-cors"
    const btn3 = createTestButton('Тест 3: GET no-cors', 'GET', 'no-cors');
    btnContainer.appendChild(btn3);

    // Кнопка "Тест 4: GET с cors"
    const btn4 = createTestButton('Тест 4: GET cors', 'GET', 'cors');
    btnContainer.appendChild(btn4);

    // Кнопка "Тест 5: HEAD с retry (3 попытки)"
    const btn5 = createTestButton('Тест 5: HEAD no-cors + retry', 'HEAD', 'no-cors', true);
    btnContainer.appendChild(btn5);

    // Кнопка "Тест 6: GET с retry (3 попытки)"
    const btn6 = createTestButton('Тест 6: GET no-cors + retry', 'GET', 'no-cors', true);
    btnContainer.appendChild(btn6);

    area.appendChild(btnContainer);

    // Контейнер для результатов
    const resultContainer = document.createElement('div');
    resultContainer.id = 'devTestResult';
    resultContainer.style.cssText = `
        padding: 12px;
        background: #0a0e1a;
        border: 1px solid #2a3555;
        border-radius: 8px;
        color: #8892b0;
        font-size: 13px;
        font-family: monospace;
        min-height: 60px;
        white-space: pre-wrap;
        word-break: break-all;
        max-height: 300px;
        overflow-y: auto;
    `;
    resultContainer.textContent = 'Нажмите кнопку для теста...';
    area.appendChild(resultContainer);
}

// ============================================================
// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ СОЗДАНИЯ КНОПОК
// ============================================================
function createTestButton(label, method, mode, useRetry = false) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = `
        padding: 10px 16px;
        background: #1a2238;
        border: 1px solid #2a3555;
        border-radius: 8px;
        color: #ccd6f6;
        cursor: pointer;
        font-family: Pliant, sans-serif;
        font-size: 14px;
        transition: all 0.3s;
        text-align: left;
    `;
    btn.onmouseenter = () => {
        btn.style.background = '#2a3555';
        btn.style.borderColor = '#4facfe';
    };
    btn.onmouseleave = () => {
        btn.style.background = '#1a2238';
        btn.style.borderColor = '#2a3555';
    };

    btn.addEventListener('click', async () => {
        const resultContainer = document.getElementById('devTestResult');
        resultContainer.textContent = '⏳ Тестируем Макс...';
        resultContainer.style.color = '#8892b0';

        const url = 'https://web.max.ru/favicon.png?v=2026';
        const timeout = 15000; // 15 секунд

        let result;
        if (useRetry) {
            result = await devCheckSiteAvailabilityWithRetry(url, timeout, method, mode);
        } else {
            result = await devCheckSiteAvailability(url, timeout, method, mode);
        }

        // Формируем вывод
        const statusIcon = result.success ? '✅' : '❌';
        const statusText = result.success ? 'ДОСТУПЕН' : 'НЕДОСТУПЕН';
        const statusColor = result.success ? '#2ed573' : '#ff4757';

        let output = `${statusIcon} Макс: ${statusText}\n`;
        output += `─────────────────────────────\n`;
        output += `Метод: ${method}\n`;
        output += `Режим: ${mode}\n`;
        output += `Таймаут: ${timeout}мс\n`;
        output += `Попыток: ${result.attempt || 1}\n`;
        if (result.success) {
            output += `Время: ${Math.round(result.time)}мс\n`;
        } else {
            output += `Ошибка: ${result.error || 'таймаут'}\n`;
        }
        if (result.attempts) {
            output += `Успешных попыток: ${result.attempts}\n`;
        }

        resultContainer.textContent = output;
        resultContainer.style.color = statusColor;
    });

    return btn;
}

// ============================================================
// ТЕСТОВЫЕ ФУНКЦИИ
// ============================================================

// Тест 1-4: Одиночный запрос
async function devCheckSiteAvailability(url, timeout, method, mode) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const start = performance.now();
        const response = await fetch(url, {
            method: method,
            signal: controller.signal,
            mode: mode
        });
        const end = performance.now();
        clearTimeout(timeoutId);
        return {
            success: true,
            time: end - start,
            attempt: 1,
            status: response.status
        };
    } catch (error) {
        clearTimeout(timeoutId);
        return {
            success: false,
            time: timeout,
            attempt: 1,
            error: error.message || 'timeout'
        };
    }
}

// Тест 5-6: С повторными попытками
async function devCheckSiteAvailabilityWithRetry(url, timeout, method, mode, retries = 3) {
    let lastError = null;
    let totalAttempts = 0;

    for (let attempt = 1; attempt <= retries; attempt++) {
        totalAttempts++;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        try {
            const start = performance.now();
            const response = await fetch(url, {
                method: method,
                signal: controller.signal,
                mode: mode
            });
            const end = performance.now();
            clearTimeout(timeoutId);
            return {
                success: true,
                time: end - start,
                attempt: totalAttempts,
                status: response.status
            };
        } catch (error) {
            clearTimeout(timeoutId);
            lastError = error.message || 'timeout';
            // Ждём перед следующей попыткой
            if (attempt < retries) {
                await sleep(1500);
            }
        }
    }

    return {
        success: false,
        time: timeout,
        attempt: totalAttempts,
        error: lastError || 'timeout',
        attempts: totalAttempts
    };
}

// ============================================================
// ФУНКЦИЯ ДЛЯ СНА (чтобы не дублировать)
// ============================================================
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}