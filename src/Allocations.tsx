import * as React from 'react';
import './Allocations.css';

import { getRoomTypesList } from './FakeReservations';
import DateColumnHeaders from './DateColumnHeaders';

const now = new Date('2017-10-25'); // new Date();
const today = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

const RowHeaders = (props: { roomTypesList: string[] }) => {
  const rows: {}[] = [];
  const roomTypes: string[] = ['', ...props.roomTypesList];

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

export default class Allocations extends React.Component<{ isMobile: boolean, hotelSiteCode: string }, { roomTypesList: string[] }> {
  constructor(props: any) {
    super(props);
    this.state = { roomTypesList: [] };
  }
  componentWillMount() {
    getRoomTypesList(this.props.hotelSiteCode).then((rl: string[]) => this.setState({ roomTypesList: rl }));
  }

  render() {
    const rows = this.buildGridRows(this.state.roomTypesList.length, 40);

    return (
      <div className="grid-container">
        <RowHeaders roomTypesList={this.state.roomTypesList} />
        <div>
          <DateColumnHeaders start={today} days={40} />
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
            999
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