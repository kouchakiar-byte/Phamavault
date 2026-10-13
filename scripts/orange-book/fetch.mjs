// Download the FDA Orange Book data files (ZIP) to the path given as argv[2].
// The ZIP link is read from the FDA "Orange Book Data Files" page, with the
// long-standing media link as a fallback.
import { writeFile } from "node:fs/promises";

const PAGE = "https://www.fda.gov/drugs/drug-approvals-and-databases/orange-book-data-files";
const FALLBACK = "https://www.fda.gov/media/76860/download";
const headers = { "User-Agent": "Mozilla/5.0 (compatible; PharmaVault data update; +https://pharmavault.ir)" };
const out = process.argv[2] ?? "orange-book.zip";

async function candidates() {
  const urls = [];
  if (process.env.OB_URL) urls.push(process.env.OB_URL);
  try {
    const html = await (await fetch(PAGE, { headers })).text();
    for (const m of html.matchAll(/href="([^"]*\/media\/\d+\/download[^"]*)"/g)) {
      urls.push(new URL(m[1], PAGE).href);
    }
  } catch (e) {
    console.warn("could not read the data files page:", e.message);
  }
  urls.push(FALLBACK);
  return [...new Set(urls)];
}

for (const url of await candidates()) {
  try {
    const res = await fetch(url, { headers });
    const buf = Buffer.from(await res.arrayBuffer());
    // A ZIP starts with "PK"; the page also links PDFs and other files.
    if (res.ok && buf.length > 100_000 && buf[0] === 0x50 && buf[1] === 0x4b) {
      await writeFile(out, buf);
      console.log(`downloaded ${url} (${buf.length} bytes)`);
      process.exit(0);
    }
    console.log(`skipped ${url}: not the data ZIP`);
  } catch (e) {
    console.warn(`failed ${url}: ${e.message}`);
  }
}
console.error("Orange Book ZIP not found");
process.exit(1);
