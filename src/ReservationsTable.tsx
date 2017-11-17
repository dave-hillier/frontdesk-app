import * as React from 'react';
import { Button, Paper, FontIcon } from 'react-md';

import { Reservation } from './Model';
import { addDays } from './dateHelpers';
import { ReservationPreviewDialog } from './ReservationPreviewDialog';

import './ReservationsPage.css';

const today = new Date();
today.setHours(0, 0, 0, 0);

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

const Config = () => (
  <div className="md-paper md-paper--2 config-paper">
    <div className="config-paper-cell">
      <FontIcon style={{ color: 'white', marginLeft: '8px' }}>date_range</FontIcon>
      <div className="config-paper-field">Start</div>
      <div className="config-paper-field">End</div>
    </div>
  </div>
);

export class ReservationsTable extends React.PureComponent<{
  reservations: Reservation[]
}, {}> {
  private dialog: ReservationPreviewDialog;

  show(event: any, reservation: Reservation) {
    if (this.dialog) {
      this.dialog.show(event, reservation);
    }
  }

  render() {
    return (
      <div>
        <Config />
        <ReservationPreviewDialog ref={(r: ReservationPreviewDialog) => this.dialog = r} isMobile={false} />
        <Paper zindex={1} className="reservation-table-grid">
          <div className="res-header-container md-font-bold md-text--secondary md-divider-border md-divider-border--bottom toolbar-margin">
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
          {this.props.reservations.map(i => <Row key={i.ref} reservation={i} onClick={e => this.show(e, i)} />)}
        </Paper>
      </div>);
  }
}