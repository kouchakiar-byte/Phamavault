import re, html, json, urllib.request, urllib.parse, ssl, time
ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36", "Accept-Language": "fa-IR,fa;q=0.9,en;q=0.8"}
def get(u):
    try:
        r = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=40, context=ctx)
        return r.status, r.read().decode("utf-8", "replace")
    except Exception as e:
        return 0, str(e)
def clean(s): return html.unescape(re.sub(r"<[^>]+>", " ", s)).strip()
def out(**k): print("@@" + json.dumps(k, ensure_ascii=False), flush=True)
Q = [
 "فروش استاندارد USP", "خرید رفرنس استاندارد دارویی", "استاندارد مرجع فارماکوپه EP فروش", "نماینده LGC Standards در ایران",
 "تولید استاندارد ثانویه دارویی", "فروش ناخالصی دارویی impurity standard", "نمایندگی مرک آلمان مواد شیمیایی آزمایشگاهی",
 "نمایندگی سیگما آلدریچ ایران", "فروش حلال HPLC تهران", "فروش محلول کارل فیشر", "مواد شیمیایی آزمایشگاهی کنترل کیفیت دارو",
 "تولیدکننده مواد شیمیایی آزمایشگاهی ایران", "فروش بافر استاندارد pH", "فروش سویه استاندارد ATCC", "فروش محیط کشت میکروبی آزمایشگاه کنترل کیفیت",
 "استاندارد مرجع دارویی واردکننده", "Iran distributor USP reference standards", "reference standards supplier Tehran pharmaceutical",
 "فروش استاندارد EDQM", "استاندارد کروماتوگرافی فروش ایران", "ریجنت آزمایشگاهی دارویی فروش",
]
for q in Q:
    s, b = get("https://html.duckduckgo.com/html/?" + urllib.parse.urlencode({"q": q, "kl": "ir-fa"}))
    res = []
    for m in re.finditer(r'class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>.*?class="result__snippet"[^>]*>(.*?)</a>', b, re.S):
        u = m.group(1)
        if "uddg=" in u: u = urllib.parse.unquote(urllib.parse.parse_qs(urllib.parse.urlparse(u).query).get("uddg", [u])[0])
        res.append([u, clean(m.group(2)), clean(m.group(3))[:300]])
    out(k="ddg", q=q, s=s, n=len(res), r=res[:25], err=b[:200] if not res else "")
    s, b = get("https://www.bing.com/search?" + urllib.parse.urlencode({"q": q, "count": "30"}))
    res = []
    for m in re.finditer(r'<li class="b_algo".*?<h2[^>]*><a[^>]*href="([^"]+)"[^>]*>(.*?)</a>(.*?)</li>', b, re.S):
        sn = re.search(r"<p[^>]*>(.*?)</p>", m.group(3), re.S)
        res.append([m.group(1), clean(m.group(2)), clean(sn.group(1))[:300] if sn else ""])
    out(k="bing", q=q, s=s, n=len(res), r=res[:30], err=b[:200] if not res else "")
    time.sleep(2)
