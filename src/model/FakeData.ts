
import { addDays, subtractDates } from '../util';
import { Chance } from 'chance';
import { Room, Reservation, GuestProfile, BookingLine, AppState, CompanyProfile } from './Model';

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
const allResevations: Reservation[] = [];
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
const allBookingLines: BookingLine[] = [];

function createRoom(roomIndex: number, hotelCode: string) {
  const roomType = roomTypesList[roomIndex % roomTypesList.length];
  const currentFloor = 1 + Math.floor(roomIndex / (roomCount / floors));
  const group = { name: 'Floor ' + currentFloor };
  const roomNumber = (roomIndex % (roomCount / floors)) + 1;
  const cleaningStatus: 'cleaningRequired' = 'cleaningRequired';

  const theRoom = {
    name: `${currentFloor}${('0' + roomNumber).slice(-2)}`,
    type: roomType,
    cleaningStatus,
    occupied: true,
    group
  };
  if (!(hotelCode in allRooms)) {
    allRooms[hotelCode] = [];
  }
  allRooms[hotelCode].push(theRoom);
  return theRoom;
}

function createProfile(seededChance: any) {
  const profile: GuestProfile = {
    firstName: seededChance.first(),
    lastName: seededChance.last(),
    emails: [
      {
        email: seededChance.email(),
        preference: 0
      }
    ],
    phoneNumbers: [{
      type: 'mobile',
      number: seededChance.phone(),
      preference: 0
    }],
    addresses: [{
      value: {
        building: '',
        streetAddress: seededChance.address(),
        postalTown: seededChance.city(),
        postCode: seededChance.zip(),
        countryRegion: seededChance.country()
      },
      preference: 0
    }],
    notes: [],
    socialMedia: [],
    identification: [],
    created: new Date()
  };
  allProfiles.push(profile);
  return profile;
}
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
    const theRoom = createRoom(roomIndex, hotelCode);

    const room: Reservation[] = rez[theRoom.name] = [];
    let currentDate = addDays(today, -5); // Start 5 days before

    for (let num = Math.floor(pseudoRandom() * 100); num > 0; --num) {

      const profile = createProfile(seededChance);
      const rate = seededChance.pickone(rates);
      const adults = seededChance.d6() > 3 ? 2 : 1;
      const reference = 'BK00' + seededChance.ssn().replace('-', '').replace('-', '');

      const company: CompanyProfile = {
        name: 'Ledger ' + seededChance.d100(),
        typeOfBusiness: '',
        contacts: [{
          profile: profile,
          preference: 0
        }],
        addresses: [{
          value: {
            building: '',
            streetAddress: seededChance.address(),
            postalTown: seededChance.city(),
            postCode: seededChance.zip(),
            countryRegion: seededChance.country()
          },
          preference: 0
        }],
        socialMedia: []
      };

      const balance = 5 * 100 + Math.floor(1 + pseudoRandom() * 100);
      const item: Reservation = {

        contact: profile,
        bookingLines: [],
        ref: reference,
        guests: [profile],
        balance,
        ledger: pseudoRandom() > 0.7 ? company : undefined,

        state: 'provisional',
        created: new Date(),
        marketSegment: 'wedding',
        mediaSource: 'internet',
        depositPaid: 0,
        depositRequired: 100,
        totalForStay: balance + 5 * 10 + Math.floor(1 + pseudoRandom() * 10)
      };
      room.push(item);
      allResevations.push(item);
      const lineBookings = seededChance.d6() === 6 ? 2 : 1;

      const dayBefore = Math.floor(pseudoRandom() * 5);

      currentDate = addDays(currentDate, dayBefore);

      for (let i = 0; i < lineBookings; ++i) {
        const nights = 1 + Math.floor(pseudoRandom() * 5);
        const departure = addDays(currentDate, nights);
        const arrival = currentDate;
        currentDate = departure;

        const subref = 1 + i;
        const bookingLine: BookingLine = {
          refSub: subref.toString(),
          refFull: item.ref + ' / ' + subref,
          arrival: arrival, // TODO: change to date?
          nights: nights,
          roomType: theRoom.type,
          allocatedRoom: theRoom,
          rate: rate,
          guests: {
            adults: adults,
            children: adults === 2 && seededChance.d6() > 3 ? 1 : 0,
            infants: adults === 2 && seededChance.d6() > 3 ? 1 : 0,
          },
          profiles: [],

          eta: seededChance.d6() === 1 ? new Date() : undefined,
          etd: seededChance.d6() === 1 ? new Date() : undefined,

          reservation: item
        };

        item.bookingLines.push(bookingLine);
        allBookingLines.push(bookingLine);
      }

    }
  }
  generated[hotelCode] = rez;

  // tslint:disable-next-line:no-console
  console.log('rooms', rez.length, 'profile', allProfiles.length, 'reservations', allResevations.length);
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

export async function getBookingLines(hotelSite: string): Promise<BookingLine[]> {
  const reservations = await getReservations(hotelSite);
  const bookingLineArrays = reservations.map(r => r.bookingLines);
  return [].concat.apply([], bookingLineArrays);
}

export async function getAllocations(hotelSite: string, from: Date, until: Date): Promise<any> {
  const bookingLines = await getBookingLines(hotelSite);
  const result = {};

  let days = subtractDates(until, from);
  for (let type of roomTypesList) {
    result[type] = new Array(days).fill(0);
  }

  for (let b of bookingLines) {
    const arrival = b.arrival;
    const nights = b.nights;
    const departure = addDays(arrival, nights);

    const daysTillNext = subtractDates(arrival, from);
    const daysTillDeparture = subtractDates(departure, from);

    const type = b.roomType;
    const roomLevels = result[type];
    for (let i = 0; i < days; ++i) {
      roomLevels[i] = roomLevels[i] + (i >= daysTillNext && i < daysTillDeparture ? 1 : 0);
    }
  }

  return result;
}

export async function getBookingLinesByRoom(hotelSite: string) {
  const bookingLines = await getBookingLines(hotelSite);

  const roomNameToResPairs: { room: string, booking: BookingLine }[] = bookingLines.filter(b => {
    return b.allocatedRoom;
  }).map(b => {
    const room = b.allocatedRoom;
    const name = room ? room.name : '';
    return { room: name, booking: b };
  });

  let lookup: { [room: string]: BookingLine[] } = {};
  for (let i = 0; i < roomNameToResPairs.length; ++i) {
    if (roomNameToResPairs[i].room in lookup) {
      lookup[roomNameToResPairs[i].room].push(roomNameToResPairs[i].booking);
    } else {
      lookup[roomNameToResPairs[i].room] = [roomNameToResPairs[i].booking];
    }
  }

  for (let key in lookup) {
    if (lookup.hasOwnProperty(key)) {
      lookup[key].sort((a: BookingLine, b: BookingLine) => {
        return a.arrival.getTime() - b.arrival.getTime();
      });
    }
  }

  return lookup;
}

export const MobileMinWidth = 320;
export const TabletMinWidth = 768;

function matchesMedia(min: number, max?: number) {
  let media = `screen and (min-width: ${min}px)`;
  if (max) {
    media += ` and (max-width: ${max}px)`;
  }

  return window.matchMedia(media).matches;
}

const isMobile = matchesMedia(MobileMinWidth, TabletMinWidth - 1);

const initialState: AppState = {
  isLaunching: true,
  isMobile,
  currentSite: '0'
};

const loadedState: AppState = {
  isLaunching: false,
  currentSite: '0',
  isMobile,
  sites: ['Hotel Site A', 'Hotel Site B', 'Hotel Site C'],

  userDetails: {
    userName: 'hillierd',
    userInitials: 'DH'
  },

  guests: {
    isLoading: true,
    arrivals: [],
    departures: [],
    residents: []
  }
};

function getArrivals(rez: BookingLine[]) {
  return rez.filter(b => {
    const d = b.arrival;
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
}

function getDepartures(rez: BookingLine[]) {
  return rez.filter(b => {
    const a = b.arrival;
    a.setHours(0, 0, 0, 0);
    const d = addDays(a, b.nights);
    return d.getTime() === today.getTime();
  });
}

function getResidents(rez: BookingLine[]) {
  return rez.filter(b => {
    const a = b.arrival;
    a.setHours(0, 0, 0, 0);
    const d = addDays(a, b.nights);
    return d.getTime() > today.getTime() &&
      a.getTime() < today.getTime();
  });
}

export function subscribe(callback: (state: AppState) => void) {
  callback({
    ...initialState,
    isMobile
  });

  getBookingLines(initialState.currentSite.toString()).then(rez => {
    const guests = {
      arrivals: getArrivals(rez),
      residents: getResidents(rez),
      departures: getDepartures(rez),
      isLoading: false
    };
    callback({
      isMobile,
      ...loadedState,
      guests
    });
  });
}
