import * as React from 'react';
import {
  Button,
  DialogContainer,
  Toolbar,
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

import { Address, Reservation, Profile } from './Model';
import { addDays } from './dateHelpers';

class StandardDialog extends React.Component<{ title: any, isMobile?: boolean, isDesktop?: boolean }, { pageX?: number, pageY?: number, visible: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { visible: false };
  }

  show = (e: any) => {
    let { pageX, pageY } = e;
    if (e.changedTouches) {
      pageX = e.changedTouches[0].pageX;
      pageY = e.changedTouches[0].pageY;
    }

    this.setState({ visible: true, pageX, pageY });
  }

  hide = () => {
    this.setState({ visible: false });
  }

  render() {
    const { visible, pageX, pageY } = this.state;
    const width = this.props.isDesktop ? 1024 : (!this.props.isMobile ? 800 : undefined); // min tablet 768
    const height = this.props.isDesktop ? 768 : (!this.props.isMobile ? 600 : undefined);
    return (
      <div>
        <DialogContainer
          id="reservation-dialog"
          visible={visible}
          pageX={pageX}
          pageY={pageY}
          fullPage={this.props.isMobile}
          onHide={this.hide}
          width={width}
          height={height}
          aria-labelledby="reservation-dialog-title"
        >
          <Toolbar
            fixed={true}
            colored={true}
            title={this.props.title}
            titleId="reservation-dialog-title"
            nav={<Button icon={true} onClick={this.hide}>close</Button>}
            actions={<Button flat={true} onClick={this.hide}>Save</Button>}
          />
          <section className="md-toolbar-relative">
            {this.props.children}
          </section>
        </DialogContainer>
      </div>
    );
  }
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
        <div key={key} style={row} className={borders}>
          <div style={header}>{key}</div>
          <div>{value}</div>
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

const ProfileShortPanel = (props: { profile: Profile }) => {
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
  const arrival = props.reservation.arrival.toLocaleDateString();
  const departure = addDays(props.reservation.arrival, props.reservation.nights).toLocaleDateString();
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
        <ProfileShortPanel profile={props.reservation.profile} />
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
            <TableColumn>{props.reservation.nights}</TableColumn>
            <TableColumn>{departure}</TableColumn>
            <TableColumn>{props.reservation.requestedRoomTypes[0]}</TableColumn>
            <TableColumn>{props.reservation.rate}</TableColumn>
            <TableColumn />
            <TableColumn />
            <TableColumn />
            <TableColumn />
          </TableRow>
          <TableRow>
            <TableColumn>{arrival}</TableColumn>
            <TableColumn>{props.reservation.nights}</TableColumn>
            <TableColumn>{departure}</TableColumn>
            <TableColumn>{props.reservation.requestedRoomTypes[0]}</TableColumn>
            <TableColumn>{props.reservation.rate}</TableColumn>
            <TableColumn>{props.reservation.allocations[0].name}</TableColumn>
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