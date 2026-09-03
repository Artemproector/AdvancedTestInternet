import os
import re
from pathlib import Path

# ============================================================
# НАСТРОЙКИ
# ============================================================

PROJECT_DIR = Path(__file__).parent
HTML_SOURCE = PROJECT_DIR / 'project' / 'index.html'
OUTPUT_FILE = PROJECT_DIR / 'dist' / 'index.html'
CSS_DIR = PROJECT_DIR / 'project' / 'css'
JS_DIR = PROJECT_DIR / 'project' / 'js'

# ============================================================
# ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
# ============================================================

def read_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f'Ошибка чтения {filepath}: {e}')
        return None

def get_js_files():
    """Возвращает все JS-файлы из папки js и подпапок"""
    if not JS_DIR.exists():
        return []
    
    all_files = list(JS_DIR.glob('**/*.js'))
    
    def get_priority(path):
        name = path.name
        rel_path = str(path.relative_to(JS_DIR)).replace('\\', '/')
        
        # Конфиги
        if name.startswith('CFG_'):
            cfg_order = {
                'CFG_user.js': 0,
                'CFG_default.js': 1,
                'CFG_common.js': 2,
                'CFG_express.js': 3,
                'CFG_categoryOnly.js': 4,
                'CFG_plus.js': 5,
            }
            if name in cfg_order:
                return cfg_order[name]
            return 10
        
        # Дизайны
        if name.startswith('DSGN_'):
            return 20
        
        # Менеджеры
        if name == 'config_mgr.js':
            return 50
        if name == 'design_mgr.js':
            return 51        
        if name == 'confirm_mgr.js':
            return 52
        
        # UI и скрипты
        if name == 'UI.js':
            return 60        
        if name == 'wiki.js':
            return 61
        if name == 'history.js':
            return 62
        if name == '__dev.logger.js':
            return 63
        if name == 'script.js':
            return 70
        
        return 80
    
    return sorted(all_files, key=get_priority)

def get_css_files():
    """Возвращает все CSS-файлы из папки css и подпапок"""
    if not CSS_DIR.exists():
        return []
    
    all_files = list(CSS_DIR.glob('**/*.css'))
    
    def sort_key(path):
        name = path.name
        # Основные стили
        if name == '01style.css':
            return 0
        if name == 'animation.css':
            return 1
        if name == 'phone.css':
            return 2
        if name == 'dark.css':
            return 3
        if name == 'scale.css':
            return 4
        # Дизайны
        if name.startswith('DSGN_'):
            return 10
        # Остальные по алфавиту
        return 99
    
    return sorted(all_files, key=sort_key)

# ============================================================
# ФУНКЦИИ СБОРКИ
# ============================================================

def embed_js(html_content):
    pattern = r'<script\s+src=["\']([^"\']+)["\']\s*>(?:</script>)?'
    
    def replace(match):
        js_path = match.group(1)
        if js_path.startswith('http://') or js_path.startswith('https://'):
            return match.group(0)
        
        full_path = JS_DIR / js_path
        if not full_path.exists():
            alt_path = PROJECT_DIR / js_path
            if alt_path.exists():
                full_path = alt_path
            else:
                print(f'Файл JS не найден: {js_path}')
                return match.group(0)
        
        js_content = read_file(full_path)
        if js_content is None:
            return match.group(0)
        
        return f'<script>\n/* {js_path} */\n{js_content}\n</script>'
    
    return re.sub(pattern, replace, html_content, flags=re.IGNORECASE)

def embed_all_css(html_content):
    css_files = get_css_files()
    if not css_files:
        return html_content
    
    style_block = '<style>\n/* ===== CSS FILES ===== */\n'
    for css_file in css_files:
        rel_path = str(css_file.relative_to(CSS_DIR)).replace('\\', '/')
        css_content = read_file(css_file)
        if css_content:
            style_block += f'\n/* ----- project/css/{rel_path} ----- */\n{css_content}\n'
    style_block += '\n</style>\n'
    
    return html_content.replace('</head>', f'{style_block}</head>')

def embed_all_js(html_content):
    js_files = get_js_files()
    if not js_files:
        return html_content
    
    script_block = '<script>\n/* ===== JS FILES ===== */\n'
    for js_file in js_files:
        rel_path = str(js_file.relative_to(JS_DIR)).replace('\\', '/')
        js_content = read_file(js_file)
        if js_content:
            script_block += f'\n/* ----- project/js/{rel_path} ----- */\n{js_content}\n'
    script_block += '\n</script>\n'
    
    return html_content.replace('</body>', f'{script_block}</body>')

# ============================================================
# СБОРКА
# ============================================================

def build():
    print('Начинаем сборку проекта...')
    
    if not HTML_SOURCE.exists():
        print(f'Файл {HTML_SOURCE} не найден!')
        return
    
    html_content = read_file(HTML_SOURCE)
    if html_content is None:
        return
    html_content = embed_js(html_content)
    print('Встраиваем все CSS-файлы...')
    html_content = embed_all_css(html_content)
    print('Встраиваем все JS-файлы...')
    html_content = embed_all_js(html_content)
    
    output_dir = OUTPUT_FILE.parent
    output_dir.mkdir(parents=True, exist_ok=True)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f'Сборка завершена! Результат: {OUTPUT_FILE}')
    print(f'Размер: {OUTPUT_FILE.stat().st_size / 1024:.1f} КБ')

if __name__ == '__main__':
    build()