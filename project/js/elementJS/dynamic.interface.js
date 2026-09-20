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
    if (CONFIG.DYN_IsSummary) {

    }
}