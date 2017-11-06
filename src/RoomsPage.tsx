import * as React from 'react';

import { getRooms } from './FakeReservations';
import { Room } from './Model';
import { SelectItemLayout } from './SelectedItemLayout';
import { ListItem } from 'react-md';

class PageLayout extends SelectItemLayout<Room> { }

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
    return <div>{JSON.stringify(item)}</div>;
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