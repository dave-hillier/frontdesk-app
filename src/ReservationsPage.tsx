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

      <div className="res-grid-b01">{props.reservation.profile.firstName} {props.reservation.profile.lastName}</div>
      <div className="res-grid-b02" />
      <div className="res-grid-b03">{props.reservation.arrival.toLocaleDateString()}</div>
      <div className="res-grid-b04">{props.reservation.nights}</div>
      <div className="res-grid-b05">{addDays(props.reservation.arrival, props.reservation.nights).toLocaleDateString()}</div>
      <div className="res-grid-b06">{props.reservation.ref}</div>
      <div className="res-grid-b07">{props.reservation.state}</div>
      <div className="res-grid-b08">{props.reservation.guests.adults}</div>
      <div className="res-grid-b09">{props.reservation.guests.children}</div>
      <div className="res-grid-b10">{props.reservation.guests.infants}</div>
      <div className="res-grid-b11">{props.reservation.rate}</div>
      <div className="res-grid-b12">{props.reservation.requestedRoomTypes[0]}</div>
      <div className="res-grid-b13">{props.reservation.allocations[0].name}</div>
      <div className="res-grid-b14">{props.reservation.ledger ? props.reservation.ledger.name : ''}</div>
      <div className="res-grid-b15">{props.reservation.balance.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</div>
      <div className="res-grid-b16">{props.reservation.balance.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</div>

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
      <Paper zIndex={1} style={{ margin: '20px' }}>
        <div className="res-header-container md-divider-border md-divider-border--bottom sticky-top">

          <div className="res-grid-b01">Guest</div>
          <div className="res-grid-b02">Contact</div>
          <div className="res-grid-b03">Arrival</div>
          <div className="res-grid-b04">Nights</div>
          <div className="res-grid-b05">Departure</div>
          <div className="res-grid-b06">Booking Ref</div>
          <div className="res-grid-b07">Status</div>
          <div className="res-grid-b08">Ad</div>
          <div className="res-grid-b09">Ch</div>
          <div className="res-grid-b10">Inf</div>
          <div className="res-grid-b11">Rate</div>
          <div className="res-grid-b12">Room Type</div>
          <div className="res-grid-b13">Room</div>
          <div className="res-grid-b14">Ledger</div>
          <div className="res-grid-b15">Net</div>
          <div className="res-grid-b16">Gross</div>

        </div>
        {this.state.reservations.map(i => <Row key={i.ref} reservation={i} />)}
      </Paper>);
  }
}

export default ReservationsPage1;