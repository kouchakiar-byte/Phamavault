import json, os, urllib.request, urllib.parse, ssl, time
ctx = ssl.create_default_context()
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36", "Accept": "application/json"}
def get(u, binary=False):
    r = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=40, context=ctx)
    b = r.read(); return b if binary else b.decode("utf-8", "replace")
os.makedirs(".github/probe/thumbs", exist_ok=True)
seen, out = set(), []
for q in ["scientists magnifying glass", "pharmacist magnifying glass", "doctor magnifying glass", "researcher magnifying glass", "two scientists magnifying glass", "magnifying glass pills", "pharmacy research team"]:
    try:
        d = json.loads(get("https://unsplash.com/napi/search/photos?" + urllib.parse.urlencode({"query": q, "per_page": 12})))
    except Exception as e:
        out.append({"q": q, "error": str(e)}); continue
    for r in d.get("results", []):
        if r["id"] in seen or r.get("premium") or r.get("plus"): continue
        seen.add(r["id"])
        item = {"q": q, "id": r["id"], "desc": r.get("alt_description") or r.get("description"), "user": r["user"]["name"], "page": r["links"]["html"], "w": r["width"], "h": r["height"], "raw": r["urls"]["raw"]}
        try:
            open(f".github/probe/thumbs/{r['id']}.jpg", "wb").write(get(r["urls"]["raw"] + "&w=360&q=70&fm=jpg", True))
        except Exception as e:
            item["thumb_error"] = str(e)
        out.append(item)
    time.sleep(1)
json.dump(out, open(".github/probe/photos.json", "w"), ensure_ascii=False, indent=1)
print(len(out))
