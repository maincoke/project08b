import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, Redirect } from 'react-router-dom';
import { Container, Col, Row, Accordion, Card, ListGroup, Image } from 'react-bootstrap';
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
        { this.state.purchases.length !== 0 ?
          (<PurchasesList src={src} srcProd={srcProd} srcImg={srcImg} allprods={allProds} shopcars={this.state.purchases} /> ) :
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
    this.stylecard =  { bgcard: 'secondary', txcard: 'light' };
    this.toggleStyleCard = this.toggleStyleCard.bind(this);
  }

  render() {
    return (
      <Row className="prods-container">
        <Col xs="12">
          <Accordion className="mb-2">
          { this.props.shopcars.map((pitem, pidx) => {
            this.toggleStyleCard();
            return (<PurchasesItem src={this.props.src} srcProd={this.props.srcProd} srcImg={this.props.srcImg} allprods={this.props.allprods} carorder={pitem.order}
                              carprods={pitem.products} ordkey={pidx} key={pidx} bgcard={this.stylecard.bgcard} txcard={this.stylecard.txcard} />)
            })
          }
          </Accordion>
        </Col>
      </Row>
    );
  }

  toggleStyleCard() {
    this.stylecard.bgcard = this.stylecard.bgcard === 'light' ? 'secondary' : 'light';
    this.stylecard.txcard = this.stylecard.txcard === 'secondary' ? 'light' : 'secondary';
  }
}

class PurchasesItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { carTotal: 0 };
  }

  render() {
    const src = this.props.src, srcProd = this.props.srcProd, srcImg = this.props.srcImg, allProds = this.props.allprods; let total = 0;
    const totalCar = this.props.carprods.map((item, idx, arr) => {
      total += item.price * item.quantt;
      if (arr.length === idx + 1) { return total }
    });
    return (
      <Card key={this.props.ordkey} id={this.props.carorder} bg={this.props.bgcard} text={this.props.txcard}>
        <Accordion.Toggle as={Card.Header} eventKey={this.props.ordkey.toString()}>
          <h3 className="h3 float-left mb-0 mt-1">Carrito N° {this.props.ordkey + 1}</h3>
          <h4 className="h4 float-right mb-0 mt-1">Total Carrito: $ {totalCar}</h4>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={this.props.ordkey.toString()}>
          <Card.Body className="p-1 text-dark">
            <ListGroup className="mb-1">
            { srcProd.map((item, idx) =>
                this.props.carprods.map((sitem, sidx) => { if (allProds[idx]._id === sitem.id && srcImg.indexOf(item) >= 0) {
                  return (
                  <ListGroup.Item className="p-2" key={idx}>
                    <Image src={src[srcProd[idx]].default} thumbnail fluid className="mt-1 float-left" style={{ height: "60px", width: "90px" }} />
                    <Row className="mt-2">
                      <Col sm="12" lg="4" className="p-1"><span className="h4 ml-2 text-capitalize">{allProds[idx].name}</span></Col>
                      <Col sm="12" lg="2" className="p-1"><span className="ml-2 mb-0">Precio: $ {sitem.price}</span></Col>
                      <Col sm="12" lg="2" className="p-1"><span className="ml-2 mb-0">Cantidad: {sitem.quantt}</span></Col>
                      <Col sm="12" lg="4" className="p-1"><span className="h5 ml-2 mb-0 float-right">Subtotal: $ {sitem.price * sitem.quantt}</span></Col>
                    </Row>
                  </ListGroup.Item>
                  )}
                })
              )
            }
            </ListGroup>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }
}

export default Purchases;