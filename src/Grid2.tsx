import * as React from 'react';
import './Grid2.css';

export default class Grid2 extends React.Component {
  render() {
    const c = {
      display: 'flex',
      flexFlow: 'row wrap'
    };
    const s0 = {
      background: 'blue',
      width: '40px',
      height: '40px'
    };
    const s1 = {
      background: 'yellow',
      height: '40px'
    };
    const s2 = {
      background: 'red',
      width: '40px'
    };
    const s3 = {
      background: 'green'
    };
    return (
      <div style={c}>
        <div style={s0}>
          Corner
        </div>
        <div style={s1}>
          RowHeader
        </div>
        <div style={s2}>
          ColHeader
        </div>
        <div style={s3}>
          Body
         </div>
      </div>
    );
  }
}