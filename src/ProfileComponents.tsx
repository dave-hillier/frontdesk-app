import * as React from 'react';
import {
  FontIcon
} from 'react-md';

import { Address, GuestProfile } from './Model';

function formatAddress(address: Address): string {
  const parts = [address.building, address.streetAddress, address.postalTown, address.postCode, address.countryRegion];
  return parts.filter(p => p.length > 0).join(', ');
}

const Row = (props: { icon?: string, title: string, children: any }) => {
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

export const ProfileShortPanel = (props: { profile: GuestProfile }) => {
  return (
    <div>
      <Row title="Name" icon="person">{props.profile.firstName} {props.profile.lastName}</Row>
      <Row title="Address" icon="person_pin_circle">{formatAddress(props.profile.address)}</Row>
      <Row title="Mail" icon="mail">{props.profile.email}</Row>
      <Row title="Phone" icon="phone"><a href={`tel:${props.profile.phone[0].number}`}>{props.profile.phone[0].number}</a></Row>
    </div>
  );
};
