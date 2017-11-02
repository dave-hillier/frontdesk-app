import * as React from 'react';

const today = new Date('2017-10-25');
today.setHours(0, 0, 0, 0);

function formatDateRange(arrival: Date, departure?: Date) {
  const arrivalShort = arrival ? arrival.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  }) : '';

  const departureShort = departure ? (' - ' + departure.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  })) : '';

  return arrivalShort + departureShort;
}

export const ArrivalTopLine = (props: { name: string, time?: Date }) => DepartureTopLine({ name: props.name, time: props.time, label: 'ETA' });

export const DepartureTopLine = (props: { name: string, time?: Date, label?: string }): JSX.Element => {
  const label = props.label ? props.label : 'ETD';
  const estimated = props.time ? label + ': ' + props.time.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  return (
    <div className="space-between-content">
      <div>{props.name}</div>
      <div className="md-text--secondary">{estimated}</div>
    </div>)
    ;
};

export const ResidentsTopLine = (props: { name: string, arrival: Date, departure: Date }): JSX.Element => {
  return (
    <div className="space-between-content">
      <div>{props.name}</div>
      <div className="md-text--secondary">{formatDateRange(props.arrival, props.departure)}</div>
    </div>)
    ;
};

// TODO: tooltips for icons
export const People = (props: { adults: number, children: number, infants: number }): JSX.Element => {
  return (
    <div className="align-items-center">
      <i className="material-icons medium-icon">person</i>&nbsp;{props.adults}&nbsp;&nbsp;
      <i className="material-icons medium-icon">child_care</i>&nbsp;{props.children}&nbsp;&nbsp;
      <i className="material-icons medium-icon">child_friendly</i>&nbsp;{props.infants}
    </div>
  );
};

export const MiddleLine = (props: { roomName: string, roomType: string, nights?: number }): JSX.Element => {
  const nights = props.nights ? `${props.nights} nights` : '';

  return (
    <div className="space-between-content">
      <div>{props.roomType} {props.roomName}</div>
      <div className="md-text--secondary">{nights}</div>
    </div>);
};

export const BottomLine = (props: { balance: number, adults: number, children: number, infants: number }): JSX.Element => {
  return (
    <div className="space-between-content">
      <People {...props} />
      <div>{props.balance.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</div>
    </div>);
};
