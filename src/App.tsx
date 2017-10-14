import * as React from 'react';
import {
  NavigationDrawer,
  FontIcon,
  ListItem,
  Card,
  CardTitle,
  CardText,
  TabsContainer,
  Tabs,
  Tab,
  Button,
  Avatar,
  MenuButton,
  BottomNavigation
} from 'react-md';
import { Link as RouterLink, Route, Switch } from 'react-router-dom';

import './App.css';

const logo = require('./logo.svg');
export const MobileMinWidth = 320;
export const TabletMinWidth = 768;
// export const DesktopMinWidth = 1025;

function matchesMedia(min: number, max?: number) {
  let media = `screen and (min-width: ${min}px)`;
  if (max) {
    media += ` and (max-width: ${max}px)`;
  }

  return window.matchMedia(media).matches;
}

const mobile = matchesMedia(MobileMinWidth, TabletMinWidth - 1);
// const tablet = matchesMedia(TabletMinWidth, DesktopMinWidth);
// const desktop = matchesMedia(DesktopMinWidth);

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

class TabChild extends React.Component {
  render() {
    return (
      <div className="toolbar-tabs">
        <TabsContainer  >
          <Tabs tabId="simple-tab" menuOverflow={true}>
            <Tab label="Check In" />
            <Tab label="Room Billing" />
            <Tab label="Check Out" />
            <Tab label="Planner" />
            <Tab label="Allocations" />
          </Tabs>
        </TabsContainer>
      </div>
    );
  }
}

class Page1 extends React.Component {
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
  label: 'Guest Journey',
  to: '/page-1',
  icon: 'room_service',
}, {
  label: 'Profiles',
  to: '/page-2',
  icon: 'contact_mail',
}, {
  label: 'Conference & Banqueting',
  to: '/page-3',
  icon: 'event',
}, {
  label: 'Reporting',
  to: '/page-3',
  icon: 'show_chart',
}, {
  label: 'Accounting',
  to: '/page-3',
  icon: 'account_balance',
}, {
  label: 'Settings',
  to: '/page-3',
  icon: 'settings',
}, {
  label: 'Help',
  to: '/page-3',
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
const links = [{
  label: 'Check In',
  icon: <FontIcon>room_service</FontIcon>,
}, {
  label: 'Room Billing',
  icon: <FontIcon>receipt</FontIcon>,
}, {
  label: 'Check Out',
  icon: <FontIcon>directions_walk</FontIcon>,
}, {
  label: 'Planner',
  icon: <FontIcon>list</FontIcon>,
}, {
  label: 'Allocations',
  icon: <FontIcon>library_add</FontIcon>,
}];

class App extends React.Component {
  render() {
    const bottomNavigation = (
      <BottomNavigation
        dynamic={true}
        links={links}
        colored={true}
      />);
    const menubutton = (
      <MenuButton
        id="menu-button-2"
        icon={true}
        menuItems={[
          <ListItem key={1} primaryText="Item One" />,
          <ListItem key={2} primaryText="Item Two" />,
        ]}
        centered={true}
      >
        more_vert
      </MenuButton>);
    return (
      <Route
        render={({ location }) => (
          <NavigationDrawer
            className="nav-drawer"
            drawerTitle={<div>Rezlynx</div>}
            toolbarTitle={<div><img src={logo} className="toolbar-logo" alt="logo" /> Guest Journey</div>}
            toolbarActions={<div>
              <Button key="search" icon={true}>search</Button>
              {menubutton}
              {!mobile ? <Avatar key="av" random={true}>DH</Avatar> : null}
            </div>}
            toolbarProminent={location.pathname === '/' && !mobile}
            toolbarChildren={location.pathname === '/' && !mobile ? <TabChild /> : null}
            navItems={navItems.map(props => <NavLink {...props} key={props.to} />)}
          >
            <Switch key={location.key}>
              <Route exact={true} path="/" location={location} component={Home} />
              <Route path="/page-1" location={location} component={Page1} />
              <Route path="/page-2" location={location} component={Page1} />
              <Route path="/page-3" location={location} component={Home} />
            </Switch>

            {mobile && bottomNavigation}

          </NavigationDrawer>
        )}
      />
    );
  }
}

export default App;
