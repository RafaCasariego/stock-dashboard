require('dotenv').config();
const express = require('express');
const path = require('path');
const stockRoutes = require('./routes/stockRoutes');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para procesar JSON y servir archivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rutas
app.use('/api/stock', stockRoutes); // Rutas para acciones
app.use('/api/send-email', emailRoutes); // Rutas para emails

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
