import json, re, time, urllib.request, urllib.parse
NAMES = ["amodiaquine hydrochloride","atropine sulfate","bedaquiline fumarate","benznidazole","calcium folinate","carbimazole","clofazimine","delamanid","desmopressin acetate","diloxanide furoate","etonogestrel","mifepristone","miltefosine","paliperidone","ranitidine hydrochloride","rifabutin","rifapentine","tranexamic acid",
"canagliflozin","saxagliptin hydrochloride","edoxaban tosylate","desvenlafaxine succinate","ziprasidone hydrochloride","lurasidone hydrochloride","silodosin","mirabegron","tofacitinib citrate","baricitinib","apremilast","bilastine","tapentadol hydrochloride","oxycodone hydrochloride","brivaracetam","perampanel","eslicarbazepine acetate","safinamide mesylate","varenicline tartrate","dexmedetomidine hydrochloride","sugammadex sodium","nirmatrelvir","baloxavir marboxil","isavuconazonium sulfate","tigecycline","tedizolid phosphate","dalbavancin","ertapenem sodium","secnidazole"]
B = "https://pubchem.ncbi.nlm.nih.gov/rest/pug"
def get(u):
    for i in range(3):
        try:
            return json.loads(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "PharmaVault/1.0"}), timeout=30).read())
        except Exception as e:
            err = str(e); time.sleep(1.5)
    return {"error": err}
for n in NAMES:
    q = urllib.parse.quote(n)
    p = get(f"{B}/compound/name/{q}/property/Title,MolecularFormula,MolecularWeight,IUPACName/JSON")
    props = (p.get("PropertyTable") or {}).get("Properties") or []
    out = {"query": n, "props": props[:2]}
    if props:
        cid = props[0]["CID"]
        s = get(f"{B}/compound/cid/{cid}/synonyms/JSON")
        syn = ((s.get("InformationList") or {}).get("Information") or [{}])[0].get("Synonym", [])
        out["cas"] = [x for x in syn if re.fullmatch(r"\d{2,7}-\d{2}-\d", x)][:4]
        out["syn"] = syn[:6]
    else:
        out["error"] = p.get("error") or p.get("Fault")
    print("@@" + json.dumps(out, ensure_ascii=False), flush=True)
    time.sleep(0.4)
