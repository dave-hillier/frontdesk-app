
import { addDays } from './dateHelpers';

const today = new Date('2017-10-25');
today.setHours(0, 0, 0, 0);

const roomCount = 100;

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

let seed = 1;
function pseudoRandom() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const roomReservations: ReservationData[][] = [];

for (let roomIndex = 0; roomIndex < roomCount; ++roomIndex) {
  const room: ReservationData[] = roomReservations[roomIndex] = [];
  let currentDate = addDays(today, -5);
  for (let num = Math.floor(pseudoRandom() * 10); num > 0; --num) {
    const dayBefore = Math.floor(pseudoRandom() * 8);
    const nights = 1 + Math.floor(pseudoRandom() * 7);
    currentDate = addDays(currentDate, dayBefore);
    const departure = addDays(currentDate, nights);
    const arrival = currentDate;
    currentDate = departure;

    const item: ReservationData = {
      firstName: 'Firstname',
      lastName: 'Lastname',
      email: 'Firstname.LastName@domain.com',
      title: 'Mr',
      arrival: arrival.toISOString(), // TODO: change to date?
      nights: nights,
      roomType: 'string',
      ref: 'string',
      balance: nights * 100 + Math.floor(pseudoRandom() * 100),
      room: roomIndex,
      ledger: pseudoRandom() > 0.7 ? 'string' : undefined,
    };
    room.push(item);
  }
}

export function getReservations(): ReservationData[] {
  return roomReservations.reduce((a, b) => a.concat(b), []);
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
  const rooms: any[] = getReservations().filter(r => r.room).map(r => { return { room: r.room, rez: r }; });

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
