import re, json, html, urllib.request, ssl
ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128 Safari/537.36", "Accept-Language": "fa-IR,fa;q=0.9"}
def get(u, extra=None):
    try:
        r = urllib.request.urlopen(urllib.request.Request(u, headers={**UA, **(extra or {})}), timeout=40, context=ctx)
        return r.status, r.read().decode("utf-8", "replace")
    except Exception as e:
        return 0, str(e)
def page_data(b):
    m = re.search(r'data-page="([^"]+)"', b)
    return json.loads(html.unescape(m.group(1))) if m else None
for path in ["/", "/members/", "/news/"]:
    s, b = get("https://dhci.org" + path)
    d = page_data(b) if s == 200 else None
    print("@@" + json.dumps({"path": path, "s": s, "data": d}, ensure_ascii=False))
