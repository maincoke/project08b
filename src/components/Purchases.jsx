import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, Redirect } from 'react-router-dom';
import { Container, Col, Row, Accordion, Card } from 'react-bootstrap';
import { Request } from '../services/requestdata.js';
import { ControlSid as controlSid } from '../services/managesid.js';
import Notifyer from './Notifyer.jsx';


class Purchases extends React.Component {
  constructor(props) {
    super(props);
    this.controlSid = new controlSid;
    this._isMounted = false;
    this.state = { purchases: new Array }
    this.gettingPurchases = this.gettingPurchases.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.gettingPurchases(this.controlSid.getSid());
  }

  componentWillUnmount() { this._isMounted = false  }

  render() {
    const src = this.props.packProds[0]; const srcImg = this.props.packProds[1]; const srcProd = this.props.packProds[2]; const allProds = this.props.packProds[3];
    return this.controlSid.getSid() !== null ? (
      <Container className="rounded-lg mt-4 bg-light">
        <Row>
          <Col xs="12">
            <h2 className="h2 text-dark mt-4">Compras Realizadas</h2>
          </Col>
        </Row>
        <hr></hr>
        { this.state.purchases.shopCars.length !== 0 ?
          (<PurchasesList src={src} srcProd={srcProd} srcImg={srcImg} allprods={allProds} shopcars={this.state.purchases.shopCars} /> ) :
          (<Row>
            <Col xs="12" sm="12" md={{span: 7, offset: 3}} lg={{span: 6, offset: 3}} className="w-100">
              <h3 className="h3">Sin compras de Carrito realizadas..!!</h3>
            </Col>
          </Row>)
        }
      </Container>
    ) : <Redirect to="/inicio" />;
  }

  async gettingPurchases(sid) {
    const req = new Request; let res;
    try {
      res = await req.getPurchases(sid);
      if (res.body.msgerr) throw error;
      this._isMounted && this.setState({ purchases: res.body.shopCars });
    } catch {
      if (res.error || res.serverError || res.body.msgerr) {
        let errmsg = res.body.msgerr !== undefined ? res.body.msgerr : "Error en el servidor de datos!!";
        ReactDOM.render(<Notifyer message={errmsg} msgtype={'bg-danger'} duration={1000} />, document.getElementById("notify"));
        setTimeout(() => {
          ReactDOM.unmountComponentAtNode(document.getElementById("notify"));
          this.controlSid.clearSid();
          history.go("/inicio"); }, 1000);
      }
    }
  }
}

class PurchasesList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row className="prods-container">
        <Col xs="12">
          <Accordion className="mb-2">
          { this.props.srcProd.map((item, idx) => 
              this.props.shocars.map((sitem, sidx) => (
                // Incluir las props para cada item de carrito comprado ***************************************************************
              <PurchasesItem src={this.props.src[this.props.srcProd[idx]].default} name={allProds[idx].name} idprod={sitem.id} prc={sitem.price}
                             qtt={sitem.quantt} cartotal={totalCar} ordkey={sidx}  key={idx} />)
            )
          )}
          </Accordion>
        </Col>
      </Row>
    );
  }
}

class PurchasesItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card key={this.props.ordkey} id={this.props.order}>

      </Card>
    );
  }
}

export default Purchases;

/*
            { srcProd.map((item, idx) =>
              this.state.purchases.map((sitem, sidx) => { if (allProds[idx]._id === sitem.id && srcImg.indexOf(item) >= 0) {
                totalCar += (sitem.price * sitem.quantt);
                return (
                  <PurchasesItem src={src[srcProd[idx]].default} name={allProds[idx].name} idprod={sitem.id} prc={sitem.price}
                               qtt={sitem.quantt} cartotal={totalCar} prodkey={sidx}  key={idx} />)
                }
              })
            )}

*/