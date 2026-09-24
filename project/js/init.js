async function initApp() {
    try {
        // Показываем экран загрузки
        showWindow(true);

        const savedCFG = localStorage.getItem('CFG') || 'base';
        applyPreset(savedCFG);
        // Загружаем сохранённые настройки интерфейса
        ['DYN_summary', 'DYN_prBar', 'DYN_tmBar', 'DYN_categories'].forEach(field => {
            const saved = localStorage.getItem(field);
            if (saved !== null) {
                CONFIG[field] = saved === 'true';
            }
        });
        const savedTimeout = localStorage.getItem('timeout') || 'tmout1';
        applyTimeout(savedTimeout);
        const savedBlock = localStorage.getItem('block') || 'block1';
        selectblocking(savedBlock);
        await generateMainContent();
        initProgressElements();
        const savedTheme = localStorage.getItem('theme') || 'dsgn1';
        selectDSGN(savedTheme);
        showcategories();
        calcConnectIndex();
        updateConnectionInfo();
        let pc_sum = document.querySelector('.pc_sum');
        pc_sum.innerHTML = buildSummaryContent()
        const btn = document.getElementById('testBtn');
        if (btn) {
            btn.addEventListener('click', runFullTest);
        }
        document.querySelectorAll('.app_ver').forEach(e => {
            e.textContent = `Версия: ${CONFIG.version}`;
        });
        checkLog();
        //consoleAllSettings();
        const needCheck = !localStorage.getItem('deviceCheckPassed');
        if (needCheck) {
            await checkDevice();
        } else {
            closeWindow();
        }
        console.log('Приложение инициализировано');
        notifiToUpdate();
    } catch (error) {
        console.error('Ошибка инициализации:', error);
    }
}
// Запуск
initApp();