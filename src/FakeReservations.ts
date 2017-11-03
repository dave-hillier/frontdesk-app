
import { addDays } from './dateHelpers';
import { Chance } from 'chance';

const today = new Date('2017-10-25');
today.setHours(0, 0, 0, 0);

const floors = 5;
const roomCount = 100;
const roomTypesList: string[] = [
  'Double',
  'Twin',
  'Suite',
  'Acc Double',
  'Acc Twin',
  'Acc Suite',
  'Exec Double',
  'Exec Twin',
  'Exec Suite'
];

export async function getRooms(hotelCode: string): Promise<Room[]> {
  await generateData(hotelCode);
  return allRooms;
}

export async function getRoomTypes(hotelCode: string): Promise<string[]> {
  return roomTypesList;
}

export interface Room {
  readonly name: string;
  readonly type: string;
}

export interface Ledger {
  readonly name: string;
}

export interface Profile {
  readonly title: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;

  // TODO: address, phone
}

export interface Reservation {
  readonly ref: string;

  readonly profile: Profile;
  readonly ledger?: Ledger;
  readonly arrival: Date;
  readonly nights: number;
  readonly adults: number;
  readonly children: number;
  readonly infants: number;
  readonly requestedRoomTypes: string[];
  readonly allocations: Room[];
  readonly balance: number;
  readonly state: 'provisional' | 'confirmed' | 'resident' | 'noshow' | 'departed' | 'cancelled' | 'waitlist';
  readonly rate: string;
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

const allRooms: Room[] = [];
const allProfiles: Profile[] = [];

const generated: any = {};
function generateData(hotelCode: string): Reservation[][] {
  if (hotelCode in generated) {
    return generated[hotelCode];
  }

  const seed = hashCode(hotelCode);
  const seededChance = new Chance(seed);
  const pseudoRandom = () => {
    return seededChance.d100() / 100;
  };
  // TODO: calculate in a promise/future in a worker
  const rez: Reservation[][] = [];

  for (let roomIndex = 0; roomIndex < roomCount; ++roomIndex) {
    const roomType = roomTypesList[Math.floor(roomTypesList.length * roomIndex / roomCount)];

    const currentFloor = 1 + Math.floor(roomIndex / (roomCount / floors));
    const roomNumber = (roomIndex % (roomCount / floors)) + 1;

    const theRoom = {
      name: `${currentFloor}${('0' + roomNumber).slice(-2)}`,
      type: roomType
    };
    allRooms.push(theRoom);

    const room: Reservation[] = rez[theRoom.name] = [];
    let currentDate = addDays(today, -5); // Start 5 days before
    for (let num = Math.floor(pseudoRandom() * 10); num > 0; --num) {
      const dayBefore = Math.floor(pseudoRandom() * 8);
      const nights = 1 + Math.floor(pseudoRandom() * 7);
      currentDate = addDays(currentDate, dayBefore);
      const departure = addDays(currentDate, nights);
      const arrival = currentDate;
      currentDate = departure;
      const profile = {
        title: 'Mr', // TODO: fix
        firstName: seededChance.first(),
        lastName: seededChance.last(),
        email: seededChance.email(),
      };
      allProfiles.push(profile);
      const adults = seededChance.d6() > 3 ? 2 : 1;
      const item: Reservation = {
        profile,
        arrival: arrival, // TODO: change to date?
        nights: nights,
        allocations: [theRoom],
        requestedRoomTypes: [roomType],
        ref: 'BK00' + seededChance.ssn().replace('-', '').replace('-', '') + '/1',
        rate: 'BAR',
        balance: nights * 100 + Math.floor(1 + pseudoRandom() * 100),
        ledger: pseudoRandom() > 0.7 ? {
          name: 'Ledger ' + seededChance.d100()
        } : undefined,
        adults: adults,
        children: adults === 2 && seededChance.d6() > 3 ? 1 : 0,
        infants: adults === 2 && seededChance.d6() > 3 ? 1 : 0,
        state: 'provisional'
      };
      room.push(item);
    }
  }
  generated[hotelCode] = rez;

  // tslint:disable-next-line:no-console
  console.log('Rooms', allRooms);

  // tslint:disable-next-line:no-console
  console.log('Profiles', allProfiles);

  return rez;
}

export async function getReservations(hotelSite: string): Promise<Reservation[]> {
  async function inner(): Promise<Reservation[]> {
    const roomReservations = generateData(hotelSite);
    return roomReservations.reduce((a, b) => a.concat(b), []);
  }

  return new Promise<Reservation[]>((resolve, reject) => {
    setTimeout(function () { resolve(inner()); }, 100);
  });
}

export async function getReservationsByRoom(hotelSite: string) {
  const rez = await getReservations(hotelSite);
  const roomNameToResPairs: any[] = rez.filter(r => r.allocations[0]).map(r => { return { room: r.allocations[0].name, rez: r }; });

  let lookup: any = {};
  for (let i = 0; i < roomNameToResPairs.length; ++i) {
    if (roomNameToResPairs[i].room in lookup) {
      lookup[roomNameToResPairs[i].room].push(roomNameToResPairs[i].rez);
    } else {
      lookup[roomNameToResPairs[i].room] = [roomNameToResPairs[i].rez];
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