import React, { useState } from 'react';
import { hot, setConfig } from 'react-hot-loader';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
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
            <Route exact path="/">{isLoggedIn ? <Redirect exact to="/catalogo"/> : <Redirect exact to="/inicio"/> }</Route>
            <Route exact path="/inicio" sensitive ><Login /></Route>
            <Route exact path="/catalogo" sensitive ><Catalog /></Route>
            <Redirect exact from="/*" to="/" />
          </Switch>
      </Router>
    );
  }
}

export default hot(module)(OnlineStore);