const ccxt = require('ccxt');

// Initialize the exchange
const exchange = new ccxt.binance({
  apiKey: 'YOUR_API_KEY',
  secret: 'YOUR_SECRET_KEY',
});

// Set trading parameters
const symbol = 'BTC/USDT';
const amount = 0.001;
const stopLoss = 0.95;
const takeProfit = 1.05;

// Check current price and place orders
async function trade() {
  const ticker = await exchange.fetchTicker(symbol);
  const currentPrice = ticker.last;
  const stopLossPrice = currentPrice * stopLoss;
  const takeProfitPrice = currentPrice * takeProfit;

  // Place stop loss order
  await exchange.createLimitSellOrder(symbol, amount, stopLossPrice);
  console.log(`Stop loss order placed at ${stopLossPrice}`);

  // Place take profit order
  await exchange.createLimitSellOrder(symbol, amount, takeProfitPrice);
  console.log(`Take profit order placed at ${takeProfitPrice}`);
}

// Run trade function every minute
setInterval(trade, 60000);
