interface ShiftBase {
  ShiftID: number
  EmployeeID: number
}

export interface ShiftRaw extends ShiftBase {
  StartTime: string
  EndTime: string
}

export interface Shift extends ShiftBase {
  StartTime: Date
  EndTime: Date
}

export interface EmployeeWeekSummary {
  EmployeeID: number
  StartOfWeek: string
  RegularHours: number
  OvertimeHours: number
  InvalidShifts: number[]
}
  
export interface ExploredShifts {
  ExploredShifts: Set<Shift>
}