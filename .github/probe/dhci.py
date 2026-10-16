import json, re, urllib.request, ssl
ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128 Safari/537.36", "Accept-Language": "fa-IR,fa;q=0.9"}
def page(path):
    try:
        r = urllib.request.urlopen(urllib.request.Request("https://dhci.org" + path, headers=UA), timeout=40, context=ctx)
        h = r.read().decode("utf-8", "replace")
        m = re.search(r'<script data-page="app" type="application/json">(.*?)</script>', h, re.S)
        d = json.loads(m.group(1)) if m else None
        if d:
            for k in ("errors", "auth", "flash", "siteSettings", "navigation", "heroContent", "landingContent", "interviews", "orgChart", "supplyMap"):
                d["props"].pop(k, None)
        return r.status, d
    except Exception as e:
        return 0, str(e)
paths = ["/members/gold", "/members/silver", "/members/bronze", "/members/terms", "/commissions/raw-materials", "/commissions/cosmetic", "/commissions/import", "/marketplace", "/search?q=" + urllib.request.quote("کولین"), "/search?q=choline"]
d0 = page("/members/")[1]
for it in (d0 or {}).get("props", {}).get("items", []):
    if it["href"] not in paths: paths.append(it["href"])
for p in paths:
    s, d = page(p)
    print("@@" + json.dumps({"path": p, "s": s, "data": d}, ensure_ascii=False))
