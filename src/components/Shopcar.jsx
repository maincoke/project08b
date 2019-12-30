import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, Redirect } from 'react-router-dom';
import { Container, Col, Row, ListGroup, Image, Button, ButtonGroup } from 'react-bootstrap';
import { Request } from '../services/requestdata.js';
import { ControlSid as controlSid } from '../services/managesid.js';
import Notifyer from './Notifyer.jsx';


class Shopcar extends React.Component {
  constructor(props) {
    super(props);
    this.controlSid = new controlSid;
    this._isMounted = false;
    this.state = { shopcar: new Array }
    this.gettingProdsShopcar = this.gettingProdsShopcar.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.gettingProdsShopcar(this.controlSid.getSid());
  }

  componentWillUnmount() { this._isMounted = false  }

  render() {
    const src = this.props.packProds[0]; const srcImg = this.props.packProds[1]; const srcProd = this.props.packProds[2]; const allProds = this.props.packProds[3];
    let totalCar = 0;
    return this.controlSid.getSid() !== null ? (
      <Container className="rounded-lg mt-4 bg-light">
        <Row>
          <Col xs="12">
            <h2 className="h2 text-dark mt-4">Carrito de Compras</h2>
          </Col>
        </Row>
        <hr></hr>
        { this.state.shopcar.length !== 0 ?
        (<Row className="prods-container">
          <Col xs="12" lg="8">
            <ListGroup className="mb-2">
            { srcProd.map((item, idx) =>
              this.state.shopcar.map((sitem, sidx) => { if (allProds[idx]._id === sitem.id && srcImg.indexOf(item) >= 0) {
                totalCar += (sitem.price * sitem.quantt);
                return (
                  <ShopcarItem src={src[srcProd[idx]].default} name={allProds[idx].name} idprod={sitem.id} prc={sitem.price}
                               qtt={sitem.quantt} prodkey={sidx}  key={idx} />)
                }
              })
            )}
            </ListGroup>
          </Col>
          <Col xs="12" lg="4">
            <Container className="mb-2 mt-2">
              <div className="align-content-start">
                <h3 className="h3 mt-2">Total Carrito: $ {totalCar}</h3>
                <ButtonGroup>
                  <Button variant="outline-secondary" onClick={() => history.go("/catalogo")}>Cancelar</Button>
                  <Button variant="outline-primary">Comprar</Button>
                </ButtonGroup>
              </div>
            </Container>
          </Col>
        </Row>) :
        (<Row>
          <Col xs="12" sm="12" md={{span: 7, offset: 3}} lg={{span: 6, offset: 3}} className="w-100">
            <h3 className="h3">Sin productos en el Carrito..!!</h3>
          </Col>
        </Row>)
        }
      </Container>
    ) : <Redirect to="/inicio" />;
  }

  async gettingProdsShopcar(sid) {
    const req = new Request; let res;
    try {
      res = await req.getProdsShopcar(sid);
      if (res.body.msgerr) throw error;
      this._isMounted && this.setState({ shopcar: res.body.shopcarProds });
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

class ShopcarItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ListGroup.Item key={this.props.prodkey} id={this.props.idprod}>
        <Image src={this.props.src} rounded fluid thumbnail style={{ height: "80px" }} className="m-1 float-left" />
        <div className="float-left">
          <h3 className="h3 m-1 ml-2 text-capitalize">{this.props.name}</h3>
          <p className="ml-2 mb-0">Precio: $ {this.props.prc}</p>
          <p className="ml-2 mb-0">Cantidad: {this.props.qtt}</p>
        </div>
        <div className="float-right">
          <Button variant="outline-danger" size="sm" className="float-right mb-4">Quitar</Button>
          <p className="mr-2 mb-0">Subtotal: {this.props.qtt * this.props.prc}</p>
        </div>
      </ListGroup.Item>
    );
  }
}

export default Shopcar;