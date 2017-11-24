import * as React from 'react';
import { Button, Paper, FontIcon, ListItem, DialogContainer } from 'react-md';

import { Reservation } from './Model';
import { addDays } from './dateHelpers';
import { ReservationPreviewDialog } from './ReservationPreviewDialog';

import './ReservationsPage.css';
import { MoreVertButton } from './MoreVertButton';
import { DatePicker } from './DataPicker';

const today = new Date();
today.setHours(0, 0, 0, 0);

const ReservationRow = (props: { reservation: Reservation, onClick: (e: any) => void }) => {
  // TODO: booking reference first?
  const room = props.reservation.bookingLines[0].allocatedRoom;
  const leadGuest = props.reservation.leadGuest ? props.reservation.leadGuest.firstName + ' ' + props.reservation.leadGuest.lastName : '';

  return (
    <div className="res-row-container md-divider-border md-divider-border--bottom" onClick={props.onClick}>
      <div className="col-ref">{props.reservation.ref}</div>

      <div className="col-arrival">{props.reservation.bookingLines[0].arrival.toLocaleDateString()}</div>
      <div className="col-nights">{props.reservation.bookingLines[0].nights}</div>
      <div className="col-departure">{addDays(props.reservation.bookingLines[0].arrival, props.reservation.bookingLines[0].nights).toLocaleDateString()}</div>

      <div className="col-room">{room ? room.name : ''}</div>
      <div className="col-roomtype">{props.reservation.bookingLines[0].roomType}</div>

      <div className="col-guest">{leadGuest}</div>
      <div className="col-contact">{props.reservation.contact.firstName} {props.reservation.contact.lastName}</div>

      <div className="col-adult">{props.reservation.bookingLines[0].guests.adults}</div>
      <div className="col-child">{props.reservation.bookingLines[0].guests.children}</div>
      <div className="col-infant">{props.reservation.bookingLines[0].guests.infants}</div>
      <div className="col-status">{props.reservation.state}</div>
      <div className="col-rate">{props.reservation.bookingLines[0].rate}</div>

      <div className="col-ledger">{props.reservation.ledger ? props.reservation.ledger.name : ''}</div>
      <div className="col-net">Net</div>
      <div className="col-gross">{props.reservation.balance.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</div>
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
    <div className="col-nights">Nights</div>
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
      <DialogContainer
        id={`date-picker-dialog`}
        visible={this.state.visible}
        onHide={() => this.setState({ visible: false })}
        dialogClassName="md-dialog--picker"
        contentClassName="md-dialog-content--picker"
        closeOnEsc={true}
        focusOnMount={false}
      >
        <DatePicker />
      </DialogContainer>
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
  rowHeight: number, onClick: (e: any, r: Reservation) => void, reservations: Reservation[]
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

  renderItem(r: any, onClick: any) {
    return <ReservationRow key={r.ref} reservation={r} onClick={e => onClick(e, r)} />;
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
    const { rowHeight, onClick, reservations } = this.props;
    const { startIndex, endIndex } = this.window(reservations.length, 10, 30);
    const reservationsToShow = reservations.slice(startIndex, endIndex);

    const countAfter = reservations.length - endIndex;
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
        <ConfigPlaceholder />
        <ReservationPreviewDialog ref={(r: ReservationPreviewDialog) => this.dialog = r} isMobile={false} />
        <Table rowHeight={52} reservations={this.props.reservations} onClick={(e, r) => this.show(e, r)} />
      </div >);
  }
}
