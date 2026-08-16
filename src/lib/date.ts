export function dateToKey(dt: Date) {
  const dateString = [
    dt.getFullYear(),
    String(dt.getMonth() + 1).padStart(2, "0"),
    String(dt.getDate()).padStart(2, "0"),
  ].join("-");

  return dateString
}

// Resolves a "HH:mm" wall-clock time on a given date, as read in `timeZone`,
// to the absolute UTC instant it represents. There's no timezone-aware date
// library in this project, so the offset is derived by formatting the same
// naive instant into both `timeZone` and UTC and diffing the results — this
// stays correct across DST without hardcoding a fixed offset.
export function zonedTimeToUtc(dateKey: string, time: string, timeZone: string): Date {
  const naive = new Date(`${dateKey}T${time}:00Z`)
  const zoned = new Date(naive.toLocaleString("en-US", { timeZone }))
  const utc = new Date(naive.toLocaleString("en-US", { timeZone: "UTC" }))
  const offset = zoned.getTime() - utc.getTime()
  return new Date(naive.getTime() - offset)
}
