import json
from pathlib import Path

root = Path('/home/ubuntu/DriveSymbols-git')
symbols_path = root / 'data/symbols.json'
categories = json.loads((root / 'data/categories.json').read_text(encoding='utf-8'))
lookup = {item['id']: item.get('nameEn', item['id']) for item in categories}
symbols = json.loads(symbols_path.read_text(encoding='utf-8'))
for symbol in symbols:
    symbol['categoryEn'] = lookup.get(symbol.get('category'), symbol.get('categoryEn', symbol.get('category', '')))
symbols_path.write_text(json.dumps(symbols, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Normalized {len(symbols)} symbol category labels.')
