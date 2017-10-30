import * as React from 'react';
import './Planner.css';
import { getReservationsByRoom } from './Reservations';

function addDays(date: Date, days: number): Date {
  var dat = new Date(date);
  dat.setDate(dat.getDate() + days); // TODO: does this work across month boundaries?
  return dat;
}

function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 1000 * 60 * 60 * 24;
  var difference = Math.abs(date1.getTime() - date2.getTime());
  return Math.round(difference / oneDay);

}

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
    let currentDate = today;
    for (let i = 0; i < numberOfRooms; ++i) {
      if (i in lookup) {
        const roomReservations = lookup[i];
        const rez: {}[] = [];
        for (let j = 0; j < roomReservations.length; ++j) {
          const arrival = new Date(roomReservations[j].arrival);
          const daysTillNext = daysBetween(arrival, currentDate);

          if (daysTillNext > 0) {
            const emptyStyle = {
              width: daysTillNext * 40 + 'px',
              background: 'lightgrey'
            };
            rez.push(<div key={'empty' + '_' + j + '_' + i} style={emptyStyle} className="rez-cell">Empty </div>);
            currentDate = addDays(currentDate, daysTillNext);
          }
          const rs = {
            width: roomReservations[0].nights * 40 + 'px',
            background: randomHsl()
          };
          rez.push(<div key={'rez' + '_' + j + '_' + i} style={rs} className="rez-cell">{roomReservations[j].lastName}<br />{arrival.toISOString()} </div>);
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