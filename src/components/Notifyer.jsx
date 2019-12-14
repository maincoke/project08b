import React, { useState } from 'react';
import { Row, Toast, ToastBody } from 'react-bootstrap';

class Notifyer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  showNotice: true,
                    typeMsgInfo: this.props.msgtype,
                    msgInfo: this.props.message,
                    duration: this.props.duration,
                  };
  }

  render() {
    return (
      <Row className="fixed-bottom mw-100 justify-content-center mh-2" id="notifyer">
        <Toast autohide delay={this.state.duration} className={"text-center " + this.state.typeMsgInfo}
                show={this.state.showNotice} onClose={() => this.setState({ showNotice: false})}>
          <ToastBody className="text-light h6">{this.state.msgInfo}</ToastBody>
        </Toast>
      </Row>
    );
  }
}

export default Notifyer;