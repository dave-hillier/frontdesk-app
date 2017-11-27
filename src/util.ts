
export function addDays(date: Date, days: number): Date {
  var dat = new Date(date);
  dat.setDate(dat.getDate() + days); // Automatically takes care of month increments etc
  return dat;
}

export function subtractDates(date1: Date, date2: Date): number {
  const oneDay = 1000 * 60 * 60 * 24;
  var difference = date1.getTime() - date2.getTime();
  return Math.round(difference / oneDay);
}

export function formatDateRange(arrival: Date, departure?: Date) {
  const arrivalShort = arrival ? arrival.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  }) : '';

  const departureShort = departure ? (' - ' + departure.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  })) : '';

  return arrivalShort + departureShort;
}
