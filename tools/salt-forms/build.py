"""PubChem lookups and checks for each candidate salt name -> salts.json and rejects.json (see README.md)."""
import json, sys, math, os, itertools
sys.path.insert(0, os.path.dirname(__file__))
from vocab import ACIDS, CATIONS, BASES, HYDRATES
from chem import parse, add, mw, fmt
import pc
HERE = os.path.dirname(os.path.abspath(__file__))
names = json.load(open(os.path.join(HERE, "candidates.json")))
SPECIAL = {"HYCLATE": "C2H10Cl2O2", "CHOLINE": "C5H13NO"}
def pieces_for(tok):
    if tok in SPECIAL: return parse(SPECIAL[tok])
    if tok in ACIDS: return parse(ACIDS[tok]) if ACIDS[tok] else None
    if tok in CATIONS:
        m, z = CATIONS[tok]; return add({m: 1}, {"H": 1}, -z)
    if tok in BASES: return parse(BASES[tok])
    return None
def split(name):
    w = name.split()
    salt, hyd = [], None
    while len(w) > 1:
        t = w[-1]
        if t in HYDRATES and hyd is None: hyd = t; w.pop(); continue
        if t == "ANHYDROUS": w.pop(); continue
        if t in ACIDS or t in CATIONS or t in BASES or t in SPECIAL:
            salt.insert(0, t); w.pop(); continue
        break
    return " ".join(w), salt, hyd
def decompose(S, B, pcs, c):
    for n in range(1, 5):
        R0 = add(S, B, -n)
        rng = [range(0, 7)] * len(pcs)
        for ks in itertools.product(*rng):
            if not all(ks): continue
            R = dict(R0)
            for p, k in zip(pcs, ks): R = add(R, p, -k)
            # remaining must be water only
            w = R.get("O", 0)
            if set(R) - {"H", "O"}: continue
            if R.get("H", 0) != 2 * w or w < 0: continue
            if c is not None and c != "any":
                if w == 0: continue
                g = math.gcd(n, *ks) if pcs else 1
                if abs(w / n - c * g / n) > 1e-9: continue
            if c == "any" and w == 0: continue
            return n, ks, w
    return None
def inchikey(cid):
    d = pc.get(f"{pc.B}/compound/cid/{cid}/property/InChIKey/JSON")
    p = (d or {}).get("PropertyTable", {}).get("Properties", [])
    return p[0].get("InChIKey") if p else None
def same_skeleton(a, b):
    """Stereoisomers (or a racemate and one enantiomer): same connectivity block of the InChIKey, hence the same formula and MW."""
    if not a or not b: return False
    ka, kb = inchikey(a), inchikey(b)
    return bool(ka and kb and ka[:14] == kb[:14])
out, rejects = [], []
def one(item):
    name, source = item
    base_name, salt_toks, hyd = split(name)
    if not salt_toks and not hyd: return
    rec = {"name": name, "base_name": base_name, "source": source}
    try:
        pcs = [pieces_for(t) for t in salt_toks]
        if any(p is None for p in pcs): rejects.append((name, "counterion not handled")); return
        sc = pc.cids_by_name(name.lower())
        if not sc: rejects.append((name, "salt not in PubChem")); return
        sp = pc.props([sc[0]]).get(sc[0])
        if not sp: rejects.append((name, "no props")); return
        if sp.get("CovalentUnitCount", 1) < 2:
            rejects.append((name, "single covalent unit (ester or not a salt)")); return
        par = pc.parent(sc[0])
        bc = pc.cids_by_name(base_name.lower())
        if not bc: rejects.append((name, "base not in PubChem")); return
        bpar = pc.parent(bc[0]) or bc[0]
        comp = ((pc.get(f"{pc.B}/compound/cid/{sc[0]}/cids/JSON?cids_type=component") or {}).get("IdentifierList", {}).get("CID", []))
        if par is None and (bpar in comp or bc[0] in comp): par = bpar
        if par != bpar and not same_skeleton(par, bpar):
            rejects.append((name, f"base name parent {bpar} != salt parent {par}")); return
        bp = pc.props([par]).get(par)
        if bp.get("Charge", 0) != 0: rejects.append((name, "charged parent (quaternary)")); return
        B = parse(bp["MolecularFormula"]); S = parse(sp["MolecularFormula"])
        if "C" not in B: rejects.append((name, "inorganic")); return
        c = None
        if hyd: c = HYDRATES[hyd] if HYDRATES[hyd] is not None else "any"
        d = decompose(S, B, pcs, c)
        if not d: rejects.append((name, f"stoichiometry mismatch {sp['MolecularFormula']} vs {bp['MolecularFormula']}")); return
        n, ks, w = d
        for t, k in zip(salt_toks, ks):
            want = 2 if t.startswith("DI") and t not in ("DIOLAMINE",) else 3 if t.startswith("TRI") and t not in ("TROMETHAMINE",) else 0.5 if t.startswith("HEMI") else None
            if want is not None and abs(k / n - want) > 1e-9:
                rejects.append((name, f"name says {t} but PubChem ratio is {k}:{n}")); return
        ms, mb = mw(S), mw(B)
        if abs(ms - float(sp["MolecularWeight"])) > 0.1 or abs(mb - float(bp["MolecularWeight"])) > 0.1:
            rejects.append((name, "MW disagrees with PubChem")); return
        anh = add(S, {"H": 2, "O": 1}, -w)
        named = S if hyd else anh
        rec.update(salt_cid=sc[0], base_cid=par, base_formula=fmt(B), n=n,
                   counter=[[t, k] for t, k in zip(salt_toks, ks)], water=(w if hyd else 0),
                   formula=fmt(named), mw_salt=round(mw(named), 3), mw_base=round(mb, 3),
                   sf=round(mw(named) / (n * mb), 5), base_title=bp.get("Title"), salt_title=sp.get("Title"))
        if w and not hyd:
            rec["pubchem_hydrate"] = {"water": w, "formula": fmt(S), "mw": round(ms, 3), "sf": round(ms / (n * mb), 5)}
        out.append(rec)
    except Exception as e:
        rejects.append((name, "error " + repr(e)))
from concurrent.futures import ThreadPoolExecutor
from concurrent.futures import as_completed
with ThreadPoolExecutor(6) as ex:
    for i, _ in enumerate(as_completed([ex.submit(one, x) for x in names])):
        if i % 50 == 0: print(i, len(out), len(rejects), flush=True)
out.sort(key=lambda r: r["name"])
json.dump(out, open(os.path.join(HERE, "salts.json"), "w"), indent=1)
json.dump(rejects, open(os.path.join(HERE, "rejects.json"), "w"), indent=1)
print("done", len(out), len(rejects))
