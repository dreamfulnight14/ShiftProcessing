import { toZonedTime } from 'date-fns-tz'
import { getWeekStart, calculateHours, splitShiftWeekly, isShiftOverlap } from './util'
import { EmployeeWeekSummary, ExploredShifts, ShiftRaw } from './types'

/**
 * @param {Shift[]} shifts
 * @param {string} timeZone
 * @returns {EmployeeWeekSummary[]}
 */
export function calculateWeeklyHours(shifts: ShiftRaw[], timeZone: string): EmployeeWeekSummary[] {
  const employeeWeeklySummaries: { [key: string]: EmployeeWeekSummary } = {}
  const exploredShifts: { [key: string]: ExploredShifts } = {}

  shifts.forEach(shift => {
    splitShiftWeekly(shift, timeZone).forEach(subShift => {
      const weekStart = getWeekStart(toZonedTime(subShift.StartTime, timeZone))
      const key = `${subShift.EmployeeID}-${weekStart}`

      if (!employeeWeeklySummaries[key]) {
        employeeWeeklySummaries[key] = {
          EmployeeID: subShift.EmployeeID,
          StartOfWeek: weekStart,
          RegularHours: 0,
          OvertimeHours: 0,
          InvalidShifts: [],
        }
      }
      if (!exploredShifts[key]) {
        exploredShifts[key] = {
          ExploredShifts: new Set(),
        }
      }

      const employeeSummary = employeeWeeklySummaries[key]
      const employeeHistory = exploredShifts[key]

      let isValid = true
      for (let exploredShift of employeeHistory.ExploredShifts) {
        if (isShiftOverlap(subShift, exploredShift)) {
          isValid = false
          employeeSummary.InvalidShifts.push(subShift.ShiftID)
          break
        }
      }

      if (isValid) {
        const hours = calculateHours(subShift.StartTime, subShift.EndTime)
        employeeSummary.RegularHours += hours
        if (employeeSummary.RegularHours > 40) {
          employeeSummary.OvertimeHours = employeeSummary.RegularHours - 40
          employeeSummary.RegularHours = 40
        }
        employeeHistory.ExploredShifts.add(subShift)
      }
    })
  })

  return Object.values(employeeWeeklySummaries)
}