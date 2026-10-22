import os, urllib.request, urllib.parse, json, re
H = {"User-Agent": "PharmaVaultPhotoProbe/1.0 (contact: info@pharmavault.ir)"}
def get(u, binary=False):
    r = urllib.request.urlopen(urllib.request.Request(u, headers=H), timeout=40); b = r.read()
    return b if binary else json.loads(b)
os.makedirs(".github/probe/thumbs", exist_ok=True)
out, seen = [], set()
for q in ["HPLC laboratory", "HPLC injection", "high performance liquid chromatography", "HPLC operator", "chromatography laboratory scientist", "liquid chromatography instrument", "standard operating procedure binder", "binders documents shelf"]:
    p = {"action": "query", "format": "json", "generator": "search", "gsrsearch": f"{q} filetype:bitmap", "gsrnamespace": 6, "gsrlimit": 14,
         "prop": "imageinfo", "iiprop": "url|extmetadata|size", "iiurlwidth": 480}
    try: d = get("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(p))
    except Exception as e: out.append({"q": q, "error": str(e)}); continue
    for pg in (d.get("query", {}).get("pages", {}) or {}).values():
        t = pg["title"]
        if t in seen or "imageinfo" not in pg: continue
        seen.add(t); ii = pg["imageinfo"][0]; m = ii.get("extmetadata", {})
        g = lambda k: re.sub("<[^>]+>", "", (m.get(k) or {}).get("value", ""))[:160]
        item = {"q": q, "title": t, "w": ii.get("width"), "h": ii.get("height"), "url": ii.get("url"), "thumb": ii.get("thumburl"), "page": ii.get("descriptionurl"),
                "license": g("LicenseShortName"), "artist": g("Artist"), "desc": g("ImageDescription")}
        n = len(out)
        try: open(f".github/probe/thumbs/c{n:03d}.jpg", "wb").write(get(ii["thumburl"], True)); item["file"] = f"c{n:03d}.jpg"
        except Exception as e: item["thumb_error"] = str(e)
        out.append(item)
json.dump(out, open(".github/probe/photos.json", "w"), indent=1, ensure_ascii=False)
