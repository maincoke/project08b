// Clase Global del Carrito de Compras de la Tienda Online */
export class Shopcar {
  constructor() {
    this.order = new String;
    this.paidod = false;
    this.products = [{
      id: new String,
      price: 0,
      quantt: 0
    }];
  }

  findProduct(idProd) { // Método: Realiza la busqueda de un producto en el Carrito de Compras./ { id: string, price: number, quantt: number}
    return this.products.findIndex((prod) => prod.id === idProd);
  }

  addProduct(prod) { // Método: Agrega un producto en el Carrito de Compras./ { id: string, price: number, quantt: number }
    return this.products.push(prod);
  }

  delProduct(idxProd) { // Método: Quita un producto del Carrito de Compras./
    return this.products.splice(idxProd, 1);
  }

  updProduct(idxProd, newPrc) {// Método: Actualiza el precio y cantidad de un producto en el Carrito de Compras./
    const newQtt = this.products[idxProd].quantt;
    const priceNew = this.products[idxProd].price !== newPrc ? newPrc : this.products[idxProd].price;
    return { priceNew, newQtt };
  }
}