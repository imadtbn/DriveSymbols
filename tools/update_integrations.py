from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.glob('*.html')) + sorted((ROOT / 'pages').glob('*.html'))
LEGAL_WITHOUT_ADS = {'privacy.html', 'terms.html'}

for path in HTML_FILES:
    text = path.read_text(encoding='utf-8')
    prefix = '../' if path.parent.name == 'pages' else ''

    # The shared loader is the only code allowed to insert the AdSense script.
    text = re.sub(r'\s*<script[^>]+pagead2\.googlesyndication\.com/pagead/js/adsbygoogle\.js[^>]*></script>', '', text, flags=re.I)
    text = re.sub(r'\s*<script[^>]+(?:^|["\'])[^"\']*js/ads\.js[^>]*></script>', '', text, flags=re.I)
    text = re.sub(r'\s*<script[^>]+(?:^|["\'])[^"\']*../js/ads\.js[^>]*></script>', '', text, flags=re.I)

    css_tag = f'  <link rel="stylesheet" href="{prefix}css/integrations.css">'
    if 'css/integrations.css' not in text:
        text = text.replace('</head>', f'{css_tag}\n</head>', 1)

    scripts = [
        f'  <script src="{prefix}js/site-config.js"></script>',
        f'  <script src="{prefix}js/analytics.js"></script>',
    ]
    if path.name not in LEGAL_WITHOUT_ADS:
        scripts.append(f'  <script src="{prefix}js/ads.js"></script>')
    script_block = '\n'.join(scripts)
    text = text.replace('</body>', f'{script_block}\n</body>', 1)

    if path.name == 'article.html':
        text = text.replace('class="ad-slot ad-slot--article" data-ad-format="fluid"', 'class="ad-slot ad-slot--article" data-ad-slot="6118497380" data-ad-format="fluid"', 1)

    path.write_text(text, encoding='utf-8')
    print(path.relative_to(ROOT))
