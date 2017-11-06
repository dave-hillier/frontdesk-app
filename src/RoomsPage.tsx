import * as React from 'react';

import { getRooms } from './FakeReservations';
import { Room } from './Model';
import { SelectItemLayout } from './SelectedItemLayout';
import { ListItem } from 'react-md';

class PageLayout extends SelectItemLayout<Room> { }

class RoomPanel extends React.PureComponent<{ room: Room }> {

  render() {
    const r = this.props.room;

    return (
      <div>
        <div className="md-tile-content">
          <div className="md-tile-text--primary md-text">Name</div>
          <div className="md-tile-text--secondary md-text--secondary">{r.name}</div>
        </div>
        <div className="md-tile-content">
          <div className="md-tile-text--primary md-text">Type</div>
          <div className="md-tile-text--secondary md-text--secondary">{r.type}</div>
        </div>
        <div className="md-tile-content">
          <div className="md-tile-text--primary md-text">Status</div>
          <div className="md-tile-text--secondary md-text--secondary">{r.occupied ? 'Occupied' : 'Vacant'}</div>
        </div>
        <div className="md-tile-content">
          <div className="md-tile-text--primary md-text">Housekeeping</div>
          <div className="md-tile-text--secondary md-text--secondary">{r.cleaningStatus}</div>
        </div>
      </div>);
  }
}

export class RoomsPage extends React.PureComponent<{
  isMobile: boolean,
  hotelSiteCode: string
}> {

  renderItem(item: Room, onClick: (x: any) => void): JSX.Element {

    return (
      <ListItem
        key={item.name}
        className="md-divider-border md-divider-border--bottom"
        primaryText={`Room: ${item.name} - ${item.type}`}
        secondaryText={`Status: Vacant\nHouse Keeping: Clean`}
        threeLines={true}
        onClick={onClick}
      />);
  }

  renderSelectedItem(item: Room): JSX.Element {
    return <RoomPanel room={item} />;
  }

  render() {
    return (
      <PageLayout
        {...this.props}
        getItems={getRooms}
        renderItem={this.renderItem}
        renderSelectedItem={this.renderSelectedItem}
      />);
  }
}

export default RoomsPage;