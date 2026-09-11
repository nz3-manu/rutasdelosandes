/**
 * Utilidades compartidas para las duraciones de YouTube.
 * Usadas por _data/ytDurations.js (build) y scripts/fetch-durations.js (respaldo).
 */
const fs = require("fs");
const path = require("path");

// Recorre las carpetas de contenido y extrae los video.id del front matter.
function collectVideoIds(roots = ["rutas", "blog"]) {
  const ids = new Set();
  const base = path.join(__dirname, "..");

  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(p);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const txt = fs.readFileSync(p, "utf8");
        const fm = txt.match(/^---\n([\s\S]*?)\n---/);
        if (!fm || !/\n\s*video:/.test("\n" + fm[1])) continue;
        const afterVideo = fm[1].split(/\n\s*video:/)[1] || "";
        const idm = afterVideo.match(/\n\s*id:\s*["']?([A-Za-z0-9_-]{11})["']?/);
        if (idm) ids.add(idm[1]);
      }
    }
  };

  roots.forEach((r) => walk(path.join(base, r)));
  return [...ids];
}

// Consulta la YouTube Data API v3 y devuelve { id: "PT#M#S" }.
async function fetchDurations(ids, key) {
  const out = {};
  if (!key || !ids.length) return out;

  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50);
    const url =
      "https://www.googleapis.com/youtube/v3/videos" +
      "?part=contentDetails&fields=items(id,contentDetails/duration)" +
      "&id=" + batch.join(",") +
      "&key=" + key;

    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[yt] YouTube API respondió ${res.status}; se omite este lote.`);
      continue;
    }
    const data = await res.json();
    for (const item of data.items || []) {
      const d = item.contentDetails && item.contentDetails.duration;
      if (d) out[item.id] = d; // ISO 8601, p.ej. "PT3M34S"
    }
  }
  return out;
}

module.exports = { collectVideoIds, fetchDurations };
