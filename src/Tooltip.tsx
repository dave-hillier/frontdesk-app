import * as React from 'react';

// Inject tooltip didnt work...
const Tooltip = (props: { label: React.ReactNode, children: React.ReactNode }) => {
  return (
    <div className="tooltip-container">
      <span className="md-tooltip md-tooltip--top-active">{props.label}</span>
      {props.children}
    </div>
  );
};

export default Tooltip;