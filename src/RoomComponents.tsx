import * as React from 'react';
import {
  ListItem
} from 'react-md';
import { Room } from './Model';

export const RoomListItem = (props: { item: Room, onClick: (x: any) => void }) => {
  return (
    <ListItem
      key={props.item.name}
      className="md-divider-border md-divider-border--bottom"
      primaryText={`Room: ${props.item.name} - ${props.item.type}`}
      secondaryText={`Status: ${props.item.occupied ? 'Occupied' : 'Vacant'}\nHouse Keeping: ${props.item.cleaningStatus}`}
      threeLines={true}
      onClick={props.onClick}
    />);
};