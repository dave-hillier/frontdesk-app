import * as React from 'react';
import { Button, TextField } from 'react-md';
import './ToolbarSearchBox.css';

const ToolbarSearchBox = (props: { placeholder: string }) => {
  return (
    <div className="toolbar-search-box-container">
      <div className="toolbar-search-box-inner" >
        <Button icon={true} style={{ opacity: 0.8, alignSelf: 'center' }}>search</Button>
        <TextField
          id="search-box"
          placeholder={props.placeholder}
          block={true}
          style={{ alignSelf: 'center' }}
          inputStyle={{ fontSize: '16px' }}
        />
        <Button icon={true} style={{ opacity: 0.8, alignSelf: 'center' }}>cancel</Button>
      </div>
    </div>);
};

export default ToolbarSearchBox;