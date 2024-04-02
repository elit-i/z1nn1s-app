const bitpay = require('bitpay-client');
const client = new bitpay.Client({
  key: 'YOUR_API_KEY',
  secret: 'YOUR_API_SECRET',
  env: 'test' // Use 'production' for mainnet
});

// Check balance and send funds if balance is above threshold
async function checkBalanceAndSendFunds() {
  const balance = await getBalance(); // Implement function to get balance from wallet
  if (balance >= 0.01) { // Set threshold to 0.01 BTC
    const invoice = await client.Invoice.create({
      currency: 'BTC',
      price: balance,
      notificationURL: 'https://your-webhook-url.com',
      buyer: {
        name: 'Your Name',
        email: 'your-email@example.com',
        address1: 'Your Address',
        city: 'Your City',
        region: 'Your Region',
        postalCode: 'Your Postal Code',
        country: 'Your Country',
        phone: 'Your Phone'
      }
    });
    const payment = await client.Payment.create({
      currency: 'BTC',
      posData: 'Your POS Data',
      paymentRequest: invoice.paymentRequest,
      refundAddress: 'YOUR_REFUND_ADDRESS'
    });
    console.log(`Sent ${balance} BTC to ${payment.address}`);
  }
}

// Run checkBalanceAndSendFunds every hour
setInterval(checkBalanceAndSendFunds, 3600000);
