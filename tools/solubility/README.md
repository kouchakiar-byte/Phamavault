# Solubility data

Builds `src/data/solubility.json` for the solubility finder (`/materials/solubility`).

1. `python3 tools/solubility/fetch.py` finds each API of `src/data/raw-materials.json` in
   PubChem (by CAS number, then by name) and keeps the "Solubility" statements from sources
   whose terms allow re-publication: HSDB (US National Library of Medicine, public domain),
   NIOSH (US government) and ICSC (CC BY 4.0). DrugBank (CC BY-NC) and CAMEO are left out.
   Output: `tools/solubility/raw.json`. PubChem responses are cached in `tools/salt-forms/cache`.
2. `python3 tools/solubility/build.py` checks each PubChem match by molecular weight, drops
   statements HSDB marks as being about another form ("/Hydrochloride/", "/21-acetate/" …),
   and parses one water value in mg/mL (measured before estimated, 20–25 °C first, no ranges,
   bounds or pH-specific values) for the pharmacopoeial descriptive term.

Statements are published word for word with their source. Excipient solubility comes from the
excipient monographs (`src/data/monographs`) at page build time.
