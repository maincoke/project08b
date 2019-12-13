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
}