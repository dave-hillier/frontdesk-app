import * as React from 'react';
import {
  FontIcon,
  ListItem
} from 'react-md';

import { Address, GuestProfile } from './model/Model';

export function formatAddress(address: Address): string {
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
      <Row title="Address" icon="person_pin_circle">{formatAddress(props.profile.addresses[0].value)}</Row>
      <Row title="Mail" icon="mail">{props.profile.emails[0].email}</Row>
      <Row title="Phone" icon="phone"><a href={`tel:${props.profile.phoneNumbers[0].number}`}>{props.profile.phoneNumbers[0].number}</a></Row>
    </div>
  );
};

export const ProfileListItem = (props: { item: GuestProfile, onClick: any }) => (
  <ListItem
    key={`${props.item.firstName} ${props.item.lastName} ${props.item.created}`}
    className="md-divider-border md-divider-border--bottom"
    primaryText={`${props.item.firstName} ${props.item.lastName}`}
    secondaryText={`${formatAddress(props.item.addresses[0].value)}\n${props.item.emails[0].email}`}
    threeLines={true}
    onClick={props.onClick}
  />
);

export class ProfilePanel extends React.PureComponent<{ profile: GuestProfile }> {
  render() {
    const p = this.props.profile;
    const minWidth = '150px';
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div className="md-cell md-cell--bottom" style={{ minWidth }}>
            <div className="md-text--primary">First Name</div>
            <div className="md-text--secondary">{p.firstName}</div>
          </div>
          <div className="md-cell md-cell--bottom" style={{ minWidth }}>
            <div className="md-text--primary">Last Name</div>
            <div className="md-text--secondary">{p.lastName}</div>
          </div>
        </div>

        <div className="md-cell md-cell--bottom" style={{ minWidth }}>
          <div className="md-text--primary">Address</div>
          <div className="md-text--secondary">{formatAddress(p.addresses[0].value)}</div>
        </div>
        <div className="md-cell md-cell--bottom" style={{ minWidth }}>
          <div className="md-text--primary">Email</div>
          <div className="md-text--secondary">{p.emails[0].email}</div>
        </div>
      </div>);
  }
}