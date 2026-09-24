// ============================================================
// МЕНЕДЖЕР КОНФИГУРАЦИЙ
// ============================================================
const PRESETS = {
    base: CFG_default,
    exp: CFG_express,
    kat: CFG_kategoryOnly,
    pls: CFG_plus,
    usr: CFG_usr,
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
async function applyPreset(presetName) {
    if (presetName === 'usr') {
        currentPreset = 'usr';
        localStorage.setItem('CFG', 'usr');
        const savedUsr = JSON.parse(localStorage.getItem('LOCAL_CFG_USR') || 'null');

        if (savedUsr) {
            CONFIG = {
                ...CFG_common,
                ...PRESETS['usr'],
                ...savedUsr,
                ...TIMEOUT[currentTime]
            };
            showcategories()
            updateConnectionInfo();
            updateVisibilityByPreset();
            return CONFIG;
        } else {
            // Пользовательского конфига ещё нет — открываем редактор
            await startAddingConfig();
            return null;
        }
    }

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
    localStorage.setItem('CFG', presetName);

    showcategories()
    updateConnectionInfo();
    updateVisibilityByPreset();
    return CONFIG;
}

async function startAddingConfig() {
    let cfg_ui = `<form action='#' class="cgf_editor">
    <p class='save_status'></p>
    <button type='submit' class='end-button'>Cохранить</button>
    <!-- ИМПОРТ ИЗ КАТЕГОРИИЙ -->
    <div class="categories_edit">
        <div class="addCat_link" onclick="addCategoryUI()">Добавить категорию</div></div>
    </form>`
    showWindow(false, "Создание конфига", cfg_ui, true)
}
function dataProcessing() {
    const categoriesEdit = document.querySelector('.categories_edit');
    //const statusEl = document.querySelector('.save_status');
    if (!categoriesEdit) return null;

    const categories = {};
    const errors = [];

    // Проходимся по всем категориям в редакторе
    const categoryBlocks = categoriesEdit.querySelectorAll('.category_edit');

    categoryBlocks.forEach((block, index) => {
        const catId = block.id || `cat${index + 1}`;
        const shortName = catId

        // Название
        const nameInput = block.querySelector('input[type="text"]');
        const name = nameInput ? nameInput.value.trim() : '';

        // Описание — второй text-input
        const textInputs = block.querySelectorAll('input[type="text"]');
        const description = textInputs[1] ? textInputs[1].value.trim() : '';

        // Домены
        const domainInputs = block.querySelectorAll('input[type="url"]');
        const sites = [];
        const shortDomains = [];

        domainInputs.forEach(input => {
            const val = input.value.trim();
            if (val) {
                sites.push(val);
                // shortDomains — например, домен без протокола
                shortDomains.push(extractDomain(val));
            }
        });

        // Валидация
        if (!name) {
            errors.push(`Категория #${index + 1}: не указано название`);
        }
        if (sites.length === 0) {
            errors.push(`Категория "${name || '#' + (index + 1)}": не указано ни одного адреса`);
        }

        categories[shortName] = {
            name: name,
            description: description,
            shortName: shortName,
            sites: sites,
            shortDomains: shortDomains
        };
    });

    // Показать статус
    if (errors.length > 0) {
        notifyError(errors.join(' / '))
        return null;
    } else {
        notifySuccess('Сохранено!',2500)
    }
    const result = {
        description: 'Пользовательская настройка.<div onclick="startAddingConfig()">Открыть настройку</div>',
        categories: categories,
        speedTest: {
            download: 'https://0.0.0.0/',
            upload: 'https://0.0.0.0/',
            uploadSize: 1 * 1024 * 1024,
            attempts: 3
        },
        ping: {
            url: 'https://web.max.ru/favicon.png?v=2026',
            attempts: 5
        },
        protocols: {
            dns: {
                url: 'https://cloudflare-dns.com/dns-query',
                domain: 'cloudflare.com',
            },
            http: {
                url: 'http://www.microsoft.com/favicon.ico',
            },
            https: {
                urls: [
                    'https://www.microsoft.com/favicon.ico'
                ]
            }
        }
    };
    localStorage.setItem("LOCAL_CFG_USR", JSON.stringify(result));
    applyPreset("usr")
    selectblocking('block2');
}
// ============================================================
// ВСПОМОГАТЕЛЬНАЯ — вытащить домен из URL
// ============================================================
function extractDomain(url) {
    try {
        const u = new URL(url);
        return u.hostname;
    } catch (e) {
        // Если невалидный URL — вернём как есть
        return url;
    }
}
// ============================================================
// ДОБАВЛЕНИЕ АДРЕСА В КАТЕГОРИЮ
// ============================================================
function addDomainUI(catId) {
    const categoryEl = document.getElementById(`cat${catId}`);
    if (!categoryEl) return;
    const domainList = categoryEl.querySelector('.domain_list');
    const addDomainBtn = categoryEl.querySelector('.addDom_link');
    if (!domainList || !addDomainBtn) return;
    const existingDomains = domainList.querySelectorAll('input[type="url"]');
    const newIndex = existingDomains.length + 1;
    const li = document.createElement('li');
    const input = document.createElement('input');
    input.type = 'url';
    input.id = `domain-${catId}-${newIndex}`;
    input.name = `domain-${catId}-${newIndex}`;
    input.placeholder = 'Адрес*';
    input.required = true;
    li.appendChild(input);
    domainList.appendChild(li);
    addDomainBtn.setAttribute('onclick', `addDomainUI(${catId})`);
}

// ============================================================
// ДОБАВЛЕНИЕ КАТЕГОРИИ
// ============================================================
function addCategoryUI() {
    const categoriesEdit = document.querySelector('.categories_edit');
    const addCatBtn = categoriesEdit.querySelector('.addCat_link');
    if (!categoriesEdit || !addCatBtn) return;
    const existingCategories = categoriesEdit.querySelectorAll('.category_edit');
    const newCatId = existingCategories.length + 1;
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category_edit';
    categoryDiv.id = `cat${newCatId}`;
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = `name-${newCatId}`;
    nameInput.name = `name-${newCatId}`;
    nameInput.placeholder = 'Название*';
    nameInput.required = true;
    categoryDiv.appendChild(nameInput);
    const descInput = document.createElement('input');
    descInput.type = 'text';
    descInput.id = `description-${newCatId}`;
    descInput.name = `description-${newCatId}`;
    descInput.placeholder = 'Краткое описание';
    categoryDiv.appendChild(descInput);
    const label = document.createElement('p');
    label.textContent = 'Адреса:';
    categoryDiv.appendChild(label);
    const domainList = document.createElement('ol');
    domainList.className = 'domain_list';
    const firstLi = document.createElement('li');
    const firstDomainInput = document.createElement('input');
    firstDomainInput.type = 'url';
    firstDomainInput.id = `domain-${newCatId}-1`;
    firstDomainInput.name = `domain-${newCatId}-1`;
    firstDomainInput.placeholder = 'Адрес*';
    firstDomainInput.required = true;
    firstLi.appendChild(firstDomainInput);
    domainList.appendChild(firstLi);
    categoryDiv.appendChild(domainList);
    const addDomLink = document.createElement('div');
    addDomLink.className = 'addDom_link';
    addDomLink.textContent = 'Добавить адрес';
    addDomLink.addEventListener('click', () => addDomainUI(newCatId));
    categoryDiv.appendChild(addDomLink);
    categoriesEdit.insertBefore(categoryDiv, addCatBtn);
    addCatBtn.setAttribute('onclick', 'addCategoryUI()');
    let cgf_editor = document.querySelector('.cgf_editor');
    cgf_editor.addEventListener('submit', (e) => {
        e.preventDefault()
        dataProcessing()
    })
}
function selectCFG(presetName) {
    applyPreset(presetName);
    loadDescConfigs()
    updateConnectionInfo()
    updateVisibilityByPreset()
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
}
function selectDSGN(dsgnID) {
    let displays = document.querySelector('.styles_wrapper');
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
}
function applyUI(key) {
    // Мапа: ключ из data-dsgn → поле в CONFIG и элемент в DOM
    const uiMap = {
        'summ': { field: 'DYN_summary', selector: '.phonesummary' },
        'prBar': { field: 'DYN_prBar', selector: '.progress-bar' },
        'tmBar': { field: 'DYN_tmBar', selector: '.timer-bar' },
        'cat': { field: 'DYN_categories', selector: '.categories' }
    };

    const item = uiMap[key];
    if (!item) return;

    // Переключаем флаг
    CONFIG[item.field] = !CONFIG[item.field];

    // Сохраняем в localStorage
    localStorage.setItem(item.field, CONFIG[item.field] ? 'true' : 'false');

    // Применяем к DOM
    const el = document.querySelector(item.selector);
    if (el) {
        if (CONFIG[item.field]) {
            el.style.display = '';
            el.style.visibility = 'visible';
            el.style.width = '';
            el.style.height = '';
        } else {
            el.style.display = 'none';
        }
    }
}