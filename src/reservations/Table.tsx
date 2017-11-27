import * as React from 'react';
import { Button, Paper, ListItem } from 'react-md';

import { Reservation, BookingLine } from '../model/Model';
import { addDays } from '../util';

import './ReservationsPage.css';
import { MoreVertButton } from '../MoreVertButton';

const today = new Date();
today.setHours(0, 0, 0, 0);

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
      <div className="col-gross">{reservation.balance.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</div>
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

// TODO: create/use Virtualized HOC
export class Table extends React.PureComponent<{
  rowHeight: number, onClick: (e: any, r: Reservation) => void, bookings: BookingLine[]
}, { scrollPosition: number }> {
  constructor(props: any) {
    super(props);
    this.state = { scrollPosition: 0 };
  }

  componentWillMount() {
    window.addEventListener('scroll', this.listenScrollEvent);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenScrollEvent);
  }

  renderItem(bl: BookingLine, onClick: any) {
    return <BookingRow key={bl.refFull} bookingLine={bl} onClick={e => onClick(e, bl.reservation)} />;
  }

  window(count: number, numberBefore: number, numberOnScreen: number) {
    let endIndex = this.state.scrollPosition + numberOnScreen;
    if (endIndex > count) {
      endIndex = count;
    }

    let startIndex = this.state.scrollPosition - numberBefore;
    if (startIndex < 0) {
      startIndex = 0;
    }

    if (startIndex > endIndex - numberOnScreen) {
      startIndex = endIndex - numberOnScreen;
    }

    return { startIndex, endIndex };
  }

  render() {
    const { rowHeight, onClick, bookings } = this.props;
    const { startIndex, endIndex } = this.window(bookings.length, 10, 30);
    const reservationsToShow = bookings.slice(startIndex, endIndex);

    const countAfter = bookings.length - endIndex;
    return (
      <Paper zDepth={1} className="reservation-table-grid" >
        <ColumnHeaders />
        <div style={{ height: startIndex * rowHeight }} />
        {reservationsToShow.map(r => this.renderItem(r, onClick))}
        <div style={{ height: countAfter * rowHeight }} />
      </Paper>);
  }

  private listenScrollEvent = (e: any) => {
    if (document.scrollingElement) {
      const offsetFromTop = document.scrollingElement.scrollTop;
      const scrollPosition = Math.floor(offsetFromTop / this.props.rowHeight);
      this.setState({ scrollPosition });
    }
  }
}
