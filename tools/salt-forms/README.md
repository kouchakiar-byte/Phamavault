# Salt forms table

Builds `src/data/salt-forms.json`, the table behind the "Salt ↔ base converter" calculator.

```
python3 tools/salt-forms/candidates.py <products.txt> <drug-ndc.json>   # ingredient names that end in a counter-ion or hydrate word
python3 tools/salt-forms/build.py                       # PubChem lookups and checks → salts.json, rejects.json
python3 tools/salt-forms/export.py .                    # → src/data/salt-forms.json (adds the Persian names the site knows)
```

`products.txt` is in the FDA Orange Book data files (https://www.fda.gov/media/76860/download);
`drug-ndc.json` is the openFDA NDC directory download (https://open.fda.gov/data/downloads/).
Only the Python 3 standard library is used; PubChem answers are cached in `tools/salt-forms/cache/` (git-ignored).

## What makes a row

For every Orange Book or NDC ingredient whose name ends in a counter-ion or hydrate word
(`HYDROCHLORIDE`, `SODIUM`, `CITRATE`, `MONOHYDRATE` …) the build:

1. looks the salt name up in PubChem and keeps it only when PubChem holds it as a salt
   (more than one covalent unit; esters such as hydrocortisone acetate drop out here);
2. looks the base name up separately and keeps the row only when it is the same parent
   compound as the salt's parent (or one of the salt's components);
3. drops charged parents (quaternary ammonium "salts" have no free base) and inorganic ones;
4. solves the stoichiometry: salt formula = n × base + k × counter-ion (+ water), with the
   counter-ion taken from the name; a `DI`, `TRI` or `HEMI` prefix must match the ratio found,
   and a hydrate word must match the water found;
5. computes both molecular weights from the formulas with the IUPAC/CIAAW 2021 standard
   atomic weights and keeps the row only when each agrees with PubChem within 0.1 g/mol.

Code names and systematic names of research substances are left out at export. Any name that fails a step is left out (see `rejects.json` after a build) rather than guessed.
When PubChem's record for a name without a hydrate word is a hydrate, the row is the anhydrous
salt and the hydrate is given alongside it (`h`).
