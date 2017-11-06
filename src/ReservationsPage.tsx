import * as React from 'react';

import { getReservations } from './FakeReservations';
import { Reservation } from './Model';
import { ResidentItem } from './ReservationComponents';
import { SelectItemLayout } from './SelectedItemLayout';

class PageLayout extends SelectItemLayout<Reservation> { }

export class ReservationsPage extends React.PureComponent<{
  isMobile: boolean,
  hotelSiteCode: string
}> {

  renderItem(item: Reservation, onClick: (x: any) => void): JSX.Element {
    return (
      <ResidentItem key={item.ref} reservation={item} onClick={onClick} />);
  }

  renderSelectedItem(item: Reservation): JSX.Element {
    return <div>{JSON.stringify(item)}</div>;
  }

  render() {
    return (
      <PageLayout
        {...this.props}
        getItems={getReservations}
        renderItem={this.renderItem}
        renderSelectedItem={this.renderSelectedItem}
      />);
  }
}

export default ReservationsPage;