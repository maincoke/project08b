import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Request } from '../services/requestdata.js';
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
    this.state = { products: new Array, prodSel: new selProd };
    this.allProds = new Array;
    this.gettingProds = this.gettingProds.bind(this);
    this.importImgs = this.importImgs.bind(this);
    this.bindImgWithSrc = this.bindImgWithSrc.bind(this);
    this.logout = this.logout.bind(this);
  }

  render() {
    document.getElementsByTagName("body").item(0).classList = 'bckgr-main';
    const src = this.importImgs(require.context('../assets/', false, /\.(png|jpe?g|svg)$/));
    const srcImg = this.bindImgWithSrc(src);
    const srcProd = this.allProds.map((item, idx) => { return (item.image).substr(10); });
    return this.controlSid.getSid() !== null ? (
      <ContextProd.Provider value={this.state.prodSel}>
      <div>
        <Router>
          <Topbar />
          <Switch>
            <Route exact path="/catalogo" sensitive><Products packProds={[ src, srcImg, srcProd, this.state.products ]} /></Route>
            <Route exact path="/catalogo/carrito" sensitive><Shopcar packProds={[ src, srcImg, srcProd, this.state.products ]} /></Route>
            <Route exact path="/catalogo/compras" sensitive><Purchases packProds={[ src, srcImg, srcProd, this.state.products ]} /></Route>
            <Route exact path="/catalogo/producto/:id?" sensitive><ViewMoreProd /></Route>
            <Route exact path="/salir" sensitive render={this.logout} />
            <Redirect to="/catalogo" />
          </Switch>
        </Router>
        <div id="notify"></div>
      </div>
      </ContextProd.Provider>
    ) :  <Redirect to="/inicio" /> ;
  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.gettingProds();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async gettingProds() {
    const req = new Request, sid = this.controlSid.getSid(); let res;
    try {
      res = await req.getProducts(sid);
      if (res.body.msgerr) throw error;
      this.allProds = await res.body;
      this._isMounted && this.setState({ products: await res.body });
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