import json
from pathlib import Path

path = Path('/home/ubuntu/DriveSymbols-git/data/categories.json')
data = json.loads(path.read_text(encoding='utf-8'))
translations = {
    'Engine': ('Engine', 'Engine and engine management symbols'),
    'Brakes': ('Brakes', 'Brake system and ABS symbols'),
    'Battery': ('Battery', 'Battery and charging system symbols'),
    'Oil': ('Oil', 'Engine oil and oil pressure symbols'),
    'Temperature': ('Temperature', 'Engine temperature and cooling symbols'),
    'Fuel': ('Fuel', 'Fuel and fuel filter symbols'),
    'Tires': ('Tires', 'Tire pressure and TPMS symbols'),
    'Airbag': ('Airbags', 'Airbag and seat belt symbols'),
    'Stability': ('Stability', 'ESP and traction control symbols'),
    'Transmission': ('Transmission', 'Gearbox and transmission symbols'),
    'Electrical': ('Electrical', 'Electrical system and fuse symbols'),
    'Lights': ('Lights', 'Lighting and lamp symbols'),
    'Assistance': ('Driver assistance', 'Driver assistance system symbols'),
}
for item in data:
    item['nameEn'], item['descriptionEn'] = translations[item['id']]
path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Updated {len(data)} categories.')
