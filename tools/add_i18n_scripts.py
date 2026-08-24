from pathlib import Path

root = Path('/home/ubuntu/DriveSymbols-git')
for page in root.rglob('*.html'):
    text = page.read_text(encoding='utf-8')
    if 'js/i18n.js' in text:
        continue
    marker = '</body>'
    if marker not in text:
        continue
    text = text.replace(marker, '  <script src="js/i18n.js"></script>\n' + marker, 1)
    page.write_text(text, encoding='utf-8')
    print(page)
