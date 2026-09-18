// ============================================================
// МЕНЕДЖЕР ОКНА ПОДТВЕРЖДЕНИЯ
// ============================================================

let confirm_modal = document.querySelector('.info-modal');
let confirm_label = document.querySelector('.modal-label');
let confirm_ok = document.querySelector('.btn-ok');
let confirm_cancel = document.querySelector('.btn-cancel');
let confirm_area = document.querySelector('.confirm-area');
let confirm_resolve = null;
let confirm_timer = null;
let confirm_interval = null;
const CONFIRM_TIMEOUT = 7000;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// ============================================================
// ПОКАЗАТЬ МОДАЛКУ
// ============================================================
function showConfirm(label_text = 'Ошибка! (e404)', main_text = 'Не указан текст этого меню!', isShowCancel = true) {
    return new Promise((resolve) => {
        // Показываем модалку
        confirm_modal.classList.add('info-modal--show');
        confirm_label.textContent = label_text;
        confirm_area.innerHTML = main_text;

        // Настройка кнопки "Отмена"
        if (!isShowCancel) {
            confirm_cancel.classList.add('btn-cancel--hide');
        } else {
            confirm_cancel.classList.remove('btn-cancel--hide');
            // Запускаем прогресс-бар в кнопке
            startCancelProgress();
        }

        // Настройка кнопки "ОК"
        confirm_ok.classList.remove('btn-ok--loading');
        confirm_ok.disabled = false;

        // Сохраняем resolve для обработчиков кнопок
        confirm_resolve = resolve;

        // Очищаем старые таймеры
        clearTimeout(confirm_timer);
        clearInterval(confirm_interval);

        // Запускаем таймер на автозакрытие
        confirm_timer = setTimeout(() => {
            closeConfirm(false);
        }, CONFIRM_TIMEOUT);
    });
}

// ============================================================
// ЗАПУСК ПРОГРЕСС-БАРА В КНОПКЕ "ОТМЕНА"
// ============================================================
async function startCancelProgress() {
    confirm_cancel.classList.remove('active');
    confirm_cancel.style.setProperty('--progress-width', '0%');
    void confirm_cancel.offsetWidth;
    confirm_cancel.classList.add('active');
    confirm_cancel.style.setProperty('--progress-width', '100%');
    let seconds = Math.floor(CONFIRM_TIMEOUT / 1000);
    const span = confirm_cancel.querySelector('span');
    if (span) {
        span.textContent = `Отмена (${seconds}с)`;
    }
    clearInterval(confirm_interval);
    for (let i = seconds - 1; i >= 0; i--) {
        await sleep(1000);
        if (span) {
            if (i > 0) {
                span.textContent = `Отмена (${i}с)`;
            } else {
                span.textContent = 'Отмена';
            }
        }
    }
}

// ============================================================
// ЗАКРЫТЬ МОДАЛКУ
// ============================================================
function closeConfirm(result) {
    // Скрываем модалку
    confirm_modal.classList.remove('info-modal--show');

    // Сбрасываем прогресс-бар
    confirm_cancel.classList.remove('active');
    confirm_cancel.style.setProperty('--progress-width', '0%');
    const span = confirm_cancel.querySelector('span');
    if (span) {
        span.textContent = 'Отмена';
    }

    // Очищаем таймеры
    clearTimeout(confirm_timer);
    clearInterval(confirm_interval);
    confirm_timer = null;
    confirm_interval = null;

    // Возвращаем результат
    if (confirm_resolve) {
        confirm_resolve(result);
        confirm_resolve = null;
    }
}

// ============================================================
// ОБРАБОТЧИКИ КНОПОК
// ============================================================
confirm_ok.addEventListener('click', () => {
    closeConfirm(true);
});
confirm_cancel.addEventListener('click', () => {
    closeConfirm(false);
});