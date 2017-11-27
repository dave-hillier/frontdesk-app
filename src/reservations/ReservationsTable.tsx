import * as React from 'react';
import { Button, Paper, FontIcon, ListItem, Collapse } from 'react-md';

import { Reservation, BookingLine } from '../Model';
import { addDays } from '../dateHelpers';
import { ReservationPreviewDialog } from './ReservationPreviewDialog';

import './ReservationsPage.css';
import { MoreVertButton } from '../MoreVertButton';
import { DatePicker } from '../DataPicker';

const today = new Date();
today.setHours(0, 0, 0, 0);

const ReservationRow = (props: { bookingLine: BookingLine, onClick: (e: any) => void }) => {
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

const ReservationHeaders = () => (
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

class PickerContainer extends React.PureComponent<{}, { visible: boolean }> {
  constructor(props: any) {
    super(props);

    this.state = { visible: false };
  }

  render() {
    return (
      <Collapse collapsed={!this.state.visible} animate={true}>
        <DatePicker close={() => this.setState({ visible: false })} />
      </Collapse>
    );
  }

  show() {
    this.setState({ visible: true });
  }
}

// TODO: Move into search bar when its wider...
class ConfigPlaceholder extends React.PureComponent<{}, {}> {
  dialog: PickerContainer | null;
  render() {
    return (
      <div>
        <PickerContainer ref={d => this.dialog = d} />
        <div className="md-paper md-paper--2 config-paper" onClick={() => this.dialog && this.dialog.show()}>
          <div className="config-paper-cell">
            <FontIcon style={{ color: 'white', marginLeft: '8px' }}> date_range</FontIcon >
            <div className="config-paper-field">Start</div>
            <div className="config-paper-field">End</div>
          </div >
        </div >
      </div>
    );
  }
}

class Table extends React.PureComponent<{
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
    return <ReservationRow key={bl.refFull} bookingLine={bl} onClick={e => onClick(e, bl.reservation)} />;
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
        <ReservationHeaders />
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

// TODO: This is the whole page
export class ReservationsTable extends React.PureComponent<{
  bookings: BookingLine[]
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
        <ConfigPlaceholder />
        <ReservationPreviewDialog ref={(r: ReservationPreviewDialog) => this.dialog = r} isMobile={false} />
        <Table rowHeight={65} bookings={this.props.bookings} onClick={(e, r) => this.show(e, r)} />
      </div >);
  }
}
