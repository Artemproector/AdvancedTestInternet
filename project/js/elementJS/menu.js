// ============================================================
// МЕНЮ И FULL-MENU
// ============================================================
let navbar = document.querySelector('.nav-bar');
let fullnavbar = document.querySelector('.full-nav-bar');
let header__left_col_btn = document.querySelector('.header__left-col-btn');
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
function openlink() {
    fullnavbar.classList.add('show-nav');
    let fullLabel = document.querySelector('.labal-full-menu');
    if (fullLabel) {
        fullLabel.textContent = 'Переход на другой сайт';
    }
    let area = document.querySelector('.area');
    area.innerHTML = 'Внимание, данная кнопка ведет на другой сайт (github.com). Если вы действительно хотите перейти нажмите далее<br> <a href="https://github.com/Artemproector/AdvancedTestInternet" target="_blank">Далее</a>';
}
function openWikiLink(id) {
    openwiki()
    //скролл до объекта
}