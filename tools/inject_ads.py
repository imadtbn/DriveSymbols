from pathlib import Path

ROOT = Path('/home/ubuntu/DriveSymbols')
ROOT_PAGES = [
    ROOT / name for name in (
        'index.html', 'brands.html', 'categories.html', 'favorites.html',
        'search.html', 'symbol.html'
    )
]
NESTED_PAGES = [
    ROOT / 'pages' / name for name in (
        'about.html', 'contact.html'
    )
]

ADSENSE_HEAD = '''\n  <!-- Google AdSense -->\n  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5656416032906373" crossorigin="anonymous"></script>\n  <meta name="google-adsense-account" content="ca-pub-5656416032906373">\n'''

SLOTS = {
    'feed_01': '<div class="ad-slot ad-slot--feed" data-ad-slot="7867079394" data-ad-format="fluid" data-ad-layout-key="-fr+56+4k-d4+74"></div>',
    'display_01': '<div class="ad-slot ad-slot--display" data-ad-slot="3143411927" data-ad-format="auto"></div>',
    'feed_02': '<div class="ad-slot ad-slot--feed" data-ad-slot="8546947691" data-ad-format="fluid" data-ad-layout-key="-h9-h+8-jr+r8"></div>',
    'display_02': '<div class="ad-slot ad-slot--display" data-ad-slot="1760836049" data-ad-format="auto"></div>',
    'feed_03': '<div class="ad-slot ad-slot--feed" data-ad-slot="6152718642" data-ad-format="fluid" data-ad-layout-key="-h6-l+d-jc+qd"></div>',
    'display_03': '<div class="ad-slot ad-slot--display" data-ad-slot="5508509362" data-ad-format="auto"></div>',
    'article_01': '<div class="ad-slot ad-slot--article" data-ad-slot="6118497380" data-ad-format="fluid" data-ad-layout="in-article"></div>',
    'article_02': '<div class="ad-slot ad-slot--article" data-ad-slot="7319898418" data-ad-format="fluid" data-ad-layout="in-article"></div>',
    'recommendations': '<div class="ad-slot ad-slot--recommendations" data-ad-slot="6528123169" data-ad-format="autorelaxed"></div>',
}


def add_shared_assets(text: str, nested: bool) -> str:
    prefix = '../' if nested else ''
    css_tag = f'  <link rel="stylesheet" href="{prefix}css/ads.css">\n'
    js_tag = f'  <script src="{prefix}js/ads.js"></script>\n'
    if 'css/ads.css' not in text:
        anchor = '  <link rel="stylesheet" href="css/responsive.css">' if not nested else '  <link rel="stylesheet" href="../css/responsive.css">'
        text = text.replace(anchor, anchor + '\n' + css_tag, 1)
    if 'google-adsense-account' not in text:
        text = text.replace('</head>', ADSENSE_HEAD + '</head>', 1)
    if 'js/ads.js' not in text:
        anchor = '  <script src="js/app.js"></script>' if not nested else '  <script src="../js/app.js"></script>'
        text = text.replace(anchor, js_tag + anchor, 1)
    return text


def add_before(text: str, marker: str, slot: str) -> str:
    if 'data-ad-slot' in slot and slot.split('data-ad-slot="', 1)[1].split('"', 1)[0] in text:
        return text
    newline = '\r\n' if '\r\n' in text else '\n'
    normalized_marker = marker.replace('\n', newline)
    normalized_slot = slot.replace('\n', newline)
    insertion = f'{newline}    {normalized_slot}{newline}{newline}'
    return text.replace(normalized_marker, insertion + normalized_marker, 1)


def transform(path: Path) -> None:
    text = path.read_bytes().decode('utf-8')
    nested = path.parent.name == 'pages'
    text = add_shared_assets(text, nested)

    if path.name == 'index.html':
        text = add_before(text, '  <!-- Danger Symbols Section -->', SLOTS['feed_01'])
        text = add_before(text, '  <!-- Popular Symbols Section -->', SLOTS['display_01'])
        text = add_before(text, '  <!-- Brands Section -->', SLOTS['feed_02'])
        text = add_before(text, '  <!-- Driving Tips Section -->', SLOTS['display_02'])
        text = add_before(text, '  <!-- Footer -->', SLOTS['recommendations'])
    elif path.name == 'search.html':
        text = add_before(text, '      <div class="search-results">', SLOTS['feed_03'])
        text = add_before(text, '    </div>\n  </section>\n\n  <footer', SLOTS['display_03'])
    elif path.name == 'categories.html':
        text = add_before(text, '    </div>\n  </section>\n\n  <!-- Footer -->', SLOTS['display_03'])
    elif path.name == 'brands.html':
        text = add_before(text, '            <div id="brandDetail"', SLOTS['display_01'])
    elif path.name == 'favorites.html':
        text = add_before(text, '  </section>\n\n  <!-- Delete Confirmation Modal -->', SLOTS['display_02'])
    elif path.name == 'symbol.html':
        text = add_before(text, '      <!-- Similar Symbols -->', SLOTS['article_02'])
        text = add_before(text, '      <div id="symbolDetail">', SLOTS['article_01'])
    elif path.name in ('about.html', 'contact.html'):
        text = add_before(text, '  </section>', SLOTS['article_01'])

    path.write_bytes(text.encode('utf-8'))


for page in ROOT_PAGES + NESTED_PAGES:
    transform(page)
