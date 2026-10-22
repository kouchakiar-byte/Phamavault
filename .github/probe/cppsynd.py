# Temporary probe: list the member pages of the pharmaceutical raw-material
# producers' syndicate (cppsynd.com) and keep the text of each page.
import json, re, html, urllib.request, urllib.parse, ssl, time

ctx = ssl.create_default_context()
UA = {"User-Agent": "Mozilla/5.0 (PharmaVault catalog check)"}

def get(url):
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=30, context=ctx) as r:
            return r.read().decode("utf-8", "replace")
    except Exception as e:
        return f"__ERR__ {e}"

def text(h):
    h = re.sub(r"(?is)<(script|style|noscript).*?</\1>", " ", h)
    h = re.sub(r"(?s)<[^>]+>", "\n", h)
    h = html.unescape(h)
    return "\n".join(l.strip() for l in h.splitlines() if l.strip())

out = {"sitemaps": {}, "pages": {}}
seen = set()
for sm in ["https://cppsynd.com/sitemap_index.xml", "https://cppsynd.com/wp-sitemap.xml", "https://cppsynd.com/sitemap.xml"]:
    body = get(sm)
    out["sitemaps"][sm] = body[:3000]
    for loc in re.findall(r"<loc>([^<]+)</loc>", body):
        seen.add(loc.strip())
# expand nested sitemaps
for loc in list(seen):
    if loc.endswith(".xml"):
        body = get(loc)
        out["sitemaps"][loc] = body[:500]
        for l in re.findall(r"<loc>([^<]+)</loc>", body):
            seen.add(l.strip())
urls = sorted(u for u in seen if not u.endswith(".xml"))
out["urls"] = urls
home = get("https://cppsynd.com/")
out["home"] = text(home)[:20000]
out["home_links"] = sorted(set(re.findall(r'href="(https://cppsynd\.com/[^"#?]+)"', home)))
for u in urls[:400]:
    if any(x in u for x in ["/tag/", "/category/", "/author/", "/feed"]):
        continue
    t = text(get(u))
    out["pages"][urllib.parse.unquote(u)] = t[:6000]
    time.sleep(0.3)
json.dump(out, open(".github/probe/cppsynd.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(urls), "urls", len(out["pages"]), "pages")
