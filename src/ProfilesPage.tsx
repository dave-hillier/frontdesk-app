import * as React from 'react';
import {
  List,
  ListItem,
  Grid,
  Cell

} from 'react-md';

import { getProfiles } from './FakeReservations';
import { Profile } from './Model';

class ProfilesPage extends React.Component<{ isMobile: boolean, hotelSiteCode: string }, { profiles: Profile[], isLoading: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { profiles: [], isLoading: true };
  }

  componentWillMount() {
    const isLoading = false;
    getProfiles().then(profiles => {
      this.setState({ profiles, isLoading });
    });
  }

  render() {
    if (this.state.isLoading) {
      return <div>Loading</div>;
    }

    const list = (
      <List>
        {this.state.profiles.map(r => (
          <ListItem
            primaryText={`${r.firstName} ${r.lastName}`}
            secondaryText={`${r.email}`}
          />))}
      </List>
    );

    return !this.props.isMobile ? <Grid><Cell>{list}</Cell></Grid> : list;
  }
}

export default ProfilesPage;