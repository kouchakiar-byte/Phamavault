import os, urllib.request, json
ids = "5156696 29454379 15508178 8282240 248152 753416 267582 4736086 33936499 8325708 8392533 3873141 9742736 7230183 5668485 48148 8152735 10514991 9574330 11589208 8940519 8293635 30019381 167542 4580978 6074000".split()
os.makedirs(".github/probe/thumbs", exist_ok=True)
out = {}
for i in ids:
    url = f"https://images.pexels.com/photos/{i}/pexels-photo-{i}.jpeg?auto=compress&cs=tinysrgb&w=640"
    try:
        r = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=30)
        open(f".github/probe/thumbs/{i}.jpg", "wb").write(r.read()); out[i] = "ok"
    except Exception as e:
        out[i] = str(e)
json.dump(out, open(".github/probe/photos.json", "w"), indent=1)
