const CryptoApiClient = require('crypto-api-client');

// Создание экземпляра клиента
const client = new CryptoApiClient({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
});

// Получение текущего курса Bitcoin
client.getTicker('BTC/USD')
  .then((ticker) => {
    console.log(`Текущий курс BTC: ${ticker.last}`);
  })
  .catch((error) => {
    console.error(error);
  });

// Получение баланса счета
client.getAccountBalance()
  .then((balance) => {
    console.log(`Баланс счета: ${balance.BTC} BTC`);
  })
  .catch((error) => {
    console.error(error);
  });
