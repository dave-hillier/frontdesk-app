import * as React from 'react';
import './Availability.css';

import { getRoomTypes, getAllocations } from './FakeReservations';
import DateColumnHeaders from './DateColumnHeaders';
import { addDays } from './dateHelpers';

const today = new Date();
today.setHours(0, 0, 0, 0);
const days = 40;

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

export default class Availability extends React.Component<{ isMobile: boolean, hotelSiteCode: string },
  { roomTypesList: string[], allocations: any }> {
  constructor(props: any) {
    super(props);
    this.state = { roomTypesList: [], allocations: {} };
  }
  componentWillMount() {
    getRoomTypes(this.props.hotelSiteCode).
      then((rl: string[]) => this.setState({ roomTypesList: rl }));

    getAllocations(this.props.hotelSiteCode, today, addDays(today, days)).
      then((allocations) => this.setState({ allocations }));
  }

  render() {
    if (Object.keys(this.state.allocations).length === 0) {
      return <div />;
    }
    const rows = this.buildGridRows(this.state.roomTypesList.length, days);

    return (
      <div className="grid-container">
        <RowHeaders roomTypesList={this.state.roomTypesList} />
        <div>
          <DateColumnHeaders start={today} days={days} />
          {...rows}
        </div>
      </div>
    );
  }

  private buildGridRows(rows: number, cols: number) {
    const r: {}[] = [];

    // TODO: subtract from total
    for (let i = 0; i < rows; ++i) {
      const type = this.state.roomTypesList[i];
      const c: {}[] = [];
      for (let j = 0; j < cols; ++j) {
        c.push(
          <div key={'' + i + j} className="md-divider-border md-divider-border--right grid-cell">
            {this.state.allocations[type][j]}
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