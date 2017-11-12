import * as React from 'react';

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const DateHeader = (props: { date: Date }) => {
  const dayOfWeek = props.date.getDay();
  const dayOfMonth = props.date.getDate();
  return (
    <div className="grid-col-header md-divider-border md-divider-border--right grid-col">
      <div className="md-font-light grid-header-day-of-week">{days[dayOfWeek]}</div>
      <div className="md-font-bold grid-header-day-of-month">{dayOfMonth}</div>
    </div>
  );
};
