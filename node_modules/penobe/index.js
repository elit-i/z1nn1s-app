const Web3 = require('web3');

// Initialize web3 with MetaMask provider
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// Get account address from MetaMask
async function getAccount() {
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
}

// Get balance of account in Ether
async function getBalance(account) {
  const balance = await web3.eth.getBalance(account);
  return web3.utils.fromWei(balance, 'ether');
}

// Send transaction from account
async function sendTransaction(account, toAddress, value) {
  const transaction = {
    from: account,
    to: toAddress,
    value: web3.utils.toWei(value.toString(), 'ether'),
    gas: 21000,
    gasPrice: web3.utils.toWei('10', 'gwei')
  };

  const signedTransaction = await web3.eth.accounts.signTransaction(transaction, 'YOUR_PRIVATE_KEY');
  const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
  console.log(`Transaction sent with hash ${receipt.transactionHash}`);
}

// Example usage
(async () => {
  const account = await getAccount();
  console.log(`Account address: ${account}`);

  const balance = await getBalance(account);
  console.log(`Account balance: ${balance} Ether`);

  const toAddress = '0x7Cb57B5A97eAbe94205C07890BE4c1aD31E486A8';
  const value = 0.1;
  await sendTransaction(account, toAddress, value);
})();
