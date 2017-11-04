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

export function renderGrid(r: any) {
  if (typeof r === 'string') {
    return r;
  } else if (Array.isArray(r)) {
    const values: any[] = r.map((v: any) => renderGrid(v));
    return <div>{...values}</div>;
  }
  const flexDirection: 'row' = 'row';
  const row = {
    width: '100%', display: 'flex', flexDirection
  };
  const header = {
    width: '150px'
  };
  const rows: JSX.Element[] = [];
  const borders = 'md-divider-border md-divider-border--top md-divider-border--right md-divider-border--bottom md-divider-border--left';
  for (let key in r) {
    if (r.hasOwnProperty(key)) {
      let value = r[key];
      if (typeof r[key] === 'object') {
        value = renderGrid(value);
      }
      const rx = (
        <div key={key} style={row} className={borders}>
          <div style={header}>{key}</div>
          <div>{value}</div>
        </div>);
      rows.push(rx);
    }
  }
  return rows;
}

export class ReservationDialog extends React.Component<{ isMobile?: boolean, isDesktop?: boolean }, { reservation: any }> {
  private dialog: StandardDialog | null;

  constructor(props: any) {
    super(props);
    this.state = { reservation: null };
  }

  render() {
    const r = this.state.reservation;
    return (
      <StandardDialog
        title="Reservation"
        {...this.props}
        ref={self => this.dialog = self}
      >
        {renderGrid(r)}
      </StandardDialog>);
  }

  show(e: any, r: any) {
    if (this.dialog) {
      this.dialog.show(e);
      this.setState({ reservation: r });
    }
  }
}