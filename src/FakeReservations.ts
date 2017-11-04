
import { addDays } from './dateHelpers';
import { Chance } from 'chance';
import { Room, Reservation, Profile } from './Model';

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
  return allRooms[hotelCode];
}

export async function getRoomTypes(hotelCode: string): Promise<string[]> {
  return roomTypesList;
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

const allRooms: { [code: string]: Room[] } = {};
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
    const cleaningStatus: 'cleaningRequired' = 'cleaningRequired';
    const theRoom = {
      name: `${currentFloor}${('0' + roomNumber).slice(-2)}`,
      type: roomType,
      cleaningStatus,
      occupied: true
    };
    if (!(hotelCode in allRooms)) {
      allRooms[hotelCode] = [];
    }
    allRooms[hotelCode].push(theRoom);

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
        firstName: seededChance.first(),
        lastName: seededChance.last(),
        email: seededChance.email(),
        phone: [{
          type: 'mobile',
          number: seededChance.phone()
        }],
        address: {
          streetNumber: seededChance.d100().toString(),
          streetName: seededChance.street(),
          townCity: seededChance.city(),
          country: seededChance.country(),
          countyState: seededChance.state(),
          postCode: seededChance.zip()
        },
        notes: []
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
        guests: {
          adults: adults,
          children: adults === 2 && seededChance.d6() > 3 ? 1 : 0,
          infants: adults === 2 && seededChance.d6() > 3 ? 1 : 0,
        },
        state: 'provisional',

      };
      room.push(item);
    }
  }
  generated[hotelCode] = rez;

  // tslint:disable-next-line:no-console
  console.log('Rooms generated', allRooms);

  // tslint:disable-next-line:no-console
  console.log('Profiles generated', hotelCode, allProfiles);

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