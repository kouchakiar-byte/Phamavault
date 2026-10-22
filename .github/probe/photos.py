import os, urllib.request
H = {"User-Agent": "PharmaVaultPhotoProbe/1.0 (contact: info@pharmavault.ir)"}
os.makedirs(".github/probe/full", exist_ok=True)
files = {
    "qc-doe.jpg": "https://upload.wikimedia.org/wikipedia/commons/2/29/U.S._Department_of_Energy_-_Science_-_408_041_001_%289788226824%29.jpg",
    "qc-fda.jpg": "https://upload.wikimedia.org/wikipedia/commons/0/09/Toxicology_Research_at_FDA_%28NCTR_-_Biochemical_Toxicology_Division%29_%286022922674%29.jpg",
    "qa-357514.jpg": "https://images.pexels.com/photos/357514/pexels-photo-357514.jpeg?auto=compress&cs=tinysrgb&w=1800",
    "qa-4502977.jpg": "https://images.pexels.com/photos/4502977/pexels-photo-4502977.jpeg?auto=compress&cs=tinysrgb&w=1800",
}
for name, url in files.items():
    open(f".github/probe/full/{name}", "wb").write(urllib.request.urlopen(urllib.request.Request(url, headers=H), timeout=60).read())
open(".github/probe/photos.json", "w").write("ok")
