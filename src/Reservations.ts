
import { addDays } from './dateHelpers';
import { Chance } from 'chance';

const today = new Date('2017-10-25');
today.setHours(0, 0, 0, 0);

const roomCount = 100;

export const roomTypesList: string[] = ['Double', 'Twin', 'Suite', 'Acc Double', 'Acc Twin', 'Acc Suite', 'Exec Doubl', 'Exec Twin', 'Exec Suite'];

export const roomTypes: string[] = [];
export const roomNames: string[] = []; // TODO: combine

export interface ReservationData {
  firstName: string;
  lastName: string;
  email: string;
  arrival: string; // TODO: change to date?
  nights: number;
  roomType: string;
  ref: string;
  balance?: number;
  room?: number;
  ledger?: string;
}

let seed = 1;

const chance = new Chance(seed);

function pseudoRandom() {
  return chance.d100() / 100;
}

const roomReservations: ReservationData[][] = [];

for (let roomIndex = 0; roomIndex < roomCount; ++roomIndex) {
  const roomType = roomTypesList[roomTypesList.length * roomIndex / roomCount];
  roomTypes.push(roomType);
  roomNames.push(`Room ${roomIndex + 1}`);

  const room: ReservationData[] = roomReservations[roomIndex] = [];
  let currentDate = addDays(today, -5); // Start 5 days before
  for (let num = Math.floor(pseudoRandom() * 10); num > 0; --num) {
    const dayBefore = Math.floor(pseudoRandom() * 8);
    const nights = 1 + Math.floor(pseudoRandom() * 7);
    currentDate = addDays(currentDate, dayBefore);
    const departure = addDays(currentDate, nights);
    const arrival = currentDate;
    currentDate = departure;

    const item: ReservationData = {
      firstName: chance.first(),
      lastName: chance.last(),
      email: chance.email(),
      arrival: arrival.toISOString(), // TODO: change to date?
      nights: nights,
      roomType: roomType,
      ref: 'BK' + chance.ssn(),
      balance: nights * 100 + Math.floor(pseudoRandom() * 100),
      room: roomIndex,
      ledger: pseudoRandom() > 0.7 ? 'Ledger ' + chance.d100() : undefined,
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

// TODO: get reservations by room type