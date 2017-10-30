import mockData from './mockData';

const today = new Date('2017-10-25');
today.setHours(0, 0, 0, 0);

export function getReservations() {
  // TODO: fixup the rooms -- distribute randomly
  // TODO: assign random length, random offset

  return mockData;
}

function addDays(date: Date, days: number) {
  var dat = new Date(date);
  dat.setDate(dat.getDate() + days);
  return dat;
}

export function getArrivals() {
  return getReservations().filter(res => {
    const d = new Date(res.arrival);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
}

export function getDepartures() {
  return getReservations().filter(res => {
    const a = new Date(res.arrival);
    a.setHours(0, 0, 0, 0);
    const d = addDays(new Date(a), res.nights);

    return d.getTime() === today.getTime();
  });
}

export function getResidents() {
  return getReservations().filter(res => {
    const a = new Date(res.arrival);
    a.setHours(0, 0, 0, 0);
    const d = addDays(new Date(a), res.nights);

    return d.getTime() > today.getTime() &&
      a.getTime() < today.getTime();
  });
}

// TODO: move this out of here
export function getReservationsByRoom(): any {
  const reservations = getReservations();
  const rooms: any[] = reservations.filter(r => r.room).map(r => { return { room: r.room, rez: r }; });

  let lookup: any = {};
  for (let i = 0; i < rooms.length; ++i) {
    if (rooms[i].room in lookup) {
      lookup[rooms[i].room].push(rooms[i].rez);
    } else {
      lookup[rooms[i].room] = [rooms[i].rez];
    }
  }

  for (let key in lookup) {
    if (lookup.hasOwnProperty(key)) {
      lookup[key].sort((a: any, b: any) => {
        return new Date(a.arrival).getTime() - new Date(b.arrival).getTime();
      });
    }
  }
  return lookup;
}
