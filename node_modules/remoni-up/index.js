const ethers = require('ethers');

// Initialize provider with MetaMask
const provider = new ethers.providers.Web3Provider(window.ethereum);

// Get account address from MetaMask
async function getAccount() {
  await provider.send('eth_requestAccounts', []);
  const accounts = await provider.listAccounts();
  return accounts[0];
}

// Get balance of account in Ether
async function getBalance(account) {
  const balance = await provider.getBalance(account);
  return ethers.utils.formatEther(balance);
}

// Send transaction from account
async function sendTransaction(account, toAddress, value) {
  const signer = provider.getSigner();
  const transaction = {
    to: toAddress,
    value: ethers.utils.parseEther(value.toString())
  };

  const signedTransaction = await signer.sendTransaction(transaction);
  console.log(`Transaction sent with hash ${signedTransaction.hash}`);
  await signedTransaction.wait();
  console.log(`Transaction confirmed`);
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
