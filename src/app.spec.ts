import { EmployeeWeekSummary, ShiftRaw } from './types'
import { calculateWeeklyHours } from './app'

const shifts: ShiftRaw[] = [
  {
    "ShiftID": 2472465354,
    "EmployeeID": 36422975,
    "StartTime": "2021-08-31T12:30:00.000000Z",
    "EndTime": "2021-08-31T21:00:00.000000Z"
  },
  {
    "ShiftID": 2472465353,
    "EmployeeID": 36422975,
    "StartTime": "2021-08-30T12:30:00.000000Z",
    "EndTime": "2021-08-30T21:00:00.000000Z"
  },
  {
    "ShiftID": 2472465352,
    "EmployeeID": 36422975,
    "StartTime": "2021-08-27T04:00:00.000000Z",
    "EndTime": "2021-08-28T04:00:00.000000Z"
  },
  {
    "ShiftID": 2472464926,
    "EmployeeID": 36422975,
    "StartTime": "2021-08-26T04:00:00.000000Z",
    "EndTime": "2021-08-27T04:00:00.000000Z"
  },
  {
    "ShiftID": 2472464925,
    "EmployeeID": 36422975,
    "StartTime": "2021-08-25T04:00:00.000000Z",
    "EndTime": "2021-08-26T04:00:00.000000Z"
  },
  {
    "ShiftID": 2472464924,
    "EmployeeID": 36422975,
    "StartTime": "2021-08-24T04:00:00.000000Z",
    "EndTime": "2021-08-25T04:00:00.000000Z"
  },
  {
    "ShiftID": 2472464923,
    "EmployeeID": 36422975,
    "StartTime": "2021-08-23T04:00:00.000000Z",
    "EndTime": "2021-08-24T04:00:00.000000Z"
  },
  {
    "ShiftID": 2472464921,
    "EmployeeID": 36422975,
    "StartTime": "2021-08-20T04:00:00.000000Z",
    "EndTime": "2021-08-21T04:00:00.000000Z"
  },
  {
    "ShiftID": 2472464108,
    "EmployeeID": 36422975,
    "StartTime": "2021-08-19T04:00:00.000000Z",
    "EndTime": "2021-08-20T04:00:00.000000Z"
  },
  {
    "ShiftID": 2472464107,
    "EmployeeID": 36422975,
    "StartTime": "2021-08-18T04:00:00.000000Z",
    "EndTime": "2021-08-19T04:00:00.000000Z"
  },
  {
    "ShiftID": 2472464106,
    "EmployeeID": 36422975,
    "StartTime": "2021-08-17T04:00:00.000000Z",
    "EndTime": "2021-08-18T04:00:00.000000Z"
  },
  {
    "ShiftID": 2472464105,
    "EmployeeID": 36422975,
    "StartTime": "2021-08-16T04:00:00.000000Z",
    "EndTime": "2021-08-17T04:00:00.000000Z"
  },
]

describe('calculateWeeklyHours', () => {
  const timeZone = 'America/Chicago'
  it('should calculate weekly hours and detect invalid shifts', () => {
    const result: EmployeeWeekSummary[] = calculateWeeklyHours(shifts, timeZone)
    expect(result.length).toBe(3)

    const summary0 = result[0]
    expect(summary0).toBeDefined()
    expect(summary0.RegularHours).toBe(16)
    expect(summary0.OvertimeHours).toBe(0)
    expect(summary0.InvalidShifts.length).toBe(0)

    const summary1 = result[1]
    expect(summary1).toBeDefined()
    expect(summary1.RegularHours).toBe(40)
    expect(summary1.OvertimeHours).toBe(24)
    expect(summary1.InvalidShifts.length).toBe(2)

    const summary2 = result[2]
    expect(summary2).toBeDefined()
    expect(summary2.RegularHours).toBe(40)
    expect(summary2.OvertimeHours).toBe(24)
    expect(summary2.InvalidShifts.length).toBe(2)
  })
})