// servidor/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. Crear la app
const app = express();
app.use(cors());
app.use(express.json());

// 2. Conectar a MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventarioDB';
mongoose.connect(mongoURI)
  .then(() => console.log('Conectado a MongoDB...'))
  .catch(err => console.error('No se pudo conectar a MongoDB:', err));

// --- 3. Usar las rutas de la API ---
// Le decimos a Express que cualquier petición que empiece con '/api/productos'
// debe ser manejada por nuestro archivo de rutas.
const productosRouter = require('./routes/productos');
app.use('/api/productos', productosRouter);


// 4. Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});