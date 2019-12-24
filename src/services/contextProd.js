import React from "react";

export class selProd {
  constructor() {
    this.propsProd = {
      selprodId: '',
      selprodNm: '',
      selprodPc: 0,
      selprodSt: 0,
      selprodIg: {}
    }
    this.settingSelprod.bind(this);
  }

  settingSelprod(values) {
      this.propsProd.selprodId = values.prodId;
      this.propsProd.selprodNm = values.pname;
      this.propsProd.selprodPc = values.price;
      this.propsProd.selprodSt = values.stock;
      this.propsProd.selprodIg = values.image;
      return this.propsProd;
  }
}

export const ContextProd = React.createContext(new selProd);