/*
Эта библиотека использует Web3.js для взаимодействия со смарт-контрактами Ethereum. Она использует HDWalletProvider из Truffle для подключения к узлу Ethereum с использованием мнемонической фразы для доступа к кошельку.

Перед использованием этой библиотеки вам нужно установить Web3.js и HDWalletProvider с помощью npm:
npm install web3 @truffle/hdwallet-provider
Также вам нужно скомпилировать свой смарт-контракт с помощью Solidity и экспортировать его интерфейс и байт-код в файл MyContract.json.
*/
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { interface, bytecode } = require('./MyContract.json');

const provider = new HDWalletProvider(
  'YOUR_MNEMONIC', // Мнемоническая фраза для доступа к кошельку
  'YOUR_INFURA_URL' // URL-адрес узла Ethereum (например, от Infura)
);

const web3 = new Web3(provider);

class MyContract {
  constructor(address) {
    this.contract = new web3.eth.Contract(JSON.parse(interface), address);
  }

  async getData() {
    const data = await this.contract.methods.getData().call();
    return data;
  }

  async setData(newData) {
    const accounts = await web3.eth.getAccounts();
    const receipt = await this.contract.methods.setData(newData).send({
      from: accounts[0],
      gas: '1000000',
    });
    return receipt;
  }
}

module.exports = MyContract;
