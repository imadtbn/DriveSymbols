import json
from pathlib import Path

path = Path('/home/ubuntu/DriveSymbols-git/data/brands.json')
data = json.loads(path.read_text(encoding='utf-8'))
translations = {
    'ألمانيا': 'Germany',
    'إسبانيا': 'Spain',
    'إيطاليا': 'Italy',
    'السويد': 'Sweden',
    'الصين': 'China',
    'المملكة المتحدة': 'United Kingdom',
    'الهند': 'India',
    'الولايات المتحدة': 'United States',
    'اليابان': 'Japan',
    'جمهورية التشيك': 'Czech Republic',
    'روسيا': 'Russia',
    'فرنسا': 'France',
    'كوريا الجنوبية': 'South Korea',
    'ماليزيا': 'Malaysia',
}
for item in data:
    item['countryEn'] = translations.get(item.get('country', ''), item.get('country', ''))
path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Updated {len(data)} brands.')
