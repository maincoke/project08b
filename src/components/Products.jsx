import React from 'react';
import memoizeone from 'memoize-one';
import ReactDOM from 'react-dom';
import { Link, Redirect } from 'react-router-dom';
import { Container, Col, Row, Card, InputGroup, FormControl, FormControlProps, Button } from 'react-bootstrap';
import { ContextProd } from '../services/contextProd.js';
import { Request } from '../services/requestdata.js';
import { ControlSid as controlSid } from '../services/managesid.js';
import Notifyer from './Notifyer.jsx';

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.controlSid = new controlSid;
    this.state = { filteredprods: '' };
    this.prodsFilter = memoizeone((prodsName, filterText) => prodsName.filter(item => item.includes(filterText)));
  }

  render() {
    const src = this.props.packProds[0], srcImg = this.props.packProds[1], srcProd = this.props.packProds[2], allProds = this.props.packProds[3];
    const filteredProds = this.prodsFilter(this.props.packProds[3].map((item) => item.name), this.state.filteredprods);
    return (
      <Container className="rounded-lg mt-4 bg-light">
        <Row>
          <Col xs="12" sm="12" md="6" lg="8" xl="8">
            <h2 className="h2 text-dark mt-4">Catalogo de Productos</h2>
          </Col>
          <Col xs="12" sm="12" md="6" lg="4" xl="4">
            <label htmlFor="filterSearch" className="h5 mt-4 text-dark">¿Que estas buscando?</label>
            <InputGroup>
              <FormControl id="filterSearch" placeholder="Buscar producto" aria-describedby="prodSearch"
                           value={this.state.filteredprods} onChange={this.filterProducts.bind(this)} />
              <InputGroup.Append>
                <InputGroup.Text><i className="material-icons text-secondary">search</i></InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
        <hr></hr>
        <Row className="prods-container">
          { srcProd.map((item, idx) =>
              filteredProds.map((fitem) => {
                if (allProds[idx].name === fitem && srcImg.indexOf(item) >= 0) {
                  return (<CardProd src={src[srcProd[idx]].default} name={allProds[idx].name} idprod={allProds[idx]._id} prc={allProds[idx].price}
                                    stk={allProds[idx].stock} carorder={this.props.shopcar.order} prodkey={idx} key={idx} initpdsc={this.props.initprods_shopcar}
                                    addingprod={this.props.addprod2shopcar} chkaddprod={this.checkAddingProd.bind(this)} />)
                }
              })
            ) }
        </Row>
      </Container>
    );
  }

  filterProducts(evt) {
    evt.preventDefault();
    this.setState({ filteredprods: evt.target.value });
  }

  checkAddingProd(prodId) {
    const prodIdx = this.props.shopcar.products.findIndex((prod) => prod.id === prodId) !== undefined ?
                    this.props.shopcar.products.findIndex((prod) => prod.id === prodId) : -1;
    const qttpd = this.props.shopcar.products[prodIdx] !== undefined ? this.props.shopcar.products[prodIdx].quantt : 0;
    return { idxprod: prodIdx, qttprod: qttpd };
  }
}

class CardProd extends React.Component {
  constructor(props) {
    super(props);
    this.controlSid = new controlSid;
    this.state = { prodId: this.props.idprod, pname: this.props.name, price: this.props.prc, stock: this.props.stk, image: this.props.src, qtt: 1 };
  }

  render() {
    return (
      <Col xs="12" sm="6" md="6" lg="4" xl="3" className="m-0 p-0" key={this.props.prodkey}>
        <Card className="m-1 p-0" id={this.state.prodId}>
          <div className="imgprod-container">
            <Card.Img src={this.state.image} alt="aguacate" className="p-2 img-fluid mw-100 h-100" />
          </div>
          <Card.Title className="m-0 mb-2 mt-2"><h4 className="h4 pl-3 m-0 text-capitalize">{this.state.pname}</h4></Card.Title>
          <Card.Body className="p-1">
            <Row className="m-0 p-0">
              <Col xs="12"><p className="mb-1">Precio: $ {this.state.price}</p></Col>
              <Col xs="12"><p className="mb-0">Unidades disponibles: {this.state.stock}</p></Col>
            </Row>
          </Card.Body>
          <Card.Footer className="p-2">
            <FormControl className="float-right ml-1 p-1 text-center qtt-width" as="input" type="number" min="1" max="30" value={this.state.qtt}
                          id={`qtt-${this.state.pname}`} onChange={(evt) => this.setState({ qtt: evt.target.value })} />
            <Button className="float-right" variant="warning" onClick={this.addProd2Car.bind(this)}>Agregar</Button>
            <ContextProd.Consumer>
            {selProd => (
              <Link to={"/catalogo/producto/" + this.state.prodId}>
                <Button className="float-left" variant="primary" onClick={() => selProd.settingSelprod(this.state)}>Ver más</Button>
              </Link>
            )}
            </ContextProd.Consumer>
          </Card.Footer>
        </Card>
      </Col>
    );
  }

  async addProd2Car() {
    const pdqtt = parseInt(this.state.qtt);
    const newstk = this.state.stock - pdqtt;
    this.setState({ qtt: 1, stock: newstk });
    const req = new Request, sid = this.controlSid.getSid(); let res;
    const prodChk = this.props.chkaddprod(this.state.prodId);
    const newprod = { id: this.state.prodId, price: this.state.price, quantt: pdqtt };
    try {
      if (prodChk.idxprod === -1) {
        res = await req.addProdShopcar(sid, this.props.carorder, newprod , newstk);
        if (res.body.msgerr || res.error) throw error;
        this.props.addingprod(true);
      } else {
        const newqtt = pdqtt + prodChk.qttprod;
        res = await req.updProdShopcar(sid, this.props.carorder, prodChk.idxprod, this.state.prodId, this.state.price, newqtt, newstk);
        if (res.body.msgerr) throw error;
      }
      this.props.initpdsc();
      ReactDOM.render(<Notifyer message={res.body.msgscs} msgtype={'bg-success'} duration={1000} />, document.getElementById("notify"));
      setTimeout(() => { ReactDOM.unmountComponentAtNode(document.getElementById("notify"));}, 1000);
    } catch {
      if (res.error || res.serverError || res.body.msgerr) {
        let errmsg = res.body.msgerr !== undefined ? res.body.msgerr : "Error en el servidor de datos!!";
        ReactDOM.render(<Notifyer message={errmsg} msgtype={'bg-danger'} duration={1000} />, document.getElementById("notify"));
        setTimeout(() => { ReactDOM.unmountComponentAtNode(document.getElementById("notify"));
          this.controlSid.clearSid();
          history.go("/inicio"); }, 1000);
      }
    }
  }
}

class ViewMoreProd extends React.Component {
  render() {
    return (
      <ContextProd.Consumer>{selProd => (
        <Container className="rounded-lg mt-4 bg-light mh-100">
          <Row>
            <Col xs="12">
              <h2 className="h2 text-dark mt-3 ml-1 mb-1 font-weight-bolder text-capitalize">{selProd.propsProd.selprodNm}</h2>
            </Col>
          </Row>
          <hr></hr>
          <Row id={selProd.propsProd.selprodId}>
            <Col xs="12" sm="12" md="8" lg="8" xl="8">
              <img src={selProd.propsProd.selprodIg} className="img-fluid w-100 img-thumbnail" />
            </Col>
            <Col xs="12" sm="12" md="4" lg="4" xl="4" className="border-right">
                <p className="text-dark mb-1 h3">Precio: $ {selProd.propsProd.selprodPc}</p>
                <p className="text-dark mb-1 h5">Unidades disponibles: {selProd.propsProd.selprodSt}</p>
            </Col>
            <Button className="float-left mt-2 ml-3 mb-2" variant="outline-secondary" size="sm" onClick={() => history.go(-1) }>
              <i className="material-icons pt-1 pb-1 font-weight-bolder float-left">arrow_back</i>
              <p className="ml-1 mb-0 pt-1 h5 float-left">Atras</p>
            </Button>
          </Row>
        </Container>
        )}
      </ContextProd.Consumer>
    );
  }
}

export { Products, ViewMoreProd };