import * as React from 'react';
import {
  FontIcon, Button
} from 'react-md';

import { Reservation } from './Model';
import { StandardDialog } from './StandardDialog';
import { ProfileShortPanel } from './ProfileComponents';
import { addDays } from './dateHelpers';

// TODO: remove duplicate
const Row = (props: { icon: string, title: string, children: any }) => {
  return (
    <div className="md-list-tile" style={{ padding: '8px' }}>
      <div className="md-tile-addon md-tile-addon--icon">
        <FontIcon>{props.icon}</FontIcon>
      </div>
      <div className="md-tile-content md-tile-content--left-icon">
        <div className="md-tile-text--primary md-text">{props.title}</div>
        <div className="md-tile-text--secondary md-text--secondary">{props.children}</div></div>
    </div>
  );
};

const ReservationPanel = (props: { reservation: Reservation }) => {
  const arrival = props.reservation.bookingLines[0].arrival;
  return (
    <div>
      <Row icon={'date_range'} title={'Arrival'}>{arrival.toLocaleDateString()}</Row>
      <Row icon={'date_range'} title={'Departure'}>{addDays(arrival, props.reservation.bookingLines[0].nights).toLocaleDateString()}</Row>
      <Row icon={'brightness_3'} title={'Nights'}>{props.reservation.bookingLines[0].nights}</Row>
      <hr />
      <div>Profile <Button icon={true}>edit</Button></div>
      <ProfileShortPanel profile={props.reservation.contact} />
      <hr />
    </div>
  );
};

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