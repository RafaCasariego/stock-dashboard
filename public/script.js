const stockForm = document.getElementById('stock-form');
const gridContainer = document.getElementById('grid-container');
const stockDetails = document.getElementById('stock-details'); // Detalles de la acción
const emailForm = document.getElementById('email-form'); // Formulario de alerta por email
const emailInput = document.getElementById('email'); // Input del correo
const ctx = document.getElementById('stock-chart').getContext('2d'); // Gráfico

let chartInstance = null; // Para guardar la instancia del gráfico

// Lista de acciones relevantes (por ejemplo, las 20 primeras del S&P 500)
const relevantStocks = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'GOOGL', name: 'Google' },
    { symbol: 'AMZN', name: 'Amazon' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'NVDA', name: 'Nvidia' },
    { symbol: 'AMD', name: 'Advanced Micro Devices Inc' },
    { symbol: 'META', name: 'Meta Platforms' },
    { symbol: 'NFLX', name: 'Netflix' },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF' },
    { symbol: 'BA', name: 'Boeing' },
    { symbol: 'DIS', name: 'Walt Disney' },
    { symbol: 'V', name: 'Visa' },
    { symbol: 'PYPL', name: 'PayPal' },
    { symbol: 'INTC', name: 'Intel' }
];

// Generar las tarjetas de acciones relevantes
relevantStocks.forEach(stock => {
  const stockCard = document.createElement('div');
  stockCard.classList.add('stock-card');
  stockCard.dataset.symbol = stock.symbol;
  stockCard.innerHTML = `
    <h3>${stock.name}</h3>
    <p>Símbolo: ${stock.symbol}</p>
    <p>Precio: Cargando...</p>
  `;
  gridContainer.appendChild(stockCard);

  // Agregar el evento de clic para mostrar detalles
  stockCard.addEventListener('click', () => {
    loadStockData(stock.symbol);
  });
});

// Función para manejar el envío del formulario de búsqueda
stockForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evitar el envío por defecto del formulario
  const symbol = document.getElementById('symbol').value; // Obtener el símbolo de la acción
  await loadStockData(symbol);
});

// Función para cargar los datos de la acción
async function loadStockData(symbol) {
  // Limpiar los detalles anteriores
  stockDetails.style.display = 'none';

  try {
    // Realizar la solicitud para obtener los datos de la acción
    const response = await fetch(`/api/stock/${symbol}?range=1mo`); // Solicitamos el último mes
    const data = await response.json();

    // Verificar si la respuesta contiene datos válidos
    if (data["Time Series (Daily)"]) {
      const timeSeries = data["Time Series (Daily)"];
      const dates = Object.keys(timeSeries).slice(0, 30); // Últimos 30 días
      const closePrices = dates.map(date => timeSeries[date]["4. close"]);

      // Actualizar las tarjetas con el precio más reciente
      const stockCards = document.querySelectorAll('.stock-card');
      stockCards.forEach(card => {
        if (card.dataset.symbol === symbol) {
          card.querySelector('p').textContent = `Precio: $${closePrices[0]}`;
        }
      });

      // Mostrar los resultados de la acción
      stockDetails.style.display = 'block';
      stockDetails.querySelector('#stock-name').textContent = `Nombre: ${symbol}`;
      stockDetails.querySelector('#stock-price').textContent = `Precio: $${closePrices[0]}`;
      stockDetails.querySelector('#stock-date').textContent = `Última actualización: ${dates[0]}`;

      // Crear el gráfico con los datos
      if (chartInstance) {
        chartInstance.destroy(); // Eliminar el gráfico anterior
      }

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates.reverse(),
          datasets: [{
            label: 'Precio de Cierre',
            data: closePrices.reverse(),
            borderColor: 'rgb(75, 192, 192)',
            fill: false,
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: 'Fecha' }},
            y: { title: { display: true, text: 'Precio en USD' }}
          }
        }
      });

      // Asegurarse de que la tarjeta se expanda para mostrar los detalles
      const stockCard = document.querySelector(`.stock-card[data-symbol="${symbol}"]`);
      stockCard.classList.add('expanded'); // Añadir una clase para hacerla más grande
    } else {
      alert(`No se encontraron datos para ${symbol}`);
    }
  } catch (error) {
    alert('Error al obtener los datos.');
  }
}

// Función para manejar el formulario de alerta por email
emailForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = emailInput.value;
  if (!email) {
    alert('Por favor, ingresa un correo electrónico.');
    return;
  }
  // Aquí se agregaría la lógica para enviar el correo (por ejemplo, con una API de backend)
  alert(`Alerta configurada para el correo: ${email}`);
  emailInput.value = ''; // Limpiar el campo
});
