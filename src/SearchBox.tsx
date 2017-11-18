import * as React from 'react';

import {
  Button,
  Toolbar,
  DialogContainer,
  TextField
} from 'react-md';

const ToolbarAutocomplete = (props: { placeholder: string }) => {
  return (
    <TextField
      id="search-box"
      {...props}
      block={true}
      style={{ alignSelf: 'center' }}
      inputStyle={{ fontSize: '16px' }}
    />);

};

// TODO: consider using a drawer instead of this or Portal & Overlay
export class MobileSearchDialog extends React.Component<{ id: string, area: any, visible: boolean, back: any },
  { search: string }> {

  constructor(props: any) {
    super(props);
    this.state = { search: '' };
  }
  startSearching() {
    // ..
  }
  // TODO: only show clear when has text

  clear() {
    this.setState({ search: '' });
  }

  handleChange(value: string) {
    this.setState({ search: value });
    // tslint:disable-next-line:no-console
    console.log('Change', value);
  }

  handleKeyDown(e: any) {
    if (e.key === 'Enter') {
      e.preventDefault();
      // tslint:disable-next-line:no-console
      console.log('Enter', e);
      // this.search(this.state.search);
    }
  }

  search(value: string) {

    // tslint:disable-next-line:no-console
    console.log('Search', value);
  }

  render() {
    let searching = this.state.search !== '';
    const icon = 'arrow_back';
    const actions = searching ? (<Button icon={true} onClick={e => this.clear()}>clear</Button>) : <div />;
    return (
      <div>
        <DialogContainer
          id={this.props.id}
          visible={this.props.visible}
          fullPage={true}
          aria-labelledby={`${this.props.id}-title`}
        >
          <Toolbar
            style={{ margin: '8px' }}
            fixed={true}
            title={<ToolbarAutocomplete placeholder={`Search ${this.props.area}`} />}
            titleId={`${this.props.id}-title`}
            actions={actions}
            nav={<Button icon={true} onClick={e => this.props.back()}>{icon}</Button>}
            className="md-background--card md-text"
            value={(v: string) => this.search(v)}
            onFocus={() => this.startSearching()}
            onChange={(v: string) => this.handleChange(v)}
            onKeyDown={() => this.handleKeyDown}
          />
          <section className="md-toolbar-relative md-text">
            {this.props.children}
            <div>test!!!</div><div>test!!!</div>
          </section>
        </DialogContainer>
      </div>
    );
  }
}

export default class SearchBox extends React.Component<{ data: any, mobile: boolean }, { open: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { open: false };
  }

  render() {
    return (
      <div>
        {!this.state.open ? <Button key="search" icon={true} onClick={() => this.setState({ open: true })}>search</Button> : null}
        <MobileSearchDialog
          id="sss"
          area="xxx"
          visible={this.state.open}
          back={(e: any) => this.setState({ open: false })}
        >
          Hi
        </MobileSearchDialog>
      </div>
    );
  }
}
