import * as React from 'react';
import {
  Avatar,
  DropdownMenu,
  AccessibleFakeButton
} from 'react-md';

const AccountMenu = () => {
  // TODO: this needs adding back in after my patch is accepted
  /*const anchors = {
    x: DropdownMenu.HorizontalAnchors.INNER_RIGHT,
    y: DropdownMenu.VerticalAnchors.BOTTOM,
  };*/
  return (
    <DropdownMenu
      id={`avatar-dropdown-menu`}
      menuItems={['Preferences', 'About', { divider: true }, 'Log out']}
      sameWidth={true}
      simplifiedMenu={false}
    >
      <AccessibleFakeButton>
        <Avatar suffix="pink">DH</Avatar>
      </AccessibleFakeButton>
    </DropdownMenu >);

};

export default AccountMenu;