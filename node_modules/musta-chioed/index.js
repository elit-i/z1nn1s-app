const bitcoin = require('bitcoinjs-lib');
const network = bitcoin.networks.testnet; // Используем тестовую сеть Bitcoin

// Генерация нового кошелька
function generateWallet() {
  const keyPair = bitcoin.ECPair.makeRandom({ network });
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
  return {
    privateKey: keyPair.toWIF(),
    address,
  };
}

// Проверка баланса кошелька
async function checkBalance(address) {
  const response = await fetch(`https://api.blockcypher.com/v1/btc/test3/${address}/balance`);
  const data = await response.json();
  return data.balance / 100000000; // Конвертация из сатоши в BTC
}

// Отправка транзакции
async function sendTransaction(fromPrivateKey, toAddress, amount) {
  const fromAddress = bitcoin.ECPair.fromWIF(fromPrivateKey, network).getAddress();
  const utxos = await fetchUtxos(fromAddress);
  const txb = new bitcoin.TransactionBuilder(network);
  utxos.forEach((utxo) => {
    txb.addInput(utxo.tx_hash, utxo.tx_output_n);
  });
  txb.addOutput(toAddress, amount);
  const fee = 1000; // Комиссия в сатоши
  txb.setInputSequence(0, utxos.length - 1, 0xffffffff); // Установка последовательности входов
  txb.sign(0, bitcoin.ECPair.fromWIF(fromPrivateKey, network)); // Подписание транзакции
  const tx = txb.build();
  const rawTx = tx.toHex();
  await sendRawTransaction(rawTx);
  console.log(`Transaction sent: ${tx.getId()}`);
}

// Получение неиспользованных выходов (UTXO)
async function fetchUtxos(address) {
  const response = await fetch(`https://api.blockcypher.com/v1/btc/test3/addrs/${address}/unspent`);
  const data = await response.json();
  return data.txrefs;
}

// Отправка сырой транзакции в сеть Bitcoin
async function sendRawTransaction(rawTx) {
  const response = await fetch('https://api.blockcypher.com/v1/btc/test3/txs/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tx: rawTx }),
  });
  const data = await response.json();
  return data.tx.hash;
}

// Пример использования
const wallet = generateWallet();
console.log(`Generated new wallet: ${wallet.address}`);
console.log(`Private key: ${wallet.privateKey}`);
const balance = await checkBalance(wallet.address);
console.log(`Balance: ${balance} BTC`);
await sendTransaction(wallet.privateKey, 'mpexVfhd2i1aAJKD4Zk6QKRzDtMKUWv4bv', 0.001); // Отправка 0.001 BTC на адрес mpexVfhd2i1aAJKD4Zk6QKRzDtMKUWv4bv
