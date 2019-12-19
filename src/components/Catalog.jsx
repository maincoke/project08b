import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Request } from '../services/requestdata.js';
import { ControlSid as controlSid } from '../services/managesid.js';
import Topbar from './Topbar.jsx';
import { Products, ViewMoreProd } from './Products.jsx';
import Shopcar from './Shopcar.jsx';
import Purchases from './Purchases.jsx';


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
        <Router>
          <Topbar url={location.pathname} />
          <Switch>
            <Route exact path={location.pathname} sensitive><Redirect exact to={location.pathname + "/productos"} /></Route>
            <Route exact path={location.pathname + "/productos"} sensitive><Products url={location.pathname} /></Route>
            <Route exact path={location.pathname + "/producto/aguacate"} sensitive><ViewMoreProd /></Route>
            <Route exact path={location.pathname + "/carrito"} sensitive><Shopcar /></Route>
            <Route exact path={location.pathname + "/compras"} sensitive><Purchases /></Route>
            <Route exact path="/salir" sensitive render={this.logout} />
            <Redirect exact from={location.pathname + "/*"} to={location.pathname + "/productos"} />
            <Redirect exact from={location.pathname + "/producto/*"} to={location.pathname + "/productos"} />
          </Switch>
        </Router>
        <div id="notify"></div>
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
        this.render();
      }).catch(error => { if (error) console.error(error); });
    }
  }

}

export default Catalog;