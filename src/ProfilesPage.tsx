import * as React from 'react';
import {
  List,
  ListItem,
  Grid,
  Cell

} from 'react-md';

import { getProfiles } from './FakeReservations';
import { Profile, Address } from './Model';

function formatAddress(address: Address): string {
  const parts = [address.organisation, address.streetAddress, address.postalTown, address.postCode, address.countryRegion];
  return parts.filter(p => p.length > 0).join(', ');
}

class ProfilesPage extends React.Component<{ isMobile: boolean, hotelSiteCode: string },
  { profiles: Profile[], isLoading: boolean, selected?: Profile }> {

  constructor(props: any) {
    super(props);
    this.state = { profiles: [], isLoading: true };
  }

  componentWillMount() {
    const isLoading = false;
    getProfiles().then((profiles: Profile[]) => {
      this.setState({ profiles, isLoading });
    });
  }

  render() {
    if (this.state.isLoading) {
      return <div>Loading</div>;
    }

    const list = (
      <List className="md-paper md-paper--1">
        {this.state.profiles.map(r => (
          <ListItem
            primaryText={`${r.firstName} ${r.lastName}`}
            secondaryText={`${formatAddress(r.address)}\n${r.email}`}
            threeLines={true}
            onClick={e => this.setState({ selected: r })}
          />))}
      </List>
    );

    return !this.props.isMobile ? (
      <Grid>
        <Cell>{list}</Cell>
        {this.state.selected && <Cell size={8}>
          <div className="md-paper md-paper--1 sticky-top md-list">
            {this.state.selected.firstName} {this.state.selected.lastName}
          </div>
        </Cell>}
      </Grid>)
      : list;
  }
}

export default ProfilesPage;