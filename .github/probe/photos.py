import os, urllib.request, urllib.parse, json, re
H = {"User-Agent": "PharmaVaultPhotoProbe/1.0 (contact: info@pharmavault.ir)"}
def get(u, binary=False):
    b = urllib.request.urlopen(urllib.request.Request(u, headers=H), timeout=60).read()
    return b if binary else json.loads(b)
os.makedirs(".github/probe/thumbs", exist_ok=True)
out, log = [], {}
for grp, ids in {"exc": "3735773 11703173 3735700 3735704 1138746", "ph": "11648283 19943230 3652750 13119976"}.items():
    for i in ids.split():
        try:
            open(f".github/probe/thumbs/{grp}-p{i}.jpg", "wb").write(get(f"https://images.pexels.com/photos/{i}/pexels-photo-{i}.jpeg?auto=compress&cs=tinysrgb&w=480", True))
            out.append({"file": f"{grp}-p{i}.jpg", "source": "pexels", "id": i, "license": "Pexels"})
        except Exception as e: log[i] = str(e)
seen = set()
for grp, qs in {"exc": ["microcrystalline cellulose", "Avicel", "reagent bottle label chemical", "chemical bottle cellulose powder", "laboratory chemical container label"],
                "ph": ["pharmacy sign", "Apotheke Schild", "pharmacy shelves interior", "pharmacy green cross sign"],
                "ref": ["pharmacopoeia", "United States Pharmacopeia", "British Pharmacopoeia", "European Pharmacopoeia", "Japanese Pharmacopoeia", "pharmacopoeia books shelf"]}.items():
    for q in qs:
        p = {"action": "query", "format": "json", "generator": "search", "gsrsearch": f"{q} filetype:bitmap", "gsrnamespace": 6, "gsrlimit": 10,
             "prop": "imageinfo", "iiprop": "url|extmetadata|size", "iiurlwidth": 400}
        try: d = get("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(p))
        except Exception as e: log[q] = str(e); continue
        for pg in (d.get("query", {}).get("pages", {}) or {}).values():
            t = pg["title"]
            if t in seen or "imageinfo" not in pg: continue
            seen.add(t); ii = pg["imageinfo"][0]; m = ii.get("extmetadata", {})
            if (ii.get("width") or 0) < 1000: continue
            g = lambda k: re.sub("<[^>]+>", "", (m.get(k) or {}).get("value", ""))[:200]
            n = len(out)
            item = {"file": f"{grp}-w{n:03d}.jpg", "source": "commons", "q": q, "title": t, "w": ii.get("width"), "h": ii.get("height"), "url": ii.get("url"), "page": ii.get("descriptionurl"),
                    "license": g("LicenseShortName"), "artist": g("Artist"), "desc": g("ImageDescription")}
            try: open(f".github/probe/thumbs/{item['file']}", "wb").write(get(ii["thumburl"], True))
            except Exception as e: item["thumb_error"] = str(e)
            out.append(item)
json.dump({"log": log, "items": out}, open(".github/probe/photos.json", "w"), indent=1, ensure_ascii=False)
