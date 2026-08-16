export const CALENDAR_START_DATE = new Date(2021, 0, 1)
export const CALENDAR_END_DATE = new Date(2030, 11, 31)
export const STARFINDER_START_DATE = new Date(1900, 0, 1)
export const APP_TIMEZONE = 'Asia/Kolkata'
export const POURNAMI_EVENT_ID = 'POURNAMI'

export const TIMEZONE_LOCALE_MAP: Record<string, string> = {
  'Asia/Kolkata': 'en-IN',
  'Asia/Calcutta': 'en-IN', // legacy IANA alias, some systems still emit this
  'America/New_York': 'en-US',
  'America/Los_Angeles': 'en-US',
  'America/Chicago': 'en-US',
  'America/Toronto': 'en-CA',
  'Europe/London': 'en-GB',
  // add more as your user base grows
};

export const DEFAULT_LOCALE = 'en-IN';

export function getLocaleForTimezone(timeZone?: string): string {
  if (!timeZone) return DEFAULT_LOCALE;
  return TIMEZONE_LOCALE_MAP[timeZone] ?? DEFAULT_LOCALE;
}
