// ============================================================
// МЕНЕДЖЕР КОНФИГУРАЦИЙ
// ============================================================
const PRESETS = {
    base: CFG_default,
    exp: CFG_express,
    kat: CFG_kategoryOnly,
    pls: CFG_plus,
    usr: CFG_user,
};
const TIMEOUT = {
    'tmout1': CFG_TIMEOUT_default,
    'tmout2': CFG_TIMEOUT_extended,
    'tmout3': CFG_TIMEOUT_infinity,
    'tmout4': CFG_TIMEOUT_user
}
const presetNames = {
    'base': 'Базовая',
    'exp': 'Экспресс',
    'kat': 'Только категории',
    'pls': 'Расширенная',
    'usr': 'Пользовательская'
};
let currentPreset = 'base';
let currentblock = 'block1';
let currentTime = 'tmout1';
function applyPreset(presetName) {
    if (!PRESETS[presetName]) {
        console.warn(`конфиг "${presetName}" не найден`);
        return;
    }

    currentPreset = presetName;
    CONFIG = {
        ...CFG_common,
        ...PRESETS[presetName],
        ...TIMEOUT[currentTime]
    };
    localStorage.setItem("CFG", presetName);
    return CONFIG;
}
function selectCFG(presetName) {
    applyPreset(presetName);
    loadDescConfigs()
    updateConnectionInfo()
    updateVisibilityByPreset()
    consoleAllSettings()
}
function loadDescConfigs() {
    return CONFIG.description
} function loadDescTimeout() {
    return CONFIG.TIMEOUT_description
}
function applyTimeout(presetName) {
    if (!TIMEOUT[presetName]) {
        console.warn(`таймаут "${presetName}" не найден`);
        return;
    }
    currentTime = presetName;
    localStorage.setItem("timeout", presetName);
    consoleAllSettings()
    applyPreset(currentPreset)
}
// ============================================================
// СООТВЕТСТВИЕ РЕЖИМОВ И ИНДЕКСОВ ДЛЯ БЛОКИРОВОК
// ============================================================
const BLOCKING_MAP = {
    'total': 3,
    'full': 4,
    'vpn': 5,
    'whitelist_2OK': 0,
    'whitelist_1OK': 1,
    'blacklist_OK': 2,
    'error': 6
};

const BLOCKING_LISTS = {
    'block1': block1,
    'block2': block2,
    'block3': block3
};

function getBlockingText(modeKey) {
    const list = BLOCKING_LISTS[currentblock] || block1;
    const index = BLOCKING_MAP[modeKey] !== undefined ? BLOCKING_MAP[modeKey] : 0;
    return list[index] || 'Неизвестно';
}
function selectblocking(number) {
    currentblock = number
    localStorage.setItem("block", number);
    consoleAllSettings()
}
function consoleAllSettings() {
    let localtheme = localStorage.getItem("theme");
    let localtimeout = localStorage.getItem("timeout");
    let localblock = localStorage.getItem("block");
    let localCFG = localStorage.getItem("CFG");
    console.log("=================================");
    console.log("ТЕКУЩИЕ НАСТРОЙКИ:");
    console.log(`Пресет:${currentPreset}`);
    console.log(`Блок:${currentblock}`);
    console.log(`Таймаут:${currentTime}`);
    console.log(`Дизайн:${currentdsgn}`);
    console.log("ЛОКАЛЬНЫЕ НАСТРОЙКИ:");
    console.log(`Пресет:${localCFG}`);
    console.log(`Блок:${localblock}`);
    console.log(`Таймаут:${localtimeout}`);
    console.log(`Дизайн:${localtheme}`);
    console.log("=================================");
}
function selectDSGN(dsgnID) {
    if (dsgnID == 'dsgn2') {
        displays.innerHTML = DSGN2_html
        localStorage.setItem("theme", dsgnID);
        currentdsgn = 'dsgn2'
    }
    else {
        if (dsgnID == 'dsgn3') {
            displays.innerHTML = DSGN3_html
            localStorage.setItem("theme", dsgnID);
            currentdsgn = 'dsgn3'
        }
        else {
            displays.innerHTML = DSGN1_html
            localStorage.setItem("theme", dsgnID);
            currentdsgn = 'dsgn1'
        }
    }
    updateVisibilityByPreset()
}
// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================
let localCFG = localStorage.getItem("CFG");
if (localCFG) {
    applyPreset(localCFG);
}
else {
    applyPreset('base');
}
// ============================================================
let localblock = localStorage.getItem("block");
if (localblock) {
    selectblocking(localblock);
}
else {
    selectblocking('block1');
}
// ============================================================
let localtimeout = localStorage.getItem("timeout");
if (localtimeout) {
    applyTimeout(localtimeout);
}
else {
    applyTimeout('tmout1');
}
// ============================================================
let localtheme = localStorage.getItem("theme");
if (localtheme) {
    selectDSGN(localtheme);
}
else {
    selectDSGN('dsgn1');
}
consoleAllSettings()