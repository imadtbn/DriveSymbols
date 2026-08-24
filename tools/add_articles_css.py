from pathlib import Path

root = Path('/home/ubuntu/DriveSymbols-git')
for page in root.rglob('*.html'):
    text = page.read_text(encoding='utf-8')
    if 'articles.css' in text:
        continue
    prefix = '../' if page.parent.name == 'pages' else ''
    marker = '  <link rel="stylesheet" href="css/ads.css">'
    replacement = marker + f'\n  <link rel="stylesheet" href="{prefix}css/articles.css">'
    if marker not in text:
        marker = '</head>'
        replacement = f'  <link rel="stylesheet" href="{prefix}css/articles.css">\n' + marker
    text = text.replace(marker, replacement, 1)
    page.write_text(text, encoding='utf-8')
    print(page)
