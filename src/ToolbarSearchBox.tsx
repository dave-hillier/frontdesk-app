import * as React from 'react';
import { Button, TextField } from 'react-md';

import './ToolbarSearchBox.css';

const ToolbarSearchBox = (props: any) => {
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
        {props.showClear && <Button icon={true} style={{ opacity: 0.8, alignSelf: 'center' }} onClick={props.clear}>cancel</Button>}
      </div>
    </div>);
};

export default ToolbarSearchBox;