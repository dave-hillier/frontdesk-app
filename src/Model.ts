export interface Room {
  readonly name: string;
  readonly type: string;
  readonly cleaningStatus: 'refreshRequired' | 'cleaningRequired' | 'noAction';
  readonly occupied: boolean;
}

export interface Ledger {
  readonly name: string;
}

// TODO: probably needs to change based on country
export interface Address {
  organisation: string;
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

  // Note - child/infant profiles seems pointless
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
}

export interface Reservation {
  readonly ref: string;
  readonly contact: GuestProfile;
  readonly leadGuest?: GuestProfile; // If null, then use the above
  readonly ledger?: Ledger;
  readonly state: 'provisional' | 'confirmed' | 'cancelled';
  readonly created: Date; // TODO: metadata, last modified, last modified user
  readonly balance: number;
  readonly bookingLines: BookingLine[];
  readonly marketSegment: string;
  // TODO: company, agent, source?
}

// TODO: folios, deposits