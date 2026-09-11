const CFG_TIMEOUT_default = {
    TIMEOUT_description:'Стандартные настройки таймаутов.',
    TIMEOUT_speedtest: 5000,
    TIMEOUT_ping:3000,
    TIMEOUT_protocols:5000,
    TIMEOUT_quickCheck: 3000,
    TIMEOUT_default:5000
}
const CFG_TIMEOUT_extended = {
    TIMEOUT_description: 'Увеличенное время ожидания сайта. Полезно при плохом соединении: тест продлится дольше, но покажет более точный результат.',
    TIMEOUT_speedtest: 10000,
    TIMEOUT_ping: 7000,
    TIMEOUT_protocols: 10000,
    TIMEOUT_quickCheck: 7000,
    TIMEOUT_default: 10000
}
const CFG_TIMEOUT_infinity= {
    TIMEOUT_description: 'Бесконечное ожидание сайта.<br> <b>ВНИМАНИЕ!</b> Если вы не знаете, что делаете, лучше не включать этот режим.',
    TIMEOUT_speedtest: 999999,
    TIMEOUT_ping: 999999,
    TIMEOUT_protocols: 999999,
    TIMEOUT_quickCheck: 999999,
    TIMEOUT_default: 999999
}
const CFG_TIMEOUT_user = {
    TIMEOUT_description: 'Ручная настройка. Открыть меню настройки.',
}