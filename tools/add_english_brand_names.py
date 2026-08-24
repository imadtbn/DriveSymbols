import json
from pathlib import Path

path = Path('/home/ubuntu/DriveSymbols-git/data/brands.json')
data = json.loads(path.read_text(encoding='utf-8'))
translations = {
    'تويوتا': 'Toyota', 'هيونداي': 'Hyundai', 'كيا': 'Kia', 'بيجو': 'Peugeot', 'رونو': 'Renault',
    'فولكس فاجن': 'Volkswagen', 'مرسيدس': 'Mercedes-Benz', 'بي إم دبليو': 'BMW', 'أودي': 'Audi',
    'فيات': 'Fiat', 'أوبل': 'Opel', 'سوزوكي': 'Suzuki', 'نيسان': 'Nissan', 'هوندا': 'Honda',
    'فورد': 'Ford', 'شيفروليه': 'Chevrolet', 'مازدا': 'Mazda', 'ميتسوبيشي': 'Mitsubishi',
    'سوبارو': 'Subaru', 'فولفو': 'Volvo', 'لاند روفر': 'Land Rover', 'جيب': 'Jeep', 'جاكوار': 'Jaguar',
    'تسلا': 'Tesla', 'بورش': 'Porsche', 'سكودا': 'Skoda', 'سيات': 'SEAT', 'سيتروين': 'Citroën',
    'ألفا روميو': 'Alfa Romeo', 'أستون مارتن': 'Aston Martin', 'بنتلي': 'Bentley', 'بويك': 'Buick',
    'كاديلاك': 'Cadillac', 'شيري': 'Chery', 'كوبرا': 'CUPRA', 'دايهاتسو': 'Daihatsu',
    'فيراري': 'Ferrari', 'غاز': 'GAZ', 'جيلي': 'Geely', 'جينيسيس': 'Genesis', 'جريت وول': 'Great Wall',
    'إيسوزو': 'Isuzu', 'لادا': 'Lada', 'لامبورغيني': 'Lamborghini', 'ماهيندرا': 'Mahindra',
    'ماسيراتي': 'Maserati', 'إم جي': 'MG', 'ميني': 'MINI', 'بروتون': 'Proton', 'رولز رويس': 'Rolls-Royce',
    'ساب': 'Saab', 'تاتا': 'Tata', 'أورال': 'Ural', 'واو': 'WAW', 'جاك': 'JAC', 'دونغفنغ': 'Dongfeng',
}
for item in data:
    item['nameEn'] = translations.get(item.get('name', ''), item.get('name', ''))
path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Updated {len(data)} brand names.')
