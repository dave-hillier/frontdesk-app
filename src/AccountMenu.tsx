import * as React from 'react';
import {
  Avatar,
  DropdownMenu,
  AccessibleFakeButton
} from 'react-md';

const AccountMenu = () => {
  const anchors = {
    x: DropdownMenu.HorizontalAnchors.INNER_RIGHT,
    y: DropdownMenu.VerticalAnchors.BOTTOM,
  };
  return (
    <DropdownMenu
      id={`avatar-dropdown-menu`}
      menuItems={['Preferences', 'About', { divider: true }, 'Log out']}
      sameWidth={true}
      simplifiedMenu={false}
      anchor={anchors}
    >
      <AccessibleFakeButton>
        <Avatar suffix="pink">DH</Avatar>
      </AccessibleFakeButton>
    </DropdownMenu >);

};

export default AccountMenu;