import * as React from 'react';
import './Planner.css';
import { getReservationsByRoom, getRooms } from './FakeReservations';
import { Room, Reservation } from './Model';
import { subtractDates, addDays } from './dateHelpers';
import { ReservationPreviewDialog } from './ReservationPreviewDialog';
import DateColumnHeaders from './DateColumnHeaders';

// TODO: break this up!
// TODO: limit how many we do per row up front, fetch more
// TODO: transparent create reservation...?
// TODO: tooltips
// TODO: consider paging vs scrolling
// TODO: optimise: can we cut down on empty cells?
// TODO: clean up the styles
// TODO: fix the grid -- top corner style
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // TODO: ensure this updates
const gridSize = 42;
const maxDays = 7 + (window.innerWidth / gridSize); // TODO: observe change?

let maxDate = addDays(today, maxDays);

const EmptyCellBlock = (props: { days: number }): JSX.Element => {
  const emptyStyle = {
    width: props.days * gridSize + 'px'
  };

  return (
    <div
      style={emptyStyle}
      className="rez-empty-cell md-divider-border md-divider-border--right grid-cell"
    />);
};
export interface RoomLookup {
  [room: string]: Reservation[];
}
export default class Planner extends React.Component<{ isMobile: boolean, hotelSiteCode: string }, { lookup: RoomLookup, roomNames: string[] }> {
  private dialog: ReservationPreviewDialog;

  constructor(props: any) {
    super(props);
    this.state = { roomNames: [], lookup: {} };
  }

  componentWillMount() {
    // TODO: get hotel by prop?
    getReservationsByRoom(this.props.hotelSiteCode).then((l: RoomLookup) => this.setState({ lookup: l }));
    getRooms(this.props.hotelSiteCode).then((r: Room[]) => this.setState({ roomNames: r.map(n => n.name) }));
  }

  render() {
    const rowStyle = {
      height: gridSize + 'px',
    };
    const position: 'sticky' = 'sticky';
    const rowHeaderStyle = {
      ...rowStyle,
      width: 2 * gridSize + 'px',
      position
    };
    const numberOfRooms = this.state.roomNames.length;
    const rowHeaders = [];
    for (let i = 0; i < numberOfRooms; ++i) {
      rowHeaders.push(
        <div
          key={'Room' + i}
          style={rowHeaderStyle}
          className="md-font-bold md-divider-border md-divider-border--bottom md-divider-border--right grid-row grid-row-header grid-cell"
        >
          {this.state.roomNames[i]}
        </div>);
    }

    const rows = [];

    // tslint:disable-next-line:no-console
    console.log('Lookup', this.state.lookup);

    for (let i = 0; i < numberOfRooms; ++i) {
      let currentDate = today;
      // tslint:disable-next-line:no-console
      console.log('name', i, this.state.roomNames[i]);
      if (this.state.roomNames[i] in this.state.lookup) {
        const roomReservations = this.state.lookup[this.state.roomNames[i]];
        const rez: {}[] = [];
        for (let j = 0; j < roomReservations.length; ++j) {
          const arrival = roomReservations[j].bookingLines[0].arrival;
          const nights = roomReservations[j].bookingLines[0].nights;
          const departure = addDays(arrival, nights);
          const daysTillNext = subtractDates(arrival, currentDate);
          const daysTillDeparture = subtractDates(departure, currentDate);
          if (arrival > addDays(today, maxDays)) {
            break;
          }

          if (daysTillNext > 0) {
            rez.push(
              <EmptyCellBlock
                key={'empty' + '_' + j + '_' + i}
                days={daysTillNext}
              />);
            currentDate = addDays(currentDate, daysTillNext);
          }
          const size = (daysTillNext < 0 && daysTillDeparture > 0) ? ((nights + daysTillNext) * gridSize + 'px') : (nights * gridSize + 'px');
          if (daysTillNext < 0 && daysTillDeparture > 0 || daysTillNext >= 0) {
            const rs = {
              width: size
            };
            rez.push(
              <div
                key={'rez' + '_' + j + '_' + i}
                style={rs}
                onClick={e => this.dialog.show(e, roomReservations[j])}
                className="md-font-bold md-divider-border md-divider-border--bottom md-divider-border--right grid-cell rez-cell"
              >
                {roomReservations[j].contact.lastName}
              </div>);
            currentDate = departure;
          }

          if (currentDate > maxDate) {
            maxDate = currentDate;
          }
        }
        const daysToFill = subtractDates(maxDate, currentDate);
        if (daysToFill > 0) {
          rez.push(<EmptyCellBlock key={'empty' + i} days={daysToFill} />);
        }

        rows.push(
          <div
            key={'RoomRow' + i}
            style={rowStyle}
            className="md-divider-border md-divider-border--bottom grid-row"
          >
            {...rez}
          </div>);
      } else {
        const daysToFill = subtractDates(maxDate, currentDate);
        rows.push(
          <div
            key={'RoomRow' + i}
            style={rowStyle}
            className="md-divider-border md-divider-border--bottom grid-row"
          >
            <EmptyCellBlock key={'emptyr' + i} days={daysToFill} />
          </div>);
      }
    }

    const daysAhead = maxDate;

    const c = {
      display: 'flex',
      flexFlow: 'row'
    };
    const s0 = {
      width: 2 * gridSize + 'px',
      height: gridSize + 'px'
    };
    const s1 = {
      height: gridSize + 'px',
      display: 'flex',
      flex: 'row'
    };
    const s2 = {
      width: 2 * gridSize + 'px'
    };
    // TODO: fixup this grid vs the Allocations, extract a standard layout
    return (
      <div>
        <ReservationPreviewDialog isMobile={this.props.isMobile} ref={(r: ReservationPreviewDialog) => this.dialog = r} />
        <div style={c}>
          <div style={s1}>
            <div
              style={s0}
              className="md-font-bold md-divider-border md-divider-border--bottom md-divider-border--right grid-row grid-row-header"
            />
            <DateColumnHeaders start={today} days={subtractDates(daysAhead, today)} />
          </div>
        </div>
        <div
          style={c}
          className="grid-container grid-body"
        >
          <div
            style={s2}
          >
            {...rowHeaders}
          </div>
          <div>
            {...rows}
          </div>
        </div>
      </div>
    );
  }
}