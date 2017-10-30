import * as React from 'react';
import './Planner.css';
import { getReservationsByRoom } from './Reservations';
import { daysBetween, addDays } from './dateHelpers';

function randomHsl() {
  return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
}

// const nowUtc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
const now = new Date('2017-10-25'); // new Date();
const today = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()); // TODO: ensure this updates

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
      rowHeaders.push(<div key={'Room' + i} style={rowHeaderStyle}>Room {i}</div>);
    }

    const rows = [];

    for (let i = 0; i < numberOfRooms; ++i) {
      let currentDate = today;
      if (i in lookup) {
        const roomReservations = lookup[i];
        const rez: {}[] = [];
        for (let j = 0; j < roomReservations.length; ++j) {
          const arrival = new Date(roomReservations[j].arrival);
          const daysTillNext = daysBetween(arrival, currentDate) - 1;

          if (daysTillNext > 0) {

            for (let k = 0; k < daysTillNext; ++k) {
              const emptyStyle = {
                width: 40 + 'px',
                background: 'lightgrey'
              };
              rez.push(<div key={'empty' + '_' + j + '_' + i + '_' + k} style={emptyStyle} className="rez-cell"> {daysTillNext} Empty</div>);
            }

            currentDate = addDays(currentDate, daysTillNext);
          }
          const rs = {
            width: roomReservations[j].nights * 40 + 'px',
            background: randomHsl()
          };
          rez.push(<div key={'rez' + '_' + j + '_' + i} style={rs} className="rez-cell">{roomReservations[j].lastName} - {roomReservations[j].nights} < br />{arrival.toISOString()} </div>);
          currentDate = addDays(currentDate, roomReservations[j].nights);
        }
        rows.push(<div key={'RoomRow' + i} style={rowStyle} className="rez-row">{...rez}</div>);
      } else {
        rows.push(<div key={'RoomRow' + i} style={rowStyle} className="rez-row">&nbsp;</div>);
      }
    }
    const cellStyle = {
      margin: 4
    };
    const daysAhead = 40;
    const colHeaders = [];
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    for (let i = 0; i < daysAhead; ++i) {
      let date = addDays(today, i);
      colHeaders.push(<div key={'Day' + i} style={cellStyle}><div>{daysOfWeek[date.getDay()]}</div><div>{date.getDate()}</div></div>);
    }

    const c = {
      display: 'flex',
      flexFlow: 'row'
    };
    const s0 = {
      background: 'blue',
      width: '80px',
      height: '40px'
    };
    const s1 = {
      background: 'yellow',
      height: '40px',
      display: 'flex',
      flex: 'row'
    };
    const s2 = {
      background: 'red',
      width: '80px'
    };
    const s3 = {
      background: 'green'
    };
    return (
      <div>
        <div style={c}>
          <div style={s1}>
            <div style={s0}>
              Corner
          </div>
            {...colHeaders}
          </div>
        </div>
        <div style={c}>
          <div style={s2}>
            {...rowHeaders}
          </div>
          <div style={s3}>
            {...rows}
          </div>
        </div>
      </div>
    );
  }
}