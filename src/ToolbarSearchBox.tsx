import * as React from 'react';
import { Button, TextField } from 'react-md';

import './ToolbarSearchBox.css';
import { TextFieldProps } from 'react-md/lib/TextFields/TextField';

export interface ToolbarSearchBoxProps {
  showClear: boolean;
  clear: () => void;
}

const SearchTextEntry = ({ showClear, clear, ...props }: ToolbarSearchBoxProps & TextFieldProps) => {
  return (
    <div className="toolbar-search-box-container">
      <div className="toolbar-search-box-inner" >
        <Button icon={true} style={{ opacity: 0.8, alignSelf: 'center' }}>search</Button>
        <TextField
          id="search-box"
          {...props}
          block={true}
          style={{ alignSelf: 'center' }}
          inputStyle={{ fontSize: '16px' }}
        />
        {showClear && <Button icon={true} style={{ opacity: 0.8, alignSelf: 'center' }} onClick={clear}>cancel</Button>}
      </div>
    </div>);
};

export class SearchBoxToolbar extends React.Component<
  { location: any, onChange?: (filter: string) => void, searchTitle: string },
  { filter: string }> {
  constructor(props: any) {
    super(props);
    this.state = {
      filter: ''
    };
  }

  render() {
    return (
      <SearchTextEntry
        placeholder={this.props.searchTitle}
        onChange={(value: string, e: any) => {
          this.setState({ filter: value });
          if (this.props.onChange) {
            this.props.onChange(value);
          }
        }}
        showClear={this.state.filter.length > 0}
        value={this.state.filter}
        clear={() => {
          this.setState({ filter: '' });
          if (this.props.onChange) {
            this.props.onChange('');
          }
        }}
      />
    );
  }
}

export default SearchTextEntry;