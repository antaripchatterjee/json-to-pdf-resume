export function getUrl(url) {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}