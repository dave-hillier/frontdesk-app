import * as React from 'react';
import {
  Grid,
  Cell,
  DataTable,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  List,
  ListItem,
  FontIcon,
  Subheader
} from 'react-md';

import { Address, Reservation, GuestProfile } from './Model';
import { addDays } from './dateHelpers';
import { StandardDialog } from './StandardDialog';

function toCaps(s: string) {
  return s.replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./, function (str: string) { return str.toUpperCase(); });
}

export function renderGrid(r: any) {
  if (typeof r === 'string') {
    return r;
  } else if (Array.isArray(r)) {
    const values: any[] = r.map((v: any) => renderGrid(v));
    return <div>{...values}</div>;
  }
  const flexDirection: 'row' = 'row';
  const row = {
    width: '100%', display: 'flex', flexDirection
  };
  const header = {
    width: '150px'
  };
  const rows: JSX.Element[] = [];
  const borders = 'md-divider-border md-divider-border--top md-divider-border--right md-divider-border--bottom md-divider-border--left';
  for (let key in r) {
    if (r.hasOwnProperty(key)) {
      let value = r[key];
      if (typeof r[key] === 'object') {
        value = renderGrid(value);
      }
      const rx = (
        <div key={key} style={row} className={borders + 'md-tile-content'}>
          <div style={header} className="md-tile-text--primary md-text">{toCaps(key)}</div>
          <div className="md-tile-text--secondary md-text--secondary">{value}</div>
        </div>);
      rows.push(rx);
    }
  }
  return rows;
}

function formatAddress(address: Address): string {
  const parts = [address.organisation, address.streetAddress, address.postalTown, address.postCode, address.countryRegion];
  return parts.filter(p => p.length > 0).join(', ');
}

const ProfileShortPanel = (props: { profile: GuestProfile }) => {
  return (
    <Cell>
      <List>
        <Subheader primaryText="Profile" />
        <ListItem
          leftIcon={<FontIcon>person</FontIcon>}
          primaryText="Name"
          secondaryText={`${props.profile.firstName} ${props.profile.lastName}`}
        />
        <ListItem
          leftIcon={<FontIcon>person_pin_circle</FontIcon>}
          primaryText="Email"
          secondaryText={props.profile.email}
        />
        <ListItem
          leftIcon={<FontIcon>mail</FontIcon>}
          primaryText="Address"
          secondaryText={formatAddress(props.profile.address)}
        />

        {props.profile.phone.map(p => (
          <ListItem
            key={p.type}
            leftIcon={<FontIcon>phone</FontIcon>}
            primaryText="Phone"
            secondaryText={p.number}
          />))}
      </List>
    </Cell>
  );
};

const ReservationLine = (props: { title: string, contents: string }) => (
  <ListItem
    primaryText={props.title}
    secondaryText={props.contents}
  />
);

const ReservationPanel = (props: { reservation: Reservation }) => {
  const arrival = props.reservation.bookingLines[0].arrival.toLocaleDateString();
  const departure = addDays(props.reservation.bookingLines[0].arrival, props.reservation.bookingLines[0].nights).toLocaleDateString();
  return (
    <div>
      <Grid>
        <Cell>
          <List>
            <ReservationLine title="Reference" contents={props.reservation.ref} />
            <ReservationLine title="Status" contents={props.reservation.state} />
            <ReservationLine title="Ledger" contents={props.reservation.ledger ? props.reservation.ledger.name : ' '} />
            <ReservationLine title="ETA" contents="00:00" />
            <ReservationLine title="ETD" contents="00:00" />
          </List>
        </Cell>
        <ProfileShortPanel profile={props.reservation.contact} />
      </Grid>
      <DataTable>
        <TableHeader>
          <TableRow>
            <TableColumn>Arrival</TableColumn>
            <TableColumn>Nights</TableColumn>
            <TableColumn>Departure</TableColumn>
            <TableColumn>Room Type</TableColumn>
            <TableColumn>Rate</TableColumn>
            <TableColumn>Room</TableColumn>
            <TableColumn>Adults</TableColumn>
            <TableColumn>Children</TableColumn>
            <TableColumn>infants</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableColumn>{arrival}</TableColumn>
            <TableColumn>{props.reservation.bookingLines[0].nights}</TableColumn>
            <TableColumn>{departure}</TableColumn>
            <TableColumn>{props.reservation.bookingLines[0].roomType}</TableColumn>
            <TableColumn>{props.reservation.bookingLines[0].rate}</TableColumn>
            <TableColumn />
            <TableColumn />
            <TableColumn />
            <TableColumn />
          </TableRow>
        </TableBody>
      </DataTable>
    </div>
  );
};

export class ReservationDialog extends React.Component<{ isMobile?: boolean, isDesktop?: boolean }, { reservation: any }> {
  private dialog: StandardDialog | null;

  constructor(props: any) {
    super(props);
    this.state = { reservation: null };
  }

  render() {
    const r: Reservation = this.state.reservation;

    return (
      <StandardDialog
        title="Reservation"
        id="reservation-dialog"
        {...this.props}
        ref={self => this.dialog = self}
      >
        {r && <ReservationPanel reservation={r} />}
      </StandardDialog>);
  }

  show(e: any, r: any) {
    if (this.dialog) {
      this.dialog.show(e);
      this.setState({ reservation: r });
    }
  }
}