import * as React from 'react';

import {
  Button,
  ExpansionList,
  ExpansionPanel
} from 'react-md';
import { addDays } from './dateHelpers';
import { ReservationData, getReservations } from './FakeReservations';
const style = {
  maxWidth: 1024
};

const ReservationLabel = (props: { rez: ReservationData }) => {
  return (
    <div>{props.rez.ref} - {props.rez.firstName} {props.rez.lastName} -
      {new Date(props.rez.arrival).toDateString()} - {addDays(new Date(), props.rez.nights).toDateString()} ({props.rez.nights} Nights)<br />
      Room: {props.rez.room} Rate: {props.rez.rate} Room Type: {props.rez.roomType} -
      Balance £{props.rez.balance}
    </div>
  );
};

const ReservationsPanel = (props: { rez: ReservationData }) => (
  <ExpansionPanel
    className="md-block-centered"
    style={style}
    label={<ReservationLabel rez={props.rez} />}
    footer={null}
  >
    <p>
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

class ReservationsPage extends React.Component<{ isMobile: boolean }, { reservations: ReservationData[] }> {

  constructor(props: any) {
    super(props);
    this.state = { reservations: [] };
  }

  componentWillMount() {
    getReservations('').then(rez => {
      rez.sort((a: ReservationData, b: ReservationData) => new Date(a.arrival).getTime() - new Date(b.arrival).getTime());
      rez.splice(100);
      this.setState({ reservations: rez });
    });
  }

  render() {
    const cards = this.state.reservations.map(r => <ReservationsPanel rez={r} key={r.ref} />);
    return (
      <div>
        <ExpansionList>
          {...cards}
        </ExpansionList>
      </div >);
  }
}

export default ReservationsPage;