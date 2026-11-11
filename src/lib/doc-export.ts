"use client";

/*
 * Browser helpers shared by the document tools (GMP forms, CoA builder):
 * a logo read from a file, the Word download and the print view, both also
 * through the PharmaVault Android app's bridge.
 */

export type LogoImage = { dataUrl: string; width: number; height: number };

export const pngBytes = (dataUrl: string) => Uint8Array.from(atob(dataUrl.split(",")[1] ?? ""), (c) => c.charCodeAt(0));

/** Reads an image file, scales it to at most 60 px high and returns it as PNG. */
export function loadLogo(file: File): Promise<LogoImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, 60 / img.height, 160 / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        // drawn at 4× for print sharpness, shown at w × h
        const canvas = document.createElement("canvas");
        canvas.width = w * 4;
        canvas.height = h * 4;
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve({ dataUrl: canvas.toDataURL("image/png"), width: w, height: h });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/** The PharmaVault Android app's JavaScript bridge (android/…/MainActivity.java), when the page runs inside it. */
type AppBridge = { saveFile(base64: string, name: string, mimeType: string): void; print(html: string, title: string): void };
const appBridge = () => (window as { PharmaVaultApp?: AppBridge }).PharmaVaultApp;

function toBase64(bytes: Uint8Array) {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

/** Saves a file: through the app's bridge (its WebView cannot follow blob: downloads), else as a browser download. */
export function saveBlob(blob: Blob, name: string) {
  const app = appBridge();
  if (app) {
    blob.arrayBuffer().then((buf) => app.saveFile(toBase64(new Uint8Array(buf)), name, blob.type));
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Prints a whole HTML document, once its fonts have loaded. */
export function printHtml(html: string, title: string) {
  const app = appBridge();
  if (app) {
    app.print(html, title);
    return;
  }
  const frame = document.createElement("iframe");
  frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
  frame.srcdoc = html;
  frame.onload = () => {
    const w = frame.contentWindow;
    if (!w) return;
    (w.document.fonts?.ready ?? Promise.resolve()).then(() => {
      w.focus();
      w.print();
      setTimeout(() => frame.remove(), 1000);
    });
  };
  document.body.append(frame);
}
