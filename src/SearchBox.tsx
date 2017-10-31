import * as React from 'react';

import {
  Button,
  Autocomplete,
  FontIcon
} from 'react-md';

export default class SearchBox extends React.Component<{ data: any, mobile: boolean }, { open: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { open: true };
  }
  render() {
    return !this.state.open ?
      <Button key="search" icon={true} onClick={() => this.setState({ open: true })}>search</Button> :
      (
        <div className="toolbar-actions">
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
        </div>
      );
  }
}
