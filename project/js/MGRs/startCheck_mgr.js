async function checkDevice() {
    // Если проверка уже проходила — пропускаем
    if (localStorage.getItem('deviceCheckPassed')) {
        return;
    }

    // Список проверок с простыми описаниями
    const tests = [
        {
            name: 'Сохранение данных',
            description: 'Проверяем, может ли приложение сохранять настройки и историю',
            test: () => {
                try {
                    localStorage.setItem('__test__', '1');
                    localStorage.removeItem('__test__');
                    return true;
                } catch (e) {
                    return false;
                }
            }
        },
        {
            name: 'Загрузка данных из интернета',
            description: 'Проверяем, может ли приложение отправлять запросы к сайтам',
            test: () => typeof fetch === 'function'
        },
        {
            name: 'Отмена запросов',
            description: 'Проверяем, может ли приложение вовремя останавливать загрузку',
            test: () => typeof AbortController === 'function'
        },
        {
            name: 'Определение типа сети',
            description: 'Проверяем, может ли приложение определить, как вы подключены к интернету',
            test: () => 'connection' in navigator
        },
        {
            name: 'Точное измерение времени',
            description: 'Проверяем, может ли приложение точно замерять скорость и пинг',
            test: () => typeof performance !== 'undefined' && typeof performance.now === 'function'
        },
        {
            name: 'Создание картинок',
            description: 'Проверяем, может ли приложение создавать изображения для результатов',
            test: () => {
                const canvas = document.createElement('canvas');
                return !!(canvas.getContext && canvas.getContext('2d'));
            }
        },
        {
            name: 'Отправка результатов',
            description: 'Проверяем, может ли приложение делиться результатами теста',
            test: () => typeof navigator.share === 'function'
        }
    ];

    // Функция для отображения лоадера с текстом
    function showLoaderWithText(text) {
        const content = `
            <div class="device-check-loader">
                <span class="loader"></span>
                <p class="device-check-text">${text}</p>
            </div>
        `;
        updateWindowContent(content);
    }

    // Функция для отображения ошибок
    function showErrors(errors) {
        let html = `
            <div class="device-check-errors">
                <h2 class="device-check-errors-title">Обнаружены проблемы</h2>
                <p class="device-check-errors-subtitle">Некоторые функции могут работать неправильно:</p>
                <ul class="device-check-errors-list">
        `;
        errors.forEach(err => {
            html += `<li><strong>${err.name}</strong> — ${err.description}</li>`;
        });
        html += `
                </ul>
                <p class="device-check-errors-note">Приложение продолжит работу, но некоторые возможности могут быть недоступны.</p>
                <button class="device-check-close-btn" onclick="closeWindow()">Понятно</button>
            </div>
        `;
        updateWindowContent(html);
    }

    // Показываем первый лоадер
    showLoaderWithText('Подготовка к проверке...');

    // Ждём немного, чтобы пользователь увидел начало
    await sleep(1000);

    const errors = [];

    // Прогоняем проверки
    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];

        // Показываем текст текущей проверки
        showLoaderWithText(test.description);

        // Задержка для имитации работы
        await sleep(Math.floor(Math.random() * (1500 - 500 + 1)) + 500);

        // Выполняем проверку
        try {
            const result = test.test();
            if (!result) {
                errors.push({
                    name: test.name,
                    description: test.description
                });
            }
        } catch (e) {
            errors.push({
                name: test.name,
                description: test.description
            });
        }
    }

    // Финальный текст
    showLoaderWithText('Завершение проверки...');
    await sleep(1000);

    // Сохраняем флаг, что проверка пройдена
    localStorage.setItem('deviceCheckPassed', 'true');

    // Если есть ошибки — показываем их
    if (errors.length > 0) {
        showErrors(errors);
    } else {
        // Всё хорошо — закрываем окно
        closeWindow();
    }
}