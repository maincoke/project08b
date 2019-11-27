import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams, useRouteMatch } from 'react-router-dom';

class Login extends React.Component {
  render() {
    return (
      <div className="col-12 offset-4">
        <h1>Login de Usuario</h1>
      </div>
    );
  }
}

export default Login;