function generateShareImage(data) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 380;

    // ============================================================
    // 1. ФОН
    // ============================================================
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ============================================================
    // 2. ЗАГОЛОВОК
    // ============================================================
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Pliant, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Расширенный тест интернета', 40, 30);

    // Линия под заголовком
    ctx.fillStyle = '#2a3555';
    ctx.fillRect(40, 70, canvas.width - 80, 1);

    // ============================================================
    // 3. ДАТА И ВРЕМЯ
    // ============================================================
    ctx.fillStyle = '#8892b0';
    ctx.font = '14px Pliant, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(data.date || new Date().toLocaleString(), 40, 85);

    // ============================================================
    // 4. ТРИ КАРТОЧКИ (Режим сети, Пинг, Протоколы)
    // ============================================================
    const modeColors = {
        'Полный доступ': '#fff',
        'Белые списки': '#fff',
        'Черные списки': '#fff',
        'Нет интернета': '#fff',
        'VPN': '#fff',
        'Полная блокировка': '#fff',
        'Частичный доступ': '#fff'
    };

    const cardData = [
        {
            label: 'РЕЖИМ СЕТИ',
            value: data.mode || 'Неизвестно',
            unit: '',
            isMode: true
        },
        {
            label: 'ПИНГ',
            value: data.ping || '--',
            unit: 'мс'
        },
        {
            label: 'ПРОТОКОЛЫ',
            value: getProtocolsCount(data.protocols),
            unit: 'из 3'
        }
    ];

    let cardX = 40;
    const cardY = 120;
    const cardW = 220;
    const cardH = 120;
    const gap = 15;

    cardData.forEach((card, index) => {
        // Фон карточки
        ctx.fillStyle = '#1a2238';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 12);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Рамка
        ctx.strokeStyle = '#2a3555';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 12);
        ctx.stroke();

        if (card.isMode) {
            // Карточка режима сети — большой цветной текст
            const modeColor = modeColors[card.value] || '#8892b0';

            // Цветной текст режима
            ctx.fillStyle = modeColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 20px Pliant, sans-serif';
            ctx.fillText(card.value, cardX + cardW / 2, cardY + 55);

            // Подпись
            ctx.fillStyle = '#5a6a8a';
            ctx.font = '11px Pliant, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(card.label, cardX + cardW / 2, cardY + cardH - 8);
        } else {
            // Карточка пинга или протоколов
            // Значение
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 32px Pliant, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(card.value, cardX + cardW / 2, cardY + 50);

            // Единица измерения
            if (card.unit) {
                ctx.fillStyle = '#8892b0';
                ctx.font = '14px Pliant, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(card.unit, cardX + cardW / 2, cardY + 78);
            }

            // Подпись
            ctx.fillStyle = '#5a6a8a';
            ctx.font = '11px Pliant, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(card.label, cardX + cardW / 2, cardY + cardH - 8);
        }

        cardX += cardW + gap;
    });

    // ============================================================
    // 5. ТИП СЕТИ И ДЛИТЕЛЬНОСТЬ
    // ============================================================
    const networkLabels = {
        'wifi': 'Wi-Fi',
        'cellular': 'Мобильный интернет',
        'ethernet': 'Проводное',
        'bluetooth': 'Bluetooth',
        'none': 'Нет сети',
        'unknown': 'Неизвестно'
    };
    const networkText = networkLabels[data.network] || 'Неизвестно';

    ctx.fillStyle = '#bbbfca';
    ctx.font = '14px Pliant, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Тип сети: ' + networkText, 40, 255);

    ctx.textAlign = 'right';
    ctx.fillText('Длительность теста: '+(data.duration || '0') + ' сек', canvas.width - 40, 255);

    // ============================================================
    // 6. ПОДВАЛ
    // ============================================================
    const footerY = 290;
    ctx.fillStyle = '#2a3555';
    ctx.fillRect(40, footerY, canvas.width - 80, 1);

    ctx.fillStyle = '#8892b0';
    ctx.font = '13px Pliant, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Расширенный тест интернета', 40, footerY + 15);

    ctx.fillStyle = '#4facfe';
    ctx.font = '13px Pliant, sans-serif';
    ctx.fillText('github.com/Artemproector/AdvancedTestInternet', 40, footerY + 40);

    // ============================================================
    // 7. ВЕРСИЯ
    // ============================================================
    ctx.fillStyle = '#2a3555';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.font = '12px Pliant, sans-serif';
    ctx.fillText('Версия: ' + (CONFIG?.version), canvas.width - 40, footerY + 15);

    // ============================================================
    // 8. ВОЗВРАЩАЕМ КАРТИНКУ
    // ============================================================
    return canvas.toDataURL('image/png');
}
// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

function getProtocolsCount(protocols) {
    if (!protocols) return '0';
    const count = Object.values(protocols).filter(v => v === true).length;
    return count;
}

// ============================================================
// ФУНКЦИЯ ДЛЯ ОТПРАВКИ
// ============================================================

async function shareHistoryResult(shareData) {
    if (!shareData) {
        alert('Нет данных для отправки');
        return;
    }

    const data = {
        download: shareData.download || '--',
        upload: shareData.upload || '--',
        ping: shareData.ping || '--',
        mode: shareData.mode || 'Неизвестно',
        date: shareData.date || new Date().toLocaleString(),
        network: shareData.network || 'unknown',
        protocols: shareData.protocols || { dns: false, http: false, https: false },
        duration: shareData.duration || '0'
    };

    const imageDataUrl = generateShareImage(data);

    if (navigator.share) {
        try {
            const response = await fetch(imageDataUrl);
            const blob = await response.blob();
            const file = new File([blob], 'test_result.png', { type: 'image/png' });
            await navigator.share({
                title: 'Расширенный тест интернета',
                text: 'Мой результат теста интернета! А какой у тебя? Скачай "Расширенный тест интернета" на GitHub!',
                files: [file]
            });
        } catch (err) {
            console.log('Поделиться не удалось:', err);
        }
    } else {
        const link = document.createElement('a');
        link.download = 'test_result.png';
        link.href = imageDataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert('Картинка сохранена!');
    }
}
function getProtocolsStatus() {
    const items = document.querySelectorAll('.proto-test');
    if (items.length === 0) {
        return { dns: false, http: false, https: false };
    }
    return {
        dns: items[0]?.style.color === '#2ed573' || false,
        http: items[1]?.style.color === '#2ed573' || false,
        https: items[2]?.style.color === '#2ed573' || false
    };
}
function copyResult(shareData) {
    // Если передали строку — парсим
    if (typeof shareData === 'string') {
        try {
            shareData = JSON.parse(shareData);
        } catch (e) {
            console.error('Ошибка парсинга данных:', e);
            alert('Не удалось скопировать результат');
            return;
        }
    }

    // Формируем простой текст
    const networkLabels = {
        'wifi': 'Wi-Fi',
        'cellular': 'Мобильный интернет',
        'ethernet': 'Проводное',
        'bluetooth': 'Bluetooth',
        'none': 'Нет сети',
        'unknown': 'Неизвестно'
    };

    const networkText = networkLabels[shareData.network] || 'Неизвестно';
    const protocolsCount = getProtocolsCount(shareData.protocols);

    const resultText = `${shareData.date || new Date().toLocaleString()} ${shareData.mode || 'Неизвестно'}
Входящая: ${shareData.download || '--'} Мбит/с
Пинг: ${shareData.ping || '--'} мс
Режим сети: ${shareData.mode || 'Неизвестно'}
Длительность: ${shareData.duration || '0'} сек
Протоколы: ${protocolsCount}/3
Тип соединения: ${networkText}`;

    // Копируем в буфер обмена
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(resultText)
            .then(() => {
                alert('Успешно!');
            })
            .catch(() => {
                fallbackCopy(resultText);
            });
    } else {
        fallbackCopy(resultText);
    }
}

// ============================================================
// FALLBACK КОПИРОВАНИЕ (для старых браузеров)
// ============================================================

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);

    try {
        textarea.select();
        document.execCommand('copy');
        alert('Успешно!');
    } catch (e) {
        alert('Не удалось скопировать результат.');
    } finally {
        document.body.removeChild(textarea);
    }
}

// ============================================================
// КОЛИЧЕСТВО ПРОТОКОЛОВ
// ============================================================

function getProtocolsCount(protocols) {
    if (!protocols) return 0;
    return Object.values(protocols).filter(v => v === true).length;
}