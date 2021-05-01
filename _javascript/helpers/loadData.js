export async function loadAmpDocument(url) {
  const res = await fetch(url);
  return await res.text();
}
