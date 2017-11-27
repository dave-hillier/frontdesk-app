import * as React from 'react';

import { getRooms } from './model/FakeData';
import { Room } from './model/Model';
import { SelectItemLayout } from './SelectedItemLayout';
import { RoomListItem, RoomPanel } from './RoomComponents';

class PageLayout extends SelectItemLayout<Room> { }

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