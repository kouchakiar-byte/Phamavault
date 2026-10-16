import re, json, html, urllib.request, urllib.parse, ssl
ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128 Safari/537.36", "Accept-Language": "fa-IR,fa;q=0.9"}
def get(u):
    try:
        r = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=30, context=ctx)
        return r.status, r.read().decode("utf-8", "replace")
    except Exception as e:
        return 0, str(e)[:200]
def text(h):
    h = re.sub(r"(?is)<(script|style|svg)[^>]*>.*?</\1>", " ", h)
    h = re.sub(r"(?i)<br\s*/?>|</(p|div|li|h\d|tr|td|th|a)>", "\n", h)
    t = html.unescape(re.sub(r"<[^>]+>", " ", h))
    return "\n".join(l for l in (re.sub(r"\s+", " ", x).strip() for x in t.split("\n")) if l)
def out(**k): print("@@" + json.dumps(k, ensure_ascii=False), flush=True)
s, b = get("https://inci-dic.com/top-100/")
out(k="top100", s=s, x=text(b)[:40000] if s == 200 else b)
SITES = ["baradkimya.com", "parsideachem.com", "shimiparsian.ir", "avatshimipezhvak.com", "chemicenter.com", "irchem.ir", "psgiran.com", "sainaco.com", "arachemi.com", "asrc.ir", "glanco.com", "dr-abidi.ir", "betafarayand.com", "shokoofachemi.com", "parsbeinolmelal.com"]
for site in SITES:
    base = "https://" + site
    s, b = get(base + "/")
    info = {"site": site, "s": s}
    if s == 200:
        info["title"] = (re.search(r"<title>(.*?)</title>", b, re.S | re.I) or [None, ""])[1].strip()[:200]
        info["tels"] = sorted(set(re.findall(r"(?:0\d{2,3}[-\s]?)?\d{8}", text(b))))[:12]
        info["mails"] = sorted(set(re.findall(r"[\w.+-]+@[\w-]+\.[\w.]+", b)))[:6]
    prods = []
    for page in range(1, 9):
        s2, b2 = get(f"{base}/wp-json/wc/store/products?per_page=100&page={page}")
        if s2 != 200: info["store"] = s2; break
        try: items = json.loads(b2)
        except Exception: info["store"] = "notjson"; break
        if not items: break
        for it in items:
            prods.append({"n": html.unescape(it.get("name", "")), "c": [html.unescape(c.get("name", "")) for c in it.get("categories", [])], "d": text(it.get("short_description") or "")[:200], "u": urllib.parse.unquote(it.get("permalink", ""))})
    info["products"] = prods
    hits = []
    for q in ("choline", "کولین"):
        s3, b3 = get(f"{base}/?s={urllib.parse.quote(q)}")
        if s3 == 200:
            hits += [l for l in text(b3).split("\n") if re.search(r"choline|کولین", l, re.I)][:15]
    info["choline"] = hits
    out(k="site", **info)
