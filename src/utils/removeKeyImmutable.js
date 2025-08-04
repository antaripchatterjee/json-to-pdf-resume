export default function removeKeyImmutable(obj, key) {
  const { [key]: _, ...rest } = (typeof obj === 'object' ? obj : { });
  return rest;
}
