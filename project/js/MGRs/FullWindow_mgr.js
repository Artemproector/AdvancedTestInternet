function showWindow(infload = false, title = '', content = '', autoclose = false, ac_timer = 1500) {
    let fullscreen_window = document.querySelector('.fullscreen-window');
    let windowWrapper = document.querySelector('.fullscreen__wrapper');

    // Если окно в процессе закрытия — сбрасываем анимацию
    if (fullscreen_window.classList.contains('fullscreen-window--closing')) {
        fullscreen_window.classList.remove('fullscreen-window--closing');
    }

    fullscreen_window.classList.add('fullscreen-window--show');
    windowWrapper.innerHTML = `
            <div class="loader_wrapper">
                <span class="loader"></span>
            </div>`;
    if (infload) {
        // Показываем лоадер
        windowWrapper.innerHTML = `
            <div class="loader_wrapper">
                <span class="loader"></span>
            </div>`;
        return;
    }

    // Если не infload — показываем контент
    const contentHTML = `
        <div class="top-block">
            <h2 class="labal-full-menu">${title}</h2>
            <div class="close" onclick="closeWindow()">
                <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#fff">
                    <path d="M287-446.67 503.67-230q10 10 9.83 23.33-.17 13.34-10.17 23.34-10 9.66-23.33 9.83-13.33.17-23.33-9.83L183.33-456.67q-5.33-5.33-7.5-11-2.16-5.66-2.16-12.33t2.16-12.33q2.17-5.67 7.5-11l273.34-273.34q9.66-9.66 23.16-9.66t23.5 9.66q10 10 10 23.5t-10 23.5L287-513.33h479.67q14.33 0 23.83 9.5 9.5 9.5 9.5 23.83 0 14.33-9.5 23.83-9.5 9.5-23.83 9.5H287Z" />
                </svg>
            </div>
        </div>
        <div class="area">
            ${content}
        </div>`;

    if (autoclose) {
        setTimeout(() => {
            windowWrapper.innerHTML = contentHTML;
        }, ac_timer);
    } else {
        windowWrapper.innerHTML = contentHTML;
    }
}
function closeWindow() {
    const fullscreen_window = document.querySelector('.fullscreen-window');
    const windowWrapper = document.querySelector('.fullscreen__wrapper');
    fullscreen_window.style.display = 'none'
    if (!fullscreen_window.classList.contains('fullscreen-window--show')) {
        return;
    }

    // Добавляем класс анимации закрытия
    fullscreen_window.classList.add('fullscreen-window--closing');

    // Ждём окончания анимации
    setTimeout(() => {
        // Убираем классы
        fullscreen_window.classList.remove('fullscreen-window--show');
        fullscreen_window.classList.remove('fullscreen-window--closing');

        // Сбрасываем содержимое на лоадер
        windowWrapper.innerHTML = `
            <div class="loader_wrapper">
                <span class="loader"></span>
            </div>`;
    }, 400);
}
function updateWindowContent(content) {
    const windowWrapper = document.querySelector('.fullscreen__wrapper');
    if (windowWrapper) {
        windowWrapper.innerHTML = content;
    }
}