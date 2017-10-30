import * as React from 'react';
import './Allocations.css';

import { roomTypesList } from './Reservations';

export default class Allocations extends React.Component {
  render() {
    const rows = this.buildGrid(roomTypesList.length, 40);

    return (
      <div className="grid-container">
        <div className="grid-row-headers">
          {this.rowHeaders()}
        </div>
        <div>
          {...rows}
        </div>
      </div>
    );
  }

  private rowHeaders() {
    const rows: {}[] = [];
    const roomTypes: string[] = ['', ...roomTypesList];

    for (let i = 0; i < roomTypes.length; ++i) {
      rows.push(
        <div
          key={'row' + i}
          className="md-font-bold md-divider-border md-divider-border--bottom md-divider-border--right grid-row grid-row-header"
        >
          {roomTypes[i]}
        </div>);
    }
    return rows;
  }

  private colHeaders() {
    const cols: {}[] = [];

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    for (let i = 0; i < 40; ++i) {
      cols.push(
        <div
          key={i.toString()}
          className="grid-col-header md-divider-border md-divider-border--right grid-col"
        >
          <div className="md-font-light grid-header-day-of-week">{days[i % 7]}</div>
          <div className="md-font-bold grid-header-day-of-month">{(i % 30) + 1}</div>
        </div>
      );
    }
    return (
      <div
        key="header"
        className="md-divider-border md-divider-border--bottom grid-row"
      >
        {...cols}
      </div>);
  }

  private buildGrid(rows: number, cols: number) {
    const r: {}[] = [
      this.colHeaders()
    ];

    for (let i = 0; i < rows; ++i) {
      const c: {}[] = [];
      for (let j = 0; j < cols; ++j) {
        c.push(
          <div
            key={'' + i + j}
            className="md-divider-border md-divider-border--right grid-cell"
          >
            &nbsp;
          </div>
        );
      }
      r.push(
        <div
          key={'row' + i}
          className="md-divider-border md-divider-border--bottom grid-row"
        >
          {...c}
        </div>);
    }
    return r;
  }
}