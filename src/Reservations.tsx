import mockData from './mockData';
mockData.splice(100);

const today = new Date('2017-10-25');
today.setHours(0, 0, 0, 0);

function addDays(date: Date, days: number) {
  var dat = new Date(date);
  dat.setDate(dat.getDate() + days);
  return dat;
}

export function getArrivals() {
  return mockData.filter(res => {
    const d = new Date(res.arrival);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
}

export function getDepartures() {
  return mockData.filter(res => {
    const a = new Date(res.arrival);
    a.setHours(0, 0, 0, 0);
    const d = addDays(new Date(a), res.nights);

    return d.getTime() === today.getTime();
  });
}

export function getResidents() {
  return mockData.filter(res => {
    const a = new Date(res.arrival);
    a.setHours(0, 0, 0, 0);
    const d = addDays(new Date(a), res.nights);

    return d.getTime() > today.getTime() &&
      a.getTime() < today.getTime();
  });
}

export function getReservations() {
  return mockData;
}
