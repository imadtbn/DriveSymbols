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

loader_path = ROOT / 'js/site-tags.js'
if not loader_path.is_file():
    errors.append('Missing central loader: js/site-tags.js')
    loader = ''
else:
    loader = loader_path.read_text(encoding='utf-8')

config_patterns = {
    'siteVerification': r"siteVerification\s*:\s*['\"]([^'\"]*)['\"]",
    'gtmId': r"gtmId\s*:\s*['\"]([^'\"]*)['\"]",
    'ga4Id': r"ga4Id\s*:\s*['\"]([^'\"]*)['\"]",
    'ga4Mode': r"ga4Mode\s*:\s*['\"]([^'\"]*)['\"]",
    'clarityId': r"clarityId\s*:\s*['\"]([^'\"]*)['\"]",
    'adsenseClient': r"adsenseClient\s*:\s*['\"]([^'\"]*)['\"]",
}
values = {}
for key, pattern in config_patterns.items():
    match = re.search(pattern, loader)
    if not match:
        errors.append(f'Central loader is missing {key}')
    else:
        values[key] = match.group(1)

allowed = {
    'siteVerification': lambda value: bool(re.fullmatch(r'[A-Za-z0-9_-]{20,100}', value)),
    'gtmId': lambda value: bool(re.fullmatch(r'xxxxxxxx|GTM-[A-Z0-9]+', value, flags=re.I)),
    'ga4Id': lambda value: bool(re.fullmatch(r'xxxxxxxx|G-[A-Z0-9]+', value, flags=re.I)),
    'ga4Mode': lambda value: value in ('gtm', 'direct'),
    'clarityId': lambda value: bool(re.fullmatch(r'xxxxxxxx|[a-z0-9]{6,32}', value, flags=re.I)),
    'adsenseClient': lambda value: bool(re.fullmatch(r'xxxxxxxx|ca-pub-\d+', value, flags=re.I)),
}
for key, value in values.items():
    if not allowed[key](value):
        errors.append(f'{key} must be a valid ID or xxxxxxxx (found {value!r})')

runtime_loader = re.sub(r'//.*', '', loader)
ga4_mode = values.get('ga4Mode')
if ga4_mode == 'gtm' and re.search(r"gtag\s*\(\s*['\"]config|googletagmanager\.com/gtag/js", runtime_loader, flags=re.I):
    errors.append('GA4 GTM mode must not configure GA4 with direct gtag.js')
if ga4_mode == 'direct' and not re.search(r"gtag\s*\(\s*['\"]config|googletagmanager\.com/gtag/js", runtime_loader, flags=re.I):
    errors.append('GA4 direct mode must include one direct Google tag configuration')

# Google/Yandex ownership files are verification documents, not site pages.
html_files = sorted(
    path for path in ROOT.rglob('*.html')
    if not path.name.lower().startswith(('google', 'yandex_'))
)
for page in html_files:
    text = page.read_text(encoding='utf-8')
    lower = text.lower()
    if page.name != 'article.html' and 'js/i18n.js' not in text:
        errors.append(f'Missing i18n script: {page}')

    verification_tags = re.findall(r'<meta[^>]+name=["\']google-site-verification["\'][^>]*>', text, flags=re.I)
    if len(verification_tags) != 1:
        errors.append(f'{page} must include exactly one Google Site Verification meta tag (found {len(verification_tags)})')
    elif values.get('siteVerification') and values['siteVerification'] not in verification_tags[0]:
        errors.append(f'{page} Google Site Verification meta does not match central config')

    noscript_count = text.count('data-site-tag="gtm-noscript"')
    if valid_gtm := bool(values.get('gtmId')) and not values['gtmId'].lower().startswith('x'):
        if noscript_count != 1:
            errors.append(f'{page} must include exactly one GTM noscript when GTM is configured (found {noscript_count})')

    script_sources = re.findall(r'<script[^>]+src=["\']([^"\']+)["\'][^>]*>', text, flags=re.I)
    loader_count = sum('site-tags.js' in source for source in script_sources)
    if loader_count != 1:
        errors.append(f'{page} must include exactly one central site-tags.js loader (found {loader_count})')
    for old in ('site-config.js', 'analytics.js', 'ads.js'):
        if any(old in source for source in script_sources):
            errors.append(f'Legacy integration script remains in {page}: {old}')

    direct_sources = ('googletagmanager.com/gtm.js', 'googletagmanager.com/gtag/js', 'clarity.ms/tag/', 'pagead2.googlesyndication.com')
    found_direct = [source for source in direct_sources if source in lower]
    if found_direct:
        errors.append(f'Direct external integration loader remains in {page}: {", ".join(found_direct)}')

    ad_tags = re.findall(r'<ins\b[^>]*class=["\'][^"\']*\badsbygoogle\b[^"\']*["\'][^>]*>', text, flags=re.I)
    if ad_tags:
        css_prefix = '../' if page.parent.name == 'pages' else ''
        if f'{css_prefix}css/ads.css' not in text:
            errors.append(f'{page} contains AdSense units but does not load css/ads.css')
        for tag in ad_tags:
            for attr in ('data-ad-client', 'data-ad-slot', 'data-ad-format'):
                if not re.search(rf'{attr}=["\'][^"\']+["\']', tag, flags=re.I):
                    errors.append(f'{page} AdSense unit missing {attr}')
    if any(term in lower for term in ('google-adsense-account', 'ca-pub-') ) and not ad_tags:
        errors.append(f'{page} contains an AdSense publisher reference without an ad unit')

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
print('Site validation passed: JSON, sitemap, article images, central tags loader, site verification, GTM noscript, configured IDs, AdSense units, local assets, i18n scripts, robots.txt, and documented verification-file exclusions.')
