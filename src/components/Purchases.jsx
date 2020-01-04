import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, Redirect } from 'react-router-dom';
import { Container, Col, Row, Accordion, AccordionProps, Card, ListGroup, Image } from 'react-bootstrap';
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
        let timeMsg = res.body.out ? 1000 : 1500;
        ReactDOM.render(<Notifyer message={errmsg} msgtype={'bg-danger'} duration={timeMsg} />, document.getElementById("notify"));
        setTimeout(() => {
          ReactDOM.unmountComponentAtNode(document.getElementById("notify"));
          if (res.body.out) {
            this.controlSid.clearSid();
            history.go("/inicio");
          } }, timeMsg);
      }
    }
  }
}

class PurchasesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { actKey: '' };
    this.cardStyles = { dark: { bgcard: 'secondary', txcard: 'light' }, light: { bgcard: 'light', txcard: 'secondary' } }
    this.stylecard =  {};
    //this.toggleStyleCard = this.toggleStyleCard.bind(this);
    this.setActiveKey = this.setActiveKey.bind(this);
  }

  render() {
    return (
      <Row className="prods-container">
        <Col xs="12">
          <Accordion className="mb-2" activeKey={this.state.actKey} onSelect={(evt) => this.setActiveKey(evt)}>
          { this.props.shopcars.map((pitem, pidx) => {
            this.stylecard = pidx % 2 === 0 ? this.cardStyles.light : this.cardStyles.dark;
            return (<PurchasesItem src={this.props.src} srcProd={this.props.srcProd} srcImg={this.props.srcImg} allprods={this.props.allprods} carorder={pitem.order}
                                   carprods={pitem.products} ordkey={pidx} key={pidx} cardstyle={this.stylecard} icontoggle={'keyboard_arrow_right'}
                                   keyactive={this.state.actKey} />)
            })
          }
          </Accordion>
        </Col>
      </Row>
    );
  }

  setActiveKey(evt) { this.setState({ actKey: evt }) }
}

class PurchasesItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { carTotal: 0 };
    this.toggleIcon = this.toggleIcon.bind(this);
  }

  render() {
    const src = this.props.src, srcProd = this.props.srcProd, srcImg = this.props.srcImg, allProds = this.props.allprods; let total = 0;
    const totalCar = this.props.carprods.map((item, idx, arr) => {
      total += item.price * item.quantt;
      if (arr.length === idx + 1) { return total.toFixed(1) }
    });
    return (
      <Card key={this.props.ordkey} id={this.props.carorder} bg={this.props.cardstyle.bgcard} text={this.props.cardstyle.txcard}>
        <Accordion.Toggle as={Card.Header} eventKey={this.props.ordkey.toString()}>
          <span className="float-left"><i className="material-icons h3 mb-0">{this.toggleIcon()}</i></span>
          <h3 className="h3 float-left mb-0 mt-1">Carrito N° {this.props.ordkey + 1}</h3>
          <h4 className="h4 float-right mb-0 mt-1">Total Carrito: $ {totalCar}</h4>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={this.props.ordkey.toString()}>
          <Card.Body className="p-1 text-dark">
            <ListGroup className="mb-1">
            { srcProd.map((item, idx) =>
                this.props.carprods.map((sitem, sidx) => { if (allProds[idx]._id === sitem.id && srcImg.indexOf(item) >= 0) {
                  const prodTotal = (sitem.price * sitem.quantt).toFixed(1);
                  return (
                  <ListGroup.Item className="p-2" key={idx}>
                    <Image src={src[srcProd[idx]].default} thumbnail fluid className="mt-1 float-left" style={{ height: "60px", width: "90px" }} />
                    <Row className="mt-2">
                      <Col sm="12" lg="4" className="p-1"><span className="h4 ml-2 text-capitalize">{allProds[idx].name}</span></Col>
                      <Col sm="12" lg="2" className="p-1"><span className="ml-2 mb-0">Precio: $ {sitem.price}</span></Col>
                      <Col sm="12" lg="2" className="p-1"><span className="ml-2 mb-0">Cantidad: {sitem.quantt}</span></Col>
                      <Col sm="12" lg="4" className="p-1"><span className="h5 ml-2 mb-0 float-right">Subtotal: $ {prodTotal}</span></Col>
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

  toggleIcon() {
    return this.props.keyactive === this.props.ordkey.toString() ? 'keyboard_arrow_down' : 'keyboard_arrow_right'
  }
}

export default Purchases;