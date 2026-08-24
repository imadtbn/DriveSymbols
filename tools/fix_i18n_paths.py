from pathlib import Path

root = Path('/home/ubuntu/DriveSymbols-git')
for page in root.rglob('*.html'):
    text = page.read_text(encoding='utf-8')
    if page.parent.name == 'pages':
        text = text.replace('src="js/i18n.js"', 'src="../js/i18n.js"')
    else:
        text = text.replace('src="../js/i18n.js"', 'src="js/i18n.js"')
    page.write_text(text, encoding='utf-8')
