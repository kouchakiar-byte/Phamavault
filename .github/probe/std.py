import re, html, json, urllib.request, urllib.parse, ssl, time
ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36", "Accept-Language": "fa-IR,fa;q=0.9,en;q=0.8"}
def get(u, t=30):
    try:
        r = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=t, context=ctx)
        return r.status, r.read(3_000_000).decode("utf-8", "replace"), r.geturl()
    except Exception as e:
        return 0, str(e), u
def clean(s): return html.unescape(re.sub(r"<[^>]+>", " ", s)).strip()
def text(h):
    h = re.sub(r"(?is)<(script|style|svg|noscript)[^>]*>.*?</\1>", " ", h)
    h = re.sub(r"(?i)<br\s*/?>|</(p|div|li|h\d|tr|td|th|a|span)>", "\n", h)
    t = html.unescape(re.sub(r"<[^>]+>", " ", h))
    lines, seen = [], set()
    for x in t.split("\n"):
        x = re.sub(r"[ \t‏‎]+", " ", x).strip()
        if x and x not in seen: seen.add(x); lines.append(x)
    return "\n".join(lines)
def out(**k): print("@@" + json.dumps(k, ensure_ascii=False), flush=True)
Q = [
 "فروش مواد شیمیایی آزمایشگاهی مرک", "نمایندگی سیگما آلدریچ", "فروش حلال HPLC", "خرید محلول کارل فیشر", "تولید مواد شیمیایی آزمایشگاهی دکتر مجللی",
 "فروش محیط کشت میکروبی مرک", "خرید سویه میکروبی ATCC", "فروش کیت اندوتوکسین LAL", "فروش بافر استاندارد pH", "خرید رفرنس استاندارد EP",
 "تولیدکننده مواد شیمیایی آزمایشگاهی داخلی", "واردکننده مواد شیمیایی آزمایشگاهی تهران", "خرید ناخالصی دارویی", "خرید استاندارد LGC",
]
for q in Q:
    s, b, _ = get("https://www.bing.com/search?" + urllib.parse.urlencode({"q": q, "count": "30"}))
    res = []
    for m in re.finditer(r'<li class="b_algo".*?<h2[^>]*><a[^>]*href="([^"]+)"[^>]*>(.*?)</a>(.*?)</li>', b, re.S):
        sn = re.search(r"<p[^>]*>(.*?)</p>", m.group(3), re.S)
        res.append([html.unescape(m.group(1)), clean(m.group(2)), clean(sn.group(1))[:300] if sn else ""])
    cites = [clean(c) for c in re.findall(r'<cite>(.*?)</cite>', b)]
    out(k="bing", q=q, s=s, n=len(res), r=res[:30], c=cites[:30], err="" if res else text(b)[:300])
    time.sleep(12)
SITES = ["nirvanashimi.com", "www.nirvanashimi.com", "adonisherb.ir", "arianpajooh.com"]
PATHS = ["/", "/contact-us/", "/contact/", "/about-us/", "/about/", "/تماس-با-ما/", "/درباره-ما/"]
for d in SITES:
    for p in PATHS:
        s, b, fu = get("https://" + d + urllib.parse.quote(p))
        if s == 0: s, b, fu = get("http://" + d + urllib.parse.quote(p))
        if s != 200: out(k="page", d=d, p=p, s=s, x=b[:150]); continue
        t = text(b)
        tel = sorted(set(re.findall(r"(?:0\d{2,3}[-\s]?\d{7,8}|\+98[\d\s-]{9,13}|۰[۰-۹]{2,3}[-\s]?[۰-۹]{7,8}|09\d{9})", t)))
        mail = sorted(set(re.findall(r"[\w.+-]+@[\w-]+\.[\w.]+", t)))
        title = clean((re.search(r"<title>(.*?)</title>", b, re.S) or [None, ""])[1]) if re.search(r"<title>", b) else ""
        out(k="page", d=d, p=p, s=s, u=fu, title=title, tel=tel, mail=mail[:5], x=t[:9000])
