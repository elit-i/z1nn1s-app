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
