/**
 * Datos globales de Eleventy: mapa { videoId: "PT#M#S" } con la duración de cada
 * video de YouTube usado en el sitio.
 *
 * Estrategia (de más a menos prioridad):
 *   1. YouTube Data API v3 en vivo (si existe la variable de entorno YT_API_KEY).
 *   2. Respaldo durable: el archivo versionado yt-durations.json (generado una vez
 *      con `npm run durations`), para que las duraciones NO desaparezcan si algún
 *      día falta la key o se agota la quota.
 *
 * Además, la duración escrita a mano en el front matter (video.duration) tiene
 * prioridad sobre todo esto (ver _includes/youtube.html).
 *
 * El build nunca se rompe: si no hay key ni caché, devuelve {} y las páginas
 * simplemente quedan sin `duration` (campo recomendado, no obligatorio).
 */
const fs = require("fs");
const path = require("path");
const { collectVideoIds, fetchDurations } = require("../scripts/yt");

const CACHE = path.join(__dirname, "..", "yt-durations.json");

module.exports = async function () {
  // 1) Base: respaldo versionado (si existe)
  let out = {};
  try {
    if (fs.existsSync(CACHE)) out = JSON.parse(fs.readFileSync(CACHE, "utf8"));
  } catch (e) {
    console.warn("[ytDurations] no se pudo leer yt-durations.json:", e.message);
  }

  // 2) Refresco en vivo desde la API (gana sobre el respaldo)
  const key = process.env.YT_API_KEY;
  if (key) {
    try {
      const ids = collectVideoIds();
      const fresh = await fetchDurations(ids, key);
      out = { ...out, ...fresh };
      console.log(`[ytDurations] API: ${Object.keys(fresh).length}/${ids.length} en vivo; total ${Object.keys(out).length}.`);
    } catch (e) {
      console.warn("[ytDurations] fallo al consultar la API; se usa el respaldo:", e.message);
    }
  } else if (!Object.keys(out).length) {
    console.warn("[ytDurations] Sin YT_API_KEY y sin yt-durations.json; se omiten las duraciones automáticas.");
  }

  return out;
};
