import * as React from 'react';

import { getReservations } from './FakeReservations';
import { Reservation } from './Model';
import { ResidentItem } from './ReservationComponents';
import { SelectItemLayout } from './SelectedItemLayout';
import { ProfilePanel } from './ProfileComponents';

import './ReservationsPage.css';
import { addDays } from './dateHelpers';
import { Button, Paper } from 'react-md';
import { ReservationDialog } from './ReservationDialog';

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
            <div className="md-tile-text--secondary md-text--secondary">--:--</div>
          </div>
          <div className="md-tile-content md-cell md-cell--bottom" style={{ minWidth }}>
            <div className="md-tile-text--primary md-text">ETD</div>
            <div className="md-tile-text--secondary md-text--secondary">--:--</div>
          </div>
        </div >
        <ProfilePanel profile={r.contact} />
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
        dialogId="reservation-dialog"
      />);
  }
}

const Row = (props: { reservation: Reservation, onClick: (e: any) => void }) => {
  // TODO: booking reference first?
  const room = props.reservation.bookingLines[0].allocatedRoom;
  const leadGuest = props.reservation.leadGuest ? props.reservation.leadGuest.firstName + ' ' + props.reservation.leadGuest.lastName : '';

  return (
    <div className="res-row-container md-divider-border md-divider-border--bottom" onClick={props.onClick}>
      <div className="col-contact">{props.reservation.contact.firstName} {props.reservation.contact.lastName}</div>
      <div className="col-guest">{leadGuest}</div>
      <div className="col-arrival">{props.reservation.bookingLines[0].arrival.toLocaleDateString()}</div>
      <div className="col-nights">{props.reservation.bookingLines[0].nights}</div>
      <div className="col-departure">{addDays(props.reservation.bookingLines[0].arrival, props.reservation.bookingLines[0].nights).toLocaleDateString()}</div>
      <div className="col-ref">{props.reservation.ref}</div>
      <div className="col-status">{props.reservation.state}</div>
      <div className="col-adult">{props.reservation.bookingLines[0].guests.adults}</div>
      <div className="col-child">{props.reservation.bookingLines[0].guests.children}</div>
      <div className="col-infant">{props.reservation.bookingLines[0].guests.infants}</div>
      <div className="col-rate">{props.reservation.bookingLines[0].rate}</div>
      <div className="col-roomtype">{props.reservation.bookingLines[0].roomType}</div>
      <div className="col-room">{room ? room.name : ''}</div>
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
  private dialog: ReservationDialog;

  constructor(props: any) {
    super(props);
    this.state = { reservations: [], isLoading: true };
  }

  componentWillMount() {
    getReservations(this.props.hotelSiteCode).then((reservations: Reservation[]) => {
      reservations.sort((a, b) => a.bookingLines[0].arrival.getTime() - b.bookingLines[0].arrival.getTime());
      this.setState({ reservations });
      // Slight delay to remove loading...
      setTimeout(() => this.setState({ isLoading: false }), 100);
    });
  }

  show(event: any, reservation: Reservation) {
    if (this.dialog) {
      this.dialog.show(event, reservation);
    }
  }

  render() {
    if (this.props.isMobile) {
      return <ReservationsPage {...this.props} />;
    }

    return (
      <div>
        <ReservationDialog ref={(r: ReservationDialog) => this.dialog = r} isMobile={this.props.isMobile} />
        <Paper zindex={1} style={{ margin: '20px' }}>
          <div className="res-header-container md-font-bold md-text--secondary md-divider-border md-divider-border--bottom sticky-top">
            <div className="col-contact">Contact</div>
            <div className="col-guest">Lead Guest</div>
            <div className="col-arrival">Arrival</div>
            <div className="col-nights">Nights</div>
            <div className="col-departure">Departure</div>
            <div className="col-ref">Booking Ref</div>
            <div className="col-status">Status</div>
            <div className="col-adult">Ad</div>
            <div className="col-child">Ch</div>
            <div className="col-infant">Inf</div>
            <div className="col-rate">Rate</div>
            <div className="col-roomtype">Room Type</div>
            <div className="col-room">Room</div>
            <div className="col-ledger">Ledger</div>
            <div className="col-net">Net</div>
            <div className="col-gross">Gross</div>

          </div>
          {this.state.reservations.map(i => <Row key={i.ref} reservation={i} onClick={e => this.show(e, i)} />)}
        </Paper>
      </div>);
  }
}

export default ReservationsPage1;