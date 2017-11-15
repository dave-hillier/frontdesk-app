import * as React from 'react';
import { FontIcon, Button } from 'react-md';

import { Reservation } from './Model';
import { StandardDialog } from './StandardDialog';
import { ProfileShortPanel } from './ProfileComponents';
import { addDays } from './dateHelpers';
import { People } from './ReservationComponents';

import './ReservationDialog.css';

// TODO: remove duplicate
const Value = (props: { title: string, children: any }) => {
  return (
    <div className="rd-tile">
      <div className="rd-tile-content">
        <div className="md-tile-text--primary md-text">{props.title}</div>
        <div className="md-tile-text--secondary md-text--secondary">{props.children}</div></div>
    </div>
  );
};

// TODO: more menu should contain the options?
// TODO: Cancel for before today?
// TODO: state on mobile
const ReservationPanel = (props: { reservation: Reservation }) => {
  const bookingLine = props.reservation.bookingLines[0];
  const arrival = bookingLine.arrival;
  return (
    <div>
      <div className="rd-grid">
        <div className="rd-row">
          <div className="rd-tile-icon"><FontIcon>date_range</FontIcon></div>
          <Value title={'Arrival'}>{arrival.toLocaleDateString()}</Value>
          <Value title={'Nights'}>{bookingLine.nights}</Value>
          <Value title={'Departure'}>{addDays(arrival, bookingLine.nights).toLocaleDateString()}</Value>
        </div>
        <div className="rd-row">
          <div className="rd-tile-icon"><FontIcon>schedule</FontIcon></div>
          <Value title="ETA">{bookingLine.eta ? bookingLine.eta.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</Value>
          <Value title="ETD">{bookingLine.etd ? bookingLine.etd.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</Value>

          <Value title="Guests"><People adults={1} children={0} infants={0} /></Value>
        </div>
        <div className="rd-row">
          <div className="rd-tile-icon"><FontIcon>hotel</FontIcon></div>
          <Value title="Room Type">{bookingLine.roomType}</Value>
          <Value title="Allocated Room">{bookingLine.allocatedRoom ? bookingLine.allocatedRoom.name : ''}</Value>
        </div>
        <div className="rd-row">
          <div className="rd-tile-icon"><FontIcon>pie_chart</FontIcon></div>
          <Value title="Media Source">{props.reservation.mediaSource}</Value>
          <Value title="Market Segment">{props.reservation.marketSegment}</Value>
        </div>
        <div className="rd-row">
          <div />
          <Value title="Rate">{bookingLine.rate}</Value>
          <Value title="Status">{props.reservation.state}</Value>
        </div>
        <div className="rd-row">
          <div />
          <Value title="Deposit Required">{props.reservation.depositRequired.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Value>
          <Value title="Deposit Paid">{props.reservation.depositPaid.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Value>
        </div>
        <div className="rd-row">
          <div />
          <Value title="Total For Stay">{props.reservation.totalForStay.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Value>
          <Value title="Balance">{props.reservation.balance.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Value>
        </div>
      </div>
      {bookingLine.allocatedRoom ? <Button flat={true}>Deallocate</Button> : <Button flat={true}>Allocate</Button>}
      <Button flat={true}>Room Billing</Button>
      <hr />
      <div className="rd-grid">
        <div className="rd-row">
          <div className="rd-tile">Profile <Button icon={true}>edit</Button></div>
        </div>
        <div className="rd-row">
          <div className="rd-tile"><ProfileShortPanel profile={props.reservation.contact} /></div>
        </div>
      </div>
    </div >
  );
};

// TODO: ideally a dialog props
// TODO: actions allocate/unallocate
export class ReservationDialog extends React.Component<{ isMobile?: boolean, isDesktop?: boolean }, { reservation?: Reservation }> {
  private dialog: StandardDialog | null;

  constructor(props: any) {
    super(props);
    this.state = { reservation: undefined };
  }

  render() {
    const r: Reservation | undefined = this.state.reservation;
    const title = !this.props.isMobile ? (r ? `${r.ref} - ${r.state}` : '') : (r ? r.ref : '');
    return (
      <StandardDialog
        title={title}
        id="reservation-dialog"
        {...this.props}
        ref={self => this.dialog = self}
      >
        {r && <ReservationPanel reservation={r} />}
      </StandardDialog>);
  }

  show(e: any, r: Reservation) {
    if (this.dialog) {
      this.dialog.show(e);
      this.setState({ reservation: r });
    }
  }
}