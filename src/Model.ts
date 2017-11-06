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

export interface Profile {
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
}

export interface Reservation {
  readonly ref: string;

  readonly profile: Profile;
  readonly ledger?: Ledger;
  readonly arrival: Date;
  readonly nights: number;
  readonly guests: {
    readonly adults: number;
    readonly children: number;
    readonly infants: number;
  };
  readonly requestedRoomTypes: string[];
  readonly allocations: Room[];
  readonly balance: number;
  readonly state: 'provisional' | 'confirmed' | 'resident' | 'noshow' | 'departed' | 'cancelled' | 'waitlist';
  readonly rate: string;
}
