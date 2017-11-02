import * as React from 'react';
import {
  NavigationDrawer,
  FontIcon,
  ListItem,
  Avatar,
  SelectField
} from 'react-md';
import { Link as RouterLink, Route, Switch } from 'react-router-dom';

import './App.css';
import Guests from './Guests';
import Allocations from './Allocations';
import Planner from './Planner';
import SearchBox from './SearchBox';
import LaunchScreen from './LaunchScreen';
import ReservationsPage from './ReservationsPage';

const logo = require('./logo.svg');
export const MobileMinWidth = 320;
export const TabletMinWidth = 768;
export const DesktopMinWidth = 1025;

function matchesMedia(min: number, max?: number) {
  let media = `screen and (min-width: ${min}px)`;
  if (max) {
    media += ` and (max-width: ${max}px)`;
  }

  return window.matchMedia(media).matches;
}

const mobile = matchesMedia(MobileMinWidth, TabletMinWidth - 1);
const tablet = matchesMedia(TabletMinWidth, DesktopMinWidth);
const desktop = matchesMedia(DesktopMinWidth);

// tslint:disable-next-line:no-console
console.log('Mobile', mobile, 'Tablet', tablet, 'desktop', desktop);

const hotelSites = ['Hotel Site A', 'Hotel Site B', 'Hotel Site C'];

class DrawerHeader extends React.Component<{ hotelSiteIndex: number, onChange: (value: string, index: number, event: any) => void }, {}> {
  render() {
    return (
      <div className="drawer-header">
        <h1><img src={logo} className="toolbar-logo" alt="logo" /> Rezlynx</h1>
        <SelectField
          id="site-select"
          className="md-title md-select-field--toolbar"
          menuItems={hotelSites}
          simplifiedMenu={false}
          defaultValue={hotelSites[this.props.hotelSiteIndex]}
          onChange={this.props.onChange}
        />
      </div>

    );
  }
}

const navItems = [{
  exact: true,
  label: 'Home',
  to: '/',
  icon: 'home',
}, {
  label: 'Reservations',
  to: '/reservations',
  icon: 'print',
}, {
  label: 'Planner',
  to: '/planner',
  icon: 'list',
}, {
  label: 'Availability',
  to: '/availability',
  icon: 'library_add',
}];

class NavLink extends React.Component<{ to: string, exact?: boolean, icon: string, label: string }, {}> {
  render() {
    const { to, exact, icon, label } = this.props;

    return (
      <Route path={to} exact={exact}>
        {({ match }) => {
          let leftIcon;
          if (icon) {
            leftIcon = <FontIcon>{icon}</FontIcon>;
          }
          return (
            <ListItem
              component={RouterLink}
              active={!!match}
              to={to}
              primaryText={label}
              leftIcon={leftIcon}
            />
          );
        }}
      </Route>
    );
  }
}

const titles = {
  '/planner': 'Planner',
  '/allocations': 'Allocations',
  '/reservations': 'Reservations'
};

class App extends React.Component<{}, { loaded: boolean, hotelSiteIndex: number }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loaded: false,
      hotelSiteIndex: 0
    };
  }

  componentWillMount() {
    setTimeout(() => {
      this.setState({ loaded: true });
      // tslint:disable-next-line:align
    }, 300); // TODO: replace with real load
  }

  render() {
    return (
      <div>
        <LaunchScreen show={!this.state.loaded} />
        <Route
          render={({ location }) => (
            <NavigationDrawer
              className="nav-drawer"
              drawerTitle={(
                <DrawerHeader
                  hotelSiteIndex={this.state.hotelSiteIndex}
                  onChange={(v, i, e) => this.setState({ hotelSiteIndex: i })}
                />)}
              toolbarTitle={<div>{titles[location.pathname] ? titles[location.pathname] : 'Guests'}</div>}
              toolbarActions={<div className="toolbar-actions">
                <SearchBox data={['rez1', 'rez2', 'rez3']} mobile={mobile} />
                {!mobile ? <Avatar key="av">DH</Avatar> : null}
              </div>}
              navItems={navItems.map(props => <NavLink {...props} key={props.to} />)}
            >
              <Switch key={location.key}>
                <Route
                  exact={true}
                  path="/"
                  location={location}
                  component={() => <Guests isMobile={mobile} hotelSiteCode={this.state.hotelSiteIndex.toString()} />}
                />
                <Route path="/planner" location={location} component={() => <Planner isMobile={mobile} hotelSiteCode={this.state.hotelSiteIndex.toString()} />} />
                <Route path="/availability" location={location} component={() => (<Allocations isMobile={mobile} hotelSiteCode={this.state.hotelSiteIndex.toString()} />)} />
                <Route path="/reservations" location={location} component={() => <ReservationsPage isMobile={mobile} />} />
              </Switch>
            </NavigationDrawer>
          )}
        /></div>
    );
  }
}

export default App;
