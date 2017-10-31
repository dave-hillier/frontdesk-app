import * as React from 'react';

import {
  Button,
  ExpansionList,
  ExpansionPanel
} from 'react-md';
import { addDays } from './dateHelpers';
import { ReservationData, getReservations } from './Reservations';
const style = {
  maxWidth: 1024
};

const ReservationsCard = (props: { rez: ReservationData }) => (
  /*<Card style={style} className="md-block-centered">
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
  </Card>*/
  <ExpansionPanel
    className="md-block-centered"
    style={style}
    label={`${props.rez.ref} - ${props.rez.firstName} ${props.rez.lastName} - ${new Date(props.rez.arrival).toDateString()} - ${addDays(new Date(), props.rez.nights).toDateString()} (${props.rez.nights} Nights) - Balance £${props.rez.balance}`}
    footer={null}
  >
    <p>Room: {props.rez.room} Rate: {props.rez.rate} Room Type: {props.rez.roomType}<br />
      Adults: 1 Children: 0 Infants: 0<br />
    </p>
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
      <Button raised={true} primary={true}>Reservation</Button>&nbsp;
      <Button raised={true} primary={true}>Check in</Button>&nbsp;
      <Button raised={true} primary={true}>Deallocate</Button>&nbsp;
      <Button raised={true} primary={true}>Room Billing</Button>&nbsp;
    </p>
  </ExpansionPanel>
);

const ReservationsPage = (props: { isMobile: boolean }) => {
  const rez = getReservations();
  rez.sort((a: ReservationData, b: ReservationData) => new Date(a.arrival).getTime() - new Date(b.arrival).getTime());
  rez.splice(100);
  const cards = rez.map(r => <ReservationsCard rez={r} key={r.ref} />);

  return (
    <div>
      <div></div>
      <ExpansionList>
        {...cards}
      </ExpansionList>
    </div>);
};

export default ReservationsPage;