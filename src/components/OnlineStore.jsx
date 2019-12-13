import React, { useState } from 'react';
import { hot, setConfig } from 'react-hot-loader';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from 'react-router-dom';
import { Request } from '../services/requestdata.js';
import { ControlSid as controlSid } from '../services/managesid.js';
import Login from './Login.jsx';
import Catalog from './Catalog.jsx';

setConfig({ showReactDomPatchNotification: false });

class OnlineStore extends React.Component {
  constructor(props) {
    super(props);
    this.controlSid = new controlSid;
  }

  render() {
    const isLoggedIn = this.controlSid.getSid() !== null ? true : false;
    return (
      <Router>
          <Switch>
            <Route exact path="/">{isLoggedIn ? <Redirect to="/catalogo"/> : <Redirect to="/inicio"/> }</Route>
            <Route path="/inicio" sensitive ><Login /></Route>
            <Route path="/catalogo" sensitive ><Catalog /></Route>
            <Redirect from="/*" to="/" />
          </Switch>
      </Router>
    );
  }

}

export default hot(module)(OnlineStore);