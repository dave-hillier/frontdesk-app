import * as React from 'react';
import './Allocations.css';

import { addDays } from './util';
import { WeekDayColumnHeader } from './WeekDayColumnHeader';

const DateColumnHeaders = (props: { start: Date, days: number }): JSX.Element => {
  const cols: {}[] = [];

  for (let i = 0; i < props.days; ++i) {
    cols.push(
      <WeekDayColumnHeader key={i} date={addDays(props.start, i)} />
    );
  }
  return (
    <div className="md-divider-border md-divider-border--bottom grid-row">
      {...cols}
    </div>);
};

export default DateColumnHeaders;