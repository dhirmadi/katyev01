// src/app/core/forms/formUtils.factory.ts

// 0-9
// https://regex101.com/r/dU0eY6/1
// const LIKES_REGEX = new RegExp(/^[0-9]$/);

// yyyy-mm-dd
const DATE_REGEX = new RegExp(/([12]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01]))/);

// 24h hh:mm
const TIME_REGEX = new RegExp(/^([01]\d|2[0-3]):?([0-5]\d)$/);

// Converts date + time strings to a Date object.
// Date and time parameters should have already
// been validated with DATE_REGEX and TIME_REGEX.
function stringsToDate(dateStr: string, timeStr: string) {
  if (!DATE_REGEX.test(dateStr) || !TIME_REGEX.test(timeStr)) {
    console.error('Cannot convert date/time to Date object.');
    return;
  }
  const date = new Date(dateStr);
  const timeArr = timeStr.split(/[\s:]+/); // https://regex101.com/r/H4dMvA/1
  let hour = parseInt(timeArr[0], 10);
  const min = parseInt(timeArr[1], 10);

  date.setHours(hour);
  date.setMinutes(min);
  return date;
}

export { DATE_REGEX, TIME_REGEX, stringsToDate };
//export { LIKES_REGEX, DATE_REGEX, TIME_REGEX, stringsToDate };
