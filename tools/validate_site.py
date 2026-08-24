import json
import re
from pathlib import Path
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

config = (ROOT / 'js/site-config.js').read_text(encoding='utf-8')
measurement_match = re.search(r"analyticsMeasurementId\s*:\s*['\"]([^'\"]*)['\"]", config)
if not measurement_match:
    errors.append('site-config.js is missing analyticsMeasurementId')
else:
    measurement_id = measurement_match.group(1)
    if measurement_id and not re.fullmatch(r'G-[A-Z0-9]+', measurement_id, flags=re.I):
        errors.append('analyticsMeasurementId must be empty or a valid G-XXXXXXXX value')
runtime_config = re.sub(r'//.*', '', config)
if re.search(r'G-X{3,}|G-XXXXXXXX|MEASUREMENT_ID|YOUR_', runtime_config + (ROOT / 'js/analytics.js').read_text(encoding='utf-8'), flags=re.I):
    errors.append('Analytics integration contains a placeholder Measurement ID')

html_files = sorted(ROOT.rglob('*.html'))
for page in html_files:
    text = page.read_text(encoding='utf-8')
    if page.name != 'article.html' and 'js/i18n.js' not in text:
        errors.append(f'Missing i18n script: {page}')

    script_sources = re.findall(r'<script[^>]+src=["\']([^"\']+)["\'][^>]*>', text, flags=re.I)
    for required in ('site-config.js', 'analytics.js'):
        count = sum(required in source for source in script_sources)
        if count != 1:
            errors.append(f'{page} must include exactly one {required} script (found {count})')

    ad_slot_tags = re.findall(r'<[^>]+class=["\'][^"\']*\bad-slot\b[^"\']*["\'][^>]*>', text, flags=re.I)
    has_ads = bool(ad_slot_tags)
    ads_script_count = text.count('js/ads.js')
    expected_ads_scripts = 1 if has_ads else 0
    if ads_script_count != expected_ads_scripts:
        errors.append(f'{page} must include {expected_ads_scripts} ads.js script(s) for its ad slots (found {ads_script_count})')
    if 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js' in text:
        errors.append(f'Raw AdSense loader must not be embedded in {page}')

    for tag in ad_slot_tags:
        disabled = re.search(r'data-ad-enabled=["\']false["\']', tag, flags=re.I)
        has_slot = re.search(r'data-ad-slot=["\'][^"\']+["\']', tag, flags=re.I)
        if not disabled and not has_slot:
            errors.append(f'Ad slot without data-ad-slot or disabled flag in {page}: {tag[:120]}')
    if page.name in {'privacy.html', 'terms.html'} and has_ads:
        errors.append(f'Legal page must not contain ad slots: {page}')

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
print('Site validation passed: JSON, sitemap, article images, integrations, ad slots, local assets, i18n scripts, and robots.txt.')
