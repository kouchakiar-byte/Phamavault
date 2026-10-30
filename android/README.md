# PharmaVault Android app

A light Android app that shows pharmavault.ir in a WebView, for Cafe Bazaar and Myket.

- Package name: `ir.pharmavault.app`
- Android 5.0 (API 21) and later
- The site sees the app in the user agent (`PharmaVaultApp/<version>`). The app does not sell
  subscriptions (`/account/buy` shows a notice); users sign in with the account they already have.
- `MainActivity` adds the back button, downloads (handbook PDFs, with the session cookie),
  file upload (logo in the form generator), printing and saving Word files through the
  `PharmaVaultApp` JavaScript bridge, external links in other apps and an offline page.

## Build

GitHub Actions builds the app (`.github/workflows/android.yml`) on every change under
`android/`, or by hand from **Actions → Android app → Run workflow**. The `pharmavault-android`
artifact holds the `.apk` and the `.aab`.

Local build (needs the Android SDK): `cd android && ./gradlew assembleRelease bundleRelease`.

## Signing

Releases are signed with the upload key in these repository secrets
(**Settings → Secrets and variables → Actions**):

| Secret | Value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | the keystore file, base64-encoded |
| `ANDROID_KEYSTORE_PASSWORD` | keystore password |
| `ANDROID_KEY_ALIAS` | key alias |
| `ANDROID_KEY_PASSWORD` | key password |

Without them the build is signed with a debug key and named `debug-signed`; do not upload
that one. Keep the keystore and passwords outside the repository: every later update must be
signed with the same key, and a lost key means a new package in the stores.

## New version

Raise `versionCode` (by 1) and `versionName` in `app/build.gradle`, merge, then upload the new
artifact to both stores.

## Store listing

`store/`: Persian listing text, the 512 px icon and 1080×1920 screenshots.
