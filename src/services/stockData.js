const axios = require('axios');

// Función para obtener los datos históricos de la acción
async function getStockData(symbol, range = '1d') {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  const endpoint = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

  try {
    const response = await axios.get(endpoint);
    const data = response.data;

    // Filtrar los datos para obtener el último mes (aproximadamente los últimos 30 días)
    if (data["Time Series (Daily)"]) {
      const timeSeries = data["Time Series (Daily)"];
      const dates = Object.keys(timeSeries).slice(0, 30); // Últimos 30 días
      const openPrices = dates.map(date => timeSeries[date]["1. open"]);
      const highPrices = dates.map(date => timeSeries[date]["2. high"]);
      const lowPrices = dates.map(date => timeSeries[date]["3. low"]);
      const closePrices = dates.map(date => timeSeries[date]["4. close"]);

      // Retornar los datos filtrados
      return {
        timeSeries: timeSeries,
        dates: dates,
        openPrices: openPrices,
        highPrices: highPrices,
        lowPrices: lowPrices,
        closePrices: closePrices
      };
    } else {
      throw new Error('No se encontraron datos para la acción');
    }
  } catch (error) {
    console.error('Error obteniendo los datos de la acción:', error);
    throw new Error('Error al obtener los datos de la acción');
  }
}

module.exports = { getStockData };
