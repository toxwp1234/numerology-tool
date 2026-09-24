// Pobiera podpisany .xpi z addons.mozilla.org dla wersji z firefox/manifest.json.
// Używane, gdy `web-ext sign` nie doczekał się zatwierdzenia albo wersja była już
// wcześniej wysłana — wtedy czekamy, aż Mozilla ją podpisze, i ściągamy plik.
//
// Wymaga: WEB_EXT_API_KEY, WEB_EXT_API_SECRET. Opcjonalnie: WAIT_MINUTES (domyślnie 60).
import { createHmac, randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const OUT = "dist/numerology-tool-amo.xpi";

const manifest = JSON.parse(readFileSync("firefox/manifest.json", "utf8"));
const guid = manifest.browser_specific_settings.gecko.id;
const version = manifest.version;
const key = process.env.WEB_EXT_API_KEY;
const secret = process.env.WEB_EXT_API_SECRET;
const waitMinutes = Number(process.env.WAIT_MINUTES || 60);

if (!key || !secret) throw new Error("WEB_EXT_API_KEY / WEB_EXT_API_SECRET not set");

// Krótkotrwały token JWT (HS256) — sam sekret nigdy nie jest wysyłany
const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
function authHeaders() {
  const now = Math.floor(Date.now() / 1000);
  const body = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ iss: key, jti: randomUUID(), iat: now, exp: now + 60 })}`;
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return { Authorization: `JWT ${body}.${sig}` };
}

async function getVersion() {
  const url = `https://addons.mozilla.org/api/v5/addons/addon/${encodeURIComponent(guid)}/versions/v${version}/`;
  const res = await fetch(url, { headers: authHeaders() });
  if (res.status === 404) throw new Error(`Version ${version} of ${guid} was never uploaded to AMO`);
  if (!res.ok) throw new Error(`AMO ${res.status}: ${await res.text()}`);
  return res.json();
}

const deadline = Date.now() + waitMinutes * 60_000;
for (;;) {
  const v = await getVersion();
  const status = v.file?.status;
  console.log(`${new Date().toISOString()}  ${guid} ${version}: ${status}`);

  if (status === "public") {
    const res = await fetch(v.file.url, { headers: authHeaders() });
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    mkdirSync("dist", { recursive: true });
    writeFileSync(OUT, Buffer.from(await res.arrayBuffer()));
    console.log(`Saved signed file to ${OUT}`);
    break;
  }
  if (status === "disabled") {
    throw new Error("Mozilla rejected or disabled this version — check the Developer Hub for details");
  }
  if (Date.now() > deadline) {
    throw new Error(`Still not approved after ${waitMinutes} min — re-run the workflow later`);
  }
  await new Promise((r) => setTimeout(r, 30_000));
}
