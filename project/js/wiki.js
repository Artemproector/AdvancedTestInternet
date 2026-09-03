// ============================================================
// СПРАВКА 
// ============================================================
function openwiki() {
    fullnavbar.classList.add('show-nav');
    let fullLabel = document.querySelector('.labal-full-menu');
    if (fullLabel) {
        fullLabel.textContent = 'Справка';
    }
    let area = document.querySelector('.area');
    area.innerHTML = `
        <div class="help-container">
         <div class="help-section">
                <h3>Как пользоваться тестом?</h3>
                <ol>
                    <li>Нажмите кнопку <strong>"Запустить тест"</strong></li>
                    <li>Дождитесь завершения проверки (обычно 5-10 секунд)</li>
                    <li>Посмотрите результаты:</li>
                    <p>Пинг (задержка)</p>
                    <p>Протоколы</p>
                    <li>Проверьте доступность категорий сайтов (отечественные и зарубежные)</li>
                </ol>
                <div class="tip">
                    Если тест показал "Белые списки" — скорее всего, ваш провайдер блокирует зарубежные сайты.
                </div>
            </div>
        </div>
<div class="help-section">
    <h3>Тип соединения: "Неизвестно"</h3>
    <p>Иногда тест показывает тип соединения как <strong>"Неизвестно"</strong>. Это не ошибка, а особенность работы браузера. Вот что это может означать:</p>
    <ul>
        <li><strong>Включён VPN или прокси</strong> — некоторые VPN-сервисы маскируют тип сети, поэтому браузер не может определить его корректно.</li>
        <li><strong>Проводное соединение (Ethernet)</strong> — в отличие от Wi-Fi, проводное подключение не всегда передаёт информацию о типе сети.</li>
        <li><strong>Браузер не поддерживает Модуль Определения Типа Сети</strong> — старые версии браузеров или некоторые мобильные браузеры могут не иметь доступа к этой информации.</li>
        <li><strong>Соединение через Bluetooth или USB-модем</strong> — эти типы подключений часто определяются как "Неизвестно".</li>
    </ul>
    <div class="tip">
        Вы можете выполнить проверку работы модуля, нажав на кнопку ниже. Если появилась галочка,а тип сети все равно "Неизвестно", вероятнее всего, это особенность вашего браузера!
    </div>
    <div style="margin-top: 12px;">
        <button onclick="checkNetworkAPI()" style="padding: 10px 20px; background: #2a3555; border: 1px solid #4facfe; border-radius: 8px; color: #fff; cursor: pointer; font-family: Pliant, sans-serif; font-size: 14px; transition: all 0.3s;">
            Проверить доступность модуля
        </button>
    </div>
</div>
            <div class="help-section">
                <h3>Что такое ТСПУ?</h3>
                <p><strong>ТСПУ</strong> (Технические средства противодействия угрозам) — это оборудование, которое устанавливается на сетях российских операторов по закону «Яровой» (ФЗ-374). Оно анализирует весь трафик и может:</p>
                <ul>
                    <li><strong>Блокировать</strong> доступ к запрещённым сайтам</li>
                    <li><strong>Замедлять</strong> скорость для определённых сервисов</li>
                    <li><strong>Обрывать</strong> соединения (если сайт в чёрном списке)</li>
                    <li><strong>Перенаправлять</strong> на страницы-заглушки</li>
                </ul>
                <div class="tip">
                    ТСПУ может влиять на работу YouTube, Discord и других зарубежных сервисов.
                </div>
            </div>

            <div class="help-section">
                <h3>Варианты обхода ограничений</h3>
                <p>Если тест показывает наличие ограничений, могут помочь следующие методы:</p>
                <ul>
                    <li><strong>VPN</strong> — шифрует трафик и позволяет менять регион</li>
                    <li><strong>Прокси-серверы</strong> — перенаправляют запросы через другой узел</li>
                    <li><strong>DNS-over-HTTPS</strong> — защищает DNS-запросы от подмены</li>
                    <li><strong>Зеркала сайтов</strong> — альтернативные адреса ресурсов</li>
                    <li><strong>Защищённые протоколы</strong> — шифрование SNI (ECH)</li>
                </ul>
                <div class="tip">
                    Эффективность методов зависит от конкретной сети и уровня фильтрации.
                </div>
            </div>

            <div class="help-section">
                <h3>Режимы работы сети</h3>
                <p>Наш тест определяет 4 основных режима работы интернета:</p>
                <div class="mode-item">
                    <strong>Полный доступ</strong>
                    <p>Все категории сайтов доступны. Интернет работает в штатном режиме без ограничений.</p>
                </div>
                <div class="mode-item">
                    <strong>Белые списки</strong>
                    <p>Доступны только отечественные ресурсы. Зарубежные сайты заблокированы.</p>
                </div>
                <div class="mode-item">
                    <strong>Черные списки</strong>
                    <p>Доступны все сайты, кроме конкретных заблокированных. Например, работает Google, но заблокирован YouTube.</p>
                </div>
                <div class="mode-item">
                    <strong>Полная блокировка</strong>
                    <p>Ни один сайт не доступен, хотя доступ в интернет есть.</p>
                </div>
            </div>

<div class="help-section">
    <h3>Индикаторы состояния сети</h3>
    <p>В интерфейсе приложения используются три индикатора, которые показывают состояние доступности сайтов в каждой категории:</p>

    <div class="mode-item">
        <strong>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle; margin-right: 6px;">
                <circle cx="12" cy="12" r="10" stroke="#2ed573" stroke-width="2"/>
                <path d="M7 12L10.5 15.5L17 9" stroke="#2ed573" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            - ОК
        </strong>
        <p><strong>Все сайты в этой категории доступны и работают в штатном режиме.</strong> При открытии страницы проблем не возникает. Это означает, что ваш провайдер или сетевое оборудование не ограничивает доступ к данным ресурсам.</p>
    </div>

    <div class="mode-item">
        <strong>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle; margin-right: 6px;">
                <path d="M12 2L2 21H22L12 2Z" stroke="#ffa502" stroke-width="2" stroke-linejoin="round"/>
                <path d="M12 9V14" stroke="#ffa502" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="17" r="1" fill="#ffa502"/>
            </svg>
            - Проблема
        </strong>
        <p><strong>Некоторые сайты в категории недоступны, но часть работает.</strong> Это может указывать на то, что провайдер или администратор сети заблокировал только определённые ресурсы (черные списки).</p>
    </div>

    <div class="mode-item">
        <strong>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#ff4757" stroke-width="2"/>
            <path d="M8 8L16 16" stroke="#ff4757" stroke-width="2" stroke-linecap="round"/>
            <path d="M16 8L8 16" stroke="#ff4757" stroke-width="2" stroke-linecap="round"/>
        </svg>

            - Неисправность
        </strong>
        <p><strong>Все сайты в категории недоступны.</strong> Это может указывать на полную блокировку категории провайдером (например, ТСПУ).</p>
    </div>
        <div class="tip">
            Если у вас красный круг в категории "Зарубежные 1" и "Зарубежные 2", это часто означает, что провайдер или администратор сети применяет "белые списки" (О режимах сети читайте в справке).
        </div>
</div>
    `;
}
