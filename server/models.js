/**
 * Configuración y exportación del Esquema de Datos para BD de MongoDB
 *
 * Importacion de paquetes instalados para configurar los esquemas de datos de Nivel 1, 2 y 3
 */
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const dataSchema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

/* Esquema de Datos de los Productos del Catálogo de la tienda Online - Nivel 1 */
let ProductSchema = new dataSchema({
  image: { type: String, require: true, alias: 'pdimg' },
  name: { type: String, require: true, alias: 'pdnme' },
  price: { type: Number, require: true, alias: 'pdpce' },
  stock: { type: Number, alias: 'pdstk' },
});
/**
 * ** ///////////// ** ////////////// ** ///////////// ** ////////////// ** ///////////// ** /////////////*/
/* Esquema de Datos de los Productos del Carrito de Usuario - Tienda Online - Nivel 3 */
let ShopCarProdsSchema = new dataSchema({
  id: { type: objectId, alias: 'scpid' },
  price: { type: Number, alias: 'scpce' },
  quantt: { type: Number, alias: 'scstk' }
}, { id: false, _id: false });

/* Esquema de Datos del Carrito de Usuario - Tienda Online - Nivel 2 */
let ShopCarSchema = new dataSchema({
  order: { type: String, require: true, alias: 'scodr'},
  paidod: { type: Boolean, require: true, alias: 'scpdo' },
  products: [ShopCarProdsSchema]
}, { id: false, _id: false });

/* Esquema de Datos del Usuario - Tienda Online - Nivel 1 */
let UserSchema = new dataSchema({
  nameuser: { type: String, require: true, alias: 'usnme' },
  emailusr: { type: String, lowercase: true, trim: true, require: true, alias: 'useml' },
  pwordusr: { type: String, require: true, alias: 'uspwd' },
  shopcar: [ShopCarSchema]
});

let UserData = mongoose.model('Usuario', UserSchema);
let ProductData = mongoose.model('Producto', ProductSchema);

module.exports = { User: UserData, Product: ProductData };
