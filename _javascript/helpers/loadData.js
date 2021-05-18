import "isomorphic-fetch";

function checkStatus(res) {
  if (res.ok) {
    // res.status >= 200 && res.status < 300
    return res;
  } else {
    console.error(res.statusText);
    throw new Error(res.statusText);
  }
}

export function loadAmpDocument(url) {
  return fetch(url)
    .then(checkStatus)
    .then((res) => res.text())
    .catch((e) => {
      throw new Error(e);
    });
}
