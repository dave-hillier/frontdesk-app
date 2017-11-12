
import { addDays, subtractDates } from './dateHelpers';
import { Chance } from 'chance';
import { Room, Reservation, GuestProfile, BookingLine } from './Model';

const today = new Date();
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
const rates = ['BAR_RO', 'BAR_BB', 'FLEX_BB', 'FLEX_RO', 'WED_RO', 'WED_BB'];

// TODO: must be called after generated.
export async function getProfiles(): Promise<GuestProfile[]> {
  await generateData('0');
  await generateData('1');
  await generateData('2');
  return allProfiles;
}

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
const allProfiles: GuestProfile[] = [];

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
    const roomType = roomTypesList[roomIndex % roomTypesList.length];

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
          building: '',
          streetAddress: seededChance.address(),
          postalTown: seededChance.city(),
          postCode: seededChance.zip(),
          countryRegion: seededChance.country()
        },
        notes: [],
        created: new Date()
      };
      allProfiles.push(profile);
      const rate = seededChance.pickone(rates);
      const adults = seededChance.d6() > 3 ? 2 : 1;
      const reference = 'BK00' + seededChance.ssn().replace('-', '').replace('-', '') + '/1';
      const bookingLine: BookingLine = {
        ref: 'BK00' + seededChance.ssn().replace('-', '').replace('-', '') + '/1',

        arrival: arrival, // TODO: change to date?
        nights: nights,
        roomType: roomType,
        allocatedRoom: theRoom,
        rate: rate,
        guests: {
          adults: adults,
          children: adults === 2 && seededChance.d6() > 3 ? 1 : 0,
          infants: adults === 2 && seededChance.d6() > 3 ? 1 : 0,
        },
        profiles: [],
        masterRef: reference,

        eta: seededChance.d6() === 1 ? new Date() : undefined,
        etd: seededChance.d6() === 1 ? new Date() : undefined,
      };
      const balance = nights * 100 + Math.floor(1 + pseudoRandom() * 100);
      const item: Reservation = {
        contact: profile,
        bookingLines: [bookingLine],
        ref: reference,

        balance,
        ledger: pseudoRandom() > 0.7 ? {
          name: 'Ledger ' + seededChance.d100(),
          address: {
            building: '',
            streetAddress: seededChance.address(),
            postalTown: seededChance.city(),
            postCode: seededChance.zip(),
            countryRegion: seededChance.country()
          }
        } : undefined,

        state: 'provisional',
        created: new Date(),
        marketSegment: 'wedding',
        mediaSource: 'internet',
        depositPaid: 0,
        depositRequired: 100,
        totalForStay: balance + nights * 10 + Math.floor(1 + pseudoRandom() * 10)
      };
      room.push(item);
    }
  }
  generated[hotelCode] = rez;
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

export async function getAllocations(hotelSite: string, from: Date, until: Date): Promise<any> {
  const reservations = await getReservations(hotelSite);
  const result = {};

  let days = subtractDates(until, from);
  for (let type of roomTypesList) {
    result[type] = new Array(days).fill(0);
  }

  for (let reservation of reservations) {
    const arrival = reservation.bookingLines[0].arrival;
    const nights = reservation.bookingLines[0].nights;
    const departure = addDays(arrival, nights);

    const daysTillNext = subtractDates(arrival, from);
    const daysTillDeparture = subtractDates(departure, from);

    const type = reservation.bookingLines[0].roomType;
    const roomLevels = result[type];
    for (let i = 0; i < days; ++i) {
      roomLevels[i] = roomLevels[i] + (i >= daysTillNext && i < daysTillDeparture ? 1 : 0);
    }
  }

  return result;
}

// TODO: grouping function
export async function getReservationsByRoomType(hotelSite: string) {
  const rez = await getReservations(hotelSite);
  const roomTypeToResPairs: { roomType: string, rez: Reservation }[] = rez.filter(r => r.bookingLines[0].allocatedRoom).map(r => {
    const roomType = r.bookingLines[0].roomType;
    return { roomType, rez: r };
  });

  let lookup: { [room: string]: Reservation[] } = {};
  for (let i = 0; i < roomTypeToResPairs.length; ++i) {
    if (roomTypeToResPairs[i].roomType in lookup) {
      lookup[roomTypeToResPairs[i].roomType].push(roomTypeToResPairs[i].rez);
    } else {
      lookup[roomTypeToResPairs[i].roomType] = [roomTypeToResPairs[i].rez];
    }
  }

  for (let key in lookup) {
    if (lookup.hasOwnProperty(key)) {
      lookup[key].sort((a: Reservation, b: Reservation) => {
        return a.bookingLines[0].arrival.getTime() - b.bookingLines[0].arrival.getTime();
      });
    }
  }

  return lookup;
}

export async function getReservationsByRoom(hotelSite: string) {
  const rez = await getReservations(hotelSite);
  const roomNameToResPairs: { room: string, rez: Reservation }[] = rez.filter(r => r.bookingLines[0].allocatedRoom).map(r => {
    const room = r.bookingLines[0].allocatedRoom;
    const name = room ? room.name : '';
    return { room: name, rez: r };
  });

  let lookup: { [room: string]: Reservation[] } = {};
  for (let i = 0; i < roomNameToResPairs.length; ++i) {
    if (roomNameToResPairs[i].room in lookup) {
      lookup[roomNameToResPairs[i].room].push(roomNameToResPairs[i].rez);
    } else {
      lookup[roomNameToResPairs[i].room] = [roomNameToResPairs[i].rez];
    }
  }

  for (let key in lookup) {
    if (lookup.hasOwnProperty(key)) {
      lookup[key].sort((a: Reservation, b: Reservation) => {
        return a.bookingLines[0].arrival.getTime() - b.bookingLines[0].arrival.getTime();
      });
    }
  }

  return lookup;
}

// TODO: get reservations by room type
