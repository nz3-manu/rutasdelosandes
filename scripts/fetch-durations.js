#!/usr/bin/env node
/**
 * Genera/actualiza el respaldo versionado de duraciones (yt-durations.json).
 *
 * Uso (una sola vez, o cuando agregues videos y quieras refrescar el respaldo):
 *   YT_API_KEY=tu_api_key npm run durations
 *   git add yt-durations.json && git commit -m "chore: refrescar duraciones de video"
 *
 * En el build normal de Netlify NO hace falta ejecutarlo: si YT_API_KEY está
 * configurada allá, las duraciones se traen en vivo. Este archivo solo crea el
 * respaldo para que las duraciones sobrevivan aunque la key/quota fallen.
 */
const fs = require("fs");
const path = require("path");
const { collectVideoIds, fetchDurations } = require("./yt");

(async () => {
  const key = process.env.YT_API_KEY;
  if (!key) {
    console.error("Falta YT_API_KEY.  Uso:  YT_API_KEY=tu_api_key npm run durations");
    process.exit(1);
  }

  const ids = collectVideoIds();
  const data = await fetchDurations(ids, key);
  const n = Object.keys(data).length;

  if (!n) {
    console.error("La API no devolvió ninguna duración (revisa la key/quota). No se escribió nada.");
    process.exit(1);
  }

  const out = path.join(__dirname, "..", "yt-durations.json");
  fs.writeFileSync(out, JSON.stringify(data, null, 2) + "\n");
  console.log(`OK: yt-durations.json con ${n}/${ids.length} duraciones.`);
  console.log("Recuerda: git add yt-durations.json && git commit && git push");
})();
