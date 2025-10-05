// servidor/routes/productos.js

const express = require('express');
const router = express.Router(); // Usamos el Router de Express
const Producto = require('../models/Producto'); // Importaremos el modelo más adelante

// --- DEFINICIÓN DE LAS RUTAS DE LA API ---

// GET: Obtener todos los productos del inventario
// Ruta: GET /api/productos
router.get('/', async (req, res) => {
  try {
    const inventario = await Producto.find(); // Busca todos los documentos en la colección
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el inventario' });
  }
});

// POST: Agregar un nuevo producto
// Ruta: POST /api/productos
router.post('/', async (req, res) => {
  try {
    const productoExistente = await Producto.findOne({ codigo: req.body.codigo });
    if (productoExistente) {
      return res.status(400).json({ mensaje: 'El código del producto ya existe' });
    }

    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.status(201).json({ mensaje: 'Producto agregado correctamente', producto: nuevoProducto });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al agregar el producto', error: error.message });
  }
});

// PUT: Actualizar un producto existente (por su código)
// Ruta: PUT /api/productos/tv001
router.put('/:codigo', async (req, res) => {
  try {
    const { cantidad, precio } = req.body; // Solo permitimos actualizar cantidad y precio
    const productoActualizado = await Producto.findOneAndUpdate(
      { codigo: req.params.codigo }, // Busca el producto por el código en la URL
      { cantidad, precio }, // Los datos a actualizar
      { new: true } // Devuelve el documento actualizado
    );

    if (!productoActualizado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto actualizado', producto: productoActualizado });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el producto', error: error.message });
  }
});

// DELETE: Eliminar un producto (por su código)
// Ruta: DELETE /api/productos/tv001
router.delete('/:codigo', async (req, res) => {
  try {
    const resultado = await Producto.findOneAndDelete({ codigo: req.params.codigo });

    if (!resultado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el producto' });
  }
});


module.exports = router; // Exportamos el router para usarlo en server.js