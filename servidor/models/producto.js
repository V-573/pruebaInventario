// servidor/models/Producto.js

const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  producto: { type: String, required: true },
  codigo: { type: String, unique: true, required: true },
  cantidad: { type: Number, default: 0 },
  precio: { type: Number, default: 0 }
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto; // Exportamos el modelo


