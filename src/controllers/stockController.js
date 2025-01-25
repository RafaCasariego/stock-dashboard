const { fetchStockData } = require('../services/stockData');

const getStockData = async (req, res) => {
  const { symbol } = req.params;

  try {
    const data = await fetchStockData(symbol);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener datos de la acción:', error);
    res.status(500).json({ error: 'Error al obtener los datos de la acción.' });
  }
};

module.exports = { getStockData };
