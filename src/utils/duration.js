export function getDuration(start, end = new Date().toISOString()) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate - startDate);
  const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.4375);
  return parseFloat(diffMonths.toFixed(1)); // return months
}
