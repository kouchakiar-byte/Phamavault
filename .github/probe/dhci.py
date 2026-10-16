import re, json, urllib.request, ssl
ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
def get(u):
    try:
        r = urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128 Safari/537.36", "Accept-Language": "fa-IR,fa;q=0.9"}), timeout=40, context=ctx)
        return r.status, r.geturl(), r.read().decode("utf-8", "replace")
    except Exception as e:
        return 0, u, str(e)
for u in ["https://dhci.org/", "https://www.dhci.org/", "http://dhci.org/", "https://dhci.org/members/", "https://dhci.org/news/", "https://dhci.org/robots.txt"]:
    s, final, b = get(u)
    print("@@" + json.dumps({"u": u, "final": final, "s": s, "len": len(b), "head": b[:3000], "links": sorted(set(re.findall(r'href="([^"#]+)"', b)))[:150]}, ensure_ascii=False))
