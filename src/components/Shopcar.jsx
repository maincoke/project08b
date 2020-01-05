import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import { Container, Col, Row, ListGroup, Image, Button, ButtonGroup, Alert } from 'react-bootstrap';
import { Request } from '../services/requestdata.js';
import { ControlSid as controlSid } from '../services/managesid.js';
import Notifyer from './Notifyer.jsx';

class Shopcar extends React.Component {
  constructor(props) {
    super(props);
    this.controlSid = new controlSid;
    this._isMounted = false;
    this.state = { prodsShopcar: new Array, carorder: '', confirmBuy: false }
    this.styleItemlist = { color: 'secondary' }
    this.gettingProdsShopcar = this.gettingProdsShopcar.bind(this);
    this.toggleStyleList = this.toggleStyleList.bind(this);
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
        { this.state.prodsShopcar.length !== 0 ?
        (<Row className="prods-container">
          <Col xs="12" lg="8">
            <ListGroup className="mb-2">
            { srcProd.map((item, idx) =>
              this.state.prodsShopcar.map((sitem, sidx) => { if (allProds[idx]._id === sitem.id && srcImg.indexOf(item) >= 0) {
                totalCar += (sitem.price * sitem.quantt);
                this.toggleStyleList();
                return (
                  <ShopcarItem src={src[srcProd[idx]].default} name={allProds[idx].name} idprod={sitem.id} prc={sitem.price} qtt={sitem.quantt} prodkey={sidx}
                               color={this.styleItemlist.color} key={idx} takeoutprod={this.takingoutProdFromCar.bind(this)} />)
                }
              })
            )}
            </ListGroup>
          </Col>
          <Col xs="12" lg="4">
            <Container className="mb-2 mt-2">
              <div className="align-content-start">
                <h3 className="h3 mt-2">Total Carrito: $ {(totalCar).toFixed(1)}</h3>
                <ButtonGroup>
                  <Button variant="outline-secondary" onClick={() => history.go("/catalogo")}>Cancelar</Button>
                  <Button variant="outline-primary" onClick={this.buyShopcar.bind(this)} disabled={this.state.confirmBuy}>Comprar</Button>
                </ButtonGroup>
              </div>
              <div className="mt-1">
                <PurchaseShopCar show={this.state.confirmBuy} hide={this.buyShopcar.bind(this)} ordcar={this.state.carorder} refreshCar={this.gettingProdsShopcar}
                                 emptingCar={this.props.takeoutProdsFromCar}/>
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

  toggleStyleList() { this.styleItemlist.color = this.styleItemlist.color === 'light' ? 'secondary' : 'light' }

  async gettingProdsShopcar(sid) {
    const req = new Request; let res;
    try {
      res = await req.getProdsShopcar(sid);
      if (res.body.msgerr || res.error) throw error;
      this._isMounted && this.setState({ prodsShopcar: res.body.shopcarProds, carorder: res.body.order });
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

  async takingoutProdFromCar(elemid, pdqtt) {
    this.setState(prevState => ({ prodsShopcar: prevState.prodsShopcar.filter(pd => pd.id != elemid)}));
    this.props.takeoutProdsFromCar(false);
    const idxProd = this.props.packProds[3].findIndex((item) => item._id === elemid);
    const newstk = this.props.packProds[3][idxProd].stock + pdqtt;
    const req = new Request, sid = this.controlSid.getSid(); let res;
    try {
      console.log(this.state.carorder);
      res = await req.delProdShopcar(sid, this.state.carorder, elemid, newstk);
      if (res.body.msgerr || res.error) throw error;
      ReactDOM.render(<Notifyer message={res.body.msgscs} msgtype={'bg-warning'} duration={1000} />, document.getElementById("notify"));
      setTimeout(() => { ReactDOM.unmountComponentAtNode(document.getElementById("notify"));}, 1000);
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
    this.props.initprods_shopcar();
  }

  buyShopcar() {
    !this.state.confirmBuy ? this.setState({ confirmBuy: true }) : this.setState({ confirmBuy: false });
  }
}

class ShopcarItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ListGroup.Item key={this.props.prodkey} id={this.props.idprod} variant={this.props.color}>
        <Image src={this.props.src} rounded fluid thumbnail style={{ height: "80px", width: "100px" }} className="m-1 float-left" />
        <div className="float-left">
          <h3 className="h3 m-1 ml-2 text-capitalize">{this.props.name}</h3>
          <p className="ml-2 mb-0">Precio: $ {this.props.prc}</p>
          <p className="ml-2 mb-0">Cantidad: {this.props.qtt}</p>
        </div>
        <div className="float-right">
          <Button variant="outline-danger" size="sm" className="float-right mb-4" 
                  onClick={() => this.props.takeoutprod(this.props.idprod, this.props.qtt)}>Quitar</Button>
          <p className="mr-2 mb-0">Subtotal: $ {(this.props.qtt * this.props.prc).toFixed(1)}</p>
        </div>
      </ListGroup.Item>
    );
  }
}

class PurchaseShopCar extends React.Component {
  constructor(props) {
    super(props);
    this.controlSid = new controlSid;
  }

  render() {
    return (
      <Alert show={this.props.show} variant="warning" dismissible onClose={this.props.hide}>
        <Alert.Heading>Confirmar Compra de Productos!!</Alert.Heading>
        <p>Está usted seguro de realizar la compra de los productos de este carriro?</p>
        <hr/>
        <div className="d-flex justify-content-end">
          <Button onClick={this.purchaseCar.bind(this)} variant="outline-dark">Si! Comprar</Button>
        </div>
      </Alert>
    );
  }

  async purchaseCar() {
    this.props.hide();
    const req = new Request, sid = this.controlSid.getSid(); let res;
    try {
      res = await req.buyACar(sid, this.props.ordcar);
      if (res.body.msgerr || res.error) throw error;
      this.props.emptingCar();
      this.props.refreshCar(sid);
      ReactDOM.render(<Notifyer message={res.body.msgscs} msgtype={'bg-success'} duration={1500} />, document.getElementById("notify"));
      setTimeout(() => { ReactDOM.unmountComponentAtNode(document.getElementById("notify"));}, 1500);
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

export default Shopcar;