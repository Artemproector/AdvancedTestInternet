// ============================================================
// ДИСПЛЕИ
// ============================================================

function updateDisplay(type, value = 0) {
    const dwnElements = document.querySelectorAll('.dwn');
    const upElements = document.querySelectorAll('.up');
    const pingElements = document.querySelectorAll('.ping');
    const modeElements = document.querySelectorAll('.mode');
    const level = Math.min(Math.max(Math.round(value), 0), 5);
    let elements = [];
    if (type === 'dwn') elements = dwnElements;
    else if (type === 'up') elements = upElements;
    else if (type === 'ping') elements = pingElements;
    else if (type === 'mode') elements = modeElements;
    else if (type === 'all') {
        updateDisplay('dwn', value);
        updateDisplay('up', value);
        updateDisplay('ping', value);
        updateDisplay('mode', value);
        return;
    } else {
        console.warn(`Неизвестный тип дисплея: ${type}`);
        return;
    }
    elements.forEach((el, index) => {
        const isActive = index >= (5 - level);
        el.classList.remove('show', 'hide', 'active', 'inactive');
        if (isActive) {
            el.classList.add('show');
        } else {
            el.classList.add('hide');
        }
    });
}

function getSpeedColor(speedMbps) {
    const { veryBad, bad, average, good } = CONFIG.speedColors;
    if (speedMbps < veryBad) {
        return { color: '#ff4757', level: 1 };
    } else if (speedMbps < bad) {
        return { color: '#ff6b35', level: 2 };
    } else if (speedMbps < average) {
        return { color: '#ffa502', level: 3 };
    } else if (speedMbps < good) {
        return { color: '#2ed573', level: 4 };
    } else {
        return { color: '#2ed573', level: 5 };
    }
}

function getPingColor(pingMs) {
    const { excellent, good, average, bad } = CONFIG.pingColors;
    if (pingMs < excellent) {
        return { color: '#2ed573', level: 5 };
    } else if (pingMs < good) {
        return { color: '#7bed9f', level: 4 };
    } else if (pingMs < average) {
        return { color: '#ffa502', level: 3 };
    } else if (pingMs < bad) {
        return { color: '#ff6b35', level: 2 };
    } else {
        return { color: '#ff4757', level: 1 };
    }
}
