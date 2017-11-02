
import { addDays } from './dateHelpers';
import { Chance } from 'chance';

const today = new Date('2017-10-25');
today.setHours(0, 0, 0, 0);

const floors = 5;
const roomCount = 100;
const roomTypesList: string[] = ['Double', 'Twin', 'Suite', 'Acc Double', 'Acc Twin', 'Acc Suite', 'Exec Doubl', 'Exec Twin', 'Exec Suite'];
const roomTypes: string[] = [];
const roomNames: string[] = [];

export async function getRoomNames(hotelSiteCode: string) {
  return roomNames;
}

export async function getRoomTypesList(hotelSiteCode: string) {
  return roomTypesList;
}

// TODO: probably want to change this to some sensible model to hide network requests
export interface ReservationData {
  firstName: string;
  lastName: string;
  email: string;
  arrival: string;
  nights: number;
  roomType: string;
  ref: string;
  rate: string;
  adults: number;
  children: number;
  infants: number;
  balance?: number;
  room?: number;
  roomName: () => string;
  ledger?: string;
}

function hashCode(str: string) {
  let hash: number = 0, i, chr;
  if (str.length === 0) {
    return hash;
  }

  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    // tslint:disable-next-line:no-bitwise
    hash = ((hash << 5) - hash) + chr;
    // tslint:disable-next-line:no-bitwise
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

const generated: any = {};
function generateData(hotelCode: string): ReservationData[][] {
  if (hotelCode in generated) {
    return generated[hotelCode];
  }

  const seed = hashCode(hotelCode);
  const seededChance = new Chance(seed);
  const pseudoRandom = () => {
    return seededChance.d100() / 100;
  };
  // TODO: calculate in a promise/future in a worker
  const rez: ReservationData[][] = [];

  for (let roomIndex = 0; roomIndex < roomCount; ++roomIndex) {
    const roomType = roomTypesList[roomTypesList.length * roomIndex / roomCount];
    roomTypes.push(roomType);
    const currentFloor = 1 + Math.floor(roomIndex / (roomCount / floors));
    const roomNumber = (roomIndex % (roomCount / floors)) + 1;
    roomNames.push(`${currentFloor}${('0' + roomNumber).slice(-2)}`);

    const room: ReservationData[] = rez[roomIndex] = [];
    let currentDate = addDays(today, -5); // Start 5 days before
    for (let num = Math.floor(pseudoRandom() * 10); num > 0; --num) {
      const dayBefore = Math.floor(pseudoRandom() * 8);
      const nights = 1 + Math.floor(pseudoRandom() * 7);
      currentDate = addDays(currentDate, dayBefore);
      const departure = addDays(currentDate, nights);
      const arrival = currentDate;
      currentDate = departure;

      const item: ReservationData = {
        firstName: seededChance.first(),
        lastName: seededChance.last(),
        email: seededChance.email(),
        arrival: arrival.toISOString(), // TODO: change to date?
        nights: nights,
        roomType: roomType,
        ref: 'BK00' + seededChance.ssn().replace('-', '').replace('-', '') + '/1',
        rate: 'BAR',
        balance: nights * 100 + Math.floor(1 + pseudoRandom() * 100),
        room: roomIndex,
        roomName: () => roomIndex ? roomNames[roomIndex] : '',
        ledger: pseudoRandom() > 0.7 ? 'Ledger ' + seededChance.d100() : undefined,
        adults: pseudoRandom() > 0.8 ? 1 : 2,
        children: 0,
        infants: 0
      };
      room.push(item);
    }
  }
  generated[hotelCode] = rez;
  return rez;
}

export async function getReservations(hotelSite: string): Promise<ReservationData[]> {
  async function inner(): Promise<ReservationData[]> {
    const roomReservations = generateData(hotelSite);
    return roomReservations.reduce((a, b) => a.concat(b), []);
  }

  return new Promise<ReservationData[]>((resolve, reject) => {
    setTimeout(function () { resolve(inner()); }, 100);
  });
}

export async function getReservationsByRoom(hotelSite: string) {
  const rez = await getReservations(hotelSite);
  const rooms: any[] = rez.filter(r => r.room).map(r => { return { room: r.room, rez: r }; });

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