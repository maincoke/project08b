import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, Redirect } from 'react-router-dom';
import { Container, Col, Row, ListGroup } from 'react-bootstrap';
import { Request } from '../services/requestdata.js';


class Purchases extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() { }

  render() {
    return (
      <Container>
        <div className="col-12 offset-3 text-danger">
          <h1>Compras Realizadas</h1>
        </div>
      </Container>
    );
  }

}

export default Purchases;