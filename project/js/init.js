async function initApp() {
    try {
        const savedCFG = localStorage.getItem('CFG') || 'base';
        applyPreset(savedCFG);
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
        const btn = document.getElementById('testBtn');
        if (btn) {
            btn.addEventListener('click', runFullTest);
        }
        document.querySelectorAll('.app_ver').forEach(e => {
            e.textContent = `Версия: ${CONFIG.version}`;
        });
        checkLog();
        consoleAllSettings();
        console.log('Приложение инициализировано');
        
    } catch (error) {
        console.error('Ошибка инициализации:', error);
    }
}
// Запуск
initApp();