import * as React from 'react';
import {
  List,
  ListItem,
  Subheader,
  BottomNavigation,
  FontIcon
} from 'react-md';
import { ReservationDialog } from './ReservationDialog';
import { ArrivalTopLine, ResidentsTopLine, DepartureTopLine, BottomLine, MiddleLine } from './ReservationComponents';
import { Reservation, getReservations } from './FakeReservations';
import { addDays } from './dateHelpers';

const today = new Date('2017-10-25');
today.setHours(0, 0, 0, 0);

function filterArrivals(rez: Reservation[]) {
  return rez.filter(res => {
    const d = new Date(res.arrival);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
}

function filterDepartures(rez: Reservation[]) {
  return rez.filter(res => {
    const a = new Date(res.arrival);
    a.setHours(0, 0, 0, 0);
    const d = addDays(new Date(a), res.nights);

    return d.getTime() === today.getTime();
  });
}

function filterResidents(rez: Reservation[]) {
  return rez.filter(res => {
    const a = new Date(res.arrival);
    a.setHours(0, 0, 0, 0);
    const d = addDays(new Date(a), res.nights);

    return d.getTime() > today.getTime() &&
      a.getTime() < today.getTime();
  });
}

// TODO: swipe to navigate
// TODO: animate change screen?
// TODO: warning for no allocation, room state
// TODO: billing warning for departure red/green?
// TODO: ETA/ETD need to be added to data
// TODO: using routes for mobile subsections
// TODO: react-transition-group betweeen tabs

const ArrivalItem = (props: { reservation: Reservation, onClick: (e: any) => void }): JSX.Element => {
  const r = props.reservation;

  return (
    <ListItem
      className="md-divider-border md-divider-border--bottom"
      primaryText={(
        <ArrivalTopLine
          name={`${r.profile.firstName} ${r.profile.lastName}`}
        />)}
      secondaryText={(
        <div>
          <MiddleLine
            roomName={props.reservation.allocations[0].name ? 'Room: '
              + props.reservation.allocations[0].name.toString() : ''}
            roomType={props.reservation.allocations[0].type}
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

const ResidentItem = (props: { reservation: Reservation, onClick: (e: any) => void }): JSX.Element => {
  const r = props.reservation;
  const a = new Date(r.arrival);

  return (
    <ListItem
      className="md-divider-border md-divider-border--bottom"
      primaryText={(
        <ResidentsTopLine
          name={`${r.profile.firstName} ${r.profile.lastName}`}
          arrival={a}
          departure={new Date(addDays(a, r.nights))}
        />)}
      secondaryText={(
        <div>
          <MiddleLine
            roomName={props.reservation.allocations[0].name ? 'Room: ' + props.reservation.allocations[0].name.toString() : ''}
            roomType={props.reservation.allocations[0].type}
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

const DepartureItem = (props: { reservation: Reservation, onClick: (e: any) => void }): JSX.Element => {
  const r = props.reservation;

  return (
    <ListItem
      className="md-divider-border md-divider-border--bottom"
      primaryText={(
        <DepartureTopLine
          name={`${r.profile.firstName} ${r.profile.lastName}`}
        />)}
      secondaryText={(
        <div>
          <div className="space-between-content">
            <div >{props.reservation.allocations[0].name && 'Room: ' + props.reservation.allocations[0].name.toString()}</div>
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
  items: Reservation[];
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

class Guests extends React.Component<{ isMobile: boolean, hotelSiteCode: string }, { title: string, currentSection: number, arrivals: Reservation[], residents: Reservation[], departures: Reservation[] }> {
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
    getReservations(this.props.hotelSiteCode).then(rez => {
      this.setState({
        arrivals: filterArrivals(rez),
        residents: filterResidents(rez),
        departures: filterDepartures(rez)
      });
    });
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