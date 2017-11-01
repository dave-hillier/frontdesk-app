import * as React from 'react';
import {
  List,
  ListItem,
  Subheader,
  BottomNavigation,
  FontIcon
} from 'react-md';
import { ReservationDialog } from './ReservationDialog';
import { ReservationData, getArrivals, getResidents, getDepartures } from './Reservations';

function formatDateRange(year: boolean, arrival?: Date, departure?: Date) {
  const arrivalShort = arrival ? arrival.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  }).split(' ').join(' ') : '';

  const departureShort = departure ? (' - ' + departure.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  }).split(' ').join(' ')) : '';

  return arrivalShort + departureShort;
}

const ArrivalTopLine = (props: { name: string, time?: Date }): JSX.Element => {
  const eta = props.time ? 'ETA: ' + props.time.toLocaleDateString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  }).substring(12) : '';
  return (
    <div className="space-between-content">
      <div>{props.name}</div>
      <div className="md-text--secondary">{eta}</div>
    </div>)
    ;
};

const DepartureTopLine = (props: { name: string, time?: Date }): JSX.Element => {
  const etd = props.time ? 'ETD: ' + props.time.toLocaleDateString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  }).substring(12) : '';
  return (
    <div className="space-between-content">
      <div>{props.name}</div>
      <div className="md-text--secondary">{etd}</div>
    </div>)
    ;
};

const ResidentsTopLine = (props: { name: string, arrival: Date, departure: Date }): JSX.Element => {
  return (
    <div className="space-between-content">
      <div>{props.name}</div>
      <div className="md-text--secondary">{formatDateRange(false, props.arrival, props.departure)}</div>
    </div>)
    ;
};

const People = (props: { adults: number, children: number, infants: number }): JSX.Element => {
  return (
    <div className="align-items-center">
      <i className="material-icons medium-icon">person</i>&nbsp;{props.adults}&nbsp;&nbsp;
      <i className="material-icons medium-icon">child_care</i>&nbsp;{props.children}&nbsp;&nbsp;
      <i className="material-icons medium-icon">child_friendly</i>&nbsp;{props.infants}
    </div>
  );
};

const MiddleLine = (props: { room: string, roomType: string, nights?: number }): JSX.Element => {
  const nights = props.nights ? `${props.nights} nights` : '';
  return (
    <div className="space-between-content">
      <div>{props.roomType} {props.room}</div>
      <div className="md-text--secondary">{nights}</div>
    </div>);
};

const BottomLine = (props: { balance: number, adults: number, children: number, infants: number }): JSX.Element => {
  return (
    <div className="space-between-content">
      <People {...props} />
      <div>{props.balance.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</div>
    </div>);
};

const ArrivalItem = (props: { reservation: ReservationData, onClick: (e: any) => void }): JSX.Element => {
  const r = props.reservation;
  return (
    <ListItem
      primaryText={(
        <ArrivalTopLine
          name={`${r.firstName} ${r.lastName}`}
          // time={new Date()}
        />)}
      secondaryText={(
        <div>
          <MiddleLine
            room={props.reservation.room ? 'Room: ' + props.reservation.room.toString() : ''}
            roomType={props.reservation.roomType}
            nights={props.reservation.nights}
          />
          <BottomLine balance={r.balance ? r.balance : 0} adults={1} children={0} infants={0} />
        </div>)}
      onClick={props.onClick}
    />
  );
};

const ResidentItem = (props: { reservation: ReservationData, onClick: (e: any) => void }): JSX.Element => {
  const r = props.reservation;
  const a = new Date(r.arrival);
  return (
    <ListItem
      primaryText={(
        <ResidentsTopLine
          name={`${r.firstName} ${r.lastName}`}
          arrival={a}
          departure={new Date(addDays(a, r.nights))}
        />)}
      secondaryText={(
        <div>
          <MiddleLine
            room={props.reservation.room ? 'Room: ' + props.reservation.room.toString() : ''}
            roomType={props.reservation.roomType}
            nights={props.reservation.nights}
          />
          <BottomLine balance={r.balance ? r.balance : 0} adults={1} children={0} infants={0} />
        </div>)}
      onClick={props.onClick}
    />
  );
};

const DepartureItem = (props: { reservation: ReservationData, onClick: (e: any) => void }): JSX.Element => {
  const r = props.reservation;
  return (
    <ListItem
      primaryText={(
        <DepartureTopLine
          name={`${r.firstName} ${r.lastName}`}
          // time={new Date()}
        />)}
      secondaryText={(
        <div>
          <div className="space-between-content">
            <div >{props.reservation.room ? 'Room: ' + props.reservation.room.toString() : ''}</div>
            <div>{props.reservation.balance ? props.reservation.balance.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' }) : ''}</div>
          </div>
        </div>)}
      onClick={props.onClick}
    />
  );
};

function arrivalsList(f: any): {}[] {
  const arrivals = getArrivals();
  const result: {}[] = [];
  for (let i = 0; i < arrivals.length; ++i) {
    result.push(
      <ArrivalItem
        key={i}
        reservation={arrivals[i]}
        onClick={f}
      />
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
    result.push(
      <ResidentItem
        key={i}
        reservation={residents[i]}
        onClick={f}
      />
    );
  }
  return result;
}

function departureList(f: any): {}[] {
  const residents = getDepartures();
  const result: {}[] = [];
  for (let i = 0; i < residents.length; ++i) {
    result.push((
      <DepartureItem
        key={i}
        reservation={residents[i]}
        onClick={f}
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