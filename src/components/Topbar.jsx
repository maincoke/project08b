import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from 'react-router-dom';
import { Container, Navbar, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';


class Topbar extends React.Component {
  constructor(props) {
    super(props);
    this.showTooltip = this.showTooltip.bind(this);
  }

  componentDidMount() { }

  render() {
    return (
      <Container className="p-0">
        <Navbar collapseOnSelect expand="sm" bg="light" variant="light" className="rounded-lg">
          <Navbar.Brand><h4 className="mb-0 font-weight-bolder text-secondary" >La Bodega</h4></Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar" />
          <Navbar.Collapse id="responsive-navbar" className="justify-content-end">
            <Nav navbar={true}>
              <OverlayTrigger placement="bottom-end" delay={{ show: 200, hide: 300}} overlay={this.showTooltip(0)}>
                <NavLink className="mt-2 ml-2 mr-2" to="/catalogo">
                  <i className="material-icons text-secondary">apps</i>
                </NavLink>
              </OverlayTrigger>
              <OverlayTrigger placement="bottom-end" delay={{ show: 200, hide: 300}} overlay={this.showTooltip(1)}>
                <NavLink className="mt-2 ml-2 mr-2" to="/catalogo/carrito">
                  <ShopcarLink />
                </NavLink>
              </OverlayTrigger>
              <OverlayTrigger placement="bottom-end" delay={{ show: 200, hide: 300}} overlay={this.showTooltip(2)}>
                <NavLink className="mt-2 ml-2 mr-2" to="/catalogo/compras">
                  <i className="material-icons text-secondary">inbox</i>
                </NavLink>
              </OverlayTrigger>
              <OverlayTrigger placement="bottom-end" delay={{ show: 200, hide: 300}} overlay={this.showTooltip(null)}>
                <NavLink className="mt-2 ml-2 mr-2" to="/salir">
                  <i className="material-icons text-secondary">exit_to_app</i>
                </NavLink>
              </OverlayTrigger>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    );
  }

  showTooltip(item) {
    let tooltipMsg, idTooltip;
    switch (item) {
      case 0: tooltipMsg = "Catalogo de Productos"; idTooltip = "ctprod"; break;
      case 1: tooltipMsg = "Carrito de Compras"; idTooltip = "shpcar"; break;
      case 2: tooltipMsg = "Compras Realizadas"; idTooltip = "prchse"; break;
      default: tooltipMsg = "Salir"; idTooltip = "logout"; break;
    }
    return (<Tooltip id={idTooltip}>{tooltipMsg}</Tooltip>);
  }

}

class ShopcarLink extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <i className="material-icons text-secondary">shopping_cart</i>
    );
  }
}

export default Topbar;