import os, urllib.request
H = {"User-Agent": "PharmaVaultPhotoProbe/1.0 (contact: info@pharmavault.ir)"}
os.makedirs(".github/probe/full", exist_ok=True)
url = "https://upload.wikimedia.org/wikipedia/commons/9/9b/High-performance_liquid_chromatography.jpg"
open(".github/probe/full/qc-hplc.jpg", "wb").write(urllib.request.urlopen(urllib.request.Request(url, headers=H), timeout=60).read())
open(".github/probe/photos.json", "w").write("ok")
