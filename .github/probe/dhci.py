import re, html, json, urllib.request, urllib.parse, ssl
ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
def get(u):
    try:
        r = urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=40, context=ctx)
        return r.status, r.read().decode("utf-8", "replace"), dict(r.headers)
    except Exception as e:
        return 0, str(e), {}
def text(h):
    h = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", h)
    h = re.sub(r"(?i)<br\s*/?>|</(p|div|li|h\d|tr|td|th)>", "\n", h)
    t = html.unescape(re.sub(r"<[^>]+>", " ", h))
    return "\n".join(l for l in (re.sub(r"[ \t‏‎]+", " ", x).strip() for x in t.split("\n")) if l)
def out(**k): print("@@" + json.dumps(k, ensure_ascii=False))
B = "https://dhci.org"
for u in [B + "/wp-sitemap.xml", B + "/sitemap_index.xml", B + "/wp-json/wp/v2/types"]:
    s, b, _ = get(u)
    out(k="map", u=u, s=s, x=b[:20000])
    for sm in re.findall(r"<loc>([^<]+sitemap[^<]*)</loc>", b):
        s2, b2, _ = get(sm)
        out(k="map", u=sm, s=s2, x="\n".join(urllib.parse.unquote(x) for x in re.findall(r"<loc>([^<]+)</loc>", b2)))
for kind in ("pages", "posts"):
    page = 1
    while page < 30:
        s, b, hd = get(f"{B}/wp-json/wp/v2/{kind}?per_page=100&page={page}&_fields=title,link,content")
        if s != 200: out(k="err", u=kind, s=s, x=b[:300]); break
        items = json.loads(b)
        if not items: break
        for it in items:
            x = text(it["content"]["rendered"])
            if kind == "posts" and not re.search(r"عضو|اعضا|مواد اولیه|تامین|تأمین", it["title"]["rendered"] + x[:3000]): continue
            out(k=kind[0], t=html.unescape(it["title"]["rendered"]), u=urllib.parse.unquote(it["link"]), x=x[:30000], h=it["content"]["rendered"][:120000])
        if page >= int(hd.get("X-WP-TotalPages", hd.get("x-wp-totalpages", "1"))): break
        page += 1
# Raw-materials committee and member list pages, rendered (in case they are not plain WP pages)
for u in [B + "/raw-materials-council/", B + "/members/", B + "/%D9%84%DB%8C%D8%B3%D8%AA-%D8%A7%D8%B9%D8%B6%D8%A7/"]:
    s, b, _ = get(u)
    out(k="page", u=u, s=s, x=text(b)[:60000] if s == 200 else b[:300])
