function openDev() {
    fullnavbar.classList.add('show-nav');
    let fullLabel = document.querySelector('.labal-full-menu');
    if (fullLabel) {
        fullLabel.textContent = 'DEV-MENU';
    }
    let area = document.querySelector('.area');
    area.innerHTML = '';
    __showNewOptions(area)
    __showLog(area)
}