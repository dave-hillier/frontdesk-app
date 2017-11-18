import * as React from 'react';

import { Reservation } from './Model';
import { StandardDialog } from './StandardDialog';
import { ReservationPanel } from './ReservationComponents';

import './ReservationDialog.css';

// TODO: ideally a dialog props
// TODO: actions allocate/unallocate
export class ReservationPreviewDialog extends React.Component<{ isMobile?: boolean, isDesktop?: boolean }, { reservation?: Reservation }> {
  private dialog: StandardDialog | null;

  constructor(props: any) {
    super(props);
    this.state = { reservation: undefined };
  }

  render() {
    const r: Reservation | undefined = this.state.reservation;
    const title = !this.props.isMobile ? (r ? `${r.ref} - ${r.state}` : '') : (r ? r.ref : '');
    return (
      <StandardDialog
        title={title}
        id="reservation-dialog"
        {...this.props}
        ref={self => this.dialog = self}
      >
        {r && <ReservationPanel reservation={r} />}
      </StandardDialog>);
  }

  show(e: any, r: Reservation) {
    if (this.dialog) {
      this.dialog.show(e);
      this.setState({ reservation: r });
    }
  }
}