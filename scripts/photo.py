#!/usr/bin/env python3
"""Find and add openly licensed Wikimedia Commons photos.

  python3 scripts/photo.py search "Dubai Creek abra"      # list candidates (skips files already used)
  python3 scripts/photo.py get "File:Name.jpg" my-key       # download 1280px copy + record credit
  python3 scripts/photo.py remove my-key                     # drop a photo you added that turned out wrong

Refuses files already used on the site, non-free licences (NC/ND), originals under 2000px wide and low-detail files.
"""
import sys, re, json, html, hashlib, urllib.parse, urllib.request, time, os, fcntl
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'src/data/photos.json')
OUT = os.path.join(ROOT, 'src/assets/photos')
UA = {'User-Agent': 'Mozilla/5.0 (EmiratesGuideBuild; static travel blog)'}

def fetch(url, binary=False):
    for i in range(6):
        try:
            r = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()
            return r if binary else r.decode('utf-8', 'replace')
        except Exception as e:
            time.sleep(3 * (i + 1))
    raise SystemExit(f'Could not load {url}')

def clean(s): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s or ''))).strip()

def info(title):
    page = fetch('https://commons.wikimedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_')))
    lic = re.search(r'licensetpl&#95;short"[^>]*>([^<]*)<', page) or re.search(r'licensetpl_short"[^>]*>([^<]*)<', page)
    link = re.search(r'licensetpl&#95;link"[^>]*>([^<]*)<', page) or re.search(r'licensetpl_link"[^>]*>([^<]*)<', page)
    aut = re.search(r'id="fileinfotpl(?:&#95;|_)aut".*?</td>\s*<td[^>]*>(.*?)</td>', page, re.S)
    dims = re.search(r'class="fileInfo">\(([\d,]+) × ([\d,]+) pixels', page) or re.search(r'([\d,]+) × ([\d,]+) pixels', page)
    desc = re.search(r'class="description[^"]*"[^>]*>(.*?)</div>', page, re.S)
    w, h = (int(dims.group(1).replace(',', '')), int(dims.group(2).replace(',', ''))) if dims else (0, 0)
    author = clean(aut.group(1)) if aut else ''
    author = re.sub(r'\b(talk|contribs)\b', '', author).strip(' |()') [:80]
    return dict(file=title, license=clean(lic.group(1)) if lic else '', licenseUrl=clean(link.group(1)) if link else '',
                author=author or 'Unknown', width=w, height=h,
                source='https://commons.wikimedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_')),
                description=clean(desc.group(1))[:200] if desc else '')

def free(lic): return bool(re.search(r'CC BY|CC0|Public domain|PD', lic, re.I)) and not re.search(r'NC|ND', lic)

def used():
    db = json.load(open(DATA))
    return db, {v['file'].replace(' ', '_') for v in db.values()}

def search(q):
    s = fetch('https://commons.wikimedia.org/w/index.php?' + urllib.parse.urlencode({'search': q, 'ns6': 1, 'fulltext': 1, 'profile': 'images', 'limit': 30}))
    titles = list(dict.fromkeys(urllib.parse.unquote(t) for t in re.findall(r'href="/wiki/(File:[^"#?]+\.(?:jpe?g|JPE?G))"', s)))
    _, taken = used()
    shown = 0
    for t in titles:
        if t.replace(' ', '_') in taken: continue
        i = info(t)
        if not free(i['license']) or i['width'] < 2000: continue
        orient = 'landscape' if i['width'] > i['height'] * 1.15 else 'portrait' if i['height'] > i['width'] * 1.15 else 'square'
        print(f"{t}\n   {i['width']}x{i['height']} {orient} | {i['license']} | {i['author']}\n   {i['description'][:160]}")
        shown += 1
        if shown >= 10: break
    if not shown: print('No usable free photos found for this search. Try different words.')

def get(title, key):
    if not re.fullmatch(r'[a-z0-9][a-z0-9-]{2,60}', key): raise SystemExit('Key must be lowercase letters, digits and hyphens')
    title = title if title.startswith('File:') else 'File:' + title
    with open(DATA + '.lock', 'w') as lk:
        fcntl.flock(lk, fcntl.LOCK_EX)
        db, taken = used()
        if key in db: raise SystemExit(f'Key "{key}" already exists. Choose another key.')
        if title.replace(' ', '_') in taken: raise SystemExit('This photo is already used on the site. Choose a different photo.')
        i = info(title)
        if not free(i['license']): raise SystemExit(f'Not an open licence: {i["license"]}')
        if i['width'] < 2000: raise SystemExit(f'Too small ({i["width"]}px wide). Pick a photo at least 2000px wide for quality.')
        name = title[5:].replace(' ', '_'); h = hashlib.md5(name.encode()).hexdigest(); q = urllib.parse.quote(name)
        url = f'https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{q}/1280px-{q}' if i['width'] > 1280 else f'https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{q}'
        data = fetch(url, binary=True)
        if len(data) < 20000: raise SystemExit('Download failed')
        if len(data) < 120000: raise SystemExit('Photo looks low in detail or heavily compressed. Pick another.')
        open(os.path.join(OUT, key + '.jpg'), 'wb').write(data)
        db[key] = {k: i[k] for k in ('file', 'author', 'license', 'licenseUrl', 'source', 'description')}
        json.dump(db, open(DATA, 'w'), indent=1, ensure_ascii=False)
    print(f'Added {key}: {title} ({i["license"]}, {i["author"]})')

def remove(key):
    with open(DATA + '.lock', 'w') as lk:
        fcntl.flock(lk, fcntl.LOCK_EX)
        db = json.load(open(DATA))
        if key not in db: raise SystemExit(f'No photo "{key}"')
        db.pop(key); json.dump(db, open(DATA, 'w'), indent=1, ensure_ascii=False)
        try: os.remove(os.path.join(OUT, key + '.jpg'))
        except FileNotFoundError: pass
    print(f'Removed {key}')

if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'search': search(' '.join(sys.argv[2:]))
    elif len(sys.argv) == 4 and sys.argv[1] == 'get': get(sys.argv[2], sys.argv[3])
    elif len(sys.argv) == 3 and sys.argv[1] == 'remove': remove(sys.argv[2])
    else: print(__doc__)
