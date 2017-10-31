import * as React from 'react';
import './Planner.css';
import { getReservationsByRoom, roomNames } from './Reservations';
import { subtractDates, addDays } from './dateHelpers';
import { ReservationDialog } from './ReservationDialog';
import DateColumnHeaders from './DateColumnHeaders';

function randomHsl() {
  return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
}

// TODO: break this up!
// TODO: style this - but avoid heights in styles as stuff will be fragile
// TODO: limit how many we do per row up front, fetch more
// TODO: transparent create reservation...?
// TODO: click to go to reservation - mobile
// TODO: tooltips
// TODO: consider paging vs scrolling
// const nowUtc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
const now = new Date('2017-10-25'); // new Date();
const today = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()); // TODO: ensure this updates
const gridSize = 40;
const maxDays = 7 + (window.innerWidth / gridSize); // TODO: observe change?

let maxDate = addDays(today, maxDays);

export default class Planner extends React.Component<{ isMobile: boolean }, {}> {
  dialog: ReservationDialog;

  render() {
    const lookup = getReservationsByRoom();

    const rowStyle = {
      height: gridSize + 'px',
    };
    const rowHeaderStyle = {
      ...rowStyle,
      width: 2 * gridSize + 'px'
    };
    const numberOfRooms = 100;
    const rowHeaders = [];
    for (let i = 0; i < numberOfRooms; ++i) {
      rowHeaders.push(
        <div
          key={'Room' + i}
          style={rowHeaderStyle}
          className="md-font-bold md-divider-border md-divider-border--bottom md-divider-border--right grid-row grid-row-header grid-cell"
        >
          {roomNames[i]}
        </div>);
    }

    const rows = [];

    for (let i = 0; i < numberOfRooms; ++i) {
      let currentDate = today;
      if (i in lookup) {
        const roomReservations = lookup[i];
        const rez: {}[] = [];
        for (let j = 0; j < roomReservations.length; ++j) {
          const arrival = new Date(roomReservations[j].arrival);
          const nights = roomReservations[j].nights;
          const departure = addDays(arrival, nights);
          const daysTillNext = subtractDates(arrival, currentDate);
          const daysTillDeparture = subtractDates(departure, currentDate);
          if (arrival > addDays(today, maxDays)) {
            break;
          }

          if (daysTillNext > 0) {
            for (let k = 0; k < daysTillNext; ++k) {
              const emptyStyle = {
                width: gridSize + 'px'
              };
              rez.push(
                <div
                  key={'empty' + '_' + j + '_' + i + '_' + k}
                  style={emptyStyle}
                  className="rez-empty-cell"
                />
              );

            }
            currentDate = addDays(currentDate, daysTillNext);
          }
          const size = (daysTillNext < 0 && daysTillDeparture > 0) ? (nights + daysTillNext * gridSize + 'px') : (nights * gridSize + 'px');
          if (daysTillNext < 0 && daysTillDeparture > 0 || daysTillNext >= 0) {
            const rs = {
              width: size, // negative
              background: randomHsl(),
              fontSize: '10px'
            };
            rez.push(
              <div
                key={'rez' + '_' + j + '_' + i}
                style={rs}
                onClick={e => this.dialog.show(0)}
                className="rez-cell"
              >
                {roomReservations[j].lastName} - {nights} < br />{arrival.toDateString()}
              </div>);
            currentDate = departure;
          }

          if (currentDate > maxDate) {
            maxDate = currentDate;
          }
        }
        rows.push(<div key={'RoomRow' + i} style={rowStyle} className="rez-row">{...rez}</div>);
      } else {
        rows.push(<div key={'RoomRow' + i} style={rowStyle} className="rez-row">&nbsp;</div>);
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
        <ReservationDialog isMobile={this.props.isMobile} ref={(r: ReservationDialog) => this.dialog = r} />
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
          className="grid-container"
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