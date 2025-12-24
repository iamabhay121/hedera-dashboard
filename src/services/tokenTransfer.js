import { Client, AccountId, PrivateKey, TransferTransaction, TokenId } from '@hashgraph/sdk';

/**
 * Transfer tokens from one account to another
 * @param {Client} client - Hedera client instance
 * @param {string} senderAccountId - Sender's account ID
 * @param {string} senderPrivateKey - Sender's private key
 * @param {string} recipientAccountId - Recipient's account ID
 * @param {string} tokenId - Token ID to transfer
 * @param {string|number} amount - Amount to transfer
 * @returns {Promise<Object>} Transaction receipt
 */
export const transferToken = async (client, senderAccountId, senderPrivateKey, recipientAccountId, tokenId, amount) => {
  if (!senderAccountId || !senderPrivateKey || !recipientAccountId || !tokenId || !amount) {
    throw new Error('All fields are required for token transfer');
  }

  const sender = AccountId.fromString(senderAccountId);
  const senderKey = PrivateKey.fromString(senderPrivateKey);
  client.setOperator(sender, senderKey);

  const tokenIdObj = TokenId.fromString(tokenId);
  const transferTx = await new TransferTransaction()
    .addTokenTransfer(tokenIdObj, sender, -parseInt(amount))
    .addTokenTransfer(tokenIdObj, AccountId.fromString(recipientAccountId), parseInt(amount))
    .execute(client);

  const receipt = await transferTx.getReceipt(client);
  return receipt;
};

