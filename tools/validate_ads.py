from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path('/home/ubuntu/DriveSymbols')
PAGES = sorted(ROOT.glob('*.html')) + sorted((ROOT / 'pages').glob('*.html'))
required_slots = {
    '7867079394', '3143411927', '8546947691', '1760836049',
    '6152718642', '5508509362', '6118497380', '7319898418', '6528123169'
}
errors = []
seen_slots = set()

for page in PAGES:
    html = page.read_text(encoding='utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    relative = page.parent.name == 'pages'
    prefix = '../' if relative else ''
    if not soup.find('link', href=f'{prefix}css/ads.css') and soup.select('[data-ad-slot]'):
        errors.append(f'{page}: missing ads.css')
    if soup.select('[data-ad-slot]') and not soup.find('script', src=f'{prefix}js/ads.js'):
        errors.append(f'{page}: missing ads.js')
    for container in soup.select('.ad-slot[data-ad-slot]'):
        slot = container.get('data-ad-slot')
        if slot not in required_slots:
            errors.append(f'{page}: unknown slot {slot}')
        if len(container.select(':scope > ins.adsbygoogle')) != 0:
            errors.append(f'{page}: adsbygoogle must be created by JS, not duplicated in HTML')
        if slot in seen_slots and page.name == 'index.html':
            errors.append(f'{page}: duplicate slot {slot}')
        if page.name == 'index.html':
            seen_slots.add(slot)

if not (ROOT / 'css/ads.css').is_file():
    errors.append('css/ads.css missing')
if not (ROOT / 'js/ads.js').is_file():
    errors.append('js/ads.js missing')

if errors:
    print('\n'.join(errors))
    raise SystemExit(1)

print(f'Validated {len(PAGES)} HTML pages and {len(seen_slots)} unique homepage slots.')
