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
import { addDays } from './dateHelpers';

// TODO: swipe to navigate
// TODO: animate change screen?
// TODO: warning for no allocation, room state
// TODO: billing warning for departure red/green?
// TODO: ETA/ETD need to be added to data
// TODO: using routes for mobile subsections
// TODO: react-transition-group betweeen tabs
function formatDateRange(arrival: Date, departure?: Date) {
  const arrivalShort = arrival ? arrival.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  }) : '';

  const departureShort = departure ? (' - ' + departure.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  })) : '';

  return arrivalShort + departureShort;
}

const ArrivalTopLine = (props: { name: string, time?: Date }) => DepartureTopLine({ name: props.name, time: props.time, label: 'ETA' });

const DepartureTopLine = (props: { name: string, time?: Date, label?: string }): JSX.Element => {
  const label = props.label ? props.label : 'ETD';
  const estimated = props.time ? label + ': ' + props.time.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  return (
    <div className="space-between-content">
      <div>{props.name}</div>
      <div className="md-text--secondary">{estimated}</div>
    </div>)
    ;
};

const ResidentsTopLine = (props: { name: string, arrival: Date, departure: Date }): JSX.Element => {
  return (
    <div className="space-between-content">
      <div>{props.name}</div>
      <div className="md-text--secondary">{formatDateRange(props.arrival, props.departure)}</div>
    </div>)
    ;
};

// TODO: tooltips for icons
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
      className="md-divider-border md-divider-border--bottom"
      primaryText={(
        <ArrivalTopLine
          name={`${r.firstName} ${r.lastName}`}
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
      className="md-divider-border md-divider-border--bottom"
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
          <BottomLine
            balance={r.balance ? r.balance : 0}
            adults={r.adults}
            children={r.children}
            infants={r.infants}
          />
        </div>)}
      onClick={props.onClick}
    />
  );
};

const DepartureItem = (props: { reservation: ReservationData, onClick: (e: any) => void }): JSX.Element => {
  const r = props.reservation;

  return (
    <ListItem
      className="md-divider-border md-divider-border--bottom"
      primaryText={(
        <DepartureTopLine
          name={`${r.firstName} ${r.lastName}`}
        />)}
      secondaryText={(
        <div>
          <div className="space-between-content">
            <div >{props.reservation.room && 'Room: ' + props.reservation.room.toString()}</div>
            <div>{props.reservation.balance && props.reservation.balance.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</div>
          </div>
        </div>)}
      onClick={props.onClick}
    />
  );
};

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

const GridSection = (props: { primaryText: string, listClassName?: string, children: any[], isMobile: boolean }) => (
  <List className={props.listClassName ? props.listClassName : ''}>
    {!props.isMobile && <Subheader primaryText={props.primaryText} primary={true} className="md-divider-border md-divider-border--bottom" />}
    {props.children}
  </List>
);

const Arrivals = (props: any) => {
  const items = getArrivals().map(r => {
    return (
      <ArrivalItem
        key={r.ref}
        reservation={r}
        onClick={(e) => props.onClick(e, r)}
      />);
  });
  return <GridSection primaryText="Arrivals" {...props}>{...items}</ GridSection>;
};

const Residents = (props: any) => {
  const items = getResidents().map(r => {
    return (
      <ResidentItem
        key={r.ref}
        reservation={r}
        onClick={(e) => props.onClick(e, r)}
      />);
  });
  return <GridSection primaryText="Residents" {...props}>{...items}</ GridSection>;
};

const Departures = (props: any) => {
  const items = getDepartures().map(r => {
    return (
      <DepartureItem
        key={r.ref}
        reservation={r}
        onClick={(e) => props.onClick(e, r)}
      />);
  });
  return <GridSection primaryText="Departures" {...props}>{...items}</ GridSection>;
};

class Guests extends React.Component<{ isMobile: boolean }, { title: string, currentList: any }> {
  dialog: ReservationDialog;

  constructor(props: any) {
    super(props);

    this.state = {
      title: '',
      currentList: <Arrivals onClick={(e: any, r: any) => this.dialog.show(e, r)} listClassName={props.isMobile ? '' : 'md-cell md-paper md-paper--1'} isMobile={props.isMobile} />
    };
  }

  render() {
    if (!this.props.isMobile) {
      return (
        <div className="md-grid">
          <ReservationDialog ref={(r: ReservationDialog) => this.dialog = r} isMobile={this.props.isMobile} />
          <Arrivals onClick={(e: any, r: any) => this.dialog.show(e, r)} listClassName={'md-cell md-paper md-paper--1'} />
          <Residents onClick={(e: any, r: any) => this.dialog.show(e, r)} listClassName={'md-cell md-paper md-paper--1'} />
          <Departures onClick={(e: any, r: any) => this.dialog.show(e, r)} listClassName={'md-cell md-paper md-paper--1'} />
        </div>

      );
    } else {
      const { currentList } = this.state;
      return (
        <div>
          <ReservationDialog ref={(r: ReservationDialog) => this.dialog = r} isMobile={this.props.isMobile} />
          {currentList}
          <BottomNavigation
            links={links}
            dynamic={true}
            animate={true}
            onNavChange={e => this.handleNavChange(e)}
          />
        </div>);
    }
  }

  private handleNavChange(index: number): any {
    const title = links[index].label;
    let currentList;
    switch (index) {
      case 1:
        currentList = <Residents onClick={(e: any, r: any) => this.dialog.show(e, r)} isMobile={true} />;
        break;
      case 2:
        currentList = <Departures onClick={(e: any, r: any) => this.dialog.show(e, r)} isMobile={true} />;
        break;
      default:
        currentList = <Arrivals onClick={(e: any, r: any) => this.dialog.show(e, r)} isMobile={true} />;
    }

    this.setState({ title, currentList });
  }
}

export default Guests;