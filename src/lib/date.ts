export function dateToKey(dt: Date) {
  const dateString = [
    dt.getFullYear(),
    String(dt.getMonth() + 1).padStart(2, "0"),
    String(dt.getDate()).padStart(2, "0"),
  ].join("-");

  return dateString
}
