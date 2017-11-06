import * as React from 'react';
import {
  List,
  ListItem,
  Grid,
  Cell

} from 'react-md';

import { getRooms } from './FakeReservations';
import { Room } from './Model';

class RoomsPage extends React.Component<{ isMobile: boolean, hotelSiteCode: string }, { rooms: Room[], isLoading: boolean }> {

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
      <List>
        {this.state.rooms.map(r => (
          <ListItem
            primaryText={r.name}
            secondaryText={r.type}
          />))}
      </List>
    );

    return !this.props.isMobile ? <Grid><Cell>{list}</Cell></Grid> : list;
  }
}

export default RoomsPage;