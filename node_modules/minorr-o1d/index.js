const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const pancakeFactoryAbi = require('./pancake-factory-abi.json');
const pancakePairAbi = require('./pancake-pair-abi.json');
const bep20Abi = require('./bep20-abi.json');

// Set up Binance Smart Chain node connection
const provider = new HDWalletProvider('YOUR_MNEMONIC', 'https://bsc-dataseed.binance.org/');
const web3 = new Web3(provider);

// Set up PancakeSwap factory and pair contracts
const pancakeFactoryAddress = '0xBCfCcbde45cE874adCB698cC183deBcF17952812';
const pancakeFactoryContract = new web3.eth.Contract(pancakeFactoryAbi, pancakeFactoryAddress);

// Set up token parameters
const tokenAddress = 'YOUR_TOKEN_ADDRESS';
const tokenContract = new web3.eth.Contract(bep20Abi, tokenAddress);
const tokenDecimals = await tokenContract.methods.decimals().call();
const tokenAmount = web3.utils.toWei('1000', tokenDecimals); // 1000 tokens

// Add liquidity to PancakeSwap pool
async function addLiquidity() {
  // Get PancakeSwap pair address for token
  const pairAddress = await pancakeFactoryContract.methods.getPair(tokenAddress, web3.utils.toChecksumAddress(web3.eth.defaultAccount)).call();
  const pairContract = new web3.eth.Contract(pancakePairAbi, pairAddress);

  // Approve token transfer to PancakeSwap pair contract
  await tokenContract.methods.approve(pairAddress, tokenAmount).send({ from: web3.eth.defaultAccount });

  // Get BNB balance of PancakeSwap pair contract
  const bnbBalance = await pairContract.methods.getReserves().call();
  const bnbReserve = bnbBalance[0];

  // Calculate BNB amount to add to pool
  const bnbAmount = web3.utils.toWei('1', 'ether'); // 1 BNB
  const tokenReserve = bnbBalance[1];
  const tokenWeight = tokenReserve / (tokenReserve + bnbReserve);
  const bnbWeight = bnbReserve / (tokenReserve + bnbReserve);
  const adjustedBnbAmount = bnbAmount / (1 - bnbWeight);

  // Add liquidity to PancakeSwap pool
  await pairContract.methods.addLiquidity(tokenAmount, adjustedBnbAmount, tokenAmount, adjustedBnbAmount, web3.eth.defaultAccount, Math.floor(Date.now() / 1000) + 60 * 20).send({ from: web3.eth.defaultAccount, value: adjustedBnbAmount });

  console.log('Liquidity added to PancakeSwap pool');
}

// Add liquidity to PancakeSwap pool every hour
setInterval(addLiquidity, 60 * 60 * 1000);
