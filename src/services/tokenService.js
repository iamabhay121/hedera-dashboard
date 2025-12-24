import { Client, AccountId, PrivateKey, TokenCreateTransaction, TokenAssociateTransaction, TokenId } from '@hashgraph/sdk';

/**
 * Create a new token on Hedera
 * @param {Client} client - Hedera client instance
 * @param {string} treasuryAccountId - Treasury account ID (will hold initial supply)
 * @param {string} treasuryPrivateKey - Treasury account private key
 * @param {string} tokenName - Name of the token
 * @param {string} tokenSymbol - Symbol of the token
 * @param {number} initialSupply - Initial supply of tokens (default: 0)
 * @param {number} decimals - Number of decimal places (default: 0)
 * @param {string} adminKey - Admin key (optional, defaults to treasury key)
 * @param {string} freezeKey - Freeze key (optional)
 * @param {string} wipeKey - Wipe key (optional)
 * @param {string} supplyKey - Supply key (optional, required if initialSupply > 0)
 * @returns {Promise<Object>} Object with tokenId
 */
export const createToken = async (
  client,
  treasuryAccountId,
  treasuryPrivateKey,
  tokenName,
  tokenSymbol,
  initialSupply = 0,
  decimals = 0,
  adminKey = null,
  freezeKey = null,
  wipeKey = null,
  supplyKey = null
) => {
  if (!treasuryAccountId || !treasuryPrivateKey || !tokenName || !tokenSymbol) {
    throw new Error('Treasury Account ID, Private Key, Token Name, and Token Symbol are required');
  }

  const treasury = AccountId.fromString(treasuryAccountId);
  const treasuryKey = PrivateKey.fromString(treasuryPrivateKey);
  client.setOperator(treasury, treasuryKey);

  // Build the token creation transaction
  const transaction = new TokenCreateTransaction()
    .setTokenName(tokenName)
    .setTokenSymbol(tokenSymbol)
    .setTreasuryAccountId(treasury)
    .setDecimals(decimals);

  // Set admin key (defaults to treasury key if not provided)
  if (adminKey) {
    transaction.setAdminKey(PrivateKey.fromString(adminKey).publicKey);
  } else {
    transaction.setAdminKey(treasuryKey.publicKey);
  }

  // Set freeze key if provided
  if (freezeKey) {
    transaction.setFreezeKey(PrivateKey.fromString(freezeKey).publicKey);
  }

  // Set wipe key if provided
  if (wipeKey) {
    transaction.setWipeKey(PrivateKey.fromString(wipeKey).publicKey);
  }

  // Set supply key if provided or if initialSupply > 0
  if (supplyKey) {
    transaction.setSupplyKey(PrivateKey.fromString(supplyKey).publicKey);
  } else if (initialSupply > 0) {
    // If initialSupply > 0, we need a supply key (use treasury key)
    transaction.setSupplyKey(treasuryKey.publicKey);
  }

  // Set initial supply if provided
  if (initialSupply > 0) {
    transaction.setInitialSupply(initialSupply);
  }

  // Execute the transaction
  const txResponse = await transaction.freezeWith(client).execute(client);
  const receipt = await txResponse.getReceipt(client);
  const tokenId = receipt.tokenId.toString();

  return {
    tokenId
  };
};

/**
 * Associate an account with a token
 * @param {Client} client - Hedera client instance
 * @param {string} accountId - Account ID to associate with the token
 * @param {string} privateKey - Account's private key
 * @param {string} tokenId - Token ID to associate with
 * @returns {Promise<Object>} Transaction receipt
 */
export const associateToken = async (client, accountId, privateKey, tokenId) => {
  if (!accountId || !privateKey || !tokenId) {
    throw new Error('Account ID, Private Key, and Token ID are required');
  }

  const account = AccountId.fromString(accountId);
  const accountKey = PrivateKey.fromString(privateKey);
  client.setOperator(account, accountKey);

  const tokenIdObj = TokenId.fromString(tokenId);
  const transaction = await new TokenAssociateTransaction()
    .setAccountId(account)
    .setTokenIds([tokenIdObj])
    .freezeWith(client)
    .execute(client);

  const receipt = await transaction.getReceipt(client);
  const transactionId = transaction.transactionId.toString();
  
  return {
    receipt,
    transactionId
  };
};

