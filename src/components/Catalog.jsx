import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Request } from '../services/requestdata.js';
import { ShopCar } from '../modeldata/Shopcar.js';
import { ControlSid as controlSid } from '../services/managesid.js';
import { ContextProd, selProd } from '../services/contextProd.js';
import Notifyer from './Notifyer.jsx';
import Topbar from './Topbar.jsx';
import { Products, ViewMoreProd } from './Products.jsx';
import Shopcar from './Shopcar.jsx';
import Purchases from './Purchases.jsx';

class Catalog extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.controlSid = new controlSid;
    this.state = { products: new Array, prodSel: new selProd, shopcar: new ShopCar, scqtt: 0 };
    this.allProds = new Array;
    this.gettingProds_Shopcar = this.gettingProds_Shopcar.bind(this);
    this.importImgs = this.importImgs.bind(this);
    this.bindImgWithSrc = this.bindImgWithSrc.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.gettingProds_Shopcar();
  }

  componentWillUnmount() { this._isMounted = false; }

  render() {
    document.getElementsByTagName("body").item(0).classList = 'bckgr-main';
    const src = this.importImgs(require.context('../assets/', false, /\.(png|jpe?g|svg)$/));
    const srcImg = this.bindImgWithSrc(src);
    const srcProd = this.allProds.map((item, idx) => { return (item.image).substr(10); });
    return this.controlSid.getSid() !== null ? (
      <ContextProd.Provider value={this.state.prodSel}>
      <div>
        <Router>
          <Topbar scqtt={this.state.scqtt} />
          <Switch>
            <Route exact path="/catalogo" sensitive>
              <Products packProds={[ src, srcImg, srcProd, this.state.products ]} shopcar={this.state.shopcar}
                        addprod2shopcar={this.manageProdsFromCar.bind(this)} initprods_shopcar={this.gettingProds_Shopcar.bind(this)} />
            </Route>
            <Route exact path="/catalogo/carrito" sensitive>
              <Shopcar packProds={[ src, srcImg, srcProd, this.state.products ]} shopcar={this.state.shopcar}
                       takeoutProdsFromCar={this.manageProdsFromCar.bind(this)} initprods_shopcar={this.gettingProds_Shopcar.bind(this)} />
            </Route>
            <Route exact path="/catalogo/compras" sensitive>
              <Purchases packProds={[ src, srcImg, srcProd, this.state.products ]} />
            </Route>
            <Route exact path="/catalogo/producto/:id?" sensitive>
              <ViewMoreProd />
            </Route>
            <Route exact path="/salir" sensitive render={this.logout} />
            <Redirect to="/catalogo" />
          </Switch>
        </Router>
        <div id="notify"></div>
      </div>
      </ContextProd.Provider>
    ) :  <Redirect to="/inicio" /> ;
  }

  async gettingProds_Shopcar() {
    const req = new Request, sid = this.controlSid.getSid(); let pdres; let scres;
    try {
      pdres = await req.getProducts(sid);
      if (pdres.body.msgerr) throw error;
      this.allProds = await pdres.body;
      scres = await req.getProdsShopcar(sid);
      if (scres.body.msgerr) throw error;
      this._isMounted && this.setState({ products: pdres.body,
                                         shopcar: { order: scres.body.order, paidod: scres.body.paidod, products: scres.body.shopcarProds },
                                         scqtt: scres.body.shopcarProds.length });
    } catch {
      if (pdres.error || pdres.serverError || pdres.body.msgerr || scres.body.msgerr) {
        let errmsg = pdres.body.msgerr !== undefined || scres.body.msgerr !== undefined ? pdres.body.msgerr !== undefined ?
            pdres.body.msgerr : scres.body.msgerr : "Error en el servidor de datos!!";
        ReactDOM.render(<Notifyer message={errmsg} msgtype={'bg-danger'} duration={1000} />, document.getElementById("notify"));
        setTimeout(() => {
          ReactDOM.unmountComponentAtNode(document.getElementById("notify"));
          this.controlSid.clearSid();
          history.go("/inicio"); }, 1000);
      }
    }
  }

  manageProdsFromCar(addordel = null) {
    let qtt = addordel !== null ? addordel ? this.state.scqtt + 1 : this.state.scqtt - 1 : 0;
    this.setState({ scqtt: qtt});
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

  logout(routeProps) {
    if (this.controlSid.getSid() !== null) {
      const req = new Request, sid = this.controlSid.getSid();
      this.controlSid.clearSid();
      req.logoutUser(sid).then(res => {
        if (res.error) throw res.error;
        routeProps.history.go('/inicio');
      }).catch(error => { if (error) console.error(error); });
    }
  }
}

export default Catalog;