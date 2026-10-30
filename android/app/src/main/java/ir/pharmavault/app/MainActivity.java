package ir.pharmavault.app;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.ActivityNotFoundException;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.URLUtil;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

/**
 * PharmaVault for Android: the pharmavault.ir site in a WebView, with the
 * phone's back button, downloads to the Downloads folder, file upload (company
 * logo in the form generator), printing, external links in the right app and
 * an offline page. The site detects the app from the "PharmaVaultApp" user agent.
 */
public class MainActivity extends Activity {

    private static final String HOME = "https://pharmavault.ir/fa";
    private static final String HOST = "pharmavault.ir";
    private static final String OFFLINE = "file:///android_asset/offline.html";
    private static final int FILE_CHOOSER = 1;
    private static final int STORAGE_PERMISSION = 2;

    private WebView web;
    private ValueCallback<Uri[]> fileCallback;
    private String lastUrl = HOME;
    private Runnable pendingSave;
    /** Kept so the print job's WebView is not collected before printing ends. */
    private WebView printView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        web = new WebView(this);
        web.setBackgroundColor(Color.WHITE);
        web.setVisibility(View.INVISIBLE); // the splash stays until the first page is drawn
        setContentView(web, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);
        s.setMediaPlaybackRequiresUserGesture(true);
        s.setAllowFileAccess(false);
        s.setUserAgentString(s.getUserAgentString() + " PharmaVaultApp/" + BuildConfig.VERSION_NAME);

        CookieManager cookies = CookieManager.getInstance();
        cookies.setAcceptCookie(true);
        cookies.setAcceptThirdPartyCookies(web, false);

        web.addJavascriptInterface(new Bridge(), "PharmaVaultApp");
        web.setWebViewClient(new Client());
        web.setWebChromeClient(new Chrome());
        web.setDownloadListener((url, userAgent, contentDisposition, mimeType, length) -> download(url, userAgent, contentDisposition, mimeType));

        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else web.loadUrl(startUrl(getIntent()));
    }

    /** A pharmavault.ir link that opened the app, or the home page. */
    private String startUrl(Intent intent) {
        Uri data = intent != null ? intent.getData() : null;
        if (data != null && isOurs(data)) return data.toString();
        return HOME;
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Uri data = intent.getData();
        if (data != null && isOurs(data)) web.loadUrl(data.toString());
    }

    private static boolean isOurs(Uri uri) {
        String host = uri.getHost();
        return "https".equals(uri.getScheme()) && host != null && (host.equals(HOST) || host.endsWith("." + HOST));
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        web.saveState(outState);
    }

    @Override
    protected void onPause() {
        super.onPause();
        CookieManager.getInstance().flush();
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    // ---------- navigation ----------

    private class Client extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return openOutside(request.getUrl());
        }

        @SuppressWarnings("deprecation")
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return openOutside(Uri.parse(url));
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            if (url != null && url.startsWith("https://")) lastUrl = url;
            view.setVisibility(View.VISIBLE);
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            if (!request.isForMainFrame()) return;
            if (isOurs(request.getUrl())) lastUrl = request.getUrl().toString();
            view.loadUrl(OFFLINE);
        }

        @SuppressWarnings("deprecation")
        @Override
        public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) return;
            if (failingUrl != null && isOurs(Uri.parse(failingUrl))) lastUrl = failingUrl;
            view.loadUrl(OFFLINE);
        }
    }

    /** Our pages stay in the app; everything else (tel:, mailto:, other sites) opens outside. */
    private boolean openOutside(Uri uri) {
        if (isOurs(uri) || "file".equals(uri.getScheme())) return false;
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (ActivityNotFoundException e) {
            Toast.makeText(this, R.string.no_app, Toast.LENGTH_SHORT).show();
        }
        return true;
    }

    // ---------- file upload ----------

    private class Chrome extends WebChromeClient {
        @Override
        public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
            if (fileCallback != null) fileCallback.onReceiveValue(null);
            fileCallback = callback;
            try {
                startActivityForResult(params.createIntent(), FILE_CHOOSER);
            } catch (ActivityNotFoundException e) {
                fileCallback = null;
                return false;
            }
            return true;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CHOOSER && fileCallback != null) {
            fileCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
            fileCallback = null;
        }
    }

    // ---------- downloads ----------

    /** Files served by the site (handbook PDFs): the system download manager, with the session cookie. */
    private void download(String url, String userAgent, String contentDisposition, String mimeType) {
        Uri uri = Uri.parse(url);
        if (!isOurs(uri)) {
            openOutside(uri);
            return;
        }
        String name = URLUtil.guessFileName(url, contentDisposition, mimeType);
        withStorage(() -> {
            DownloadManager.Request req = new DownloadManager.Request(uri);
            req.addRequestHeader("Cookie", CookieManager.getInstance().getCookie(url));
            req.addRequestHeader("User-Agent", userAgent);
            req.setMimeType(mimeType);
            req.setTitle(name);
            req.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            req.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, name);
            DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
            if (dm != null) {
                dm.enqueue(req);
                Toast.makeText(this, R.string.downloading, Toast.LENGTH_SHORT).show();
            }
        });
    }

    /** Files made in the page (Word forms): written to Downloads and opened. */
    private void saveBytes(byte[] bytes, String name, String mimeType) {
        withStorage(() -> {
            try {
                Uri opened;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentResolver resolver = getContentResolver();
                    ContentValues values = new ContentValues();
                    values.put(MediaStore.MediaColumns.DISPLAY_NAME, name);
                    values.put(MediaStore.MediaColumns.MIME_TYPE, mimeType);
                    values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
                    opened = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                    if (opened == null) throw new IllegalStateException("no uri");
                    try (OutputStream out = resolver.openOutputStream(opened)) {
                        if (out == null) throw new IllegalStateException("no stream");
                        out.write(bytes);
                    }
                } else {
                    File dir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                    if (!dir.exists() && !dir.mkdirs()) throw new IllegalStateException("no dir");
                    File file = new File(dir, name);
                    try (FileOutputStream out = new FileOutputStream(file)) {
                        out.write(bytes);
                    }
                    opened = null; // opening a file:// uri needs a FileProvider; the toast says where it is
                }
                Toast.makeText(this, R.string.saved, Toast.LENGTH_LONG).show();
                if (opened != null) {
                    Intent view = new Intent(Intent.ACTION_VIEW).setDataAndType(opened, mimeType).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    try {
                        startActivity(view);
                    } catch (ActivityNotFoundException ignored) {
                        // no app for this type; the file is in Downloads
                    }
                }
            } catch (Exception e) {
                Toast.makeText(this, R.string.save_failed, Toast.LENGTH_LONG).show();
            }
        });
    }

    /** Android 6–9 ask for storage permission before writing to Downloads. */
    private void withStorage(Runnable action) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q || Build.VERSION.SDK_INT < Build.VERSION_CODES.M
                || checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
            action.run();
            return;
        }
        pendingSave = action;
        requestPermissions(new String[] {Manifest.permission.WRITE_EXTERNAL_STORAGE}, STORAGE_PERMISSION);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] results) {
        super.onRequestPermissionsResult(requestCode, permissions, results);
        if (requestCode != STORAGE_PERMISSION) return;
        Runnable action = pendingSave;
        pendingSave = null;
        if (results.length > 0 && results[0] == PackageManager.PERMISSION_GRANTED && action != null) action.run();
        else Toast.makeText(this, R.string.permission_needed, Toast.LENGTH_LONG).show();
    }

    // ---------- printing ----------

    private void print(String html, String title) {
        WebView view = new WebView(this);
        view.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView v, String url) {
                PrintManager pm = (PrintManager) getSystemService(PRINT_SERVICE);
                if (pm != null) pm.print(title, v.createPrintDocumentAdapter(title), new PrintAttributes.Builder().setMediaSize(PrintAttributes.MediaSize.ISO_A4).build());
            }
        });
        printView = view;
        view.loadDataWithBaseURL("https://" + HOST + "/", html, "text/html", "utf-8", null);
    }

    // ---------- bridge for the site ----------

    /** Called by the site's JavaScript; only answers while one of our pages is shown. */
    private class Bridge {
        private boolean trusted() {
            String url = lastUrl;
            return url != null && isOurs(Uri.parse(url));
        }

        @JavascriptInterface
        public void saveFile(String base64, String name, String mimeType) {
            if (!trusted()) return;
            byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
            String safe = name.replaceAll("[\\\\/:*?\"<>|]", "_");
            runOnUiThread(() -> saveBytes(bytes, safe, mimeType));
        }

        @JavascriptInterface
        public void print(String html, String title) {
            if (!trusted()) return;
            runOnUiThread(() -> MainActivity.this.print(html, title));
        }

        @JavascriptInterface
        public void retry() {
            runOnUiThread(() -> web.loadUrl(lastUrl));
        }
    }
}
