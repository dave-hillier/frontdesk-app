export interface Room {

  // TODO: looks like rooms have custom attributes for filtering purposes. E.g. View, Jacuzzi, Can accomodate cot
  // TODO: they can also be connected to other rooms
  readonly name: string;
  readonly type: string;
  readonly cleaningStatus: 'refreshRequired' | 'cleaningRequired' | 'noAction';
  readonly occupied: boolean;
  readonly group: { name: string };
}

export interface CompanyProfile {
  readonly name: string;

  readonly address: Address;
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

// TODO: company profiles

export interface GuestProfile {
  readonly title?: string;
  readonly firstName: string;
  readonly lastName: string;

  readonly email: string;
  readonly address: Address;

  readonly phone: {
    type: string,
    number: string
  }[];
  readonly notes: Note[];
  readonly created: Date;

  // Note - child/infant profiles/details seems pointless
}

export interface BookingLine {
  readonly ref: string;
  readonly masterRef: string;

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