const ccxt = require('ccxt');

// Initialize exchange
const exchange = new ccxt.binance({
  apiKey: 'YOUR_API_KEY',
  secret: 'YOUR_SECRET_KEY',
});

// Set target asset allocation
const targetAllocation = {
  BTC: 0.5,
  ETH: 0.3,
  LTC: 0.2,
};

// Get current balance and calculate current allocation
async function getCurrentAllocation() {
  const balance = await exchange.fetchBalance();
  const totalValue = balance.total;
  const allocation = {};

  for (const [symbol, weight] of Object.entries(targetAllocation)) {
    const value = balance[symbol] * exchange.price(symbol + '/USDT');
    allocation[symbol] = value / totalValue;
  }

  return allocation;
}

// Calculate trades required to rebalance portfolio
async function calculateTrades(currentAllocation) {
  const trades = {};

  for (const [symbol, weight] of Object.entries(targetAllocation)) {
    const currentWeight = currentAllocation[symbol];
    const diff = weight - currentWeight;

    if (diff !== 0) {
      const value = diff * exchange.price(symbol + '/USDT');
      const amount = value / exchange.price(symbol + '/USDT');

      trades[symbol] = {
        amount,
        value,
      };
    }
  }

  return trades;
}

// Execute trades to rebalance portfolio
async function executeTrades(trades) {
  for (const [symbol, { amount, value }] of Object.entries(trades)) {
    if (amount > 0) {
      // Buy asset
      const order = await exchange.createMarketBuyOrder(symbol + '/USDT', amount);
      console.log(`Bought ${amount} ${symbol} for ${value} USDT (order ID: ${order.id})`);
    } else if (amount < 0) {
      // Sell asset
      const order = await exchange.createMarketSellOrder(symbol + '/USDT', -amount);
      console.log(`Sold ${-amount} ${symbol} for ${value} USDT (order ID: ${order.id})`);
    }
  }
}

// Rebalance portfolio
async function rebalance() {
  const currentAllocation = await getCurrentAllocation();
  const trades = await calculateTrades(currentAllocation);

  if (Object.keys(trades).length > 0) {
    await executeTrades(trades);
  } else {
    console.log('Portfolio already balanced');
  }
}

// Run rebalance function every hour
setInterval(rebalance, 3600000);
