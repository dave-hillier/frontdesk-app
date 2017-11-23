import * as React from 'react';

import './DatePicker.css';
import { Divider, Button, FontIcon } from 'react-md';
import { addDays } from './dateHelpers';

const today = new Date();
today.setHours(0, 0, 0, 0);

const dayInitial = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getMonthName(date: Date, locale: string = 'en-gb') {
  return date.toLocaleString(locale, { month: 'long' });
}

const MonthPanel = (props: { date: Date, disableBefore: Date, start: Date, end: Date }) => {
  const { date, disableBefore, start, end } = props;

  const header = dayInitial.map((d, i) => <div className="date-picker-day-of-week" key={++i}>{d}</div>);
  const empty = [];
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  for (let d = 0; d < firstDay; ++d) {
    empty.push(<div key={'e' + d} />);
  }

  const days = [];
  const daysInMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  for (let d = 0; d < daysInMonth; ++d) {
    const day = addDays(date, d);

    const inRange = start <= day && end >= day ? ' in-range' : '';
    const disabled = !inRange && disableBefore > day ? ' disabled' : '';
    const startRange = start.getTime() === day.getTime() ? ' start-range' : '';
    const endRange = end.getTime() === day.getTime() ? ' end-range' : '';
    days.push(
      <div
        key={'dpd' + d.toString()}
        className={'date-picker-day' + disabled + inRange + startRange + endRange}
      >
        {d + 1}
      </div >);
  }

  return (
    <div>
      <div className="date-picker-month">{getMonthName(date)}</div>
      <div className="date-picker-grid">
        {header}
        {empty}
        {days}
      </div>
    </div>);
};

export class DatePicker extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div>
        <div style={{ height: '52px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <FontIcon style={{ marginLeft: '8px' }}>date_range</FontIcon>
          <div>Start</div>
          <div>End</div>

          <Button icon={true}>keyboard_arrow_left</Button>
          <Button icon={true}>keyboard_arrow_right</Button>
          <Button flat={true} disabled={true} primary={true}>Reset</Button>
        </div>
        <Divider />
        <div className="date-picker-calendar">
          <MonthPanel date={new Date(2017, 10, 1)} start={new Date(2017, 10, 22)} end={new Date(2017, 10, 30)} disableBefore={today} />
          <MonthPanel date={new Date(2017, 11, 1)} start={new Date(2017, 10, 22)} end={new Date(2017, 10, 30)} disableBefore={today} />
        </div>
        <Divider />
        <div style={{ height: '52px', alignItems: 'center' }}>
          <Button flat={true} primary={true}>Done</Button>
        </div>
      </div>);
  }
}