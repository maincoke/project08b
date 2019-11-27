import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams, useRouteMatch } from 'react-router-dom';
import Login from './Login.jsx';
import Catalog from './Catalog.jsx';

class OnlineStore extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li><Link to="/inicio">Iniciar Sesión</Link></li>
            <li><Link to="/catalogo">Catalogo</Link></li>
            <li><Link to="/salir">Salir</Link></li>
            <li><Link to="/">Iniciar Raiz</Link></li>
          </ul>
          <Switch>
            <Route path="/inicio" component={ Login } />
            <Route path="/catalogo" component={ Catalog } />
            <Route path="/salir"><Redirect to="/inicio"/></Route>
            <Route exact path="/"><Redirect to="/inicio"/></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default OnlineStore;