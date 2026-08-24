from __future__ import annotations

import json
import re
from pathlib import Path
from bs4 import BeautifulSoup
from openai import OpenAI

ROOT = Path('/home/ubuntu/DriveSymbols-git')
PAGES = [ROOT / 'pages/about.html', ROOT / 'pages/contact.html', ROOT / 'pages/privacy.html', ROOT / 'pages/terms.html', ROOT / 'categories.html', ROOT / 'brands.html', ROOT / 'favorites.html']

schema = {
    'type': 'object',
    'properties': {
        'items': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {'key': {'type': 'string'}, 'value': {'type': 'string'}},
                'required': ['key', 'value'],
                'additionalProperties': False,
            },
        }
    },
    'required': ['items'],
    'additionalProperties': False,
}

client = OpenAI(timeout=45.0, max_retries=1)
all_translations = {}
for page in PAGES:
    soup = BeautifulSoup(page.read_text(encoding='utf-8'), 'html.parser')
    for tag in soup(['script', 'style', 'noscript']):
        tag.decompose()
    values = set()
    for node in soup.find_all(string=True):
        value = re.sub(r'\s+', ' ', node.strip())
        if value and re.search(r'[\u0600-\u06ff]', value) and len(value) <= 500:
            values.add(value)
    for node in soup.find_all(True):
        for attr in ('placeholder', 'title', 'aria-label', 'alt', 'data-tooltip'):
            value = re.sub(r'\s+', ' ', str(node.get(attr, '')).strip())
            if value and re.search(r'[\u0600-\u06ff]', value) and len(value) <= 250:
                values.add(value)
    if not values:
        continue
    items = sorted(values)
    response = client.chat.completions.create(
        model='gpt-5-mini',
        messages=[
            {'role': 'system', 'content': 'Translate Arabic website copy into concise natural English. Preserve meaning, safety disclaimers, legal intent, names, numbers, and punctuation. Do not summarize or invent. Return one key/value pair for every input string.'},
            {'role': 'user', 'content': 'Translate these exact Arabic strings independently:\n' + json.dumps(items, ensure_ascii=False)},
        ],
        max_completion_tokens=7000,
        response_format={'type': 'json_schema', 'json_schema': {'name': 'page_translations', 'strict': True, 'schema': schema}},
    )
    pairs = json.loads(response.choices[0].message.content)['items']
    page_translations = {pair['key']: pair['value'] for pair in pairs}
    missing = [item for item in items if not page_translations.get(item)]
    if missing:
        raise SystemExit(f'Missing translations for {page}: {missing[:3]}')
    all_translations.update(page_translations)
    print(f'{page.name}: {len(items)} strings')

out = ROOT / 'js/i18n-content.js'
out.write_text('window.DriveContentTranslations = ' + json.dumps(all_translations, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
print(f'Generated {len(all_translations)} static translations.')
