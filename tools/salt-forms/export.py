"""salts.json (build.py) -> src/data/salt-forms.json for the site, with Persian names the site already knows."""
import json, os, re, sys, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = sys.argv[1]
salts = json.load(open(os.path.join(HERE, "salts.json")))
raw = json.load(open(os.path.join(REPO, "src/data/raw-materials.json")))
raw = raw["items"] if isinstance(raw, dict) else raw
FA = re.compile(r"[؀-ۿ]")
INN = {"besilate": "besylate", "mesilate": "mesylate", "tosilate": "tosylate", "esilate": "esylate", "sulphate": "sulfate"}
def key(s):
    s = s.lower().strip()
    for a, b in INN.items(): s = s.replace(a, b)
    return re.sub(r"\s+", " ", s)
fa_of = {}
for it in raw:
    syn = [x.strip() for x in re.split(r"[,،]", it.get("synonyms") or "") if x.strip()]
    fas = [x for x in syn if FA.search(x)]
    if fas:
        for name in [it["name"]] + [x for x in syn if not FA.search(x)]:
            fa_of.setdefault(key(name), fas[0])
src = open(os.path.join(REPO, "src/data/interactions.ts"), encoding="utf8").read()
for en, fa in re.findall(r'd\("[^"]+", "([^"]+)", "([^"]+)"', src):
    fa_of.setdefault(key(en), fa)
SHOW = {"HYDROCHLORIDE": "HCl", "HCL": "HCl", "DIHYDROCHLORIDE": "HCl", "HYDROBROMIDE": "HBr", "HYDROIODIDE": "HI",
        "SULFATE": "H2SO4", "BISULFATE": "H2SO4", "HEMISULFATE": "H2SO4", "PHOSPHATE": "H3PO4", "DIPHOSPHATE": "H3PO4", "NITRATE": "HNO3",
        "SODIUM": "Na", "DISODIUM": "Na", "TRISODIUM": "Na", "POTASSIUM": "K", "DIPOTASSIUM": "K", "CALCIUM": "Ca", "MAGNESIUM": "Mg",
        "ZINC": "Zn", "STRONTIUM": "Sr", "LITHIUM": "Li", "ALUMINUM": "Al", "HYCLATE": "2 HCl + C2H5OH + H2O"}
def title(s):
    return " ".join(w[:1] + w[1:].lower() if not w[:1].isdigit() else w.lower() for w in s.split())
def title_word(w):
    return "-".join(p[:1].upper() + p[1:].lower() for p in w.split("-"))
rows = []
for r in salts:
    ct = []
    for tok, k in r["counter"]:
        nm = SHOW.get(tok, title_word(tok).replace("Dimesylate", "Mesylate").replace("Dimeglumine", "Meglumine").replace("Hemifumarate", "Fumarate"))
        if tok == "HYCLATE": ct.append(nm); continue
        ct.append(f"{k} {nm}" if k != 1 else nm)
    en = " ".join(title_word(w) for w in r["name"].split())
    base = " ".join(title_word(w) for w in r["base_name"].split())
    # Code names and systematic names of research substances (NDC listings) are left out.
    if re.search(r"\d", base) and "'-" not in base:
        continue
    fa = fa_of.get(key(en)) or fa_of.get(key(base))
    row = {"en": en, "base": base, "n": r["n"], "ct": " + ".join(ct), "w": r["water"], "f": r["formula"], "fb": r["base_formula"],
           "ms": r["mw_salt"], "mb": r["mw_base"], "sf": r["sf"], "cid": r["salt_cid"], "bcid": r["base_cid"], "src": r["source"]}
    if fa: row["fa"] = fa
    if r.get("pubchem_hydrate"):
        h = r["pubchem_hydrate"]; row["h"] = {"w": h["water"], "f": h["formula"], "ms": h["mw"], "sf": h["sf"]}
    rows.append(row)
rows.sort(key=lambda x: x["en"])
seen = set(); uniq = []
for x in rows:
    if x["en"] in seen: continue
    seen.add(x["en"]); uniq.append(x)
out = {"source": "FDA Orange Book and FDA NDC directory ingredient names; formulas and stoichiometry checked against PubChem; MW from IUPAC/CIAAW 2021 standard atomic weights",
       "built": datetime.date.today().isoformat(), "rows": uniq}
json.dump(out, open(os.path.join(REPO, "src/data/salt-forms.json"), "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
print(len(uniq), sum(1 for x in uniq if "fa" in x))
