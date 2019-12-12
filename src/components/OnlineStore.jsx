import React from 'react';
import { hot, setConfig } from 'react-hot-loader';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from 'react-router-dom';
import { useHistory as history } from 'react-router-dom';
import Login from './Login.jsx';
import Catalog from './Catalog.jsx';

setConfig({ showReactDomPatchNotification: false });

class OnlineStore extends React.Component {
  componentDidMount(props) {
    document.getElementsByTagName("body").item(0).classList = 'bckgr-login';
  }

  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/inicio" component={ Login } />
            <Route path="/catalogo" component={ Catalog } />
            <Route path="/salir"><Redirect to="/inicio"/></Route>
            <Route path="/"><Redirect to="/inicio"/></Route>
            <Redirect from="/*" to="/inicio" />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default hot(module)(OnlineStore);