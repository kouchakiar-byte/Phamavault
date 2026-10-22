import os, urllib.request
H = {"User-Agent": "PharmaVaultPhotoProbe/1.0 (contact: info@pharmavault.ir)"}
os.makedirs(".github/probe/full", exist_ok=True)
url = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Collection_of_colorful_binders_on_a_shelf_for_storing_documents_in_an_office_setting.jpg/1800px-Collection_of_colorful_binders_on_a_shelf_for_storing_documents_in_an_office_setting.jpg"
open(".github/probe/full/qa-binders.jpg", "wb").write(urllib.request.urlopen(urllib.request.Request(url, headers=H), timeout=60).read())
open(".github/probe/photos.json", "w").write("ok")
