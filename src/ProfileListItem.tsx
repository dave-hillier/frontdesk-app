import * as React from 'react';

import { GuestProfile } from './Model';
import { ListItem } from 'react-md';
import { formatAddress } from './ProfileComponents';

const ProfileListItem = (props: { item: GuestProfile, onClick: any }) => (
  <ListItem
    key={`${props.item.firstName} ${props.item.lastName} ${props.item.created}`}
    className="md-divider-border md-divider-border--bottom"
    primaryText={`${props.item.firstName} ${props.item.lastName}`}
    secondaryText={`${formatAddress(props.item.address)}\n${props.item.email}`}
    threeLines={true}
    onClick={props.onClick}
  />
);

export default ProfileListItem;