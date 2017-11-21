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

const RowHeader = (props: { rowHeaderStyle: any, key: string, roomName: string }) => (
  <div
    key={props.key}
    style={props.rowHeaderStyle}
    className="md-font-bold md-divider-border md-divider-border--bottom md-divider-border--right grid-row grid-row-header grid-cell"
  >
    {props.roomName}
  </div>);

const ReservationBlock = (props: { reservation: Reservation, width: string, onClick: any }) => (
  <div
    key={props.reservation.ref}
    style={{ width: props.width }}
    onClick={props.onClick}
    className="md-font-bold md-divider-border md-divider-border--bottom md-divider-border--right grid-cell rez-cell"
  >
    {props.reservation.contact.lastName}
  </div>
);

const RowWrapper = (props: { index: number, gridSize: number, children: any }) => (
  <div key={'RoomRow' + props.index} style={{ height: props.gridSize + 'px' }} className="md-divider-border md-divider-border--bottom grid-row">
    {props.children}
  </div>
);

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
      rowHeaders.push(<RowHeader rowHeaderStyle={rowHeaderStyle} key={'Room' + i} roomName={this.state.roomNames[i]} />);
    }

    const rows = [];
    for (let i = 0; i < numberOfRooms; ++i) {
      let currentDate = today;
      if (this.state.roomNames[i] in this.state.lookup) {
        const roomReservations = this.state.lookup[this.state.roomNames[i]];
        const currentRow: {}[] = [];
        for (let j = 0; j < roomReservations.length; ++j) {
          const r = roomReservations[j];
          const arrival = r.bookingLines[0].arrival;
          const nights = r.bookingLines[0].nights;
          const departure = addDays(arrival, nights);
          const daysTillNext = subtractDates(arrival, currentDate);
          const daysTillDeparture = subtractDates(departure, currentDate);
          if (arrival > addDays(today, maxDays)) {
            break;
          }

          if (daysTillNext > 0) {
            currentRow.push(
              <EmptyCellBlock
                key={'empty' + '_' + j + '_' + i}
                days={daysTillNext}
              />);
            currentDate = addDays(currentDate, daysTillNext);
          }
          const size = (daysTillNext < 0 && daysTillDeparture > 0) ? ((nights + daysTillNext) * gridSize + 'px') : (nights * gridSize + 'px');
          if (daysTillNext < 0 && daysTillDeparture > 0 || daysTillNext >= 0) {
            currentRow.push(<ReservationBlock width={size} reservation={r} onClick={(e: any) => this.dialog.show(e, r)} />);
            currentDate = departure;
          }

          if (currentDate > maxDate) {
            maxDate = currentDate;
          }
        }
        const daysToFill = subtractDates(maxDate, currentDate);
        if (daysToFill > 0) {
          currentRow.push(<EmptyCellBlock key={'empty' + i} days={daysToFill} />);
        }

        rows.push(
          <RowWrapper index={i} gridSize={gridSize}>
            {...currentRow}
          </RowWrapper>);
      } else {
        const daysToFill = subtractDates(maxDate, currentDate);
        rows.push(
          <RowWrapper index={i} gridSize={gridSize}>
            <EmptyCellBlock key={'emptyr' + i} days={daysToFill} />
          </RowWrapper>);
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