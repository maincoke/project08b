import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, Redirect } from 'react-router-dom';
import { Container, Col, Row, Card, InputGroup, FormControl, Button } from 'react-bootstrap';
import { Request } from '../services/requestdata.js';
import { ControlSid as controlSid } from '../services/managesid.js';
import Notifyer from './Notifyer.jsx';

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.controlSid = new controlSid;
    this.state = { allproducts: new Array };
    this.gettingProds = this.gettingProds.bind(this);
    this.importImgs = this.importImgs.bind(this);
    this.bindImgWithSrc = this.bindImgWithSrc.bind(this);
  }

  componentDidMount() {
    const req = new Request, sid = this.controlSid.getSid();
    req.getProducts(sid).then(res => {
      if (res.error || res.body.msgerr) {
        if (res.body.msgerr) {
          ReactDOM.render(<Notifyer message={res.body.msgerr} msgtype={'bg-danger'} duration={1500} />,
          document.getElementById("notify"));
          setTimeout(() => {
            ReactDOM.unmountComponentAtNode(document.getElementById("notify"));
            this.controlSid.clearSid();
            history.go("/inicio");
          }, 1500);
        }
        throw res.error;
      }
      this.setState({ allproducts: res.body });
      this.render();
    }).catch(error => {
      console.error(error);
    });
  }

  render() {
    const src = this.importImgs(require.context('../assets/', false, /\.(png|jpe?g|svg)$/));
    console.log(src['aguacate.jpg'].default);
    const srcImg = this.bindImgWithSrc(src);
    const srcProd = this.state.allproducts.map((item, idx, arr) => { return (item.image).substr(10); })
    return (
      <Container className="rounded-lg mt-4 bg-light mh-75">
        <Row>
          <Col xs="12" sm="12" md="6" lg="8" xl="8">
            <h2 className="h2 text-dark mt-4">Catalogo de Productos</h2>
          </Col>
          <Col xs="12" sm="12" md="6" lg="4" xl="4">
            <label htmlFor="filterSearch" className="h5 mt-4 text-dark">¿Que estas buscando?</label>
            <InputGroup>
              <FormControl id="filterSearch" placeholder="Buscar producto" aria-describedby="prodSearch" />
              <InputGroup.Append>
                <InputGroup.Text><i className="material-icons text-secondary">search</i></InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
        <hr></hr>
        <Row>
            { 
              srcProd.map((item, idx) => {
                console.log(srcProd[idx]);
                if (srcImg.indexOf(item) >= 0) {
                  return (
                    <CardProd src={src[srcProd[idx]].default} name={this.state.allproducts[idx].name} idprod={this.state.allproducts[idx]._id}
                              prc={this.state.allproducts[idx].price} stk={this.state.allproducts[idx].stock} key={idx} url={this.props.url} />
                  )
                }
              })
            }
        </Row>
      </Container>
    );
  }
  // srcProd[idx].toString()
  gettingProds() {
    const req = new Request, sid = this.controlSid.getSid();
    req.getProducts(sid).then(res => {
      if (res.error || res.body.msgerr) {
        if (res.body.msgerr) {
          ReactDOM.render(<Notifyer message={res.body.msgerr} msgtype={'bg-danger'} duration={1500} />,
          document.getElementById("notify"));
          setTimeout(() => {
            ReactDOM.unmountComponentAtNode(document.getElementById("notify"));
            this.controlSid.clearSid();
            history.go("/inicio");
          }, 1500);
        }
        throw res.error;
      }
      this.setState({ allproducts: res.body });
    }).catch(error => {
      console.error(error);
    });
  }

  importImgs(rsrc) {
    let imgs = {};
    rsrc.keys().map((item, idx) => { imgs[item.replace('./','')] = rsrc(item); });
    return imgs;
  }

  bindImgWithSrc(objsrc) {
    let imgSrc = [];
    for (let key in objsrc) {
      if (objsrc.hasOwnProperty(key)) {
        imgSrc.push(key);
      }      
    }
    return imgSrc;
  }
}

class CardProd extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Col xs="12" sm="12" md="6" lg="4" xl="3" className="m-0 p-0">
        <Card className="m-1 p-0" id={this.props.key}>
          <Card.Img src={this.props.src} alt="aguacate" className="p-2 img-prod" />
          <Card.Title className="m-0 mb-2 mt-2"><h4 className="h4 pl-3 m-0 text-capitalize">{this.props.name }</h4></Card.Title>
          <Card.Body className="p-1">
            <Row className="m-0 p-0">
              <Col xs="6"><label htmlFor="cant-aguacate">Precio: $ {this.props.prc}</label></Col>
              <Col xs="6"><label htmlFor="prec-aguacate">Cantidad: {this.props.stk}</label></Col>
            </Row>
          </Card.Body>
          <Card.Footer className="p-2">
            <FormControl className="float-right ml-1 p-1 text-center qtt-width" as="input" type="number"
                          min="1" max="30" defaultValue="1" id="qtt-" />
            <Button className="float-right" variant="warning" onClick={() => alert("Agregado el producto..!!")}>Agregar</Button>
            <Link to={this.props.url + "/producto/aguacate"}><Button className="float-left" variant="primary">Ver más</Button></Link>
          </Card.Footer>
        </Card>
      </Col>
    );
  }
}

class ViewMoreProd extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Container className="rounded-lg mt-4 bg-light mh-100">
        <Row>
          <Col xs="12">
            <h2 className="h2 text-dark mt-4">Detalle del Producto</h2>
          </Col>
        </Row>
        <hr></hr>
        <Row>
          <Col xs="12" sm="12" md="8" lg="8" xl="8">
          </Col>
          <Col xs="12" sm="12" md="4" lg="4" xl="4">
          </Col>
        </Row>
      </Container>
    );
  }
}

export { Products, ViewMoreProd };