import * as React from 'react';
import {
  FontIcon, Button
} from 'react-md';

import { Reservation } from './Model';
import { StandardDialog } from './StandardDialog';
import { ProfileShortPanel } from './ProfileComponents';
import { addDays } from './dateHelpers';
import { People } from './ReservationComponents';

import './ReservationDialog.css';

// TODO: remove duplicate
const Row = (props: { icon?: string, title: string, children: any }) => {
  return (
    <div className="rd-tile">
      <div className="rd-tile-icon">
        {props.icon ? <FontIcon>{props.icon}</FontIcon> : <div style={{ width: '24px' }} />}
      </div>
      <div className="rd-tile-content">
        <div className="md-tile-text--primary md-text">{props.title}</div>
        <div className="md-tile-text--secondary md-text--secondary">{props.children}</div></div>
    </div>
  );
};

// TODO: more menu should contain the options?
// TODO: Cancel for before today?
const ReservationPanel = (props: { reservation: Reservation }) => {
  const bookingLine = props.reservation.bookingLines[0];
  const arrival = bookingLine.arrival;
  return (
    <div>
      <div className="rd-grid">
        <div className="rd-tile">
          <Row icon={'date_range'} title={'Arrival'}>{arrival.toLocaleDateString()}</Row>
          <Row icon={'brightness_3'} title={'Nights'}>{bookingLine.nights}</Row>
          <Row icon={'date_range'} title={'Departure'}>{addDays(arrival, bookingLine.nights).toLocaleDateString()}</Row>
        </div>
        <div className="rd-tile">
          <Row icon={'schedule'} title="ETA">{bookingLine.eta ? bookingLine.eta.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</Row>
          <Row title="ETD">{bookingLine.etd ? bookingLine.etd.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</Row>
        </div>
        <div className="rd-tile">
          <Row icon={'hotel'} title="Room Type">{bookingLine.roomType}</Row>
          <Row title="Allocated Room">{bookingLine.allocatedRoom ? bookingLine.allocatedRoom.name : ''}</Row>
        </div>
        <div className="rd-tile">
          <Row icon={'laptop'} title="Media Source">{props.reservation.mediaSource}</Row>
          <Row icon={'pie_chart'} title="Market Segment">{props.reservation.marketSegment}</Row>
        </div>
        <div className="rd-tile">
          <Row icon={'people'} title="Guests"><People adults={1} children={0} infants={0} /></Row>
        </div>

        <div className="rd-tile">

          <Row title="Rate">{bookingLine.rate}</Row>
          <Row title="Deposit Required">{props.reservation.depositRequired.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Row>
          <Row title="Deposit Paid">{props.reservation.depositPaid.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Row>
          <Row title="Total For Stay">{props.reservation.totalForStay.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Row>
          <Row title="Balance">{props.reservation.balance.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Row>
        </div>
      </div>
      {bookingLine.allocatedRoom ? <Button flat={true}>Deallocate</Button> : <Button flat={true}>Allocate</Button>}
      <Button flat={true}>Room Billing</Button>
      <hr />
      <div>Profile <Button icon={true}>edit</Button></div>
      <ProfileShortPanel profile={props.reservation.contact} />
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
    const title = r ? `${r.ref} - ${r.state}` : '';
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