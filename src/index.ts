import fs from 'fs'
import path from 'path'
import { ShiftRaw } from './types';
import { calculateWeeklyHours } from './app';

let shifts: ShiftRaw[] = [];

try {
  const data = fs.readFileSync(path.resolve(__dirname, '../dataset.json'), 'utf8');
  shifts = JSON.parse(data);
} catch (error) {
  console.error('Error reading or parsing dataset.json:', error);
  process.exit(1);
}

const timeZone: string = 'America/Chicago'

try {
  const result = calculateWeeklyHours(shifts, timeZone);
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error('Error calculating weekly hours:', error);
  process.exit(1);
}
