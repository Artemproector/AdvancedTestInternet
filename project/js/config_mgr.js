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
const presetNames = {
    'base': 'Базовая',
    'exp': 'Экспресс',
    'kat': 'Только категории',
    'pls': 'Расширенная',
    'usr': 'Пользовательская'
};
let currentPreset = 'base';
let currentblock = 'block1'
function applyPreset(presetName) {
    if (!PRESETS[presetName]) {
        console.warn(`конфиг "${presetName}" не найден`);
        return;
    }

    currentPreset = presetName;
    CONFIG = {
        ...CFG_common,
        ...PRESETS[presetName]
    };
    localStorage.setItem("CFG", presetName);
    console.log(`Конфиг ${presetName}`);
    return CONFIG;
}
function selectCFG(presetName) {
    applyPreset(presetName);
    loadDescConfigs()
    updateConnectionInfo()
    updateVisibilityByPreset()
}
function loadDescConfigs() {
    return CONFIG.description
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
    console.log(`${number}`);
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
let localblock = localStorage.getItem("block");
if (localblock) {
    selectblocking(localblock);
}
else {
    selectblocking('block1');
}