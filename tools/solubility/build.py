"""
Builds src/data/solubility.json from raw.json (fetch.py).

Kept for each API:
  - the PubChem CID, only when the PubChem molecular weight agrees with the
    database's (so a CAS or name lookup that landed on another form is dropped);
  - the solubility statements word for word, minus those that HSDB marks as
    being about another form (a trailing "/Hydrochloride/", "/21-acetate/" …),
    table placeholders and "see the HSDB record" lines;
  - one water value in mg/mL, parsed from an explicit statement, to place the
    substance in the USP descriptive solubility term. Measured values are
    preferred to estimated ones, and values near 20–25 °C to others; values
    given at a stated pH are left in their statement only.

Run:  python3 tools/solubility/build.py
"""
import json, os, re, sys, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "salt-forms"))
import pc  # noqa: E402

KEEP_TAGS = {"estimated", "form not specified"}
NUM = r"(\d+(?:[.,]\d+)*(?:\s*[xX×]\s*10\s*\(?\s*([+\-−]?\d+)\)?)?)"


def words(s):
    return set(re.findall(r"[a-z]+", s.lower())) - {"salt", "anhydrous", "the"}


def keep(text, name):
    if text.startswith("For more Solubility") or "[Table#" in text:
        return False
    m = re.search(r"/([^/]{2,80})/\s*\.?$", text)
    if not m:
        return True
    tag = m.group(1).strip()
    if tag.lower() in KEEP_TAGS:
        return True
    # a tag naming the database's own form ("/LIDOCAINE HYDROCHLORIDE/" for Lidocaine hydrochloride)
    tw = words(tag)
    return bool(tw) and tw <= words(name) | {"l", "d", "dl"}


def num(s):
    m = re.fullmatch(r"(\d+(?:[.,]\d+)*)(?:\s*[xX×]\s*10\s*\(?\s*([+\-−]?\d+)\)?)?", s.strip())
    if not m:
        return None
    base = m.group(1)
    # "4,600" is a thousands separator; "0,5" would be a decimal comma (not used by HSDB)
    base = base.replace(",", "") if re.fullmatch(r"\d{1,3}(,\d{3})+(\.\d+)?", base) else base.replace(",", ".")
    try:
        v = float(base)
    except ValueError:
        return None
    if m.group(2):
        v *= 10 ** int(m.group(2).replace("−", "-"))
    return v


UNIT = {"mg/l": 1e-3, "g/l": 1.0, "mg/ml": 1.0, "g/ml": 1000.0, "ug/ml": 1e-3, "µg/ml": 1e-3, "g/100 ml": 10.0, "g/100ml": 10.0, "g/100 cc": 10.0, "g/100cc": 10.0, "g/dl": 10.0}


def water_values(text, src):
    """(mg/mL, temp °C or None, estimated) from one statement, when it states a water solubility explicitly."""
    out = []
    est = "/estimated/" in text.lower()
    t = text.replace("−", "-")
    # "In water, 4,600 mg/L at 25 °C" / "Solubility in water: 0.23 g/L at 0 °C, 11.4 g/L at 25 °C"
    m = re.match(r"^\s*(?:in water|solubility in water|water solubility|sol(?:uble|ubility)? in water)\s*[,:]?\s*(?:approx\.?\s*|about\s*)?(.*)$", t, re.I)
    if m:
        for pre, v, _, u, temp in re.findall(r"([-–<>≤≥]\s*)?" + NUM + r"\s*(mg/L|g/L|mg/mL|g/mL|ug/mL|µg/mL|g/100 ?mL|g/100 ?cc|g/dL)(?:\s*water)?(?:\s*(?:at|@)\s*(-?\d+(?:\.\d+)?)\s*°?\s*C)?", m.group(1), re.I):
            if pre:  # the end of a range ("5-8 mg/L") or a bound ("<100 mg/L"): the statement is shown, no single value is taken
                continue
            x = num(v)
            if x is not None and not re.search(r"\d\s*[-–]\s*$", m.group(1)[: m.group(1).find(v)]):
                out.append((x * UNIT[u.lower()], float(temp) if temp else None, est, 0))
    # ICSC: "Solubility in water, g/100ml at 25 °C: 0.01"
    m = re.match(r"^Solubility in water, g/100\s?ml(?: at (\d+) °C)?: " + NUM + r"\s*(?:\(|$)", t)
    if m:
        x = num(m.group(2))
        if x is not None:
            out.append((x * 10.0, float(m.group(1)) if m.group(1) else None, False, 1))
    # "1 g dissolves in 300 mL water" / "1 g sol in: 300 mL water at 25 °C"
    m = re.search(r"\b1 g (?:dissolves|is soluble|sol)\.? in:?\s*(?:about\s*|approx\.?\s*)?" + NUM + r"\s*mL (?:of )?(?:water|H2O)(?:\s*at (\d+) °C)?", t, re.I)
    if m:
        x = num(m.group(1))
        if x:
            out.append((1000.0 / x, float(m.group(3)) if m.group(3) else None, est, 2))
    return out


def best(values):
    def score(v):
        mg, temp, est, kind = v
        near = temp is not None and 18 <= temp <= 30
        return (est, not near, temp is None, kind)
    return sorted(values, key=score)[0] if values else None


def main():
    raw = json.load(open(os.path.join(HERE, "raw.json")))
    db = {i["name"]: i for i in json.load(open(os.path.join(ROOT, "src/data/raw-materials.json")))["items"]}
    props = pc.props([r["cid"] for r in raw if r["cid"]])
    items, dropped_mw = {}, []
    for r in raw:
        if not r["cid"] or not r["s"]:
            continue
        mw_db = float(re.sub(r"[^\d.]", "", db[r["name"]].get("mw") or "0") or 0)
        mw_pc = float(props.get(r["cid"], {}).get("MolecularWeight") or 0)
        if mw_db and mw_pc and abs(mw_db - mw_pc) / mw_db > 0.01:
            dropped_mw.append((r["name"], mw_db, mw_pc))
            continue
        s = [[t, src] for t, src in r["s"] if keep(t, r["name"])]
        if not s:
            continue
        # a value given at a stated pH is not one figure for the substance: it stays in its statement only
        vals = [v + (src, i) for i, (t, src) in enumerate(s) if not re.search(r"\bpH\b", t, re.I) for v in water_values(t, src)]
        b = best([v[:4] for v in vals])
        row = {"cid": r["cid"], "s": s}
        if b:
            src, i = next(v[4:] for v in vals if v[:4] == b)
            row["w"] = {"mg": float(f"{b[0]:.3g}"), "t": b[1], "est": b[2], "src": src, "i": i}
        items[r["name"]] = row
    out = {"generated": datetime.date.today().isoformat(), "items": items}
    json.dump(out, open(os.path.join(ROOT, "src/data/solubility.json"), "w"), ensure_ascii=False, indent=1)
    print("items", len(items), "with water value", sum(1 for v in items.values() if "w" in v), "dropped (MW mismatch)", len(dropped_mw))
    for d in dropped_mw:
        print("  MW", d)


if __name__ == "__main__":
    main()
