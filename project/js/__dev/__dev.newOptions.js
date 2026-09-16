function __showNewOptions(area) {
    // Кнопка "Добавить демо-записи"
    const demoBtn = document.createElement('button');
    demoBtn.textContent = 'Добавить демо-записи в историю';
    demoBtn.classList.add('__btn');
    demoBtn.addEventListener('click', () => {
        addDemoHistoryRecords();
        alert('Добавлено 20 демо-записей! Проверь историю.');
    });
    area.appendChild(demoBtn);    
    // Кнопка "окна"
    const windowBtn = document.createElement('button');
    windowBtn.textContent = 'Открыть окно';
    windowBtn.classList.add('__btn');
    windowBtn.addEventListener('click', () => {
        showWindow('DEMO',"Демострация возможностей");
    });
    area.appendChild(windowBtn);    
    // Кнопка уведомления
    const notiBtn = document.createElement('button');
    notiBtn.textContent = 'Создать уведомление';
    notiBtn.classList.add('__btn');
    notiBtn.addEventListener('click', () => {
        notifydemo();
    });
    area.appendChild(notiBtn);
}
function addDemoHistoryRecords() {
    const modes = [
        'Полный доступ',
        'Белые списки',
        'Черные списки',
        'VPN',
        'Полная блокировка'
    ];

    const networks = ['wifi', 'cellular', 'ethernet', 'unknown'];

    // Сколько демо-записей создать
    const count = 20;

    // Период: за последние 24 часа
    const now = Date.now();
    const dayAgo = now - 24 * 60 * 60 * 1000;

    for (let i = 0; i < count; i++) {
        // Случайное время за последние 24 часа
        const timestamp = dayAgo + Math.random() * (now - dayAgo);
        const date = new Date(timestamp);

        // Случайный режим
        const mode = modes[Math.floor(Math.random() * modes.length)];

        // Логика успешности: ПБ — неудачный, остальные — успешные
        const isSuccess = mode !== 'Полная блокировка';

        // Случайный пинг (только если не ПБ)
        const ping = isSuccess
            ? Math.floor(Math.random() * 150) + 10
            : '—';

        // Случайный тип сети
        const network = networks[Math.floor(Math.random() * networks.length)];

        // Случайная длительность
        const duration = (Math.random() * 15 + 3).toFixed(1);

        // Случайные протоколы
        const protocols = {
            dns: isSuccess ? Math.random() > 0.1 : false,
            http: isSuccess ? Math.random() > 0.15 : false,
            https: isSuccess ? Math.random() > 0.05 : false
        };

        // Добавляем запись
        addHistoryRecord({
            timestamp: timestamp,
            ping: ping,
            mode: mode,
            date: date.toLocaleString(),
            success: isSuccess,
            duration: duration,
            protocols: protocols,
            network: network
        });
    }

    console.log(`Добавлено ${count} демо-записей в историю`);
}