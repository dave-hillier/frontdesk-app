import * as React from 'react';
import {
  NavigationDrawer,
  FontIcon,
  ListItem,
  Avatar
} from 'react-md';
import { Link as RouterLink, Route, Switch } from 'react-router-dom';

import './App.css';
import Guests from './Guests';
import Allocations from './Allocations';
import Planner from './Planner';
import SearchBox from './SearchBox';
import LaunchScreen from './LaunchScreen';

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

class DrawerHeader extends React.Component {
  render() {
    return (
      <div className="drawer-header">
        <h1><img src={logo} className="toolbar-logo" alt="logo" /> Rezlynx</h1>
        <h2>Some Hotel Site</h2>
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
  label: 'Planner',
  to: '/planner',
  icon: 'list',
}, {
  label: 'Allocations',
  to: '/allocations',
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
  '/allocations': 'Allocations'
};

class App extends React.Component<{}, { loaded: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { loaded: false };
  }

  componentWillMount() {
    setTimeout(() => {
      this.setState({ loaded: true });
      // tslint:disable-next-line:align
    }, 1500);
  }

  render() {

    return (
      <div>
        <LaunchScreen show={!this.state.loaded} />
        <Route
          render={({ location }) => (
            <NavigationDrawer
              className="nav-drawer"
              drawerTitle={<DrawerHeader />}
              toolbarTitle={<div>{titles[location.pathname] ? titles[location.pathname] : 'Guests'}</div>}
              toolbarActions={<div className="toolbar-actions">
                <SearchBox data={['rez1', 'rez2', 'rez3']} />
                {!mobile ? <Avatar key="av">DH</Avatar> : null}
              </div>}
              navItems={navItems.map(props => <NavLink {...props} key={props.to} />)}
            >
              <Switch key={location.key}>
                <Route exact={true} path="/" location={location} component={() => <Guests isMobile={mobile} />} />
                <Route path="/planner" location={location} component={Planner} />
                <Route path="/allocations" location={location} component={Allocations} />
              </Switch>
            </NavigationDrawer>
          )}
        /></div>
    );
  }
}

export default App;
