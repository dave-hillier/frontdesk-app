import * as React from 'react';

import { getReservations } from './FakeReservations';
import { Reservation } from './Model';
import { ResidentItem, ReservationPanel } from './ReservationComponents';
import { SelectItemLayout } from './SelectedItemLayout';
import { ReservationPreviewDialog } from './ReservationPreviewDialog';
import { ReservationsTable } from './ReservationsTable';
import * as Fuse from 'fuse.js';

import './ReservationsPage.css';
import { DialogContainer, Toolbar, Button } from 'react-md';

class PageLayout extends SelectItemLayout<Reservation> { }

class CreateReservationDialog extends React.PureComponent<{}, {
  visible: boolean, pageX?: number, pageY?: number
}> {
  constructor(props: any) {
    super(props);
    this.state = { visible: false };
  }

  show = (e: any) => {
    // provide a pageX/pageY to the dialog when making visible to make the
    // dialog "appear" from that x/y coordinate
    let { pageX, pageY } = e;
    if (e.changedTouches) {
      pageX = e.changedTouches[0].pageX;
      pageY = e.changedTouches[0].pageY;
    }

    this.setState({ visible: true, pageX, pageY });
  }

  hide = () => {
    this.setState({ visible: false });
  }

  render() {
    const { visible, pageX, pageY } = this.state;

    return (
      <div>
        <DialogContainer
          id="create-reservation-dialog"
          visible={visible}
          pageX={pageX}
          pageY={pageY}
          fullPage={true}
          onHide={this.hide}
          aria-labelledby="create-reservation-dialogtitle"
        >
          <Toolbar
            fixed={true}
            colored={true}
            title="Create"
            titleId="create-reservation-dialog-title"
            nav={<Button icon={true} onClick={this.hide}>close</Button>}
          />

        </DialogContainer>
      </div>
    );
  }
}
// TODO: only used for mobile view, get rid of the dependency
export class ReservationsPage extends React.PureComponent<{
  isMobile: boolean,
  hotelSiteCode: string
}>  {
  private dialog: CreateReservationDialog | null;

  render() {
    return (
      <div>
        <CreateReservationDialog ref={el => this.dialog = el} />
        <div className="fab">
          <Button floating={true} secondary={true} primary={true} onClick={(e) => this.dialog && this.dialog.show(e)}>add</Button>
        </div>
        <PageLayout
          {...this.props}
          title="Reservation"
          getItems={getReservations}
          renderItem={(item: Reservation, onClick: (x: any) => void) => <ResidentItem key={item.ref} reservation={item} onClick={onClick} />}
          renderSelectedItem={i => <ReservationPanel reservation={i} />}
          dialogId="reservation-dialog"
          onFabClick={() => {
            // ..
          }}
        />
      </div >);
  }
}

const fuseOptions = {
  shouldSort: true,
  threshold: 0.2,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    'contact.firstName',
    'contact.lastName',
    'ref',
    'ledger.name'
  ]
};

export class ReservationsTablePage extends React.PureComponent<
  {
    isMobile: boolean,
    hotelSiteCode: string,
    filter: string
  },
  {
    reservations: Reservation[],
    isLoading: boolean
  }> {
  private dialog: ReservationPreviewDialog;

  constructor(props: any) {
    super(props);
    this.state = { reservations: [], isLoading: true };
  }

  componentWillMount() {
    getReservations(this.props.hotelSiteCode).then((reservations: Reservation[]) => {
      reservations.sort((a, b) => a.bookingLines[0].arrival.getTime() - b.bookingLines[0].arrival.getTime());
      this.setState({ reservations });
      // Slight delay to remove loading...
      setTimeout(() => this.setState({ isLoading: false }), 100);
    });
  }

  show(event: any, reservation: Reservation) {
    if (this.dialog) {
      this.dialog.show(event, reservation);
    }
  }

  render() {
    if (this.props.isMobile) {
      return <ReservationsPage {...this.props} />;
    }

    const fuse = new Fuse(this.state.reservations, fuseOptions);
    const filtered: Reservation[] = this.props.filter !== '' ? fuse.search(this.props.filter) : this.state.reservations;
    return <ReservationsTable reservations={filtered} />;
  }
}

export default ReservationsTablePage;