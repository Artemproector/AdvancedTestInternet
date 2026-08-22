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
// ИНИЦИАЛИЗАЦИЯ
// ============================================================
let localCFG = localStorage.getItem("CFG");
if (localCFG) {
    applyPreset(localCFG);
}
else {
    applyPreset('base');
}