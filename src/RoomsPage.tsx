import * as React from 'react';
import {
  List,
  ListItem,
  Grid,
  Cell

} from 'react-md';

import { getRooms } from './FakeReservations';
import { Room } from './Model';

class RoomsPage extends React.Component<{ isMobile: boolean, hotelSiteCode: string },
  { rooms: Room[], isLoading: boolean, selected?: Room }> {

  constructor(props: any) {
    super(props);
    this.state = { rooms: [], isLoading: true };
  }

  componentWillMount() {
    const isLoading = false;
    getRooms(this.props.hotelSiteCode).then(rooms => {
      this.setState({ rooms, isLoading });
    });
  }

  render() {
    if (this.state.isLoading) {
      return <div>Loading</div>;
    }

    const list = (
      <List className="md-paper md-paper--1">
        {this.state.rooms.map(r => (
          <ListItem
            primaryText={`Room: ${r.name} - ${r.type}`}
            secondaryText={`Status: Vacant\nHouse Keeping: Clean`}
            threeLines={true}
            onClick={e => this.setState({ selected: r })}
          />))}
      </List>
    );

    return !this.props.isMobile ? (
      <Grid>
        <Cell>{list}</Cell>
        {this.state.selected && <Cell size={8}>
          <div className="md-paper md-paper--1 sticky-top">
            {this.state.selected.name} - {this.state.selected.type}
          </div>
        </Cell>}
      </Grid>)
      : list;
  }
}

export default RoomsPage;