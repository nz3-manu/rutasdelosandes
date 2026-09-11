/**
 * Datos globales de Eleventy: mapa { videoId: "PT#M#S" } con la duración de cada
 * video de YouTube usado en el sitio, obtenida automáticamente en tiempo de build
 * desde la YouTube Data API v3 (videos.list, part=contentDetails).
 *
 * Requiere la variable de entorno YT_API_KEY (crear una key gratuita en
 * Google Cloud Console → APIs → YouTube Data API v3 y ponerla en Netlify).
 *
 * Comportamiento seguro:
 *  - Si no hay YT_API_KEY, o la API falla, devuelve {} y el build NO se rompe
 *    (las páginas quedan sin `duration`, que es un campo recomendado, no obligatorio).
 *  - La duración escrita a mano en el front matter (video.duration) SIEMPRE tiene
 *    prioridad sobre la de la API (ver _includes/youtube.html).
 */
const fs = require("fs");
const path = require("path");

// Recorre las carpetas de contenido y extrae los video.id del front matter.
function collectVideoIds() {
  const ids = new Set();
  const roots = ["rutas", "blog"];

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
        // Toma el id dentro del bloque `video:` del front matter.
        const afterVideo = fm[1].split(/\n\s*video:/)[1] || "";
        const idm = afterVideo.match(/\n\s*id:\s*["']?([A-Za-z0-9_-]{11})["']?/);
        if (idm) ids.add(idm[1]);
      }
    }
  };

  roots.forEach(walk);
  return [...ids];
}

module.exports = async function () {
  const key = process.env.YT_API_KEY;
  const ids = collectVideoIds();
  const out = {};

  if (!key) {
    console.warn("[ytDurations] YT_API_KEY no definida; se omiten las duraciones automáticas.");
    return out;
  }
  if (!ids.length) return out;

  try {
    for (let i = 0; i < ids.length; i += 50) {
      const batch = ids.slice(i, i + 50);
      const url =
        "https://www.googleapis.com/youtube/v3/videos" +
        "?part=contentDetails&fields=items(id,contentDetails/duration)" +
        "&id=" + batch.join(",") +
        "&key=" + key;

      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`[ytDurations] YouTube API respondió ${res.status}; se omite este lote.`);
        continue;
      }
      const data = await res.json();
      for (const item of data.items || []) {
        const d = item.contentDetails && item.contentDetails.duration;
        if (d) out[item.id] = d; // formato ISO 8601, p.ej. "PT3M34S"
      }
    }
    console.log(`[ytDurations] duraciones obtenidas para ${Object.keys(out).length}/${ids.length} videos.`);
  } catch (e) {
    console.warn("[ytDurations] fallo al consultar la YouTube API:", e.message);
  }

  return out;
};
