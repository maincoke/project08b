/**
 *  ** Servicio de Gestión de Sesión **
 */
export class ControlSid {
  constructor() {
    this.userSid = new String;
    this.getSid = this.getSid.bind(this);
    this.buildSid = this.buildSid.bind(this);
    this.clearSid = this.clearSid.bind(this);
  }

  getSid() {
    this.userSid = sessionStorage.getItem('cellarsid') !== null && sessionStorage.getItem('cellarsid') !== undefined ?
                    sessionStorage.getItem('cellarsid') : null;
    return this.userSid;
  }

  buildSid(sid) { sessionStorage.setItem('cellarsid', sid); }

  clearSid() { sessionStorage.removeItem('cellarsid'); }
}