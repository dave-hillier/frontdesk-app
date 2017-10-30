export function addDays(date: Date, days: number): Date {
  var dat = new Date(date);
  dat.setDate(dat.getDate() + days); // TODO: does this work across month boundaries?
  return dat;
}

export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 1000 * 60 * 60 * 24;
  var difference = Math.abs(date1.getTime() - date2.getTime());
  return Math.round(difference / oneDay);

}