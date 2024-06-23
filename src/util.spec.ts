import { getWeekStart, calculateHours, splitShiftWeekly, isShiftOverlap, areDatesInvalid } from './util'
import { Shift, ShiftRaw } from './types'

const timeZone = 'America/Chicago'

describe('Util', () => {
  describe(getWeekStart.name, () => {
    it('should return the start of the week', () => {
      const date = new Date('2021-08-31T09:00:00Z')
      const weekStart = getWeekStart(date)
      expect(weekStart).toBe('2021-08-29')
    })
  
    it('should throw an error for invalid date', () => {
      expect(() => {
        getWeekStart('invalid-date' as unknown as Date)
      }).toThrow()
    })
  })

  describe(calculateHours.name, () => {
    it('should return the difference in hours', () => {
      const hours = calculateHours(new Date('2021-08-31T09:00:00Z'), new Date('2021-08-31T17:00:00Z'))
      expect(hours).toBe(8)
    })
  
    it('should return 0 for invalid time input', () => {
      expect(calculateHours(new Date('invalid-time'), new Date('2021-08-31T17:00:00Z'))).toBe(0)
      expect(calculateHours(new Date('2021-08-31T09:00:00Z'), new Date('invalid-time'))).toBe(0)
    })
  })


  describe(splitShiftWeekly.name, () => {
    it('should split shifts across weeks', () => {
      const splitedShift: ShiftRaw = {
        ShiftID: 456,
        EmployeeID: 456,
        StartTime: '2021-08-29T00:00:00.000000Z',
        EndTime: '2021-09-01T17:00:00.000000Z',
      }
      
      const shifts = splitShiftWeekly(splitedShift, timeZone)
      expect(shifts.length).toBe(2)
      expect(shifts[0].EndTime.toISOString()).toBe('2021-08-29T06:59:59.999Z')
      expect(shifts[1].StartTime.toISOString()).toBe('2021-08-29T07:00:00.999Z')
    })
  
    it('should return empty array for invalid shift', () => {
      const invalidShift: ShiftRaw = {
        ShiftID: 789,
        EmployeeID: 456,
        StartTime: 'invalid-time',
        EndTime: '2021-09-01T17:00:00.000000Z',
      }
  
      expect(splitShiftWeekly(invalidShift, timeZone).length).toBe(0)
    })
  })

  describe(isShiftOverlap.name, () => {
    const shift: Shift = {
      ShiftID: 123,
      EmployeeID: 456,
      StartTime: new Date('2021-08-31T12:30:00.000000Z'),
      EndTime: new Date('2021-08-31T21:00:00.000000Z'),
    }

    const overlappingShift: Shift = {
      ShiftID: 234,
      EmployeeID: 456,
      StartTime: new Date('2021-08-31T15:30:00.000000Z'),
      EndTime: new Date('2021-08-31T23:00:00.000000Z'),
    }
    
    const nonOverlappingShift: Shift = {
      ShiftID: 345,
      EmployeeID: 456,
      StartTime: new Date('2021-08-31T22:00:00.000000Z'),
      EndTime: new Date('2021-09-01T02:00:00.000000Z'),
    }
    

    it('should detect overlapping shifts', () => {
      const result = isShiftOverlap(shift, overlappingShift)
      expect(result).toBe(true)
    })
  
    it('should detect non-overlapping shifts', () => {
      const result = isShiftOverlap(shift, nonOverlappingShift)
      expect(result).toBe(false)
    })
  
    it('should throw an error for invalid shift times', () => {
      const invalidShift1: Shift = {
        ShiftID: 890,
        EmployeeID: 456,
        StartTime: new Date('invalid-time'),
        EndTime: new Date('2021-08-31T21:00:00.000000Z'),
      }
  
      const invalidShift2: Shift = {
        ShiftID: 901,
        EmployeeID: 456,
        StartTime: new Date('2021-08-31T18:00:00.000000Z'),
        EndTime: new Date('invalid-time'),
      }
  
      expect(isShiftOverlap(invalidShift1, shift)).toBe(false)
      expect(isShiftOverlap(invalidShift2, shift)).toBe(false)
    })
  })

  describe(areDatesInvalid.name, () => {
    it('should return true if any date is invalid', () => {
      const dates = [
        new Date('2021-08-31T12:30:00.000000Z'),
        new Date('invalid-date'),
        new Date('2021-08-31T21:00:00.000000Z')
      ]
      const result = areDatesInvalid(...dates)
      expect(result).toBe(true)
    })
  
    it('should return false if all dates are valid', () => {
      const dates = [
        new Date('2021-08-31T12:30:00.000000Z'),
        new Date('2021-08-30T12:30:00.000000Z'),
        new Date('2021-08-31T21:00:00.000000Z')
      ]
      const result = areDatesInvalid(...dates)
      expect(result).toBe(false)
    })

    it('should return false for an empty array', () => {
      const result = areDatesInvalid();
      expect(result).toBe(false);
    })
  })
})
