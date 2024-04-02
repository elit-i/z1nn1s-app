const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

// Set up provider and signer
const provider = new HDWalletProvider('YOUR_MNEMONIC', 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
const web3 = new Web3(provider);
const account = web3.eth.accounts.privateKeyToAccount('YOUR_PRIVATE_KEY').address;

// Set up SushiSwap contract
const sushiswapABI = [
  // SushiSwap ABI JSON goes here
];
const sushiswapAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const sushiswapContract = new web3.eth.Contract(sushiswapABI, sushiswapAddress);

// Set up trading parameters
const tokenAddress = 'YOUR_TOKEN_ADDRESS';
const tokenAmount = web3.utils.toWei('1', 'ether');
const minEthAmount = web3.utils.toWei('0.01', 'ether');
const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

// Calculate ethAmount based on current exchange rate
async function getEthAmount() {
  const [reserve0, reserve1] = await sushiswapContract.methods.getReserves().call();
  const tokenReserve = reserve1;
  const ethReserve = reserve0;
  const exchangeRate = tokenAmount.mul(ethReserve).div(tokenReserve);
  const ethAmount = exchangeRate.add(ethAmount.mul(5).div(1000)); // Add 0.5% slippage tolerance

  return ethAmount;
}

// Execute trade
async function trade() {
  const ethAmount = await getEthAmount();

  // Approve token transfer
  const tokenContract = new web3.eth.Contract([
    // ERC20 ABI JSON goes here
  ], tokenAddress, { from: account });
  const approveTx = await tokenContract.methods.approve(sushiswapAddress, tokenAmount).send({ from: account });

  // Execute trade
  const tradeTx = await sushiswapContract.methods.swapTokensForExactETH(
    tokenAmount,
    ethAmount,
    [tokenAddress, sushiswapAddress],
    account,
    deadline
  ).send({ from: account });

  console.log(`Trade executed: ${tradeTx.transactionHash}`);
}

// Run trade function
trade().catch((error) => {
  console.error(error);
});
