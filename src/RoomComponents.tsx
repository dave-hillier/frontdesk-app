import * as React from 'react';
import { ListItem } from 'react-md';

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

const Row = (props: { icon?: string, title: string, children: any }) => {
  return (
    <div className="md-tile-content">
      <div className="md-tile-text--primary md-text">{props.title}</div>
      <div className="md-tile-text--secondary md-text--secondary">{props.children}</div></div>
  );
};

export class RoomPanel extends React.PureComponent<{ room: Room }> {
  render() {
    const r = this.props.room;

    return (
      <div>
        <Row title="Name">{r.name}</Row>
        <Row title="Type">{r.type}</Row>
        <Row title="Status">{r.occupied ? 'Occupied' : 'Vacant'}</Row>
        <Row title="Housekeeping">{r.cleaningStatus}</Row>
      </div>);
  }
}
