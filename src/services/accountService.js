import { Client, AccountId, PrivateKey, AccountBalanceQuery, AccountCreateTransaction, TokenId } from '@hashgraph/sdk';

/**
 * Fetch account balances (HBAR and tokens)
 * @param {Client} client - Hedera client instance
 * @param {string} accountId - Account ID to query
 * @param {string} tokenId - Token ID to get balance for (optional)
 * @returns {Promise<Object>} Object with hbarBalance and tokenBalance
 */
export const fetchAccountBalances = async (client, accountId, tokenId = null) => {
  if (!accountId) {
    throw new Error('Account ID is required');
  }

  const balanceQuery = new AccountBalanceQuery()
    .setAccountId(AccountId.fromString(accountId));
  const accountBalance = await balanceQuery.execute(client);

  const hbarBalance = accountBalance.hbars.toString();
  
  let tokenBalanceStr = '0';
  if (tokenId) {
    try {
      const tokenIdObj = TokenId.fromString(tokenId);
      const tokenBalance = accountBalance.tokens.get(tokenIdObj);
      tokenBalanceStr = tokenBalance ? tokenBalance.toString() : '0';
    } catch (error) {
      // If tokenId is invalid, just return 0
      tokenBalanceStr = '0';
    }
  }

  return {
    hbarBalance,
    tokenBalance: tokenBalanceStr
  };
};

/**
 * Create a new Hedera account
 * @param {Client} client - Hedera client instance
 * @param {string} operatorId - Operator account ID (pays for account creation)
 * @param {string} operatorKey - Operator private key
 * @param {number} initialBalance - Initial HBAR balance (default: 0)
 * @returns {Promise<Object>} Object with newAccountId and newPrivateKey
 */
export const createAccount = async (client, operatorId, operatorKey, initialBalance = 0) => {
  if (!operatorId || !operatorKey) {
    throw new Error('Operator Account ID and Private Key are required');
  }

  const operator = AccountId.fromString(operatorId);
  const operatorPrivateKey = PrivateKey.fromString(operatorKey);
  client.setOperator(operator, operatorPrivateKey);

  // Generate new key pair for the account
  const newKey = PrivateKey.generateED25519();

  // Create the account
  const tx = await new AccountCreateTransaction()
    .setKey(newKey.publicKey)
    .setInitialBalance(initialBalance)
    .freezeWith(client)
    .execute(client);

  const receipt = await tx.getReceipt(client);
  const newAccountId = receipt.accountId.toString();
  const newPrivateKey = newKey.toString();

  return {
    newAccountId,
    newPrivateKey
  };
};

