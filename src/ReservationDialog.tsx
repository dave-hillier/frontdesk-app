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
const Row = (props: { icon?: string, title: string, children: any }) => {
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
      <Row icon={'date_range'} title={'Arrival'}>{arrival.toLocaleDateString()}</Row>
      <Row icon={'date_range'} title={'Departure'}>{addDays(arrival, bookingLine.nights).toLocaleDateString()}</Row>
      <Row icon={'brightness_3'} title={'Nights'}>{bookingLine.nights}</Row>
      <Row title="Guests"><People adults={1} children={0} infants={0} /></Row>
      <Row title="Rate">{bookingLine.rate}</Row>
      <Row title="Room Type">{bookingLine.roomType}</Row>
      <Row title="Room">{bookingLine.allocatedRoom ? bookingLine.allocatedRoom.name : ''}</Row>
      <Row title="Media Source">{props.reservation.mediaSource}</Row>
      <Row title="Market Segment">{props.reservation.marketSegment}</Row>
      <Row title="Deposit Required">{props.reservation.depositRequired.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Row>
      <Row title="Deposit Paid">{props.reservation.depositPaid.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Row>
      <Row title="Total For Stay">{props.reservation.totalForStay.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</Row>
      <hr />
      <div>Profile <Button icon={true}>edit</Button></div>
      <ProfileShortPanel profile={props.reservation.contact} />
      <hr />
    </div>
  );
};

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