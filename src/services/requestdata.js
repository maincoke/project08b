/**
 *  ** Servicio de Solicitudes de Datos ** HTTP-Request - Superagent **
 */
import * as Req from 'superagent';

export class Request {
  constructor() {
    this.urlData = 'http://' + window.location.hostname + ':3000/shopping';
    this.loginCheck = this.loginCheck.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.signupUser = this.signupUser.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getProdsShopcar = this.getProdsShopcar.bind(this);
    this.getPurchases = this.getPurchases.bind(this);
    this.addProdShopcar = this.addProdShopcar.bind(this);
    this.updProdShopcar = this.updProdShopcar.bind(this);
    this.delProdShopcar = this.delProdShopcar.bind(this);
    this.buyACar = this.buyACar.bind(this);
  }

  loginCheck(credsUser) {
    const userCreds = JSON.stringify(credsUser);
    return Req.post(this.urlData + '/login').type('application/json').responseType('json').send(userCreds);
  }

  logoutUser(userSid) {
    const sid = JSON.stringify({ sid: userSid });
    return Req.post(this.urlData + '/logout').type('application/json').responseType('json').send(sid);
  }

  signupUser(dataUser) { // Ejecuta la solicitud de Registro del Usuario en la Tienda Online./
    const userData = JSON.stringify(dataUser);
    return Req.post(this.urlData + '/newuser').type('application/json').responseType('json').send(userData);
  }

  getProducts(userSid) {
    const sid = JSON.stringify({ sid: userSid });
    return Req.post(this.urlData + '/catalog').type('application/json').responseType('json').send(sid);
  }

  getProdsShopcar(userSid) {
    const sid = JSON.stringify({ sid: userSid });
    return Req.post(this.urlData + '/shopcar').type('application/json').responseType('json').send(sid);
  }

  addProdShopcar(userSid, ordCar, newProd, newStk) {
    const prodData = JSON.stringify({ sid: userSid, order: ordCar, prod: newProd, newstk: newStk });
    return Req.post(this.urlData + '/newprod').type('application/json').responseType('json').send(prodData);
  }

  updProdShopcar(userSid, ordCar, idxProd, idProd, newPrc, newQtt, newStk) {
    const prodData = JSON.stringify({ sid: userSid, order: ordCar, idx: idxProd, price: newPrc, quantt: newQtt, newstk: newStk });
    return Req.post(this.urlData + '/updateprod/' + idProd).type('application/json').responseType('json').send(prodData);
  }

  delProdShopcar(userSid, ordCar, idProd, newStk) {
    const prodData = JSON.stringify({ sid: userSid, order: ordCar, newstk: newStk });
    return Req.post(this.urlData + '/deleteprod/' + idProd).type('application/json').responseType('json').send(prodData);
  }

  getPurchases(userSid) {
    const sid = JSON.stringify({ sid: userSid });
    return Req.post(this.urlData + '/shopping').type('application/json').responseType('json').send(sid);
  }

  buyACar(userSid, ordCar) {
    const sid = JSON.stringify({ sid: userSid });
    return Req.post(this.urlData + '/purchase/' + ordCar).type('application/json').responseType('json').send(sid);
  }
}