import * as React from 'react';
import {
  List,
  ListItem,
  Subheader,
  BottomNavigation,
  FontIcon
} from 'react-md';
import { ReservationPreviewDialog } from './reservations/ReservationPreviewDialog';
import { ArrivalTopLine, DepartureTopLine, BottomLine, MiddleLine, ResidentListItem } from './reservations/ReservationListItems';
import { getBookingLines } from './model/FakeData';
import { addDays } from './util';
import { BookingLine, Reservation } from './model/Model';
import * as Fuse from 'fuse.js';

const today = new Date();
today.setHours(0, 0, 0, 0);

// TODO: push onto model
function getArrivals(rez: BookingLine[]) {
  return rez.filter(b => {
    const d = b.arrival;
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
}

function getDepartures(rez: BookingLine[]) {
  return rez.filter(b => {
    const a = b.arrival;
    a.setHours(0, 0, 0, 0);
    const d = addDays(a, b.nights);

    return d.getTime() === today.getTime();
  });
}

function getResidents(rez: BookingLine[]) {
  return rez.filter(b => {
    const a = b.arrival;
    a.setHours(0, 0, 0, 0);
    const d = addDays(a, b.nights);

    return d.getTime() > today.getTime() &&
      a.getTime() < today.getTime();
  });
}

// TODO: warning for no allocation, room state
// TODO: billing warning for departure red/green?
// TODO: using routes for mobile subsections
const ArrivalItem = (props: { booking: BookingLine, onClick: (e: any) => void }): JSX.Element => {
  const b = props.booking;
  const r = b.reservation;
  const room = b.allocatedRoom;
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
            nights={b.nights}
          />
          <BottomLine
            balance={r.balance ? r.balance : 0}
            adults={b.guests.adults}
            children={b.guests.children}
            infants={b.guests.infants}
          />
        </div>)}
      onClick={props.onClick}
    />
  );
};

const DepartureItem = (props: { booking: BookingLine, onClick: (e: any) => void }): JSX.Element => {
  const b = props.booking;
  const r = b.reservation;
  const room = b.allocatedRoom;

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
            <div>{r.balance && r.balance.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</div>
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
  items: BookingLine[];
  onClick: (e: any, r: Reservation) => void;
  isMobile: boolean;
  filter: string;
}

interface TitleProp {
  title: string;
}

const fuseOptions = {
  shouldSort: true,
  threshold: 0.2,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    'contact.firstName',
    'contact.lastName',
    'ref',
    'ledger.name'
  ]
};

const filteredList = (
  { title, items, onClick, filter, ...rest }: Props & TitleProp,
  renderItem: (r: BookingLine, onClick: (e: any, r: Reservation) => void) => void) => {
  const fuse = new Fuse(items, fuseOptions);
  const filtered: BookingLine[] = filter ? fuse.search(filter) : items;

  const i = filtered.map(r => renderItem(r, onClick));
  return <GridSection primaryText={`${title} (${items.length} bookings)`} {...rest}>{...i}</ GridSection>;
};

const Arrivals = (props: Props) => filteredList(
  { ...props, title: 'Arrivals' },
  (r: BookingLine, onClick: any) => <ArrivalItem key={r.refFull} booking={r} onClick={(e) => onClick(e, r.reservation)} />);

const Residents = (props: Props) => filteredList(
  { ...props, title: 'Residents' },
  (r: BookingLine, onClick: any) => <ResidentListItem key={r.refFull} booking={r} onClick={(e) => onClick(e, r.reservation)} />);

const Departures = (props: Props) => filteredList(
  { ...props, title: 'Departures' },
  (r: BookingLine, onClick: any) => <DepartureItem key={r.refFull} booking={r} onClick={(e) => onClick(e, r.reservation)} />);

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
  search: string;
}

export interface GuestsState {
  title: string;
  currentSection: number;
  arrivals: BookingLine[];
  residents: BookingLine[];
  departures: BookingLine[];
}

class Guests extends React.PureComponent<GuestsProps, GuestsState> {
  subscription: any;
  dialog: ReservationPreviewDialog;

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
    getBookingLines(this.props.hotelSiteCode).then(rez => {
      this.setState({
        arrivals: getArrivals(rez),
        residents: getResidents(rez),
        departures: getDepartures(rez)
      });
    });
  }

  render() {
    const arrivals = (
      <Arrivals
        items={this.state.arrivals}
        onClick={(e: any, r: Reservation) => this.dialog.show(e, r)}
        listClassName={!this.props.isMobile ? 'md-cell md-paper md-paper--1' : ''}
        isMobile={this.props.isMobile}
        filter={this.props.search}
      />);

    const residents = (
      <Residents
        items={this.state.residents}
        onClick={(e: any, r: Reservation) => this.dialog.show(e, r)}
        listClassName={!this.props.isMobile ? 'md-cell md-paper md-paper--1' : ''}
        isMobile={this.props.isMobile}
        filter={this.props.search}
      />);
    const departures = (
      <Departures
        items={this.state.departures}
        onClick={(e: any, r: Reservation) => this.dialog.show(e, r)}
        listClassName={!this.props.isMobile ? 'md-cell md-paper md-paper--1' : ''}
        isMobile={this.props.isMobile}
        filter={this.props.search}
      />);

    if (!this.props.isMobile) {
      return (
        <div className="md-grid">
          <ReservationPreviewDialog ref={(r: ReservationPreviewDialog) => this.dialog = r} isMobile={this.props.isMobile} />
          {arrivals}
          {residents}
          {departures}
        </div>);
    } else {
      const sections = [arrivals, residents, departures];
      return (
        <div>
          <ReservationPreviewDialog ref={(r: ReservationPreviewDialog) => this.dialog = r} isMobile={this.props.isMobile} />
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