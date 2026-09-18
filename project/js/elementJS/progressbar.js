// ============================================================
// ПРОГРЕСС БАР ЭТАПОВ ТЕСТА
// ============================================================
let progress_el_1 = document.querySelector('.pr-bar-1');
let progress_el_2 = document.querySelector('.pr-bar-2');
let progress_el_3 = document.querySelector('.pr-bar-3');
let progress_el_4 = document.querySelector('.pr-bar-4');
let progress_el_5 = document.querySelector('.pr-bar-5');
let progress_el_6 = document.querySelector('.pr-bar-6');
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
