import { parseISO, startOfWeek, endOfWeek, differenceInHours, addSeconds, formatISO, isValid } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Shift, ShiftRaw } from './types'

/**
 * Return the date string of start of week from a given date
 * @param {Date} date
 * @returns {string}
 */
export function getWeekStart(date: Date): string {
  return formatISO(startOfWeek(date, { weekStartsOn: 0 }), { representation: 'date' })
}

/**
 * Return distance in hours between two dates in a given timeZone
 * @param {string} start
 * @param {string} end
 * @returns {number}
 */
export function calculateHours(start: Date, end: Date): number {
  if (areDatesInvalid(start, end)) return 0
  return differenceInHours(end, start)
}

/**
 * Split a given shift into weekly shifts in a given timezone
 * @param {Shift} shift
 * @param {string} timeZone
 * @returns {Shift[]}
 */
export function splitShiftWeekly(shift: ShiftRaw, timeZone: string): Shift[] {
  const shifts = []
  let start = toZonedTime(parseISO(shift.StartTime), timeZone)
  const end = toZonedTime(parseISO(shift.EndTime), timeZone)

  if (areDatesInvalid(start, end)) {
    console.error('Date format is invalid in Shift:', shift.ShiftID)
    return []
  }
  while (start < end) {
    const weekEnd = endOfWeek(start, { weekStartsOn: 0 })
    const shiftEnd = end < weekEnd ? end : weekEnd

    shifts.push({
      ...shift,
      StartTime: start,
      EndTime: shiftEnd,
    })

    start = addSeconds(shiftEnd, 1)
  }

  return shifts
}

/**
 * Detect overlap between two shifts
 * @param {Shift} shift1
 * @param {Shift} shift2
 * @returns {boolean}
 */
export function isShiftOverlap(shift1: Shift, shift2: Shift): boolean {
  for (let shift of [shift1, shift2]) {
    if (areDatesInvalid(shift.StartTime, shift.EndTime)) {
      console.error('Date format is invalid in Shift:', shift.ShiftID)
      return false
    }
  }
  return !(shift1.EndTime < shift2.StartTime || shift2.EndTime < shift1.StartTime)
}

/**
 * Check if any of dates in
 * @param {Date[]} dates - Array of date strings to check.
 * @returns {boolean} - Returns true if any date is invalid, false otherwise.
 */
export function areDatesInvalid(...dates: Date[]): boolean {
  return dates.some(date => !isValid(date))
}