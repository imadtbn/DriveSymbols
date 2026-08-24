import re
from pathlib import Path

root = Path('/home/ubuntu/DriveSymbols-git')
version = '1316866'
pattern = re.compile(r'((?:\.\./)?js/(?:app|search|i18n|article)\.js)\?v=[^\" ]+')
for page in root.rglob('*.html'):
    text = page.read_text(encoding='utf-8')
    updated = pattern.sub(r'\1?v=' + version, text)
    page.write_text(updated, encoding='utf-8')
print('Bumped frontend asset versions.')
