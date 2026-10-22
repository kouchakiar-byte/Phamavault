import os, urllib.request
H = {"User-Agent": "Mozilla/5.0"}
os.makedirs(".github/probe/full", exist_ok=True)
for i in "4068312 8015465 13787561 4492104 3735773 4580978".split():
    url = f"https://images.pexels.com/photos/{i}/pexels-photo-{i}.jpeg?auto=compress&cs=tinysrgb&w=1800"
    open(f".github/probe/full/{i}.jpg", "wb").write(urllib.request.urlopen(urllib.request.Request(url, headers=H), timeout=60).read())
open(".github/probe/photos.json", "w").write("ok")
