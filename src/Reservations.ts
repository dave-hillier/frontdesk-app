
import { addDays } from './dateHelpers';
import mockData from './mockData';

const today = new Date('2017-10-25');
today.setHours(0, 0, 0, 0);

export interface ReservationData {
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  arrival: string; // TODO: change to date?
  nights: number;
  roomType: string;
  ref: string;
  balance?: number;
  room?: number;
  ledger?: string;
}

const lookup1 = getReservationsByRoom();

var seed = 1;
function pseudoRandom() {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

for (let key in lookup1) {
  if (lookup1.hasOwnProperty(key)) {

    let currentDate = today;
    for (let reservation of lookup1[key]) {

      const dayBefore = Math.floor(pseudoRandom() * 8);
      const nights = 1 + Math.floor(pseudoRandom() * 7);
      currentDate = addDays(currentDate, dayBefore);
      const departure = addDays(currentDate, nights);

      reservation.arrival = currentDate;
      currentDate = departure;
      reservation.nights = nights;

    }
  }
}

export function getReservations(): ReservationData[] {
  return mockData;
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
export function getReservationsByRoom(reservations: any[] = mockData): any {
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
