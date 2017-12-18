export interface Room {

  // TODO: looks like rooms have custom attributes for filtering purposes. E.g. View, Jacuzzi, Can accomodate cot
  // TODO: they can also be connected to other rooms
  readonly name: string;
  readonly type: string;
  readonly cleaningStatus: 'refreshRequired' | 'cleaningRequired' | 'noAction';
  readonly occupied: boolean; // TODO: infer from reservations?
  readonly group: { name: string };
}

export type Preference = number;
// TODO: room type, descriptions, images
// TODO: hotel info, site info

export interface CompanyProfile {
  readonly name: string;
  readonly addresses: { value: Address, preference: Preference }[];

  readonly contacts: {
    profile: GuestProfile,
    preference: Preference
  }[];

  readonly typeOfBusiness: string;

  readonly socialMedia: {
    value: string,
    preference: Preference
  }[];
}

// TODO: probably needs to change based on country
export interface Address {
  building: string;
  streetAddress: string;
  postalTown: string;
  postCode: string;
  countryRegion: string;
}

export interface Note {
  readonly body: string;
}

export interface Metadata {
  readonly modified: Date;
  readonly created: Date;
  readonly user: string;
}

export interface GuestProfile {
  readonly title?: string;
  readonly firstName: string;
  readonly lastName: string;

  readonly addresses: {
    value: Address,
    preference: Preference
  }[];

  readonly phoneNumbers: {
    type: string,
    number: string,
    preference: Preference
  }[];

  readonly emails: {
    email: string,
    preference: Preference
  }[];

  readonly notes: Note[];

  readonly identification: {
    type: string,
    uniqueId: string,
    expiry: Date
  }[];

  readonly socialMedia: {
    value: string,
    preference: Preference
  }[];

  readonly created: Date;
}

export interface BookingLine {
  readonly refSub: string;
  readonly refFull: string;

  readonly reservation: Reservation;

  readonly arrival: Date;
  readonly nights: number;

  readonly guests: {
    readonly adults: number;
    readonly children: number;
    readonly infants: number;
  };

  readonly profiles: GuestProfile[];

  readonly rate: string;
  readonly roomType: string;
  readonly allocatedRoom?: Room;

  readonly eta?: Date;
  readonly etd?: Date;
}

export interface Reservation {
  readonly ref: string;
  readonly contact: GuestProfile;
  readonly leadGuest?: GuestProfile; // If null, then use the above
  readonly guests: GuestProfile[];
  readonly ledger?: CompanyProfile;
  readonly state: 'provisional' | 'confirmed' | 'cancelled';
  readonly created: Date; // TODO: metadata, last modified, last modified user, etc
  readonly bookingLines: BookingLine[];
  readonly marketSegment: string;
  readonly mediaSource: string;
  // TODO: company, agent, source?

  readonly depositRequired: number;
  readonly totalForStay: number; // TODO: sum from booking lines...

  readonly balance: number;
  readonly depositPaid: number; // TODO: obtain from folio?
}

export interface AppState {
  isLaunching: boolean;
  isMobile: boolean;

  currentSite: string;
  sites?: string[];

  userDetails?: {
    userName: string,
    userInitials: string
  };

  reservations?: {
    bookingLines: BookingLine[],
    isLoading: boolean
  };

  guests?: {
    arrivals: BookingLine[],
    departures: BookingLine[],
    residents: BookingLine[],
    isLoading: boolean
  };

  planner?: {
    roomBookings: {
      roomName: string,
      bookingLines: BookingLine[]
    }[]
  };

  availability?: {
    roomTypeAvailability: {
      roomType: string,
      quantity: number
    }[],
    isLoading: boolean
  };

  rooms?: {
    rooms: Room[],
    isLoading: boolean
  };

  profiles?: {
    profiles: GuestProfile[],
    isLoading: boolean
  };
}
