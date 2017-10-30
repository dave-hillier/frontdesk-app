import * as React from 'react';
import {
  NavigationDrawer,
  FontIcon,
  ListItem,
  Card,
  CardTitle,
  CardText,
  Avatar
} from 'react-md';
import { Link as RouterLink, Route, Switch } from 'react-router-dom';

import './App.css';
import Guests from './Guests';
import GridPage from './GridPage';
import Grid2 from './Grid2';
import SearchBox from './SearchBox';

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

class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <div className="home-header">
          <h2>Test Page</h2>
        </div>
        <p className="home-intro">
          Do something
        </p>
        <div><i className="material-icons">face</i>Face</div>
      </div>
    );
  }
}

class Cards extends React.Component {
  render() {
    return (
      <div className="md-grid md-text-container">
        <h2 className="md-cell md-cell--12">
          Page 1
        </h2>
        <Card className="md-cell">
          <CardTitle title="Card 1" />
          <CardText>
            <p>Wowza</p>
          </CardText>
        </Card>
        <Card className="md-cell">
          <CardTitle title="Card 2" />
          <CardText>
            <p>Wowza</p>
          </CardText>
        </Card>
        <Card className="md-cell">
          <CardTitle title="Card 3" />
          <CardText>
            <p>Wowza</p>
          </CardText>
        </Card>
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
  label: 'Check In',
  to: '/checkin',
  icon: 'room_service',
}, {
  label: 'Planner',
  to: '/planner',
  icon: 'list',
}, {
  label: 'Allocations',
  to: '/allocations',
  icon: 'library_add',
}, {
  label: 'Settings',
  to: '/settings',
  icon: 'settings',
}, {
  label: 'Help',
  to: '/help',
  icon: 'help',
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

class App extends React.Component {
  render() {
    return (
      <Route
        render={({ location }) => (
          <NavigationDrawer
            className="nav-drawer"
            drawerTitle={<DrawerHeader />}
            toolbarTitle={<div>Planner</div>}
            toolbarActions={<div className="toolbar-actions">
              <SearchBox data={['rez1', 'rez2', 'rez3']} />
              {!mobile ? <Avatar key="av">DH</Avatar> : null}
            </div>}
            navItems={navItems.map(props => <NavLink {...props} key={props.to} />)}
          >
            <Switch key={location.key}>
              <Route exact={true} path="/" location={location} component={() => <Guests isMobile={mobile} />} />
              <Route path="/planner" location={location} component={GridPage} />
              <Route path="/allocations" location={location} component={Grid2} />
              <Route path="/checkin" location={location} component={Cards} />
              <Route path="/settings" location={location} component={Home} />
            </Switch>

          </NavigationDrawer>
        )}
      />
    );
  }
}

export default App;
