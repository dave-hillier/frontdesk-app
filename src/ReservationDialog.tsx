import * as React from 'react';
import {
  FontIcon
} from 'react-md';

import { Address, Reservation, GuestProfile } from './Model';
import { StandardDialog } from './StandardDialog';

function toCaps(s: string) {
  return s.replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./, function (str: string) { return str.toUpperCase(); });
}

export function renderGrid(r: any) {
  if (typeof r === 'string') {
    return r;
  } else if (Array.isArray(r)) {
    const values: any[] = r.map((v: any) => renderGrid(v));
    return <div>{...values}</div>;
  }
  const flexDirection: 'row' = 'row';
  const row = {
    width: '100%', display: 'flex', flexDirection
  };
  const header = {
    width: '150px'
  };
  const rows: JSX.Element[] = [];
  const borders = 'md-divider-border md-divider-border--top md-divider-border--right md-divider-border--bottom md-divider-border--left';
  for (let key in r) {
    if (r.hasOwnProperty(key)) {
      let value = r[key];
      if (typeof r[key] === 'object') {
        value = renderGrid(value);
      }
      const rx = (
        <div key={key} style={row} className={borders + 'md-tile-content'}>
          <div style={header} className="md-tile-text--primary md-text">{toCaps(key)}</div>
          <div className="md-tile-text--secondary md-text--secondary">{value}</div>
        </div>);
      rows.push(rx);
    }
  }
  return rows;
}

function formatAddress(address: Address): string {
  const parts = [address.organisation, address.streetAddress, address.postalTown, address.postCode, address.countryRegion];
  return parts.filter(p => p.length > 0).join(', ');
}

const Row = (props: { icon: string, title: string, children: any }) => {
  return (
    <div
      className="md-list-tile"
    >
      <div className="md-tile-addon md-tile-addon--icon">
        <FontIcon>{props.icon}</FontIcon>
      </div>
      <div className="md-tile-content md-tile-content--left-icon">
        <div className="md-tile-text--primary md-text">{props.title}</div>
        <div className="md-tile-text--secondary md-text--secondary">{props.children}</div></div>
    </div>
  );
};

const ProfileShortPanel = (props: { profile: GuestProfile }) => {
  return (
    <div>
      <div>Profile</div>
      <Row title="Name" icon="person">{props.profile.firstName} {props.profile.lastName}</Row>
      <Row title="Address" icon="person_pin_circle">{formatAddress(props.profile.address)}</Row>
      <Row title="Mail" icon="mail">{props.profile.email}</Row>
      <Row title="Phone" icon="phone"><a href={`tel:${props.profile.phone[0].number}`}>{props.profile.phone[0].number}</a></Row>
    </div>
  );
};

const ReservationPanel = (props: { reservation: Reservation }) => {
  return (
    <div>
      <ProfileShortPanel profile={props.reservation.contact} />
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

    return (
      <StandardDialog
        title="Reservation"
        id="reservation-dialog"
        {...this.props}
        ref={self => this.dialog = self}
      >
        {r && <ReservationPanel reservation={r} />}
      </StandardDialog>);
  }

  show(e: any, r: any) {
    if (this.dialog) {
      this.dialog.show(e);
      this.setState({ reservation: r });
    }
  }
}