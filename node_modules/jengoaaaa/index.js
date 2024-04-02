const { ethers } = require('ethers');

// Set up provider and signer
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
const privateKey = 'YOUR_PRIVATE_KEY';
const wallet = new ethers.Wallet(privateKey, provider);
const signer = wallet.connect(provider);

// Set up Uniswap contract
const uniswapABI = [
  // Uniswap ABI JSON goes here
];
const uniswapAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const uniswapContract = new ethers.Contract(uniswapAddress, uniswapABI, signer);

// Set up trading parameters
const tokenAddress = 'YOUR_TOKEN_ADDRESS';
const tokenAmount = ethers.utils.parseEther('1');
const minEthAmount = ethers.utils.parseEther('0.01');
const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

// Calculate ethAmount based on current exchange rate
async function getEthAmount() {
  const [reserve0, reserve1] = await uniswapContract.getReserves();
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
  const tokenContract = new ethers.Contract(tokenAddress, [
    // ERC20 ABI JSON goes here
  ], signer);
  const approveTx = await tokenContract.approve(uniswapAddress, tokenAmount);
  await approveTx.wait();

  // Execute trade
  const tradeTx = await uniswapContract.swapTokensForExactETH(
    tokenAmount,
    ethAmount,
    [tokenAddress, uniswapAddress],
    signer.getAddress(),
    deadline
  );
  const receipt = await tradeTx.wait();

  console.log(`Trade executed: ${receipt.transactionHash}`);
}

// Run trade function
trade().catch((error) => {
  console.error(error);
});
