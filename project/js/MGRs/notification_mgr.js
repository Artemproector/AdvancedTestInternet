// ============================================================
// МЕНЕДЖЕР УВЕДОМЛЕНИЙ
// ============================================================

// Создаём контейнер при загрузке
let notificationContainer = null;

function initNotificationContainer() {
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
}

// ============================================================
// ИКОНКИ ДЛЯ ТИПОВ
// ============================================================
const NOTIFICATION_ICONS = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M7 12L10.5 15.5L17 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M8 8L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M16 8L8 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 21H22L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M12 9V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="17" r="1" fill="currentColor"/>
    </svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M12 8V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
    </svg>`
};

// ============================================================
// ПОКАЗАТЬ УВЕДОМЛЕНИЕ
// ============================================================
function notify(text, type = 'info', duration = 5000) {
    initNotificationContainer();

    // Создаём уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;

    // Иконка
    const iconHTML = NOTIFICATION_ICONS[type] || NOTIFICATION_ICONS.info;

    notification.innerHTML = `
        <div class="notification__wrapper">
            <div class="notification__icon">${iconHTML}</div>
            <div class="notification__text">${text}</div>
            <div class="notification__close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
                </svg>
            </div>
        </div>
        <div class="notification__progress" style="animation-duration: ${duration}ms;"></div>
    `;

    // Добавляем в контейнер
    notificationContainer.appendChild(notification);

    // Обработчик закрытия
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });

    // Автозакрытие
    let timer = setTimeout(() => {
        hideNotification(notification);
    }, duration);

    // При наведении — пауза таймера
    notification.addEventListener('mouseenter', () => {
        clearTimeout(timer);
        const progress = notification.querySelector('.notification__progress');
        if (progress) {
            progress.style.animationPlayState = 'paused';
        }
    });

    notification.addEventListener('mouseleave', () => {
        // Перезапускаем таймер (упрощённо — на 2 секунды)
        timer = setTimeout(() => {
            hideNotification(notification);
        }, 2000);
        const progress = notification.querySelector('.notification__progress');
        if (progress) {
            progress.style.animationPlayState = 'running';
        }
    });

    return notification;
}

// ============================================================
// СКРЫТЬ УВЕДОМЛЕНИЕ
// ============================================================
function hideNotification(notification) {
    notification.classList.add('notification--hide');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// ============================================================
// БЫСТРЫЕ ФУНКЦИИ
// ============================================================
function notifySuccess(text, duration) {
    return notify(text, 'success', duration);
}

function notifyError(text, duration) {
    return notify(text, 'error', duration); 
}

function notifyWarning(text, duration) {
    return notify(text, 'warning', duration);
}

function notifyInfo(text, duration) {
    return notify(text, 'info', duration);
}
function notifydemo(text='Демострация возможностей') {
    notifySuccess(text)
    notifyError(text)
    notifyWarning(text)
    notifyInfo(text)
}