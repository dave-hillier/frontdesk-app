import * as React from 'react';

import { getProfiles } from './FakeReservations';
import { GuestProfile } from './Model';
import { SelectItemLayout } from './SelectedItemLayout';
import { ProfileListItem, ProfilePanel } from './ProfileComponents';

class PageLayout extends SelectItemLayout<GuestProfile> { }

export class ProfilesPage extends React.PureComponent<{
  isMobile: boolean,
  hotelSiteCode: string
}> {

  render() {
    return (
      <PageLayout
        {...this.props}
        title="Profile"
        getItems={() => getProfiles().then(pl => pl.sort((a: GuestProfile, b: GuestProfile) => a.lastName.localeCompare(b.lastName)))}
        renderItem={(item: GuestProfile, onClick: (x: any) => void) => <ProfileListItem item={item} onClick={onClick} />}
        renderSelectedItem={(item: GuestProfile) => <ProfilePanel profile={item} />}
        dialogId="profile-dialog"
      />);
  }
}

export default ProfilesPage;