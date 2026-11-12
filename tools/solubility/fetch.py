"""
Solubility statements for the raw-material database, from PubChem.

For every API in src/data/raw-materials.json the PubChem compound is found by
CAS number (then by name), and the "Solubility" section of its PubChem record
is read. Only statements from sources whose terms allow re-publication on a
commercial site are kept:

  HSDB   Hazardous Substances Data Bank (US National Library of Medicine; public domain)
  NIOSH  NIOSH Pocket Guide (US government; public domain)
  ICSC   ILO-WHO International Chemical Safety Cards (CC BY 4.0)

DrugBank (CC BY-NC) and CAMEO Chemicals (restricted terms) are left out.
Statements are kept word for word; the water value is parsed only to place it
in the USP descriptive term (see parse.py).

Run:  python3 tools/solubility/fetch.py   (results cached in tools/salt-forms/cache)
"""
import json, os, sys, urllib.parse
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "salt-forms"))
import pc  # noqa: E402  (shared, rate-limited, cached PubChem client)

SOURCES = {
    "Hazardous Substances Data Bank (HSDB)": "HSDB",
    "The National Institute for Occupational Safety and Health (NIOSH)": "NIOSH",
    "ILO-WHO International Chemical Safety Cards (ICSCs)": "ICSC",
}
VIEW = "https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/{}/JSON?heading=Solubility"


def cid_for(item):
    for q in (item.get("cas"), item["name"]):
        if not q:
            continue
        cids = pc.cids_by_name(q)
        if cids:
            return cids[0]
    return None


def statements(cid):
    d = pc.get(VIEW.format(cid))
    if not d:
        return []
    refs = {r["ReferenceNumber"]: r for r in d["Record"].get("Reference", [])}
    out = []

    def walk(sec):
        for info in sec.get("Information", []):
            src = SOURCES.get(refs.get(info.get("ReferenceNumber"), {}).get("SourceName", ""))
            if not src:
                continue
            for m in info.get("Value", {}).get("StringWithMarkup", []):
                t = " ".join(m["String"].split())
                if t and (t, src) not in out:
                    out.append((t, src))
        for c in sec.get("Section", []):
            walk(c)

    walk(d["Record"])
    return out


def main():
    items = json.load(open(os.path.join(ROOT, "src/data/raw-materials.json")))["items"]

    def one(it):
        cid = cid_for(it)
        return it["name"], cid, statements(cid) if cid else []

    with ThreadPoolExecutor(4) as ex:
        rows = list(ex.map(one, items))
    out = [{"name": n, "cid": c, "s": [list(x) for x in s]} for n, c, s in rows]
    json.dump(out, open(os.path.join(HERE, "raw.json"), "w"), ensure_ascii=False, indent=1)
    print("items", len(out), "with cid", sum(1 for r in out if r["cid"]), "with statements", sum(1 for r in out if r["s"]))


if __name__ == "__main__":
    main()
