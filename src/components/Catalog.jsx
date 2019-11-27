import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams, useRouteMatch } from 'react-router-dom';

class Catalog extends React.Component {
  render() {
    return (
      <div className="col-12 offset-3">
        <h1>Catalogo de Productos</h1>
      </div>
    );
  }
}

export default Catalog;