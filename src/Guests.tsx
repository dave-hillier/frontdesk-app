import * as React from 'react';
import {
  List,
  ListItem,
  Subheader,
  BottomNavigation,
  FontIcon
} from 'react-md';
import { ReservationDialog } from './ReservationDialog';
import { ReservationData, getArrivals, getResidents, getDepartures } from './FakeReservations';
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

const GridSection = (props: { primaryText: string, listClassName: string, children: any[], isMobile: boolean }) => (
  <List className={props.listClassName ? props.listClassName : ''}>
    {!props.isMobile && <Subheader primaryText={props.primaryText} primary={true} className="md-divider-border md-divider-border--bottom" />}
    {props.children}
  </List>
);

interface Props {
  listClassName: string;
  items: ReservationData[];
  onClick: (e: any, r: any) => void;
  isMobile: boolean;
}

const Arrivals = (props: Props) => {
  const { items, onClick, ...rest } = props;
  const i = items.map(r => <ArrivalItem key={r.ref} reservation={r} onClick={(e) => props.onClick(e, r)} />);
  return <GridSection primaryText={`Arrivals (${items.length} bookings)`} {...rest}>{...i}</ GridSection>;
};

const Residents = (props: Props) => {
  const { items, onClick, ...rest } = props;
  const i = items.map(r => <ResidentItem key={r.ref} reservation={r} onClick={(e) => props.onClick(e, r)} />);
  return <GridSection primaryText={`Residents (${items.length} bookings)`} {...rest}>{...i}</ GridSection>;
};

const Departures = (props: Props) => {
  const { items, onClick, ...rest } = props;
  const i = items.map(r => <DepartureItem key={r.ref} reservation={r} onClick={(e) => props.onClick(e, r)} />);
  return <GridSection primaryText={`Departures (${items.length} bookings)`} {...rest}>{...i}</ GridSection>;
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

class Guests extends React.Component<{ isMobile: boolean }, { title: string, currentSection: number, arrivals: ReservationData[], residents: ReservationData[], departures: ReservationData[] }> {
  dialog: ReservationDialog;

  constructor(props: any) {
    super(props);

    this.state = {
      title: '',
      currentSection: 0,
      arrivals: [],
      residents: [],
      departures: []
    };
  }

  componentWillMount() {
    // TODO: merge these and provide filters 
    getArrivals('').then(r => this.setState({ arrivals: r }));
    getResidents('').then(r => this.setState({ residents: r }));
    getDepartures('').then(r => this.setState({ departures: r }));
  }

  render() {
    const arrivals = <Arrivals items={this.state.arrivals} onClick={(e: any, r: any) => this.dialog.show(e, r)} listClassName={!this.props.isMobile ? 'md-cell md-paper md-paper--1' : ''} isMobile={this.props.isMobile} />;
    const residents = <Residents items={this.state.residents} onClick={(e: any, r: any) => this.dialog.show(e, r)} listClassName={!this.props.isMobile ? 'md-cell md-paper md-paper--1' : ''} isMobile={this.props.isMobile} />;
    const departures = <Departures items={this.state.departures} onClick={(e: any, r: any) => this.dialog.show(e, r)} listClassName={!this.props.isMobile ? 'md-cell md-paper md-paper--1' : ''} isMobile={this.props.isMobile} />;

    if (!this.props.isMobile) {
      return (
        <div className="md-grid">
          <ReservationDialog ref={(r: ReservationDialog) => this.dialog = r} isMobile={this.props.isMobile} />
          {arrivals}
          {residents}
          {departures}
        </div>);
    } else {
      const sections = [arrivals, residents, departures];
      return (
        <div>
          <ReservationDialog ref={(r: ReservationDialog) => this.dialog = r} isMobile={this.props.isMobile} />
          {sections[this.state.currentSection]}
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
    this.setState({ title, currentSection: index });
  }
}

export default Guests;