import os, urllib.request
H = {"User-Agent": "PharmaVaultPhotoProbe/1.0 (contact: info@pharmavault.ir)"}
os.makedirs(".github/probe/full", exist_ok=True)
url = "https://upload.wikimedia.org/wikipedia/commons/8/80/Caffeine-ball-and-stick.png"
open(".github/probe/full/api.png", "wb").write(urllib.request.urlopen(urllib.request.Request(url, headers=H), timeout=60).read())
open(".github/probe/photos.json", "w").write("ok")
