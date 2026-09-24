// ============================================================
// ДИНАМИЧЕСКОЕ СОЗДАНИЕ БАЗОВОГО ИНТЕРФЕЙСА
// ============================================================
let app = document.querySelector('.app__dyn-content');
async function generateMainContent() {
    app.innerHTML = `<div class="summary phonesummary">
                        <h3>Сводка</h3>
                        <div class="summary__wrapper">
                            <div class="summary__left-col">
                                <p>Надёжность соединения</p>
                                <h3 class="connect_index">——</h3>
                            </div>
                            <div class="summary__right-col">
                                <p>Количество тестирований</p>
                                <p class="summary__right-col-today">За сегодня</p>
                                <h3 class="tests_counter">——</h3>
                            </div>
                        </div>
                        <p class="summarybtn" onclick="summaryload()">Вся сводка</p>
                    </div>
                    <div class="styles_wrapper">
                    </div>
                    <div class="progress-bar">
                        <div id="pr-bar-1" class="pr-bar-section pr-bar-1">Проверка интернета</div>
                        <div id="pr-bar-4" class="pr-bar-section pr-bar-4">Проверка режима</div>
                        <div style="display: none;" id="pr-bar-2" class="pr-bar-section pr-bar-2">Измерение скорости
                        </div>
                        <div id="pr-bar-3" class="pr-bar-section pr-bar-3">Измерение пинга</div>
                        <div id="pr-bar-6" class="pr-bar-section pr-bar-6">Проверка протоколов</div>
                        <div id="pr-bar-5" class="pr-bar-section pr-bar-5">Конец</div>
                    </div>
                    <!-- ===== КНОПКА ===== -->
                    <button class="test-button" id="testBtn">
                        <span class="button-text">Запустить тест</span>
                        <div class="spinner"></div>
                    </button>
                    <div class="timer-bar">
                        <div id="tm-bar-1" class="tm-bar-section tm-bar-1">Начало: <span
                                class="start-time">--:--:--</span>
                        </div>
                        <div id="tm-bar-2" class="tm-bar-section tm-bar-2">Окончание: <span
                                class="stop-time">--:--:--</span></div>
                        <div id="tm-bar-3" class="tm-bar-section tm-bar-3">Длительность: <span
                                class="test-time">--</span>
                            сек</div>
                    </div>
                    <!-- ===== КАТЕГОРИИ САЙТОВ ===== -->
                    <div class="categories">
                        <div class="categories-title">
                            Доступность категорий:
                        </div>
                    </div>`
    let phonesummary = document.querySelector('.phonesummary');
    let progressBar = document.querySelector('.progress-bar');
    let tmBar = document.querySelector('.timer-bar');
    let categories = document.querySelector('.categories');
    //if (!CONFIG.DYN_summary) {
    //    phonesummary.style.display = 'none'
    //    phonesummary.style.visibility = 'hidden'
    //    phonesummary.style.width = '0px'
    //    phonesummary.style.height = '0px'
    //}
    //if (!CONFIG.DYN_prBar) {
    //    progressBar.style.display = 'none'
    //}
    //if (!CONFIG.DYN_tmBar) {
    //    tmBar.style.display = 'none'
    //}
    //if (!CONFIG.DYN_categories) {
    //    categories.style.display = 'none'
    //}
}
function selectOffElem() {
    const dsgn_ui = `
        <ol class='selecter'>
            <li class="select ui_dsgn summ ${CONFIG.DYN_summary ? 'selected' : ''}" data-dsgn="summ">Сводка данных</li>
            <li class="select ui_dsgn prBar ${CONFIG.DYN_prBar ? 'selected' : ''}" data-dsgn="prBar">Прогресс-бар</li>
            <li class="select ui_dsgn tmBar ${CONFIG.DYN_tmBar ? 'selected' : ''}" data-dsgn="tmBar">Таймер</li>
            <li class="select ui_dsgn cat ${CONFIG.DYN_categories ? 'selected' : ''}" data-dsgn="cat">Категории</li>
        </ol>`;

    showWindow(false, "Дизайн", dsgn_ui);

    document.querySelectorAll('.ui_dsgn').forEach(el => {
        el.addEventListener('click', function () {
            const key = this.dataset.dsgn;
            applyUI(key);

            // Обновляем визуальное выделение
            document.querySelectorAll('.ui_dsgn').forEach(item => {
                item.classList.remove('selected');
            });
            this.classList.add('selected');

            // Меняем класс .selected в зависимости от нового состояния
            const field = {
                'summ': 'DYN_summary',
                'prBar': 'DYN_prBar',
                'tmBar': 'DYN_tmBar',
                'cat': 'DYN_categories'
            }[key];

            if (CONFIG[field]) {
                this.classList.add('selected');
            } else {
                this.classList.remove('selected');
            }

            notifySuccess("Применено!", 2000);
        });
    });
}