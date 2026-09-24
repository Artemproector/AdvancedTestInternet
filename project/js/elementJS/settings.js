// ============================================================
// МЕНЮ НАСТРОЕК
// ============================================================
function openSettings() {
    fullnavbar.classList.add('show-nav');
    let fullLabel = document.querySelector('.labal-full-menu');
    if (fullLabel) {
        fullLabel.textContent = 'Настройки';
    }
    let area = document.querySelector('.area');
    area.innerHTML = `
        <h3 class='setting_name'>Выбор конфигурации:</h3>
        <div class='settings_wrapper'>
        <ol class='selecter'>
            <li class="select cfg cfg_base ${currentPreset === 'base' ? 'selected' : ''}" data-preset="base">Базовая</li>
            <li class="select cfg cfg_exp ${currentPreset === 'exp' ? 'selected' : ''}" data-preset="exp">Экспресс</li>
            <li class="select cfg cfg_kat ${currentPreset === 'kat' ? 'selected' : ''}" data-preset="kat">Только категории</li>
            <li class="select cfg cfg_pls ${currentPreset === 'pls' ? 'selected' : ''}" data-preset="pls">Расширенная</li>
            <li class="select cfg cfg_usr ${currentPreset === 'usr' ? 'selected' : ''}" data-preset="usr">Пользовательская</li>
        </ol>
        <p id="configDescription"><span class='desclabel'>Описание конфигурации:</span><br> ${loadDescConfigs()}</p></div>
        <h3 class='setting_name'>Таймауты:</h3>
        <ol class='selecter'>
            <li class="select timeout tmout1 ${currentTime === 'tmout1' ? 'selected' : ''}" data-timeout="tmout1">Стандартный</li>
            <li class="select timeout tmout2 ${currentTime === 'tmout2' ? 'selected' : ''}" data-timeout="tmout2">Расширенный</li>
            <li class="select timeout tmout3 ${currentTime === 'tmout3' ? 'selected' : ''}" data-timeout="tmout3">Бесконечный</li>
            <li class="select timeout tmout4 ${currentTime === 'tmout4' ? 'selected' : ''}" data-timeout="tmout4">Пользовательский</li>
        </ol>
        <p id="timeoutDescription"><span class='desclabel'>Описание таймаута:</span><br> ${loadDescTimeout()}</p></div>
        <h3 class='setting_name'>Дизайн:</h3>
        <ol class='selecter'>
            <li class="select dsgn dsgn1 ${currentdsgn === 'dsgn1' ? 'selected' : ''}" data-dsgn="dsgn1">Стандартный</li>
            <li class="select dsgn dsgn2 ${currentdsgn === 'dsgn2' ? 'selected' : ''}" data-dsgn="dsgn2">Горизонтальный</li>
            <li class="select dsgn dsgn3 ${currentdsgn === 'dsgn3' ? 'selected' : ''}" data-dsgn="dsgn3">Точечный</li>
            <!-- УБРАТЬ "МУСОР" ИЗ ИНТЕРФЕЙСА -->
        </ol>
        <h3 class='setting_name'>Режим отображения блокировок:</h3>
        <ol class='selecter block'>
            <li class="select blocking block1 ${currentblock === 'block1' ? 'selected' : ''}" data-blocking="block1">Списками</li>
            <li class="select blocking block2 ${currentblock === 'block2' ? 'selected' : ''}" data-blocking="block2">В процентах</li>
            <li class="select blocking block3 ${currentblock === 'block3' ? 'selected' : ''}" data-blocking="block3">Словами</li>
            <!-- КОГДА-НИБУДЬ БУДЕТ ПОЛЬЗОВАТЕЛЬСКАЯ -->
        </ol>
    `;
    document.querySelectorAll('.cfg').forEach(el => {
        el.addEventListener('click', function () {
            const presetName = this.dataset.preset;
            selectCFG(presetName);
            notifySuccess("Применено!", 3000)
            document.querySelectorAll('.cfg').forEach(item => {
                item.classList.remove('selected');
            });
            this.classList.add('selected');

            // Обновляем описание
            const descEl = document.getElementById('configDescription');
            if (descEl) {
                descEl.innerHTML = `<span class='desclabel'>Описание конфигурации:</span><br> ${loadDescConfigs()}`;
            }
        });
    });
    document.querySelectorAll('.timeout').forEach(el => {
        el.addEventListener('click', function () {
            const timeoutName = this.dataset.timeout;
            applyTimeout(timeoutName);
            notifySuccess("Применено!", 3000)
            document.querySelectorAll('.timeout').forEach(item => {
                item.classList.remove('selected'); 
            });
            this.classList.add('selected');
            const descEl = document.getElementById('timeoutDescription');
            if (descEl) {
                descEl.innerHTML = `<span class='desclabel'>Описание таймаута:</span><br> ${loadDescTimeout()}`;
            }
        });
    });
    document.querySelectorAll('.dsgn').forEach(el => {
        el.addEventListener('click', function () {
            const dsgnName = this.dataset.dsgn;
            selectDSGN(dsgnName);
            updateConnectionInfo()
            notifySuccess("Применено!",3000)
            document.querySelectorAll('.dsgn').forEach(item => {
                item.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
    document.querySelectorAll('.blocking').forEach(el => {
        el.addEventListener('click', function () {
            if (currentPreset == 'usr') {
                selectblocking('block2');
                notifyError("Недоступно при текущем конфиге!")
                let btns = document.querySelectorAll('.blocking')
                btns.forEach(item => {
                    item.classList.remove('selected');
                });
                btns[1].classList.add('selected');
            }
            else {
                const blockingName = this.dataset.blocking;
                selectblocking(blockingName);
                notifySuccess("Применено!", 3000)
                document.querySelectorAll('.blocking').forEach(item => {
                    item.classList.remove('selected');
                });
                this.classList.add('selected');
            }
        });
    });
}