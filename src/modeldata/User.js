// Clase Global de un Usuario de la Tienda Online */
import { Creds } from './Creds.js';
import { Shopcar } from './Shopcar.js';

export class User {
  constructor() {
    this.namesusr = new String;
    this.credsusr = new Creds;
    this.shopcar = new Shopcar;
  }
}