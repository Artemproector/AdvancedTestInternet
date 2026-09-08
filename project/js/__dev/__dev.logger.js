//АКТИВАЦИЯ DEV-РЕЖИМА ПРОИСХОДИТ ПУТЕМ НАЖАТИЯ КНОПКИ В МЕНЮ ПРОВЕРКИ ОБНОВЛЕНИЯ ПРИ ИСПОЛЬЗОВАНИИ ВЕРСИИ ВЫШЕ, ЧЕМ В GITHUB
const LOG_KEY = 'devLog';
async function changeLogPolicy() {
    let logger = document.querySelector('.logger_btn');
    if (logger.textContent == 'Включить логирование') {
        logger.classList.add('logger--on')
        logger.textContent = 'Выключить логирование'
        checkLog()
        localStorage.setItem("logger", 'on');
        addToLog('Сохранение лога включено')
    }
    else {
        if (logger.textContent == 'Выключить логирование') {
            const confirmed = await showConfirm(
                'Выключение логирования',
                'Если отключить эту функцию сейчас, то доступа в официальном релизе к ней не будет. В включенном режиме она будет доступна в любой версии выше 1.5.0 (включительно).'
            );

            if (confirmed) {
                localStorage.removeItem('logger');
                localStorage.removeItem(LOG_KEY);
                logger.classList.remove('logger--on')
                logger.textContent = 'Включить логирование'
                checkLog()
            }
        }
    }
}
function checkLog() {
    let openlog_btn = document.querySelector('.openlog_btn')
    if (localStorage.getItem('logger')) {
        openlog_btn.style.display = 'block'
    }
    else {
        openlog_btn.style.display = 'none'
    }
}
checkLog()
function __showLog(area) {
    const btnGrp = document.createElement('div');
    btnGrp.className = 'log_btn_grp';
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download_btn';
    downloadBtn.textContent = 'Скачать лог';
    downloadBtn.addEventListener('click', downloadLog);
    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear_btn';
    clearBtn.textContent = 'Очистить лог';
    clearBtn.addEventListener('click', clearLog);
    btnGrp.appendChild(downloadBtn);
    btnGrp.appendChild(clearBtn);
    area.appendChild(btnGrp);
    const logContainer = document.createElement('p');
    logContainer.className = 'log_container';
    logContainer.innerHTML = localStorage.getItem(LOG_KEY) || 'Лог пуст';
    area.appendChild(logContainer);
}
function addToLog(text) {
    if (localStorage.getItem('logger')) {
        let log = localStorage.getItem(LOG_KEY) || '';
        const timestamp = new Date().toLocaleString();
        const entry = `[${timestamp}] - ${text}<br> \n`;
        log += entry;
        localStorage.setItem(LOG_KEY, log);
    }

}
function getLog() {
    return localStorage.getItem(LOG_KEY) || 'Лог пуст';
}
async function clearLog() {
    const confirmed = await showConfirm(
        'Очистить лог?',
        'Очистить?'
    );

    if (confirmed) {
        localStorage.removeItem(LOG_KEY);
        __showLog()
    }
}

// ============================================================
// СКАЧАТЬ ЛОГ (для отправки разработчику)
// ============================================================

function downloadLog() {
    const log = getLog();
    const blob = new Blob([log], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}