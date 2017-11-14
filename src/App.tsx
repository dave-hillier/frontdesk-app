import * as React from 'react';
import {
  NavigationDrawer,
  FontIcon,
  ListItem,
  SelectField,
} from 'react-md';
import { Link as RouterLink, Route, Switch } from 'react-router-dom';

import * as Rx from 'rx-lite';

import Guests from './Guests';
import Availability from './Availability';
import Planner from './Planner';
import SearchBox from './SearchBox';
import LaunchScreen from './LaunchScreen';
import RoomsPage from './RoomsPage';
import ReservationsPage from './ReservationsPage';
import ProfilesPage from './ProfilesPage';
import ToolbarSearchBox from './ToolbarSearchBox';
import AccountMenu from './AccountMenu';

import './App.css';

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

const isMobile = matchesMedia(MobileMinWidth, TabletMinWidth - 1);
const tablet = matchesMedia(TabletMinWidth, DesktopMinWidth);
const desktop = matchesMedia(DesktopMinWidth);

// tslint:disable-next-line:no-console
console.log('Mobile', isMobile, 'Tablet', tablet, 'desktop', desktop);

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
  icon: 'receipt',
}, {
  label: 'Planner',
  to: '/planner',
  icon: 'list',
}, {
  label: 'Availability',
  to: '/availability',
  icon: 'library_add',
}, {
  label: 'Rooms',
  to: '/rooms',
  icon: 'room',
}, {
  label: 'Profiles',
  to: '/profiles',
  icon: 'contacts',
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
  '/reservations': 'Reservations',
  '/rooms': 'Rooms',
  '/profiles': 'Profiles'
};

class ToolbarStateful extends React.Component<{ location: any, onChange?: (filter: string) => void }, { filter: string }> {
  constructor(props: any) {
    super(props);
    this.state = {
      filter: ''
    };
  }

  render() {
    const searchTitle = `Search ${titles[this.props.location.pathname] ? titles[this.props.location.pathname].toLowerCase() : ''}`;
    return (
      <ToolbarSearchBox
        placeholder={searchTitle}
        onChange={(value: string, e: any) => {
          this.setState({ filter: value });
          if (this.props.onChange) {
            this.props.onChange(value);
          }
        }}
        showClear={this.state.filter.length > 0}
        value={this.state.filter}
        clear={() => this.setState({ filter: '' })}
      />
    );
  }
}

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
    const filterSubject = new Rx.Subject<string>();
    const debounced = filterSubject.debounce(300).publish().refCount();

    // tslint:disable-next-line:no-console
    debounced.subscribe((v) => console.log('on search', v));

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
                  onChange={(v, i, e) => {
                    this.setState({ hotelSiteIndex: i });
                    // tslint:disable-next-line:no-console
                    console.log('updating site', i);
                  }}
                />)}
              toolbarChildren={!isMobile ?
                <ToolbarStateful
                  location={location}
                  onChange={s => filterSubject.onNext(s)}
                /> : null}
              toolbarTitle={<div>{titles[location.pathname] ? titles[location.pathname] : ''}</div>}
              toolbarActions={<div className="toolbar-actions">
                {isMobile ? <SearchBox data={['rez1', 'rez2', 'rez3']} mobile={isMobile} /> : null}
                {!isMobile ? <AccountMenu /> : null}
              </div>}
              navItems={navItems.map(props => <NavLink {...props} key={props.to} />)}
            >
              <Switch key={location.key}>
                <Route
                  exact={true}
                  path="/"
                  location={location}
                  render={() => (
                    <Guests
                      isMobile={isMobile}
                      hotelSiteCode={this.state.hotelSiteIndex.toString()}
                      search={debounced}
                    />)}
                />
                <Route path="/planner" location={location} component={() => <Planner isMobile={isMobile} hotelSiteCode={this.state.hotelSiteIndex.toString()} />} />
                <Route path="/availability" location={location} component={() => (<Availability isMobile={isMobile} hotelSiteCode={this.state.hotelSiteIndex.toString()} />)} />
                <Route path="/reservations" location={location} component={() => <ReservationsPage isMobile={isMobile} hotelSiteCode={this.state.hotelSiteIndex.toString()} />} />
                <Route path="/rooms" location={location} component={() => <RoomsPage isMobile={isMobile} hotelSiteCode={this.state.hotelSiteIndex.toString()} />} />
                <Route path="/profiles" location={location} component={() => <ProfilesPage isMobile={isMobile} hotelSiteCode={this.state.hotelSiteIndex.toString()} />} />
              </Switch>
            </NavigationDrawer>
          )}
        /></div>
    );
  }
}

export default App;
