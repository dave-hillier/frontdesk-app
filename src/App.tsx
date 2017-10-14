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
          <img src={logo} className="home-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="home-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
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
            <Tab label="Tab one" />
            <Tab label="Tab two" />
            <Tab label="Tab three" />
            <Tab label="Tab four" />
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
  label: 'Page 1',
  to: '/page-1',
  icon: 'bookmark',
}, {
  label: 'Page 2',
  to: '/page-2',
  icon: 'donut_large',
}, {
  label: 'Page 3',
  to: '/page-3',
  icon: 'flight_land',
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
  label: 'Movies & TV',
  icon: <FontIcon>ondemand_video</FontIcon>,
}, {
  label: 'Music',
  icon: <FontIcon>music_note</FontIcon>,
}, {
  label: 'Books',
  icon: <FontIcon>book</FontIcon>,
}, {
  label: 'Newsstand',
  icon: <FontIcon iconClassName="fa fa-newspaper-o" />,
}];

class App extends React.Component {
  render() {
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
            drawerTitle={<h1>Drawer</h1>}
            toolbarTitle={<div><img src={logo} className="toolbar-logo" alt="logo" /> Application</div>}
            toolbarActions={<div>
              <Button key="search" icon={true}>search</Button>
              {menubutton}
              <Avatar key="av" random={true}>XX</Avatar>
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
            {location.pathname === '/' && mobile ? <BottomNavigation
              dynamic={true}
              links={links}
              colored={true}
            /> : null}

          </NavigationDrawer>
        )}
      />
    );
  }
}

export default App;
