import * as React from 'react';
import {
  Button,
  DialogContainer,
  Toolbar,

} from 'react-md';

class StandardDialog extends React.Component<{ title: any, isMobile?: boolean, isDesktop?: boolean }, { pageX?: number, pageY?: number, visible: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { visible: false };
  }

  show = (e: any) => {
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
    const width = this.props.isDesktop ? 1024 : (!this.props.isMobile ? 800 : undefined); // min tablet 768
    const height = this.props.isDesktop ? 768 : (!this.props.isMobile ? 600 : undefined);
    return (
      <div>
        <DialogContainer
          id="simple-full-page-dialog"
          visible={visible}
          pageX={pageX}
          pageY={pageY}
          fullPage={this.props.isMobile}
          onHide={this.hide}
          width={width}
          height={height}
          aria-labelledby="simple-full-page-dialog-title"
        >
          <Toolbar
            fixed={true}
            colored={true}
            title={this.props.title}
            titleId="simple-full-page-dialog-title"
            nav={<Button icon={true} onClick={this.hide}>close</Button>}
            actions={<Button flat={true} onClick={this.hide}>Save</Button>}
          />
          <section className="md-toolbar-relative">
            {this.props.children}
          </section>
        </DialogContainer>
      </div>
    );
  }
}

export class ReservationDialog extends React.Component<{ isMobile?: boolean, isDesktop?: boolean }, { reservation: any }> {
  private dialog: StandardDialog | null;

  constructor(props: any) {
    super(props);
    this.state = { reservation: null };
  }

  render() {
    const r = this.state.reservation;
    const wide = { width: 100 };
    const rows: JSX.Element[] = [];
    for (let key in r) {
      if (r.hasOwnProperty(key)) {
        rows.push(
          <div key={key} className="grid-row">
            <div style={wide} className="grid-cell grid-row-header">{key}</div>
            <div className="grid-cell">{(typeof r[key] === 'function') ? r[key]() : r[key]}</div>
          </div>);
      }
    }

    return (
      <StandardDialog
        title="Reservation"
        {...this.props}
        ref={self => this.dialog = self}
      >
        {rows}
      </StandardDialog>);
  }

  show(e: any, r: any) {
    if (this.dialog) {
      this.dialog.show(e);
      this.setState({ reservation: r });
    }
  }
}