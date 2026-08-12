import os
import re
from pathlib import Path

# ============================================================
# НАСТРОЙКИ
# ============================================================

PROJECT_DIR = Path(__file__).parent
HTML_SOURCE = PROJECT_DIR / 'project' / 'index.html'  # ✅ ИСПРАВЛЕНО: index.html в папке project
OUTPUT_FILE = PROJECT_DIR / 'dist' / 'index.html'
CSS_DIR = PROJECT_DIR / 'project' / 'css'             # ✅ ИСПРАВЛЕНО: папка css внутри project
JS_DIR = PROJECT_DIR / 'project' / 'js'               # ✅ ИСПРАВЛЕНО: папка js внутри project

# ============================================================
# ФУНКЦИИ
# ============================================================

def read_file(filepath):
    """Читает содержимое файла"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f'❌ Ошибка чтения {filepath}: {e}')
        return None

def get_all_files(directory, extensions):
    """Возвращает список всех файлов с указанными расширениями в папке и подпапках"""
    files = []
    if not directory.exists():
        return files
    for ext in extensions:
        files.extend(directory.glob(f'**/*.{ext}'))
    return sorted(files)

def embed_css(html_content):
    """Заменяет <link rel="stylesheet" href="..."> на <style>...</style>"""
    pattern = r'<link\s+rel=["\']stylesheet["\']\s+href=["\']([^"\']+)["\']\s*/?>'
    
    def replace(match):
        css_path = match.group(1)
        if css_path.startswith('http://') or css_path.startswith('https://'):
            return match.group(0)
        
        full_path = PROJECT_DIR / css_path
        if not full_path.exists():
            print(f'⚠️ Файл CSS не найден: {css_path}')
            return match.group(0)
        
        css_content = read_file(full_path)
        if css_content is None:
            return match.group(0)
        
        return f'<style>\n/* {css_path} */\n{css_content}\n</style>'
    
    return re.sub(pattern, replace, html_content, flags=re.IGNORECASE)

def embed_js(html_content):
    """Заменяет <script src="..."> на <script>...</script>"""
    pattern = r'<script\s+src=["\']([^"\']+)["\']\s*>(?:</script>)?'
    
    def replace(match):
        js_path = match.group(1)
        if js_path.startswith('http://') or js_path.startswith('https://'):
            return match.group(0)
        
        full_path = PROJECT_DIR / js_path
        if not full_path.exists():
            print(f'⚠️ Файл JS не найден: {js_path}')
            return match.group(0)
        
        js_content = read_file(full_path)
        if js_content is None:
            return match.group(0)
        
        return f'<script>\n/* {js_path} */\n{js_content}\n</script>'
    
    return re.sub(pattern, replace, html_content, flags=re.IGNORECASE)

def embed_all_css(html_content):
    """Встраивает все CSS-файлы из папки css в порядке загрузки"""
    css_files = get_all_files(CSS_DIR, ['css'])
    if not css_files:
        return html_content
    
    style_block = '<style>\n'
    for css_file in css_files:
        rel_path = css_file.relative_to(PROJECT_DIR)
        css_content = read_file(css_file)
        if css_content:
            style_block += f'/* {rel_path} */\n{css_content}\n\n'
    style_block += '</style>\n'
    
    return html_content.replace('</head>', f'{style_block}</head>')

def embed_all_js(html_content):
    """Встраивает все JS-файлы из папки js в порядке загрузки"""
    js_files = get_all_files(JS_DIR, ['js'])
    if not js_files:
        return html_content
    
    script_block = '<script>\n'
    for js_file in js_files:
        rel_path = js_file.relative_to(PROJECT_DIR)
        js_content = read_file(js_file)
        if js_content:
            script_block += f'/* {rel_path} */\n{js_content}\n\n'
    script_block += '</script>\n'
    
    return html_content.replace('</body>', f'{script_block}</body>')

def build():
    """Основная функция сборки"""
    print('🔨 Начинаем сборку проекта...')
    
    if not HTML_SOURCE.exists():
        print(f'❌ Файл {HTML_SOURCE} не найден!')
        print('   Убедитесь, что index.html лежит в папке project/')
        return
    
    html_content = read_file(HTML_SOURCE)
    if html_content is None:
        return
    
    html_content = embed_css(html_content)
    html_content = embed_js(html_content)
    html_content = embed_all_css(html_content)
    html_content = embed_all_js(html_content)
    
    output_dir = OUTPUT_FILE.parent
    output_dir.mkdir(parents=True, exist_ok=True)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f'✅ Сборка завершена! Результат: {OUTPUT_FILE}')
    print(f'   Размер: {OUTPUT_FILE.stat().st_size / 1024:.1f} КБ')

if __name__ == '__main__':
    build()
