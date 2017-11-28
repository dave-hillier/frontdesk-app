import * as React from 'react';
import { Button, Paper, ListItem } from 'react-md';

import { Reservation, BookingLine } from '../model/Model';
import { addDays } from '../util';

import './ReservationsPage.css';
import { MoreVertButton } from '../MoreVertButton';
import { Virtualized } from '../Virtualized';

const today = new Date();
today.setHours(0, 0, 0, 0);
const locale = navigator.language;

const BookingRow = (props: { bookingLine: BookingLine, onClick: (e: any) => void }) => {
  const bookingLine = props.bookingLine;
  const reservation = props.bookingLine.reservation;
  const room = bookingLine.allocatedRoom;

  const leadGuest = reservation.leadGuest ? reservation.leadGuest.firstName + ' ' + reservation.leadGuest.lastName : '';

  return (
    <div className="res-row-container md-divider-border md-divider-border--bottom" onClick={props.onClick}>
      <div className="col-ref">{bookingLine.refFull}</div>

      <div className="col-arrival">{bookingLine.arrival.toLocaleDateString()}</div>
      <div className="col-nights">{bookingLine.nights}</div>
      <div className="col-departure">{addDays(bookingLine.arrival, bookingLine.nights).toLocaleDateString()}</div>

      <div className="col-room">{room ? room.name : ''}</div>
      <div className="col-roomtype">{bookingLine.roomType}</div>

      <div className="col-guest">{leadGuest}</div>
      <div className="col-contact">{reservation.contact.firstName} {reservation.contact.lastName}</div>

      <div className="col-adult">{bookingLine.guests.adults}</div>
      <div className="col-child">{bookingLine.guests.children}</div>
      <div className="col-infant">{bookingLine.guests.infants}</div>
      <div className="col-status">{reservation.state}</div>
      <div className="col-rate">{bookingLine.rate}</div>

      <div className="col-ledger">{reservation.ledger ? reservation.ledger.name : ''}</div>
      <div className="col-net">Net</div>
      <div className="col-gross">{reservation.balance.toLocaleString(locale, { style: 'currency', currency: 'GBP' })}</div>
      <div className="col-actions">
        <Button icon={true}>edit</Button>
        <MoreVertButton id="dialog-more-button">
          <ListItem key={1} primaryText="Item One" />
          <ListItem key={2} primaryText="Item Two" />
        </MoreVertButton>
      </div>
    </div>
  );
};

const ColumnHeaders = () => (
  <div className="res-header-container md-font-bold md-text--secondary md-divider-border md-divider-border--bottom toolbar-margin">
    <div className="col-ref">Booking Ref</div>

    <div className="col-arrival">Arrival</div>
    <div className="col-nights">Ngt</div>
    <div className="col-departure">Departure</div>

    <div className="col-room">Room</div>
    <div className="col-roomtype">Room Type</div>

    <div className="col-guest">Lead Guest</div>
    <div className="col-contact">Contact</div>

    <div className="col-adult">Ad</div>
    <div className="col-child">Ch</div>
    <div className="col-infant">Inf</div>
    <div className="col-status">Status</div>

    <div className="col-rate">Rate</div>

    <div className="col-ledger">Ledger</div>
    <div className="col-net">Net</div>
    <div className="col-gross">Gross</div>
  </div>
);

export class Table extends React.PureComponent<{
  rowHeight: number, onClick: (e: any, r: Reservation) => void, bookings: BookingLine[]
}, {}> {

  renderItem(bl: BookingLine, onClick: any) {
    return <BookingRow key={bl.refFull} bookingLine={bl} onClick={e => onClick(e, bl.reservation)} />;
  }

  render() {
    const { rowHeight, onClick, bookings } = this.props;

    return (
      <Paper zDepth={1} className="reservation-table-grid" >
        <ColumnHeaders />
        <Virtualized
          numberBefore={10}
          numberOnScreen={30}
          rowHeight={rowHeight}
          collection={bookings}
          renderItem={(r: BookingLine) => this.renderItem(r, onClick)}
        />
      </Paper>);
  }
}
