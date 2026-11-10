import re
from fractions import Fraction
# IUPAC standard atomic weights, conventional/abridged values (CIAAW 2021).
AW = {"H":1.008,"C":12.011,"N":14.007,"O":15.999,"S":32.06,"P":30.973762,"Cl":35.45,"Br":79.904,"I":126.90447,
 "F":18.998403163,"Na":22.98976928,"K":39.0983,"Ca":40.078,"Mg":24.305,"Zn":65.38,"Sr":87.62,"Li":6.94,
 "Al":26.9815384,"B":10.81,"Se":78.971,"Fe":55.845,"Si":28.085,"Bi":208.98040,"Pt":195.084,"Gd":157.25,
 "Co":58.933194,"Cu":63.546,"Mn":54.938043,"As":74.921595,"Au":196.966570,"Ag":107.8682,"Ga":69.723,
 "Ba":137.327,"Sb":121.760,"Ti":47.867,"Cr":51.9961,"La":138.90547,"Hg":200.592,"Sn":118.710,"Mo":95.95,"W":183.84}
def parse(f):
    f = re.sub(r"[+-]\d*$", "", f.strip())
    out = {}
    for el, n in re.findall(r"([A-Z][a-z]?)(\d*)", f):
        out[el] = out.get(el, 0) + (int(n) if n else 1)
    return out
def add(a, b, k=1):
    o = dict(a)
    for e, n in b.items():
        o[e] = o.get(e, 0) + k * n
        if o[e] == 0: del o[e]
    return o
def mw(d):
    return sum(AW[e] * n for e, n in d.items())
def fmt(d):
    order = ["C", "H"] + sorted(e for e in d if e not in ("C", "H"))
    s = ""
    for e in order:
        if e in d and d[e]:
            n = d[e]
            s += e + ("" if n == 1 else (str(n) if float(n).is_integer() else str(n)))
    return s
