const axios = require('axios');
const fs = require('fs');

const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
const vsCurrency = 'usd';
const perPage = 100;
const page = 1;

async function getCoins() {
  const response = await axios.get(apiUrl, {
    params: {
      vs_currency: vsCurrency,
      per_page: perPage,
      page,
    },
  });
  return response.data;
}

function writeCoinsToCsv(coins) {
  const headers = ['Name', 'Symbol', 'Price', '24h Change', '24h Volume'];
  const rows = [headers];
  coins.forEach((coin) => {
    rows.push([
      coin.name,
      coin.symbol,
      coin.current_price,
      coin.price_change_percentage_24h,
      coin.total_volume,
    ]);
  });
  const csv = rows.map((row) => row.join(',')).join('\n');
  fs.writeFileSync('coins.csv', csv);
}

async function main() {
  const coins = await getCoins();
  console.log(`Total coins: ${coins.length}`);
  writeCoinsToCsv(coins);
  console.log('Data saved to coins.csv');
}

main();
