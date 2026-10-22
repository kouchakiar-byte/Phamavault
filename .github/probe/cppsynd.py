# Temporary probe: download the syndicate's current product lists (محصولات page)
# and keep their text, so the supplier bank can be checked against them.
import json, re, html, urllib.request, urllib.parse, ssl, subprocess, os

ctx = ssl.create_default_context()
UA = {"User-Agent": "Mozilla/5.0 (PharmaVault catalog check)"}
os.makedirs(".github/probe/lists", exist_ok=True)

def get(url, binary=False):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60, context=ctx) as r:
        data = r.read()
    return data if binary else data.decode("utf-8", "replace")

out = {"links": [], "files": {}}
for page in ["https://cppsynd.com/محصولات/", "https://cppsynd.com/لیست-قیمت/"]:
    h = get(urllib.parse.quote(page, safe=":/"))
    for href, label in re.findall(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', h, re.S):
        label = re.sub(r"<[^>]+>", " ", html.unescape(label)).strip()
        if re.search(r"\.(pdf|xlsx?|docx?)(\?|$)", href, re.I):
            out["links"].append({"page": page, "href": href, "label": label})
for i, l in enumerate(out["links"]):
    href = l["href"]
    try:
        data = get(urllib.parse.quote(href, safe=":/%?=&"), binary=True)
    except Exception as e:
        out["files"][href] = f"__ERR__ {e}"
        continue
    ext = re.search(r"\.(pdf|xlsx?|docx?)", href, re.I).group(1).lower()
    path = f"/tmp/f{i}.{ext}"
    open(path, "wb").write(data)
    txt = ""
    if ext == "pdf":
        txt = subprocess.run(["pdftotext", "-layout", path, "-"], capture_output=True, text=True).stdout
    elif ext in ("xlsx", "xls"):
        try:
            import openpyxl
            wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
            rows = []
            for ws in wb.worksheets:
                rows.append(f"### sheet {ws.title}")
                for row in ws.iter_rows(values_only=True):
                    cells = [str(c).strip() for c in row if c is not None and str(c).strip()]
                    if cells:
                        rows.append(" | ".join(cells))
            txt = "\n".join(rows)
        except Exception as e:
            txt = f"__XLSX_ERR__ {e}"
    name = f".github/probe/lists/{i:02d}.txt"
    open(name, "w", encoding="utf-8").write(txt)
    out["files"][href] = {"bytes": len(data), "text": name, "chars": len(txt)}
json.dump(out, open(".github/probe/lists.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(json.dumps(out, ensure_ascii=False)[:3000])
