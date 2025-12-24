require('dotenv').config();
const {PrivateKey, AccountCreateTransaction, Client, AccountId, AccountBalanceQuery} = require('@hashgraph/sdk');

(async () => {
  const client = Client.forTestnet();
  
  // Load credentials from .env file
  // Get your testnet account from: https://portal.hedera.com/register
  const operatorId = process.env.OPERATOR_ID;
  const operatorKey = process.env.OPERATOR_KEY;
  // Initial balance in tinybars (default: 0, set to 100000000 for 1 HBAR)
  const initialBalance = parseInt(process.env.INITIAL_BALANCE || '0');
  
  if (!operatorId || !operatorKey || operatorId === '0.0.YOUR_ACCOUNT_ID' || operatorKey === 'YOUR_PRIVATE_KEY') {
    console.error('Error: Please set OPERATOR_ID and OPERATOR_KEY in your .env file');
    console.error('Get a testnet account from: https://portal.hedera.com/register');
    process.exit(1);
  }
  
  try {
    client.setOperator(
      AccountId.fromString(operatorId),
      PrivateKey.fromString(operatorKey)
    );
    
    // Check operator balance first
    const balanceQuery = await new AccountBalanceQuery()
      .setAccountId(AccountId.fromString(operatorId))
      .execute(client);
    
    const operatorBalance = balanceQuery.hbars.toTinybars();
    console.log(`Operator balance: ${operatorBalance.toString()} tinybars (${balanceQuery.hbars.toString()} HBAR)`);
    
    if (initialBalance > 0) {
      const totalNeeded = initialBalance + 50000000; // ~0.5 HBAR for fees
      if (operatorBalance < totalNeeded) {
        console.error(`\nError: Insufficient balance!`);
        console.error(`You need at least ${totalNeeded} tinybars (${totalNeeded / 100000000} HBAR)`);
        console.error(`Your balance: ${operatorBalance.toString()} tinybars (${balanceQuery.hbars.toString()} HBAR)`);
        console.error(`\nOptions:`);
        console.error(`1. Set INITIAL_BALANCE=0 in .env to create account without initial balance`);
        console.error(`2. Get more HBAR from: https://portal.hedera.com/register`);
        process.exit(1);
      }
    }
    
    const key = PrivateKey.generateED25519();
    const tx = await new AccountCreateTransaction()
      .setKey(key.publicKey)
      .setInitialBalance(initialBalance)
      .freezeWith(client)
      .execute(client);
    
    const receipt = await tx.getReceipt(client);
    
    console.log('\n✅ Account created successfully!');
    console.log('Account:', receipt.accountId.toString());
    console.log('Private:', key.toString());
    //privatekey.fromString()
    if (initialBalance > 0) {
      console.log(`Initial balance: ${initialBalance} tinybars (${initialBalance / 100000000} HBAR)`);
    }
    
    client.close();
  } catch (error) {
    console.error('\n❌ Error creating account:', error.message);
    if (error.message.includes('INSUFFICIENT_PAYER_BALANCE')) {
      console.error('\nYour operator account does not have enough HBAR.');
      console.error('Options:');
      console.error('1. Set INITIAL_BALANCE=0 in .env to create account without initial balance');
      console.error('2. Get more HBAR from: https://portal.hedera.com/register');
    }
    process.exit(1);
  }
})();

