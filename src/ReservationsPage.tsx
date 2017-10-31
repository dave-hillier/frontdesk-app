import * as React from 'react';

import {
  Card,
  CardActions,
  CardText,
  Button
} from 'react-md';

const style = { maxWidth: 1024 };
import { ReservationData, getReservations } from './Reservations';

const ReservationsCard = (props: { rez: ReservationData }) => (
  <Card style={style} className="md-block-centered">
    <CardActions expander={true}>
      <CardText>
        {props.rez.firstName} {props.rez.lastName} {props.rez.ledger ? ' - ' + props.rez.ledger : ''} -&nbsp;
        {new Date(props.rez.arrival).toDateString()} - {new Date().toDateString()} ({props.rez.nights} Nights)<br />
        Room: {props.rez.room} Rate: {props.rez.rate} Room Type: {props.rez.roomType}<br />
        Adults: 1 Children: 0 Infants: 0 - Balance £{props.rez.balance}<br />
      </CardText>
    </CardActions>

    <CardText expandable={true}>
      <p>
        Contact Information:
      </p>
      <p>
        Line1<br />
        Line2<br />
        Line3<br />
        Line4<br />
        Line5<br />
      </p>
      <p>
        <Button raised={true} primary={true}>Check in</Button>&nbsp;
        <Button raised={true} primary={true}>Deallocate</Button>&nbsp;
        <Button raised={true} primary={true}>Room Billing</Button>&nbsp;
      </p>
    </CardText>
  </Card>
);

const ReservationsPage = (props: { isMobile: boolean }) => {
  const rez = getReservations();
  rez.sort((a: ReservationData, b: ReservationData) => new Date(a.arrival).getTime() - new Date(b.arrival).getTime());
  rez.splice(100);
  const cards = rez.map(r => <ReservationsCard rez={r} key={r.ref} />);

  return (
    <div>
      <div>Filters?</div>
      {...cards}
    </div>);
};

export default ReservationsPage;