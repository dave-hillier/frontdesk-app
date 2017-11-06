import * as React from 'react';

import { getProfiles } from './FakeReservations';
import { Profile, Address } from './Model';
import { SelectItemLayout } from './SelectedItemLayout';
import { ListItem } from 'react-md';

function formatAddress(address: Address): string {
  const parts = [address.organisation, address.streetAddress, address.postalTown, address.postCode, address.countryRegion];
  return parts.filter(p => p.length > 0).join(', ');
}

class ProfilePanel extends React.PureComponent<{ profile: Profile }, {}> {
  render() {
    return (
      <div>{this.props.profile.firstName}</div>
    );
  }
}

class PageLayout extends SelectItemLayout<Profile> { }

export class ProfilesPage extends React.PureComponent<{
  isMobile: boolean,
  hotelSiteCode: string
}> {

  renderItem(item: Profile, onClick: (x: any) => void): JSX.Element {

    return (
      <ListItem
        key={`${item.firstName} ${item.lastName} ${item.created}`}
        className="md-divider-border md-divider-border--bottom"
        primaryText={`${item.firstName} ${item.lastName}`}
        secondaryText={`${formatAddress(item.address)}\n${item.email}`}
        threeLines={true}
        onClick={onClick}
      />);
  }

  renderSelectedItem(item: Profile): JSX.Element {
    return <ProfilePanel profile={item} />;
  }

  render() {
    return (
      <PageLayout
        {...this.props}
        getItems={getProfiles}
        renderItem={this.renderItem}
        renderSelectedItem={this.renderSelectedItem}
      />);
  }
}

export default ProfilesPage;