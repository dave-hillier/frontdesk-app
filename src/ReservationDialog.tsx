import * as React from 'react';
import {
  FontIcon, Button
} from 'react-md';

import { Reservation } from './Model';
import { StandardDialog } from './StandardDialog';
import { ProfileShortPanel } from './ProfileComponents';
import { addDays } from './dateHelpers';
import { People } from './ReservationComponents';

// TODO: remove duplicate
const IconNameValue = (props: { icon?: string, title: string, children: any }) => {
  return (
    <div className="md-list-tile" style={{ padding: '8px' }}>
      <div className="md-tile-addon md-tile-addon--icon">
        {props.icon ? <FontIcon>{props.icon}</FontIcon> : <div style={{ width: '20px' }} />}
      </div>
      <div className="md-tile-content md-tile-content--left-icon">
        <div className="md-tile-text--primary md-text">{props.title}</div>
        <div className="md-tile-text--secondary md-text--secondary">{props.children}</div></div>
    </div>
  );
};

const ReservationPanel = (props: { reservation: Reservation }) => {
  const bookingLine = props.reservation.bookingLines[0];
  const arrival = bookingLine.arrival;
  return (
    <div>
      <div className="md-grid">
        <div className="md-cell"><IconNameValue icon={'date_range'} title={'Arrival'}>{arrival.toLocaleDateString()}</IconNameValue></div>
        <div className="md-cell"><IconNameValue icon={'date_range'} title={'Departure'}>{addDays(arrival, bookingLine.nights).toLocaleDateString()}</IconNameValue></div>
        <div className="md-cell"><IconNameValue icon={'brightness_3'} title={'Nights'}>{bookingLine.nights}</IconNameValue></div>
        <div className="md-cell"><IconNameValue title="Guests"><People adults={1} children={0} infants={0} /></IconNameValue></div>
        <div className="md-cell"><IconNameValue title="Rate">{bookingLine.rate}</IconNameValue></div>
        <div className="md-cell"><IconNameValue title="Room Type">{bookingLine.roomType}</IconNameValue></div>
        <div className="md-cell"><IconNameValue title="Room">{bookingLine.allocatedRoom ? bookingLine.allocatedRoom.name : ''}</IconNameValue></div>
        <div className="md-cell"><IconNameValue title="Media Source">{props.reservation.mediaSource}</IconNameValue></div>
        <div className="md-cell"><IconNameValue title="Market Segment">{props.reservation.marketSegment}</IconNameValue></div>
        <div className="md-cell"><IconNameValue title="Deposit Required">{props.reservation.depositRequired.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</IconNameValue></div>
        <div className="md-cell"><IconNameValue title="Deposit Paid">{props.reservation.depositPaid.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</IconNameValue></div>
        <div className="md-cell"><IconNameValue title="Total For Stay">{props.reservation.totalForStay.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</IconNameValue></div>
        <div className="md-cell"><IconNameValue title="Balance">{props.reservation.balance.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</IconNameValue></div>
      </div>
      <hr />
      <div>Profile <Button icon={true}>edit</Button></div>
      <ProfileShortPanel profile={props.reservation.contact} />
      <hr />
    </div >
  );
};

// TODO: ideally a dialog props
// TODO: actions allocate/unallocate
export class ReservationDialog extends React.Component<{ isMobile?: boolean, isDesktop?: boolean }, { reservation: any }> {
  private dialog: StandardDialog | null;

  constructor(props: any) {
    super(props);
    this.state = { reservation: null };
  }

  render() {
    const r: Reservation = this.state.reservation;
    const title = r ? `${r.ref} - ${r.state}` : '';
    return (
      <StandardDialog
        title={title}
        id="reservation-dialog"
        {...this.props}
        ref={self => this.dialog = self}
      >
        <ReservationPanel reservation={r} />
      </StandardDialog>);
  }

  show(e: any, r: any) {
    if (this.dialog) {
      this.dialog.show(e);
      this.setState({ reservation: r });
    }
  }
}