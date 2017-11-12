import * as React from 'react';

import {
  Button,
  Autocomplete,
  FontIcon,
  Toolbar,
  DialogContainer
} from 'react-md';

const ToolbarAutocomplete = (props: { placeholder: string }) => {
  return (
    <Autocomplete
      id="toolbar-search"
      data={[]}
      block={true}
      dataLabel="label"
      dataValue="value"
      listClassName="toolbar-search__list"
      className="md-background--card md-text"
      {...props}
    />);
};

export class MobileSearchDialog extends React.Component<{ id: string, area: any }> {

  render() {
    return (
      <div>
        <DialogContainer
          id={this.props.id}
          visible={true}
          fullPage={true}
          aria-labelledby={`${this.props.id}-title`}
        >
          <Toolbar
            style={{ margin: '8px' }}
            fixed={true}
            title={<ToolbarAutocomplete placeholder={`Search ${this.props.area}`} />}
            titleId={`${this.props.id}-title`}
            actions={<Button icon={true}>cancel</Button>}
            nav={<Button icon={true}>arrow_back</Button>}
            className="md-background--card md-text"
          />
          <section className="md-toolbar-relative">
            {this.props.children}
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
        <div className={'toolbar-actions search-box ' + (!this.state.open ? 'hide' : 'show')}>
          <FontIcon>search</FontIcon>
          <Autocomplete
            id="my-search"
            label="Search Reservations"
            placeholder="Reference, Name, etc"
            className="toolbar-search"
            data={this.props.data}
            filter={Autocomplete.caseInsensitiveFilter}
            sameWidth={false}
            simplifiedMenu={false}
            minBottom={20}
            fillViewportWidth={this.props.mobile}
            fillViewportHeight={this.props.mobile}
          />
          <Button key="close" icon={true} onClick={() => this.setState({ open: false })}>close</Button>
          <MobileSearchDialog id="sss" area="xxx" />
        </div></div>
    );
  }
}
