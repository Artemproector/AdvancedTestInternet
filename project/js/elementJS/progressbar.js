// ============================================================
// УПРАВЛЕНИЕ ПРОГРЕСС-БАРОМ ЭТАПОВ ТЕСТА
// ============================================================

// Кэш элементов (находим один раз)
let progressElements = {};

function initProgressElements() {
    progressElements = {
        1: document.querySelector('.pr-bar-1'),
        2: document.querySelector('.pr-bar-2'),
        3: document.querySelector('.pr-bar-3'),
        4: document.querySelector('.pr-bar-4'),
        5: document.querySelector('.pr-bar-5'),
        6: document.querySelector('.pr-bar-6'),
    };
}

// ============================================================
// УСТАНОВКА СОСТОЯНИЯ ЭТАПА
// ============================================================
/**
 * @param {number} stage - номер этапа (1-6)
 * @param {string} state - 'active' | 'pass' | 'fail' | 'reset' | 'hide'
 */
function setProgressState(stage, state) {
    const el = progressElements[stage];
    if (!el) return;

    // Снимаем все классы
    el.classList.remove('pr-bar-section--active', 'pr-bar-section--pass', 'pr-bar-section--fail');

    switch (state) {
        case 'active':
            el.classList.add('pr-bar-section--active');
            break;
        case 'pass':
            el.classList.add('pr-bar-section--pass');
            break;
        case 'fail':
            el.classList.add('pr-bar-section--fail');
            break;
        case 'hide':
            el.style.display = 'none';
            break;
        case 'show':
            el.style.display = 'block';
            break;
        case 'reset':
        default:
            // ничего не добавляем
            break;
    }
}

// ============================================================
// СБРОС ВСЕГО ПРОГРЕСС-БАРА
// ============================================================
function resetProgressBar() {
    for (let i = 1; i <= 6; i++) {
        setProgressState(i, 'reset');
    }
    scrollToFirst();
}

// ============================================================
// ПРОКРУТКА
// ============================================================
function scrollToActiveProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    const activeElement = progressBar.querySelector('.pr-bar-section--active');
    if (activeElement) {
        const containerWidth = progressBar.offsetWidth;
        const elementOffset = activeElement.offsetLeft;
        const elementWidth = activeElement.offsetWidth;
        progressBar.scrollLeft = elementOffset - (containerWidth / 2) + (elementWidth / 2);
    }
}

function scrollToFirst() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    const first = progressBar.querySelector('.pr-bar-section');
    if (first) {
        const containerWidth = progressBar.offsetWidth;
        const elementOffset = first.offsetLeft;
        const elementWidth = first.offsetWidth;
        progressBar.scrollLeft = elementOffset - (containerWidth / 2) + (elementWidth / 2);
    }
}

function scrollToLast() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    const elements = progressBar.querySelectorAll('.pr-bar-section');
    if (elements.length) {
        const last = elements[elements.length - 1];
        const containerWidth = progressBar.offsetWidth;
        const elementOffset = last.offsetLeft;
        const elementWidth = last.offsetWidth;
        progressBar.scrollLeft = elementOffset - (containerWidth / 2) + (elementWidth / 2);
    }
}