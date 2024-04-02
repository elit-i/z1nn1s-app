const binance = require('binance-api-node').default;

// Set up Binance API connection
const binanceApi = binance({
  apiKey: 'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET',
  useServerTime: true,
  test: false, // Set to true for testnet
});

// Set up trading parameters
const tradingPair = 'BTCUSDT';
const orderQuantity = 0.001; // Order quantity in BTC
const stopLossPercentage = 10; // Stop loss percentage
const takeProfitPercentage = 20; // Take profit percentage

// Check current market price and place orders
async function trade() {
  const marketPrice = await binanceApi.prices(tradingPair);
  const currentPrice = parseFloat(marketPrice[tradingPair]);

  // Calculate stop loss and take profit prices
  const stopLossPrice = currentPrice * (1 - stopLossPercentage / 100);
  const takeProfitPrice = currentPrice * (1 + takeProfitPercentage / 100);

  // Place orders
  const orderResponse = await binanceApi.order({
    symbol: tradingPair,
    side: 'BUY',
    type: 'LIMIT',
    timeInForce: 'GTC',
    quantity: orderQuantity,
    price: currentPrice,
    stopPrice: stopLossPrice,
    icebergQty: 0,
    newClientOrderId: '',
    recvWindow: 5000,
  });

  console.log(`Order placed: ${orderResponse}`);

  // Place take profit order
  const takeProfitOrderResponse = await binanceApi.order({
    symbol: tradingPair,
    side: 'SELL',
    type: 'LIMIT',
    timeInForce: 'GTC',
    quantity: orderQuantity,
    price: takeProfitPrice,
    stopPrice: 0,
    icebergQty: 0,
    newClientOrderId: '',
    recvWindow: 5000,
  });

  console.log(`Take profit order placed: ${takeProfitOrderResponse}`);
}

// Place orders every minute
setInterval(trade, 60000);
