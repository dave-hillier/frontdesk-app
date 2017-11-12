import * as React from 'react';

import { getRooms } from './FakeReservations';
import { Room } from './Model';
import { SelectItemLayout } from './SelectedItemLayout';
import { RoomListItem } from './RoomComponents';

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

  render() {
    return (
      <PageLayout
        {...this.props}
        title="Room"
        getItems={getRooms}
        renderItem={(item: Room, onClick: (x: any) => void) => <RoomListItem item={item} onClick={onClick} />}
        renderSelectedItem={(item: Room) => <RoomPanel room={item} />}
        dialogId="rooms-dialog"
      />);
  }
}

export default RoomsPage;