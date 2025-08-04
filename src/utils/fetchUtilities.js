import removeKeyImmutable from "./removeKeyImmutable";

export function fetchWithTimeout(url, options = {}) {
  let _options = { ...options };
  if(_options.signal) {
    _options = removeKeyImmutable(options, 'timeout');
  }
  const timeout = _options.timeout ?? -1;

  if (timeout < 0) {
    return fetch(url, _options);
  }



  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  return fetch(url, { ...removeKeyImmutable(_options, 'timeout'), signal: controller.signal })
    .catch((err) => {
      if (err.name === "AbortError") {
        throw new Error("Timeout - Could not fetch font faces");
      }
      throw err;
    })
    .finally(() => clearTimeout(timeoutId));
}

