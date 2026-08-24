from pathlib import Path
from PIL import Image

root = Path('/home/ubuntu/DriveSymbols-git/images/articles')
for path in sorted(root.glob('*.jpg')):
    with Image.open(path) as image:
        image = image.convert('RGB')
        image.thumbnail((1280, 720), Image.Resampling.LANCZOS)
        image.save(path, format='JPEG', quality=82, optimize=True, progressive=True)
        print(f'{path.name}: {image.size[0]}x{image.size[1]}')
