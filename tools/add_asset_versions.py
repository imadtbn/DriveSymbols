from pathlib import Path

root = Path('/home/ubuntu/DriveSymbols-git')
version = '3718650'
assets = ('app.js', 'search.js', 'i18n.js', 'article.js')
for page in root.rglob('*.html'):
    text = page.read_text(encoding='utf-8')
    for asset in assets:
        text = text.replace(f'src="js/{asset}"', f'src="js/{asset}?v={version}"')
        text = text.replace(f'src="../js/{asset}"', f'src="../js/{asset}?v={version}"')
    page.write_text(text, encoding='utf-8')
print('Versioned site JavaScript assets.')
