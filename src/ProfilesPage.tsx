import * as React from 'react';

import { getProfiles } from './FakeReservations';
import { GuestProfile } from './Model';
import { SelectItemLayout } from './SelectedItemLayout';
import { TextField, FontIcon } from 'react-md';
import ProfileListItem from './ProfileListItem';
import { formatAddress } from './ProfileComponents';

export class ProfilePanel extends React.PureComponent<{ profile: GuestProfile }, {}> {

  render() {
    const p = this.props.profile;
    const minWidth = '150px';
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div className="md-cell md-cell--bottom" style={{ minWidth }}>
            <div className="md-text--primary">First Name</div>
            <div className="md-text--secondary">{p.firstName}</div>
          </div>
          <div className="md-cell md-cell--bottom" style={{ minWidth }}>
            <div className="md-text--primary">Last Name</div>
            <div className="md-text--secondary">{p.lastName}</div>
          </div>
        </div>

        <div className="md-cell md-cell--bottom" style={{ minWidth }}>
          <div className="md-text--primary">Address</div>
          <div className="md-text--secondary">{formatAddress(p.address)}</div>
        </div>
        <div className="md-cell md-cell--bottom" style={{ minWidth }}>
          <div className="md-text--primary">Email</div>
          <div className="md-text--secondary">{p.email}</div>
        </div>
      </div>);
  }
}
export class EditProfilePanel extends React.PureComponent<{ profile: GuestProfile }, {}> {
  render() {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <TextField
            id="profile-firstname"
            label="First Name"
            defaultValue={this.props.profile.firstName}
            className="md-cell md-cell--bottom md-cell--6"
            leftIcon={<FontIcon>person</FontIcon>}
          />
          <TextField
            id="profile-lastname"
            label="Last Name"
            defaultValue={this.props.profile.lastName}
            className="md-cell md-cell--bottom md-cell--6"
          />
        </div>
        <div>
          <TextField
            id="profile-email"
            label="Email"
            defaultValue={this.props.profile.email}
            className="md-cell md-cell--bottom md-cell--12"
            leftIcon={<FontIcon>mail</FontIcon>}
          />
        </div>
        <div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <TextField
              id="profile-phone-type"
              label="Type"
              defaultValue={this.props.profile.phone[0].type}
              className="md-cell md-cell--bottom md-cell--2"
              leftIcon={<FontIcon>phone</FontIcon>}
            />
            <TextField
              id="profile-phone-number"
              label="Number"
              defaultValue={this.props.profile.phone[0].number}
              className="md-cell md-cell--bottom md-cell--8"
            />
          </div>
        </div>
      </div>
    );
  }
}

class PageLayout extends SelectItemLayout<GuestProfile> { }

export class ProfilesPage extends React.PureComponent<{
  isMobile: boolean,
  hotelSiteCode: string
}> {

  renderSelectedItem(item: GuestProfile): JSX.Element {
    return <ProfilePanel profile={item} />;
  }

  render() {
    return (
      <PageLayout
        {...this.props}
        title="Profile"
        getItems={() => getProfiles().then(pl => pl.sort((a: GuestProfile, b: GuestProfile) => a.lastName.localeCompare(b.lastName)))}
        renderItem={(item: GuestProfile, onClick: (x: any) => void) => <ProfileListItem item={item} onClick={onClick} />}
        renderSelectedItem={this.renderSelectedItem}
        dialogId="profile-dialog"
      />);
  }
}

export default ProfilesPage;