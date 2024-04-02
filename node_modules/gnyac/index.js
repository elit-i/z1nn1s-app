const ccxt = require('ccxt');

// Initialize exchange
const exchange = new ccxt.binance({
  apiKey: 'YOUR_API_KEY',
  secret: 'YOUR_SECRET_KEY',
});

// Set target assets and thresholds
const targetAssets = ['BTC/USDT', 'ETH/USDT', 'LTC/USDT'];
const threshold = 0.05;

// Get current ticker prices and check for significant changes
async function checkPrices() {
  const prices = {};

  for (const asset of targetAssets) {
    const ticker = await exchange.fetchTicker(asset);
    const price = ticker.last;
    prices[asset] = price;
  }

  for (const [asset, price] of Object.entries(prices)) {
    const prevPrice = prices[asset] || 0;
    const diff = Math.abs(price - prevPrice) / prevPrice;

    if (diff > threshold) {
      console.log(`Significant change in ${asset}: ${price} (${diff * 100}%)`);
    }
  }
}

// Run checkPrices function every minute
setInterval(checkPrices, 60000);