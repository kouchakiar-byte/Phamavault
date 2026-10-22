import os, urllib.request
ids = "29454379 248152 753416 267582 8325708 7230183 8152735 10514991 30019381 6074000 4580978 8293635".split()
os.makedirs(".github/probe/full", exist_ok=True)
for i in ids:
    url = f"https://images.pexels.com/photos/{i}/pexels-photo-{i}.jpeg?auto=compress&cs=tinysrgb&w=1800"
    r = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=60)
    open(f".github/probe/full/{i}.jpg", "wb").write(r.read())
open(".github/probe/photos.json", "w").write("ok")
