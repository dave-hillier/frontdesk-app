import * as React from 'react';
import {
  List,
  ListItem,
  Subheader,
  BottomNavigation,
  FontIcon
} from 'react-md';
import { ReservationDialog } from './ReservationDialog';
import { ArrivalTopLine, DepartureTopLine, BottomLine, MiddleLine, ResidentItem } from './ReservationComponents';
import { getReservations } from './FakeReservations';
import { addDays } from './dateHelpers';
import { Reservation } from './Model';
import * as Fuse from 'fuse.js';

const today = new Date();
today.setHours(0, 0, 0, 0);

function getArrivals(rez: Reservation[]) {
  return rez.filter(res => {
    const d = res.bookingLines[0].arrival;
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
}

function getDepartures(rez: Reservation[]) {
  return rez.filter(res => {
    const a = res.bookingLines[0].arrival;
    a.setHours(0, 0, 0, 0);
    const d = addDays(a, res.bookingLines[0].nights);

    return d.getTime() === today.getTime();
  });
}

function getResidents(rez: Reservation[]) {
  return rez.filter(res => {
    const a = res.bookingLines[0].arrival;
    a.setHours(0, 0, 0, 0);
    const d = addDays(a, res.bookingLines[0].nights);

    return d.getTime() > today.getTime() &&
      a.getTime() < today.getTime();
  });
}

// TODO: swipe to navigate
// TODO: animate change screen?
// TODO: warning for no allocation, room state
// TODO: billing warning for departure red/green?
// TODO: using routes for mobile subsections
const ArrivalItem = (props: { reservation: Reservation, onClick: (e: any) => void }): JSX.Element => {
  const r = props.reservation;
  const room = r.bookingLines[0].allocatedRoom;
  return (
    <ListItem
      className="md-divider-border md-divider-border--bottom"
      primaryText={(
        <ArrivalTopLine
          name={`${r.contact.firstName} ${r.contact.lastName}`}
        />)}
      secondaryText={(
        <div>
          <MiddleLine
            roomName={room ? 'Room: '
              + room.name.toString() : ''}
            roomType={room ? room.type : ''}
            nights={r.bookingLines[0].nights}
          />
          <BottomLine
            balance={r.balance ? r.balance : 0}
            adults={r.bookingLines[0].guests.adults}
            children={r.bookingLines[0].guests.children}
            infants={r.bookingLines[0].guests.infants}
          />
        </div>)}
      onClick={props.onClick}
    />
  );
};

const DepartureItem = (props: { reservation: Reservation, onClick: (e: any) => void }): JSX.Element => {
  const r = props.reservation;
  const room = r.bookingLines[0].allocatedRoom;

  return (
    <ListItem
      className="md-divider-border md-divider-border--bottom"
      primaryText={(
        <DepartureTopLine
          name={`${r.contact.firstName} ${r.contact.lastName}`}
        />)}
      secondaryText={(
        <div>
          <div className="space-between-content">
            <div>{room ? 'Room: ' + room.name.toString() : ''}</div>
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
  onClick: (e: any, r: Reservation) => void;
  isMobile: boolean;
  filter: string;
}

interface TitleProp {
  title: string;
}

const fuseOptions = {
  shouldSort: true,
  threshold: 0.4,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    'contact.firstName',
    'contact.lastName'
  ]
};

const renderItemA = (r: Reservation, onClick: (e: any, r: Reservation) => void) => {
  return <ArrivalItem key={r.ref} reservation={r} onClick={(e) => onClick(e, r)} />;
};

const wrapper = ({ title, items, onClick, filter, ...rest }: Props & TitleProp, renderItem = renderItemA) => {
  const fuse = new Fuse(items, fuseOptions);
  const filtered: Reservation[] = filter ? fuse.search(filter) : items;

  const i = filtered.map(r => renderItem(r, onClick));
  return <GridSection primaryText={`${title} (${items.length} bookings)`} {...rest}>{...i}</ GridSection>;
};

const Arrivals = (props: Props) => wrapper(
  { ...props, title: 'Arrivals' },
  (r: Reservation, onClick: any) => <ArrivalItem key={r.ref} reservation={r} onClick={(e) => onClick(e, r)} />);

const Residents = (props: Props) => wrapper(
  { ...props, title: 'Residents' },
  (r: Reservation, onClick: any) => <ResidentItem key={r.ref} reservation={r} onClick={(e) => onClick(e, r)} />);

const Departures = (props: Props) => wrapper(
  { ...props, title: 'Departures' },
  (r: Reservation, onClick: any) => <DepartureItem key={r.ref} reservation={r} onClick={(e) => onClick(e, r)} />);

const links = [{
  label: 'Arrivals',
  icon: <FontIcon>room_service</FontIcon>,
}, {
  label: 'Residents',
  icon: <FontIcon>local_hotel</FontIcon>,
}, {
  label: 'Departures',
  icon: <FontIcon>directions_walk</FontIcon>,
}];

export interface GuestsProps {
  isMobile: boolean;
  hotelSiteCode: string;
  search: Rx.Observable<string>;
}

export interface GuestsState {
  title: string;
  filter: string;
  currentSection: number;
  arrivals: Reservation[];
  residents: Reservation[];
  departures: Reservation[];
}

class Guests extends React.Component<GuestsProps, GuestsState> {
  subscription: any;
  dialog: ReservationDialog;

  constructor(props: any) {
    super(props);

    this.state = {
      title: '',
      currentSection: 0,
      arrivals: [],
      residents: [],
      departures: [],
      filter: ''
    };
  }

  componentWillMount() {
    this.subscription = this.props.search.subscribe(filter => {
      // tslint:disable-next-line:no-console
      console.log('Fitlering items ', filter);
      this.setState({ filter });
    });

    getReservations(this.props.hotelSiteCode).then(rez => {
      this.setState({
        arrivals: getArrivals(rez),
        residents: getResidents(rez),
        departures: getDepartures(rez)
      });
    });
  }

  componentWillUnmount() {
    // TODO: this is crashing!
    // this.subscription.unsubscribe();

  }

  render() {
    const arrivals = (
      <Arrivals
        items={this.state.arrivals}
        onClick={(e: any, r: Reservation) => this.dialog.show(e, r)}
        listClassName={!this.props.isMobile ? 'md-cell md-paper md-paper--1' : ''}
        isMobile={this.props.isMobile}
        filter={this.state.filter}
      />);

    const residents = (
      <Residents
        items={this.state.residents}
        onClick={(e: any, r: Reservation) => this.dialog.show(e, r)}
        listClassName={!this.props.isMobile ? 'md-cell md-paper md-paper--1' : ''}
        isMobile={this.props.isMobile}
        filter={this.state.filter}
      />);
    const departures = (
      <Departures
        items={this.state.departures}
        onClick={(e: any, r: Reservation) => this.dialog.show(e, r)}
        listClassName={!this.props.isMobile ? 'md-cell md-paper md-paper--1' : ''}
        isMobile={this.props.isMobile}
        filter={this.state.filter}
      />);

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