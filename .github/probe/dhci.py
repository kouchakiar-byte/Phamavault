import json, urllib.request, ssl
ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128 Safari/537.36", "Accept-Language": "fa-IR,fa;q=0.9"}
for path in ["/members/", "/"]:
    try:
        r = urllib.request.urlopen(urllib.request.Request("https://dhci.org" + path, headers=UA), timeout=40, context=ctx)
        s, b = r.status, r.read().decode("utf-8", "replace")
    except Exception as e:
        s, b = 0, str(e)
    print("@@" + json.dumps({"path": path, "s": s, "html": b}, ensure_ascii=False))
