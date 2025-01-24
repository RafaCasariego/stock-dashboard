require('dotenv').config();

const apiKey = process.env.API_KEY;
const baseUrl = 'https://www.alphavantage.co/query';

document.getElementById('search-btn').addEventListener('click', async () => {
  const symbol = document.getElementById('stock-symbol').value.toUpperCase();
  if (!symbol) {
    alert('Please enter a stock symbol');
    return;
  }

  const url = `${baseUrl}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data['Error Message']) {
      alert('Invalid stock symbol. Please try again.');
    } else {
      displayStockInfo(data);
    }
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
});

function displayStockInfo(data) {
    const stockInfo = document.getElementById('stock-info');
    const timeSeries = data['Time Series (Daily)'];
    const lastRefreshed = data['Meta Data']['3. Last Refreshed'];
    
    // Extraer datos del último día
    const lastData = timeSeries[lastRefreshed];
    const currentPrice = lastData['4. close'];
    const openPrice = lastData['1. open'];
  
    stockInfo.innerHTML = `
      <h2 class="text-2xl font-semibold">Ticker: ${data['Meta Data']['2. Symbol']}</h2>
      <p><strong>Precio Actual:</strong> $${currentPrice}</p>
      <p><strong>Precio de Apertura:</strong> $${openPrice}</p>
      <p><strong>Última Actualización:</strong> ${lastRefreshed}</p>
    `;
  
    // Preparar datos para el gráfico
    const labels = [];
    const prices = [];
    for (let date in timeSeries) {
      labels.push(date); // Fechas
      prices.push(timeSeries[date]['4. close']); // Precio de cierre
    }
  
    // Invertir el orden para mostrar del más antiguo al más reciente
    labels.reverse();
    prices.reverse();
  
    renderChart(labels, prices); // Crear el gráfico
}


let chartInstance = null; // Variable global para la instancia del gráfico

function renderChart(labels, prices) {
    const ctx = document.getElementById('stock-chart').getContext('2d');

    // Destruir el gráfico anterior si existe
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Crear el nuevo gráfico
    chartInstance = new Chart(ctx, {
        type: 'line', // Tipo de gráfico
        data: {
        labels: labels, // Fechas en el eje X
        datasets: [{
            label: 'Precio al Cierre',
            data: prices, // Precios en el eje Y
            borderColor: 'rgba(75, 192, 192, 1)', // Color de la línea
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fondo bajo la línea
            borderWidth: 2,
        }]
        },
        options: {
        responsive: true,
        scales: {
            x: {
            title: {
                display: true,
                text: 'Date',
            }
            },
            y: {
            title: {
                display: true,
                text: 'Price (USD)',
            }
            }
        }
        }
    });
}
