const express = require('express');
const { getStockData } = require('../services/stockData');
const router = express.Router();

// Ruta para obtener datos de la acción con un parámetro de rango de tiempo
router.get('/api/stock/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const range = req.query.range || '1d'; // Si no se especifica, por defecto '1d'

  try {
    const data = await getStockData(symbol, range);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los datos de la acción' });
  }
});

module.exports = router;
