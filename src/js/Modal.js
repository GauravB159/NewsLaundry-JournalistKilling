import React from 'react';

class Modal extends React.Component {
  render() {
    let scroll;
    if (this.props.mode === 'laptop'){
      scroll = "ui modal small content scrolling"
    } else {
      scroll = "ui modal small"
    }
    return(
      <div id="proto-modal" className={scroll}>
        <div id="proto-embed-card">
          <i className="close icon proto-close"></i>
        </div>
      </div>
    )
  }
}

export default Modal;