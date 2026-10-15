import re, html, urllib.request, urllib.parse, ssl
ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
def get(u):
    try:
        r = urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=30, context=ctx)
        return r.status, r.read().decode("utf-8", "replace")
    except Exception as e:
        return 0, str(e)
for u in ["https://cppsynd.com/", "https://cppsynd.com/wp-sitemap.xml", "https://cppsynd.com/sitemap_index.xml", "https://cppsynd.com/sitemap.xml"]:
    s, b = get(u); print("==", u, s, len(b))
    if s == 200 and "xml" in u:
        for loc in re.findall(r"<loc>([^<]+)</loc>", b): print("  ", urllib.parse.unquote(loc))
s, b = get("https://cppsynd.com/")
print("== home links")
for h in sorted(set(re.findall(r'href="(https://cppsynd\.com/[^"#?]+)"', b))): print("  ", urllib.parse.unquote(h))
