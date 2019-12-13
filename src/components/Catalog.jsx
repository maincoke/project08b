import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams, useRouteMatch } from 'react-router-dom';
import { Request } from '../services/requestdata.js';
import { ControlSid as controlSid } from '../services/managesid.js';


class Catalog extends React.Component {
  constructor(props) {
    super(props);
    this.controlSid = new controlSid;
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    document.getElementsByTagName("body").item(0).classList = 'bckgr-main';
  }

  render() {
    return this.controlSid.getSid() !== null ? (
      <div>
      <div className="col-12 offset-3 text-info">
        <h1>Catalogo de Productos</h1>
      </div>
      <div className="fixed-bottom">
        <Router>
          <Link to="/salir">Salir</Link>
          <Switch>
            <Route path="/salir" sensitive render={this.logout} />
          </Switch>
        </Router>
      </div>
      </div>
    ) :  <Redirect to="/inicio" /> ;
  }

  logout(routeProps) {
    if (this.controlSid.getSid() !== null) {
      const req = new Request, sid = this.controlSid.getSid();
      this.controlSid.clearSid();
      req.logoutUser(sid).then(res => {
        if (res.error) throw res.error;
        routeProps.history.go('/inicio');
      }).catch(error => { if (error) console.error(error); });
    }
  }

}

export default Catalog;