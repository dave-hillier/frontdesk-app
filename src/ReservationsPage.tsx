import * as React from 'react';

import { getReservations } from './FakeReservations';
import { Reservation } from './Model';
import { ResidentItem } from './ReservationComponents';
import { SelectItemLayout } from './SelectedItemLayout';
import { ProfilePanel } from './ProfilesPage';

import './ReservationsPage.css';
import { addDays } from './dateHelpers';
import { Button, Paper } from 'react-md';

class PageLayout extends SelectItemLayout<Reservation> { }

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
      <div className="col-guest">{props.reservation.profile.firstName} {props.reservation.profile.lastName}</div>
      <div className="col-contact">ContactContact ContactContact</div>
      <div className="col-arrival">{props.reservation.arrival.toLocaleDateString()}</div>
      <div className="col-nights">{props.reservation.nights}</div>
      <div className="col-departure">{addDays(props.reservation.arrival, props.reservation.nights).toLocaleDateString()}</div>
      <div className="col-ref">{props.reservation.ref}</div>
      <div className="col-status">{props.reservation.state}</div>
      <div className="col-adult">{props.reservation.guests.adults}</div>
      <div className="col-child">{props.reservation.guests.children}</div>
      <div className="col-infant">{props.reservation.guests.infants}</div>
      <div className="col-rate">{props.reservation.rate}</div>
      <div className="col-roomtype">{props.reservation.requestedRoomTypes[0]}</div>
      <div className="col-room">{props.reservation.allocations[0].name}</div>
      <div className="col-ledger">{props.reservation.ledger ? props.reservation.ledger.name : ''}</div>
      <div className="col-net">Net</div>
      <div className="col-gross">{props.reservation.balance.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</div>
      <div className="col-actions">
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
      <Paper zIndex={1} style={{ margin: '20px' }}>
        <div className="res-header-container md-font-bold md-text--secondary md-divider-border md-divider-border--bottom sticky-top">

          <div className="col-guest">Guest</div>
          <div className="col-contact">Contact</div>
          <div className="col-arrival">Arrival</div>
          <div className="col-nights">Nights</div>
          <div className="col-departure">Departure</div>
          <div className="col-ref">Booking Ref</div>
          <div className="col-status">Status</div>
          <div className="col-adult">Ad</div>
          <div className="col-child">Ch</div>
          <div className="col-rate">Inf</div>
          <div className="col-rate">Rate</div>
          <div className="col-roomtype">Room Type</div>
          <div className="col-room">Room</div>
          <div className="col-ledger">Ledger</div>
          <div className="col-net">Net</div>
          <div className="col-gross">Gross</div>

        </div>
        {this.state.reservations.map(i => <Row key={i.ref} reservation={i} />)}
      </Paper>);
  }
}

export default ReservationsPage1;