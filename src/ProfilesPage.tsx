import * as React from 'react';

import { getProfiles } from './FakeReservations';
import { Profile, Address } from './Model';
import { SelectItemLayout } from './SelectedItemLayout';
import { ListItem } from 'react-md';

function formatAddress(address: Address): string {
  const parts = [address.organisation, address.streetAddress, address.postalTown, address.postCode, address.countryRegion];
  return parts.filter(p => p.length > 0).join(', ');
}

function toCaps(s: string) {
  return s.replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./, function (str: string) { return str.toUpperCase(); });
}
const renderGrid = (object: any) => {
  const r: any = [];
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      let value = object[key]; // typeof profile[key] === 'string' ? toCaps(profile[key]) : ' ';

      if (typeof value === 'object') {
        value = renderGrid(value);
      } else if (Array.isArray(value)) {
        const inner = value.map(v => renderGrid(v));
        r.push(
          <div key={key} className="md-tile-content">
            <div className="md-tile-text--primary md-text">{toCaps(key)}</div>
            <div className="md-tile-text--secondary md-text--secondary">{inner}</div>
          </div>);
      }

      r.push(
        <div key={key} className="md-tile-content">
          <div className="md-tile-text--primary md-text">{toCaps(key)}</div>
          <div className="md-tile-text--secondary md-text--secondary">{value}</div>
        </div>);
    }
  }
  return r;
};

class ProfilePanel extends React.PureComponent<{ profile: Profile }, {}> {
  render() {
    return <div>{renderGrid(this.props.profile)}</div>;
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