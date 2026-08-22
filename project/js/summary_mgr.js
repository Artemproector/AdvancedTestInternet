// ============================================================
// ГИСТОГРАММА НАДЁЖНОСТИ ПО ЧАСАМ
// ============================================================

function buildChart() {
    const history = getTodayHistory();

    // 1. Инициализируем массив для 24 часов
    const hourlyData = Array.from({ length: 24 }, () => ({
        total: 0,
        success: 0,
        count: 0
    }));

    // 2. Заполняем данными из истории
    history.forEach(item => {
        const ts = item.timestamp || new Date(item.date).getTime();
        const hour = new Date(ts).getHours();

        hourlyData[hour].count++;
        hourlyData[hour].total++;

        // Определяем, успешен ли тест
        const isSuccess = item.success !== false && item.mode !== 'Нет интернета';
        if (isSuccess) {
            hourlyData[hour].success++;
        }
    });

    // 3. Вычисляем надёжность для каждого часа (в процентах)
    const reliabilityByHour = hourlyData.map(hour => {
        if (hour.count === 0) return null; // Нет данных
        return Math.round((hour.success / hour.total) * 100);
    });

    // 4. Строим HTML
    let html = `<div class='chart_area'>`;

    for (let i = 0; i < 24; i++) {
        const reliability = reliabilityByHour[i];
        const height = reliability !== null ? reliability : 0; // 0–100%
        const hasData = reliability !== null;

        html += `
            <div class='chart_hour_data hour_${i}' 
                 data-hour="${i}" 
                 data-reliability="${reliability !== null ? reliability : 'Нет данных'}"
                 style="height: ${height}%; ${!hasData ? 'opacity: 0.3;' : ''}">
                ${hasData ? `<span class="chart_value">${reliability}%</span>` : ''}
            </div>
        `;
    }

    html += `</div>`;
    return html;
}

function buildSummaryContent() {
    return buildChart();
}