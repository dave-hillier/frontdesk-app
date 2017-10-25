import * as React from 'react';

import {
  Button,
  Autocomplete,
  FontIcon
} from 'react-md';

export default class SearchBox extends React.Component<{ data: any }, { open: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { open: false };
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
            data={this.props.data}
            filter={Autocomplete.caseInsensitiveFilter}
          />
          <Button key="close" icon={true} onClick={() => this.setState({ open: false })}>close</Button>
        </div>
      );
  }
}
