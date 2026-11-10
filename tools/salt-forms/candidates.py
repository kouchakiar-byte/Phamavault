"""Ingredient names that end in a counter-ion or hydrate word, from the FDA Orange Book
(products.txt) and the FDA NDC directory (openFDA drug-ndc JSON) -> candidates.json."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vocab import ACIDS, CATIONS, BASES, HYDRATES
WORDS = set(ACIDS) | set(CATIONS) | set(BASES) | set(HYDRATES) | {"HYCLATE", "CHOLINE", "ANHYDROUS"}
keep = lambda n: len(n.split()) > 1 and n.split()[-1] in WORDS
ob, ndc = set(), set()
with open(sys.argv[1], encoding="latin1") as f:
    next(f)
    for line in f:
        for part in line.split("~")[0].split(";"):
            ob.add(part.strip().upper())
for r in json.load(open(sys.argv[2]))["results"]:
    for a in r.get("active_ingredients", []):
        ndc.add(a["name"].strip().upper())
names = [[n, "OB"] for n in sorted(ob) if keep(n)] + [[n, "NDC"] for n in sorted(ndc - ob) if keep(n)]
json.dump(names, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "candidates.json"), "w"), indent=0)
print(len(names))
