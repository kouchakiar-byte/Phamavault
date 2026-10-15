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
    h = re.sub(r"(?i)<br\s*/?>|</(p|div|li|h\d|tr|td)>", "\n", h)
    t = html.unescape(re.sub(r"<[^>]+>", " ", h))
    return "\n".join(l for l in (re.sub(r"[ \t‏‎]+", " ", x).strip() for x in t.split("\n")) if l)
# Every WordPress page and post, as text
for kind in ("pages", "posts"):
    page = 1
    while True:
        s, b, hd = get(f"https://cppsynd.com/wp-json/wp/v2/{kind}?per_page=100&page={page}&_fields=title,link,content")
        if s != 200: break
        items = json.loads(b)
        if not items: break
        for it in items:
            link = urllib.parse.unquote(it["link"])
            x = text(it["content"]["rendered"])
            links = [urllib.parse.unquote(u) for u in re.findall(r'href="(https?://[^"]+)"', it["content"]["rendered"])]
            if kind == "posts" and not re.search(r"تلفن|مدیرعامل|نوع فعالیت|عضویت", x): continue
            print("@@" + json.dumps({"k": kind[0], "t": html.unescape(it["title"]["rendered"]), "u": link, "x": x[:2500], "l": [u for u in links if "cppsynd.com/wp-content" not in u][:40]}, ensure_ascii=False))
        if page >= int(hd.get("X-WP-TotalPages", hd.get("x-wp-totalpages", "1"))): break
        page += 1
# Tehran chemical importers association: main members
for u in ["https://tcia.ir/%D9%84%DB%8C%D8%B3%D8%AA-%D8%A7%D8%B9%D8%B6%D8%A7%DB%8C-%D8%A7%D8%B5%D9%84%DB%8C-%D8%A7%D9%86%D8%AC%D9%85%D9%86/"]:
    s, b, _ = get(u)
    print("@@" + json.dumps({"k": "tcia", "s": s, "u": u, "x": text(b)[:60000] if s == 200 else b}, ensure_ascii=False))
