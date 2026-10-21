import json, os, urllib.request, urllib.parse, ssl, time
ctx = ssl.create_default_context()
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36", "Accept": "application/json"}
def get(u, binary=False):
    r = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=40, context=ctx)
    b = r.read(); return b if binary else b.decode("utf-8", "replace")
os.makedirs(".github/probe/thumbs", exist_ok=True)
seen, out = set(), []
for q in ["scientist magnifying glass", "pharmacist magnifying glass", "doctor magnifying glass", "researchers magnifying glass", "laboratory magnifying glass", "magnifying glass medicine"]:
    try:
        d = json.loads(get("https://api.openverse.org/v1/images/?" + urllib.parse.urlencode({"q": q, "license_type": "commercial,modification", "page_size": 20, "category": "photograph", "mature": "false"})))
    except Exception as e:
        out.append({"q": q, "error": str(e)}); continue
    for r in d.get("results", []):
        if r["id"] in seen: continue
        seen.add(r["id"])
        item = {"q": q, "id": r["id"], "title": r.get("title"), "creator": r.get("creator"), "license": r.get("license"), "license_version": r.get("license_version"), "page": r.get("foreign_landing_url"), "url": r.get("url"), "w": r.get("width"), "h": r.get("height"), "source": r.get("source")}
        try:
            open(f".github/probe/thumbs/{r['id'][:8]}.jpg", "wb").write(get(r["thumbnail"], True))
        except Exception as e:
            item["thumb_error"] = str(e)
        out.append(item)
    time.sleep(1)
json.dump(out, open(".github/probe/photos.json", "w"), ensure_ascii=False, indent=1)
print(len(out))
