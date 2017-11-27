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
import MobileSearch from './MobileSearch';
import LaunchScreen from './LaunchScreen';
import RoomsPage from './RoomsPage';
import ReservationsPage from './reservations/ReservationsPage';
import ProfilesPage from './ProfilesPage';
import { SearchBoxToolbar } from './ToolbarSearchBox';
import AccountMenu from './AccountMenu';

import './App.css';
import { AppState } from './model/Model';

const logo = require('./logo.svg');

const hotelSites = ['Hotel Site A', 'Hotel Site B', 'Hotel Site C'];

class DrawerHeader extends React.Component<
  { hotelSiteIndex: number, onChange: (value: string, index: number, event: any) => void }, {}> {
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
  '/': 'Guests',
  '/planner': 'Planner',
  '/allocations': 'Allocations',
  '/reservations': 'Reservations',
  '/rooms': 'Rooms',
  '/profiles': 'Profiles'
};
const filterSubject = new Rx.Subject<string>();
const debounced = filterSubject.debounce(300).publish().refCount();

class App extends React.PureComponent<{ appState: AppState },
  { filter: string }> {
  subscription: Rx.IDisposable;
  constructor(props: any) {
    super(props);
    this.state = {
      filter: ''
    };
  }

  componentWillMount() {
    this.subscription = debounced.subscribe(f => this.setState({ filter: f }));
  }

  componentWillUnmount() {
    this.subscription.dispose();
  }

  render() {
    const { isLaunching, isMobile, currentSite, guests } = this.props.appState;

    // https://github.com/reactjs/react-transition-group/issues/79
    return (
      <div>
        <LaunchScreen show={isLaunching} />
        <Route
          render={({ location }) => (
            <NavigationDrawer
              className="nav-drawer"
              drawerTitle={(
                <DrawerHeader
                  hotelSiteIndex={0}
                  onChange={(v, i, e) => {
                    // this.setState({ hotelSiteIndex: i }); // TODO: change site
                    // tslint:disable-next-line:no-console
                    console.log('updating site', i);
                  }}
                />)}
              toolbarChildren={!isMobile ?
                <SearchBoxToolbar
                  searchTitle={`Search ${titles[location.pathname] ?
                    titles[location.pathname].toLowerCase() : ''}`}
                  location={location}
                  onChange={(s: any) => filterSubject.onNext(s)}
                /> : null}
              toolbarTitle={<div>{titles[location.pathname] ? titles[location.pathname] : ''}</div>}
              toolbarActions={<div className="toolbar-actions">
                {isMobile ? <MobileSearch data={['rez1', 'rez2', 'rez3']} mobile={isMobile} /> : null}
                {!isMobile ? <AccountMenu /> : null}
              </div>}
              navItems={navItems.map(props => <NavLink {...props} key={props.to} />)}
            >
              <Switch key={location.key} location={location}>
                <Route
                  exact={true}
                  path="/"
                  location={location}
                  component={() => (
                    guests ? <Guests
                      isMobile={isMobile}
                      hotelSiteCode={currentSite}
                      search={this.state.filter}
                      {...guests}
                    /> : null)}
                />
                <Route
                  path="/planner"
                  location={location}
                  component={() => <Planner isMobile={isMobile} hotelSiteCode={currentSite} />}
                />
                <Route
                  path="/availability"
                  location={location}
                  component={() => (<Availability isMobile={isMobile} hotelSiteCode={currentSite} />)}
                />
                <Route
                  path="/reservations"
                  location={location}
                  component={() => (
                    <ReservationsPage
                      isMobile={isMobile}
                      hotelSiteCode={currentSite}
                      filter={this.state.filter}
                    />)}
                />
                <Route
                  path="/rooms"
                  location={location}
                  component={() => <RoomsPage isMobile={isMobile} hotelSiteCode={currentSite} />}
                />
                <Route
                  path="/profiles"
                  location={location}
                  component={() => <ProfilesPage isMobile={isMobile} hotelSiteCode={currentSite} />}
                />}
                />
              </Switch>
            </NavigationDrawer>
          )}
        /></div>
    );
  }
}

export default App;
