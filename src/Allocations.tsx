import * as React from 'react';
import './Allocations.css';

import { roomTypesList } from './Reservations';
import DateColumnHeaders from './DateColumnHeaders';

const now = new Date('2017-10-25'); // new Date();
const today = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

const RowHeaders = () => {
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
  return <div className="grid-row-headers">{...rows}</div>;
};

export default class Allocations extends React.Component {
  render() {
    const rows = this.buildGridRows(roomTypesList.length, 40);

    return (
      <div className="grid-container">
        <RowHeaders />
        <div>
          <DateColumnHeaders start={today} days={40} key={'headers'} />
          {...rows}
        </div>
      </div>
    );
  }

  private buildGridRows(rows: number, cols: number) {
    const r: {}[] = [];

    for (let i = 0; i < rows; ++i) {
      const c: {}[] = [];
      for (let j = 0; j < cols; ++j) {
        c.push(
          <div
            key={'' + i + j}
            className="md-divider-border md-divider-border--right grid-cell"
          >
            99
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