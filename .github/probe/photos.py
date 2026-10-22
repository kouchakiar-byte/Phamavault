import os, urllib.request, urllib.parse, json, re
H = {"User-Agent": "PharmaVaultPhotoProbe/1.0 (contact: info@pharmavault.ir)"}
def get(u, binary=False):
    b = urllib.request.urlopen(urllib.request.Request(u, headers=H), timeout=60).read()
    return b if binary else json.loads(b)
os.makedirs(".github/probe/full", exist_ok=True)
os.makedirs(".github/probe/thumbs", exist_ok=True)
log = {}
try:
    open(".github/probe/full/qa-binders.jpg", "wb").write(get("https://upload.wikimedia.org/wikipedia/commons/f/f8/Collection_of_colorful_binders_on_a_shelf_for_storing_documents_in_an_office_setting.jpg", True))
except Exception as e:
    log["qa"] = str(e)
out, seen = [], set()
qs = ["chemist HPLC", "scientist HPLC instrument", "HPLC analysis laboratory technician", "Waters HPLC laboratory", "Agilent HPLC laboratory scientist",
      "Shimadzu HPLC laboratory", "pharmaceutical quality control laboratory", "quality control laboratory chromatography", "analytical laboratory chromatography researcher",
      "UPLC laboratory", "HPLC vial autosampler hand", "laboratory analyst chromatography"]
for q in qs:
    p = {"action": "query", "format": "json", "generator": "search", "gsrsearch": f"{q} filetype:bitmap", "gsrnamespace": 6, "gsrlimit": 15,
         "prop": "imageinfo", "iiprop": "url|extmetadata|size", "iiurlwidth": 400}
    try: d = get("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(p))
    except Exception as e: log[q] = str(e); continue
    for pg in (d.get("query", {}).get("pages", {}) or {}).values():
        t = pg["title"]
        if t in seen or "imageinfo" not in pg: continue
        seen.add(t); ii = pg["imageinfo"][0]; m = ii.get("extmetadata", {})
        if (ii.get("width") or 0) < 1100: continue
        g = lambda k: re.sub("<[^>]+>", "", (m.get(k) or {}).get("value", ""))[:200]
        n = len(out)
        item = {"q": q, "title": t, "w": ii.get("width"), "h": ii.get("height"), "url": ii.get("url"), "page": ii.get("descriptionurl"),
                "license": g("LicenseShortName"), "artist": g("Artist"), "desc": g("ImageDescription"), "file": f"q{n:03d}.jpg"}
        try: open(f".github/probe/thumbs/q{n:03d}.jpg", "wb").write(get(ii["thumburl"], True))
        except Exception as e: item["thumb_error"] = str(e)
        out.append(item)
json.dump({"log": log, "items": out}, open(".github/probe/photos.json", "w"), indent=1, ensure_ascii=False)
