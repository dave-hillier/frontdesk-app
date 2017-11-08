import * as React from 'react';

import { getReservations } from './FakeReservations';
import { Reservation } from './Model';
import { ResidentItem } from './ReservationComponents';
import { SelectItemLayout } from './SelectedItemLayout';
import { ProfilePanel } from './ProfilesPage';

import './ReservationsPage.css';
import { addDays } from './dateHelpers';
import { Button } from 'react-md';

class PageLayout extends SelectItemLayout<Reservation> { }
const widerColumn = {
  marginLeft: '5px',
  marginRight: '5px',
  minWidth: '150px'
};
const mediumColumn = {
  marginLeft: '5px',
  marginRight: '5px',
  minWidth: '80px'
};
const narrowColumn = {
  marginLeft: '5px',
  marginRight: '5px',
  minWidth: '40px'
};
const flexDirection: 'row' = 'row';
const horizontal = {
  display: 'flex',
  flexDirection
};

class ReservationPanel extends React.PureComponent<{ reservation: Reservation }> {

  render() {
    const r = this.props.reservation;
    const minWidth = '150px';
    return (
      <div className="md-grid">
        <div className="md-cell--5">
          <div className="md-tile-content md-cell md-cell--bottom" style={{ minWidth }}>
            <div className="md-tile-text--primary md-text">Reference</div>
            <div className="md-tile-text--secondary md-text--secondary">{r.ref}</div>
          </div >
          <div className="md-tile-content md-cell md-cell--bottom" style={{ minWidth }}>
            <div className="md-tile-text--primary md-text">Status</div>
            <div className="md-tile-text--secondary md-text--secondary">{r.state}</div>
          </div>
          <div className="md-tile-content md-cell md-cell--bottom" style={{ minWidth }}>
            <div className="md-tile-text--primary md-text">Ledger</div>
            <div className="md-tile-text--secondary md-text--secondary">{r.ledger ? r.ledger.name : ' '}</div>
          </div>
          <div className="md-tile-content md-cell md-cell--bottom" style={{ minWidth }}>
            <div className="md-tile-text--primary md-text">ETA</div>
            <div className="md-tile-text--secondary md-text--secondary">00:00</div>
          </div>
          <div className="md-tile-content md-cell md-cell--bottom" style={{ minWidth }}>
            <div className="md-tile-text--primary md-text">ETD</div>
            <div className="md-tile-text--secondary md-text--secondary">00:00</div>
          </div>
        </div >
        <ProfilePanel profile={r.profile} />
      </div>
    );
  }
}

export class ReservationsPage extends React.PureComponent<{
  isMobile: boolean,
  hotelSiteCode: string
}>  {

  renderItem(item: Reservation, onClick: (x: any) => void): JSX.Element {
    return (
      <ResidentItem key={item.ref} reservation={item} onClick={onClick} />);
  }

  renderSelectedItem(item: Reservation): JSX.Element {
    return <ReservationPanel reservation={item} />;
  }

  render() {
    return (
      <PageLayout
        {...this.props}
        title="Reservation"
        getItems={getReservations}
        renderItem={this.renderItem}
        renderSelectedItem={this.renderSelectedItem}
      />);
  }
}

const Row = (props: { reservation: Reservation }) => {
  // TODO: booking reference first?
  return (
    <div className="res-row-container md-divider-border md-divider-border--bottom">
      <div className="col" style={horizontal}>
        <div className="res-grid-b01" style={widerColumn}>{props.reservation.profile.firstName} {props.reservation.profile.lastName}</div>
        <div className="res-grid-b02" style={widerColumn} />
        <div className="res-grid-b03" style={mediumColumn}>{props.reservation.arrival.toLocaleDateString()}</div>
        <div className="res-grid-b04" style={narrowColumn}>{props.reservation.nights}</div>
        <div className="res-grid-b05" style={mediumColumn}>{addDays(props.reservation.arrival, props.reservation.nights).toLocaleDateString()}</div>
        <div className="res-grid-b06" style={widerColumn}>{props.reservation.ref}</div>
        <div className="res-grid-b07" style={mediumColumn}>{props.reservation.state}</div>
        <div className="res-grid-b08" style={narrowColumn}>{props.reservation.guests.adults}</div>
        <div className="res-grid-b09" style={narrowColumn}>{props.reservation.guests.children}</div>
        <div className="res-grid-b10" style={narrowColumn}>{props.reservation.guests.infants}</div>
        <div className="res-grid-b11" style={mediumColumn}>{props.reservation.rate}</div>
        <div className="res-grid-b12" style={mediumColumn}>{props.reservation.requestedRoomTypes[0]}</div>
        <div className="res-grid-b13" style={mediumColumn}>{props.reservation.allocations[0].name}</div>
        <div className="res-grid-b14" style={widerColumn}>{props.reservation.ledger ? props.reservation.ledger.name : ''}</div>
        <div className="res-grid-b15" style={mediumColumn}>{props.reservation.balance.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</div>
        <div className="res-grid-b16" style={mediumColumn}>{props.reservation.balance.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</div>

      </div>
      <div className="actions">
        <Button icon={true}>edit</Button>
        <Button icon={true}>more_vert</Button>
      </div>
    </div>
  );
};

export class ReservationsPage1 extends React.PureComponent<
  {
    isMobile: boolean,
    hotelSiteCode: string
  },
  {
    reservations: Reservation[],
    isLoading: boolean,
    selected?: Reservation
  }> {

  constructor(props: any) {
    super(props);
    this.state = { reservations: [], isLoading: true };
  }

  componentWillMount() {
    getReservations(this.props.hotelSiteCode).then((reservations: Reservation[]) => {
      this.setState({ reservations });
      // Slight delay to remove loading...
      setTimeout(() => this.setState({ isLoading: false }), 100);
    });
  }

  render() {
    return (
      <div>
        <div className="res-header-container md-divider-border md-divider-border--bottom sticky-top">
          <div className="col" style={horizontal}>
            <div className="res-grid-b01" style={widerColumn}>Guest</div>
            <div className="res-grid-b02" style={widerColumn}>Contact</div>
            <div className="res-grid-b03" style={mediumColumn}>Arrival</div>
            <div className="res-grid-b04" style={narrowColumn}>Nights</div>
            <div className="res-grid-b05" style={mediumColumn}>Departure</div>
            <div className="res-grid-b06" style={widerColumn}>Booking Ref</div>
            <div className="res-grid-b07" style={mediumColumn}>Status</div>
            <div className="res-grid-b08" style={narrowColumn}>Ad</div>
            <div className="res-grid-b09" style={narrowColumn}>Ch</div>
            <div className="res-grid-b10" style={narrowColumn}>Inf</div>
            <div className="res-grid-b11" style={mediumColumn}>Rate</div>
            <div className="res-grid-b12" style={mediumColumn}>Room Type</div>
            <div className="res-grid-b13" style={mediumColumn}>Room</div>
            <div className="res-grid-b14" style={widerColumn}>Ledger</div>
            <div className="res-grid-b15" style={mediumColumn}>Net</div>
            <div className="res-grid-b16" style={mediumColumn}>Gross</div>
          </div>
        </div>
        {this.state.reservations.map(i => <Row key={i.ref} reservation={i} />)}
      </div>
    );
  }
}

export default ReservationsPage1;