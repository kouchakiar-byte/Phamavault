import json, os, time, urllib.request, urllib.parse, hashlib, threading
_lock = threading.Lock()
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cache")
os.makedirs(CACHE, exist_ok=True)
_last = [0.0]
def get(url):
    key = hashlib.sha1(url.encode()).hexdigest()
    p = os.path.join(CACHE, key + ".json")
    if os.path.exists(p):
        return json.load(open(p))
    for attempt in range(5):
        with _lock:
            wait = 0.21 - (time.time() - _last[0])
            if wait > 0: time.sleep(wait)
            _last[0] = time.time()
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                data = json.load(r)
            break
        except urllib.error.HTTPError as e:
            if e.code == 404:
                data = None; break
            if e.code in (503, 429, 500): time.sleep(2 * (attempt + 1)); continue
            data = None; break
        except Exception:
            time.sleep(2 * (attempt + 1))
    else:
        return None
    tmp = p + ".%d" % threading.get_ident()
    json.dump(data, open(tmp, "w")); os.replace(tmp, p)
    return data
B = "https://pubchem.ncbi.nlm.nih.gov/rest/pug"
def cids_by_name(name):
    d = get(f"{B}/compound/name/{urllib.parse.quote(name)}/cids/JSON")
    return (d or {}).get("IdentifierList", {}).get("CID", [])
PROPS = "Title,MolecularFormula,MolecularWeight,CovalentUnitCount,Charge,IUPACName"
def props(cids):
    out = {}
    cids = list(cids)
    for i in range(0, len(cids), 100):
        chunk = ",".join(map(str, cids[i:i+100]))
        d = get(f"{B}/compound/cid/{chunk}/property/{PROPS}/JSON")
        for p in (d or {}).get("PropertyTable", {}).get("Properties", []):
            out[p["CID"]] = p
    return out
def parent(cid):
    d = get(f"{B}/compound/cid/{cid}/cids/JSON?cids_type=parent")
    l = (d or {}).get("IdentifierList", {}).get("CID", [])
    return l[0] if l else None
