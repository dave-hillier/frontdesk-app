import * as React from 'react';
import {
  List,
  ListItem,
  Subheader,
  BottomNavigation,
  FontIcon
} from 'react-md';
import { ReservationDialog } from './ReservationDialog';
import { getArrivals, getResidents, getDepartures } from './Reservations';

function arrivalsList(f: any): {}[] {
  const arrivals = getArrivals();
  const result: {}[] = [];
  for (let i = 0; i < arrivals.length; ++i) {
    const firstLine = `${arrivals[i].firstName} ${arrivals[i].lastName}` +
      (arrivals[i].ledger ? ` - ${arrivals[i].ledger}` : '');
    const nights = arrivals[i].nights;
    const balance = arrivals[i].balance ? arrivals[i].balance : 0;
    result.push((
      <ListItem
        key={i}
        primaryText={firstLine}
        secondaryText={`${nights} nights\nBalance £${balance}`}
        threeLines={true}
        onClick={e => f()}
      />)
    );
  }
  return result;
}

function addDays(date: Date, days: number) {
  var dat = new Date(date);
  dat.setDate(dat.getDate() + days);
  return dat;
}

function residentList(f: any): {}[] {
  const residents = getResidents();
  const result: {}[] = [];
  for (let i = 0; i < residents.length; ++i) {
    const firstLine = `${residents[i].firstName} ${residents[i].lastName}` +
      (residents[i].ledger ? ` - ${residents[i].ledger}` : '');
    const departs = addDays(new Date(residents[i].arrival), residents[i].nights).toDateString();
    const balance = residents[i].balance ? residents[i].balance : 0;
    result.push((
      <ListItem
        key={i}
        primaryText={firstLine}
        secondaryText={`Departs ${departs}\nBalance £${balance}`}
        threeLines={true}
        onClick={e => f()}
      />)
    );
  }
  return result;
}

function departureList(f: any): {}[] {
  const residents = getDepartures();
  const result: {}[] = [];
  for (let i = 0; i < residents.length; ++i) {
    const firstLine = `${residents[i].firstName} ${residents[i].lastName}` +
      (residents[i].ledger ? ` - ${residents[i].ledger}` : '');
    const balance = residents[i].balance ? residents[i].balance : 0;
    result.push((
      <ListItem
        key={i}
        primaryText={firstLine}
        secondaryText={`Balance £${balance}`}
        threeLines={true}
        onClick={e => f()}
      />)
    );
  }
  return result;
}
const links = [{
  label: 'Arrivals',
  icon: <FontIcon>room_service</FontIcon>,
}, {
  label: 'Residents',
  icon: <FontIcon>receipt</FontIcon>,
}, {
  label: 'Departures',
  icon: <FontIcon>directions_walk</FontIcon>,
}];

class Guests extends React.Component<{ isMobile: boolean }, { title: string, children: any }> {
  dialog: ReservationDialog;

  constructor(props: any) {
    super(props);

    this.state = {
      title: '',
      children: this.arrive()
    };
  }

  arrive() {
    return (
      <List className="md-cell md-paper md-paper--1">
        <a ><Subheader primaryText="Arrivals" primary={true} /></a>
        {...arrivalsList(() => this.dialog.show(0))}
      </List>
    );
  }

  resident() {
    return (
      <List className="md-cell md-paper md-paper--1">
        <Subheader primaryText="Residents" primary={true} />
        {...residentList(() => this.dialog.show(0))}
      </List>
    );
  }

  depart() {
    return (
      <List className="md-cell md-paper md-paper--1">
        <Subheader primaryText="Departures" primary={true} />
        {...departureList(() => this.dialog.show(0))}
      </List>
    );
  }

  render() {
    if (!this.props.isMobile) {
      return (

        <div className="md-grid">
          <ReservationDialog ref={(r: ReservationDialog) => this.dialog = r} isMobile={this.props.isMobile} />
          {this.arrive()}
          {this.resident()}
          {this.depart()}
        </div>

      );
    } else {

      const { children } = this.state;
      return (
        <div className="md-grid">
          <ReservationDialog ref={(r: ReservationDialog) => this.dialog = r} isMobile={this.props.isMobile} />
          {children}
          <BottomNavigation links={links} dynamic={false} onNavChange={e => this.handleNavChange(e)} />
        </div>);
    }
  }

  private handleNavChange(index: number): any {
    const title = links[index].label;
    let children;
    switch (index) {
      case 1:
        children = this.resident();
        break;
      case 2:
        children = this.depart();
        break;
      default:
        children = this.arrive();
    }

    this.setState({ title, children });
  }
}

export default Guests;