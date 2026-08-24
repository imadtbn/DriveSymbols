import json
import re
from pathlib import Path
from urllib.parse import urlparse
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
errors = []

for path in (ROOT / 'data').glob('*.json'):
    try:
        json.loads(path.read_text(encoding='utf-8'))
    except Exception as exc:
        errors.append(f'Invalid JSON {path}: {exc}')

try:
    sitemap = ElementTree.parse(ROOT / 'sitemap.xml')
    locs = [node.text for node in sitemap.iter() if node.tag.endswith('}loc')]
    if len(locs) != 43:
        errors.append(f'Expected 43 sitemap URLs, found {len(locs)}')
    if any(not value.startswith('https://imadtbn.github.io/DriveSymbols/') for value in locs):
        errors.append('Sitemap contains a URL outside the deployed base path')
except Exception as exc:
    errors.append(f'Invalid sitemap.xml: {exc}')

articles = json.loads((ROOT / 'data/articles.json').read_text(encoding='utf-8'))
for article in articles:
    image = ROOT / article['image']
    if not image.exists():
        errors.append(f'Missing article image: {article["image"]}')
    for lang in ('Ar', 'En'):
        for field in (f'title{lang}', f'excerpt{lang}', f'alt{lang}'):
            if not article.get(field):
                errors.append(f'Missing {field} in {article["slug"]}')

for page in ROOT.rglob('*.html'):
    text = page.read_text(encoding='utf-8')
    if page.name != 'article.html' and 'js/i18n.js' not in text:
        errors.append(f'Missing i18n script: {page}')
    for src in re.findall(r'(?:src|href)="([^"]+)"', text):
        if src.startswith(('http://', 'https://', '#', 'mailto:', 'tel:')):
            continue
        clean = src.split('?', 1)[0].split('#', 1)[0]
        if not clean or clean.startswith('data:'):
            continue
        target = (page.parent / clean).resolve()
        if target.suffix in ('.css', '.js', '.json', '.jpg', '.png', '.webp', '.svg') and not target.exists():
            errors.append(f'Missing local asset {src} referenced by {page}')

robots = (ROOT / 'robots.txt').read_text(encoding='utf-8')
if 'Sitemap: https://imadtbn.github.io/DriveSymbols/sitemap.xml' not in robots:
    errors.append('robots.txt does not point to the deployed sitemap')

if errors:
    raise SystemExit('\n'.join(errors))
print('Site validation passed: JSON, sitemap, article images, local assets, i18n scripts, and robots.txt.')
