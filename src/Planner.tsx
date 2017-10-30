import * as React from 'react';
import './Planner.css';
import { getReservationsByRoom, roomNames } from './Reservations';
import { subtractDates, addDays } from './dateHelpers';

function randomHsl() {
  return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
}

// TODO: break this up!
// TODO: style this - but avoid heights in styles as stuff will be fragile
// TODO: limit how many we do per row up front, fetch more
// const nowUtc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
// TODO: transparent create reservation...?
// TODO: click to go to reservation
// TODO: tooltips
const now = new Date('2017-10-25'); // new Date();
const today = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()); // TODO: ensure this updates
let maxDate = addDays(today, 30);

export default class Planner extends React.Component {

  render() {
    const lookup = getReservationsByRoom();

    // tslint:disable-next-line:no-console
    console.log('rooms', lookup);
    const rowStyle = {
      height: '40px',
    };
    const rowHeaderStyle = {
      ...rowStyle,
      width: '80px'
    };
    const numberOfRooms = 100;
    const rowHeaders = [];
    for (let i = 0; i < numberOfRooms; ++i) {
      rowHeaders.push(<div key={'Room' + i} style={rowHeaderStyle}>{roomNames[i]}</div>);
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

          if (daysTillNext > 0) {
            for (let k = 0; k < daysTillNext; ++k) {
              const emptyStyle = {
                width: 40 + 'px'
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

          if (daysTillNext < 0 && daysTillDeparture > 0) {
            const rs = {
              width: nights + daysTillNext * 40 + 'px',
              background: randomHsl(),
              fontSize: '10px'
            };
            rez.push(<div key={'rez' + '_' + j + '_' + i} style={rs} className="rez-cell">{roomReservations[j].lastName} - {nights} < br />{arrival.toDateString()} </div>);
            currentDate = departure;
          }

          if (daysTillNext >= 0) {
            const rs = {
              width: nights * 40 + 'px',
              background: randomHsl(),
              fontSize: '10px'
            };
            rez.push(<div key={'rez' + '_' + j + '_' + i} style={rs} className="rez-cell">{roomReservations[j].lastName} - {nights} < br />{arrival.toDateString()} </div>);
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
    const cellStyle = {
      padding: 4,
      width: '40px'
    };
    const daysAhead = maxDate;
    const colHeaders = [];
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    for (let i = 0; i < subtractDates(daysAhead, today); ++i) {
      let date = addDays(today, i);
      colHeaders.push(<div key={'Day' + i} style={cellStyle}><div>{daysOfWeek[date.getDay()]}</div><div>{date.getDate()}</div></div>);
    }

    const c = {
      display: 'flex',
      flexFlow: 'row'
    };
    const s0 = {
      width: '80px',
      height: '40px'
    };
    const s1 = {
      height: '40px',
      display: 'flex',
      flex: 'row'
    };
    const s2 = {
      width: '80px'
    };
    return (
      <div>
        <div style={c}>
          <div style={s1}>
            <div style={s0} />
            {...colHeaders}
          </div>
        </div>
        <div style={c}>
          <div style={s2}>
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