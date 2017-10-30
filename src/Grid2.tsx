import * as React from 'react';
import './Grid2.css';
import { getReservations } from './Reservations';

function addDays(date: Date, days: number): Date {
  var dat = new Date(date);
  dat.setDate(dat.getDate() + days);
  return dat;
}

export default class Grid2 extends React.Component {
  render() {
    const reservations = getReservations();
    const rooms: any[] = reservations.filter(r => r.room).map(r => { return { room: r.room, rez: r }; });

    let lookup: any = {};
    for (let i = 0; i < rooms.length; ++i) {
      if (rooms[i].room in lookup) {
        lookup[rooms[i].room].push(rooms[i].rez);
      } else {
        lookup[rooms[i].room] = [rooms[i].rez];
      }
    }

    // tslint:disable-next-line:no-console
    console.log('rooms', lookup);
    const rowStyle = {
      height: '40px',
    };
    const numberOfRooms = 100;
    const rowHeaders = [];
    for (let i = 0; i < numberOfRooms; ++i) {
      rowHeaders.push(<div key={'Room' + i} style={rowStyle}>Room {i}</div>);
    }

    const rows = [];

    for (let i = 0; i < numberOfRooms; ++i) {
      if (i in lookup) {
        const roomReservations = lookup[i];
        const rez: {}[] = [];
        for (let j = 0; j < roomReservations.length; ++j) {
          const rs = {
            width: roomReservations[0].nights * 40 + 'px',
            background: 'pink'
          };
          rez.push(<div key={'rez' + '_' + j + '_' + i} style={rs} className="rez-cell">{lookup[i][0].lastName}<br /> {lookup[i][0].nights} nights</div>);
        }
        rows.push(<div key={'RoomRow' + i} style={rowStyle}>{...rez}</div>);
      } else {
        rows.push(<div key={'RoomRow' + i} style={rowStyle}>&nbsp;</div>);
      }
    }
    const cellStyle = {
      margin: 4
    };
    const daysAhead = 40;
    const colHeaders = [];
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < daysAhead; ++i) {
      let date = addDays(today, i);
      colHeaders.push(<div key={'Day' + i} style={cellStyle}><div>{daysOfWeek[date.getDay()]}</div><div>{date.getDate()}</div></div>);
    }

    const c = {
      display: 'flex',
      flexFlow: 'row wrap'
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
      <div style={c}>
        <div style={s1}>
          <div style={s0}>
            Corner
          </div>
          {...colHeaders}
        </div>
        <div style={s2}>
          {...rowHeaders}
        </div>
        <div style={s3}>
          {...rows}
        </div>
      </div>
    );
  }
}