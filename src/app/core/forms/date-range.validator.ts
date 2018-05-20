// src/app/core/forms/date-range.validator.ts
import { AbstractControl } from '@angular/forms';
import { stringsToDate } from './formUtils.factory';

export function dateRangeValidator(c: AbstractControl): {[key: string]: any} {
  // Get controls in group
  const createDateC = c.get('createDate');
  const startTimeC = c.get('startTime');
  const endDateC = c.get('endDate');
  const endTimeC = c.get('endTime');
  // Object to return if date is invalid
  const invalidObj = { 'dateRange': true };

  // If start and end dates are valid, can check range (with prefilled times)
  // Final check happens when all dates/times are valid
  if (createDateC.valid && endDateC.valid) {
    const checkStartTime = startTimeC.invalid ? '00:00' : startTimeC.value;
    const checkEndTime = endTimeC.invalid ? '23:59' : endTimeC.value;
    const createDatetime = stringsToDate(createDateC.value, checkStartTime);
    const endDatetime = stringsToDate(endDateC.value, checkEndTime);

    if (endDatetime >= createDatetime) {
      return null;
    } else {
      return invalidObj;
    }
  }
  return null;
}
