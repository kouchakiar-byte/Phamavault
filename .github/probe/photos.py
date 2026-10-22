import os, urllib.request, json
ids = "3861457 3735709 8442110 3825458 8940516 3912364 3938023 4031692 4033144 9574330 85276 268457 357514 4502977 32201000 8654752 10347152 8293774 8052843 7841833".split()
os.makedirs(".github/probe/thumbs", exist_ok=True)
out = {}
for i in ids:
    for w, d in ((640, "thumbs"),):
        url = f"https://images.pexels.com/photos/{i}/pexels-photo-{i}.jpeg?auto=compress&cs=tinysrgb&w={w}"
        try:
            r = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=30)
            open(f".github/probe/{d}/{i}.jpg", "wb").write(r.read()); out[i] = "ok"
        except Exception as e:
            out[i] = str(e)
json.dump(out, open(".github/probe/photos.json", "w"), indent=1)
