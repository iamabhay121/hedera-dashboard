import { Client, AccountId, PrivateKey, AccountBalanceQuery, AccountCreateTransaction, TokenId, Hbar } from '@hashgraph/sdk';

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
 * Get node account IDs from the network
 * @param {Client} client - Hedera client instance
 * @returns {Promise<AccountId[]>} Array of node account IDs
 */
const getNodeAccountIds = async (client) => {
  try {
    const network = client.network;
    const nodeAccountIds = [];
    for (const [nodeId, address] of network) {
      nodeAccountIds.push(nodeId);
    }
    return nodeAccountIds.length > 0 ? nodeAccountIds : undefined;
  } catch (error) {
    // If we can't get node account IDs, return undefined to let SDK handle it
    return undefined;
  }
};

/**
 * Create a new Hedera account
 * @param {Client} client - Hedera client instance
 * @param {string} operatorId - Operator account ID (pays for account creation)
 * @param {string} operatorKey - Operator private key
 * @param {number|string} balance - Initial HBAR balance (default: 0)
 * @param {string} automaticAssociation - Max automatic token associations (default: '0')
 * @param {string} memo - Account memo (optional)
 * @returns {Promise<Object>} Object with newAccountId and newPrivateKey
 */
export const createAccount = async (client, operatorId, operatorKey, balance = 0, automaticAssociation = '0', memo = '') => {
  if (!operatorId || !operatorKey) {
    throw new Error('Operator Account ID and Private Key are required');
  }

  const operator = AccountId.fromString(operatorId);
  const operatorPrivateKey = PrivateKey.fromString(operatorKey);
  client.setOperator(operator, operatorPrivateKey);

  // Generate new key pair for the account
  const newKey = PrivateKey.generateED25519();

  // Get node account IDs
  const nodeAccountIds = await getNodeAccountIds(client);

  // Create the account transaction
  const transaction = new AccountCreateTransaction()
    .setKey(newKey.publicKey)
    .setInitialBalance(new Hbar(balance))
    .setMaxAutomaticTokenAssociations(parseInt(automaticAssociation, 10));

  // Set node account IDs if available
  if (nodeAccountIds && nodeAccountIds.length > 0) {
    transaction.setNodeAccountIds(nodeAccountIds);
  }

  // Set memo if provided
  if (memo && memo.trim() !== '') {
    transaction.setAccountMemo(memo);
  }

  // Execute the transaction
  const tx = await transaction.execute(client);

  const receipt = await tx.getReceipt(client);
  const newAccountId = receipt.accountId.toString();
  const newPrivateKey = newKey.toString();

  return {
    newAccountId,
    newPrivateKey
  };
};

