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
 "استاندارد مرجع فارماکوپه EP فروش", "نماینده LGC Standards در ایران", "تولید استاندارد ثانویه دارویی", "فروش ناخالصی دارویی impurity",
 "نمایندگی مرک آلمان مواد شیمیایی آزمایشگاهی", "نمایندگی سیگما آلدریچ ایران", "فروش حلال HPLC", "فروش محلول کارل فیشر",
 "تولیدکننده مواد شیمیایی آزمایشگاهی ایران", "فروش سویه استاندارد ATCC", "واردکننده رفرنس استاندارد دارویی", "فروش استاندارد EDQM",
 "رفرنس استاندارد BP فروش", "ورکینگ استاندارد دارویی", "مواد شیمیایی آزمایشگاهی مرک فروش تهران", "خرید رفرنس استاندارد USP",
]
for q in Q:
    s, b, _ = get("https://www.mojeek.com/search?" + urllib.parse.urlencode({"q": q}))
    res = [[m.group(1), clean(m.group(2))] for m in re.finditer(r'<a class="ob" href="([^"]+)"[^>]*>(.*?)</a>', b, re.S)]
    if not res: res = [[m.group(1), clean(m.group(2))] for m in re.finditer(r'<h2><a[^>]*href="(https?://[^"]+)"[^>]*>(.*?)</a>', b, re.S)]
    out(k="mojeek", q=q, s=s, n=len(res), r=res[:20], err="" if res else b[:300])
    time.sleep(4)
    s, b, _ = get("https://www.bing.com/search?" + urllib.parse.urlencode({"q": q, "count": "30", "setlang": "en", "cc": "us"}))
    res = []
    for m in re.finditer(r'<li class="b_algo".*?<h2[^>]*><a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', b, re.S):
        res.append([html.unescape(m.group(1)), clean(m.group(2))])
    cites = re.findall(r'<cite>(.*?)</cite>', b)
    out(k="bing", q=q, s=s, n=len(res), r=res[:30], c=[clean(c) for c in cites][:30], err="" if res else text(b)[:300])
    time.sleep(6)
SITES = ["arianpajooh.com", "rabinazma.com", "daricodarou.com", "imengostarshimi.com", "yasgene.com", "argonexir.com", "nirvanashimi.com", "manashimi.com", "www.adonisherb.ir"]
PATHS = ["/", "/contact-us/", "/contact/", "/about-us/", "/about/", "/تماس-با-ما/", "/درباره-ما/"]
for d in SITES:
    for p in PATHS:
        s, b, fu = get("https://" + d + urllib.parse.quote(p))
        if s != 200: out(k="page", d=d, p=p, s=s, x=b[:150]); continue
        t = text(b)
        tel = sorted(set(re.findall(r"(?:0\d{2,3}[-\s]?\d{7,8}|\+98[\d\s-]{9,13}|۰[۰-۹]{2,3}[-\s]?[۰-۹]{7,8}|09\d{9})", t)))
        mail = sorted(set(re.findall(r"[\w.+-]+@[\w-]+\.[\w.]+", t)))
        title = clean((re.search(r"<title>(.*?)</title>", b, re.S) or [None, ""])[1]) if re.search(r"<title>", b) else ""
        out(k="page", d=d, p=p, s=s, u=fu, title=title, tel=tel, mail=mail[:5], x=t[:9000])
