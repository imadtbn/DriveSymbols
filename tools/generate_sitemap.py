import json
from datetime import date
from pathlib import Path
from xml.etree.ElementTree import Element, SubElement, ElementTree

ROOT = Path('/home/ubuntu/DriveSymbols-git')
BASE = 'https://imadtbn.github.io/DriveSymbols/'
TODAY = date.today().isoformat()

def load(name):
    return json.loads((ROOT / 'data' / name).read_text(encoding='utf-8'))

urls = [
    ('index.html', '1.0'),
    ('search.html', '0.9'),
    ('categories.html', '0.8'),
    ('brands.html', '0.8'),
    ('favorites.html', '0.3'),
    ('about.html', '0.4'),
    ('contact.html', '0.3'),
]
for symbol in load('symbols.json'):
    urls.append((f'symbol.html?id={symbol["id"]}', '0.7'))
for article in load('articles.json'):
    urls.append((f'article.html?slug={article["slug"]}', '0.8'))

ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'
root = Element(f'{{{ns}}}urlset')
for path, priority in urls:
    entry = SubElement(root, f'{{{ns}}}url')
    SubElement(entry, f'{{{ns}}}loc').text = BASE + path
    SubElement(entry, f'{{{ns}}}lastmod').text = TODAY
    SubElement(entry, f'{{{ns}}}changefreq').text = 'weekly'
    SubElement(entry, f'{{{ns}}}priority').text = priority

ElementTree(root).write(ROOT / 'sitemap.xml', encoding='utf-8', xml_declaration=True)
(ROOT / 'robots.txt').write_text(
    'User-agent: *\nAllow: /DriveSymbols/\nDisallow: /DriveSymbols/favorites.html\nSitemap: https://imadtbn.github.io/DriveSymbols/sitemap.xml\n',
    encoding='utf-8'
)
print(f'Generated sitemap.xml with {len(urls)} URLs and robots.txt.')
