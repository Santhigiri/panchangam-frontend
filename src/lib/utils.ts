import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFormattedDate(datetime: string): string {

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric', month: 'short', day: 'numeric'
  };

  const locale = 'en-IN'

  return new Date(datetime).toLocaleString(locale, options)
}

export function getFormattedTime(datetime: string): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric', minute: 'numeric',
    hour12: false
  };

  const locale = 'en-IN'

  return new Date(datetime).toLocaleTimeString(locale, options)

}

export function getFormattedDateTime(datetime: string | null): string {

  if (datetime === null) return ""

  const options: Intl.DateTimeFormatOptions = {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: 'numeric',
    hour12: true
  };

  const locale = 'en-IN'

  return new Date(datetime).toLocaleString(locale, options)
}


export function addDay(dt: Date, offset: number): Date {
  const result = new Date(dt)
  result.setDate(result.getDate() + offset)
  return result
}
