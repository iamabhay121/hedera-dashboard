import { Client, AccountId, PrivateKey, TransferTransaction, Hbar } from '@hashgraph/sdk';

/**
 * Transfer HBAR from one account to another
 * @param {Client} client - Hedera client instance
 * @param {string} senderAccountId - Sender's account ID
 * @param {string} senderPrivateKey - Sender's private key
 * @param {string} recipientAccountId - Recipient's account ID
 * @param {string} amount - Amount to transfer (as string, e.g., "1.5")
 * @returns {Promise<Object>} Transaction receipt
 */
export const transferHbar = async (client, senderAccountId, senderPrivateKey, recipientAccountId, amount) => {
  if (!senderAccountId || !senderPrivateKey || !recipientAccountId || !amount) {
    throw new Error('All fields are required for HBAR transfer');
  }

  const sender = AccountId.fromString(senderAccountId);
  const senderKey = PrivateKey.fromString(senderPrivateKey);
  client.setOperator(sender, senderKey);

  const recipient = AccountId.fromString(recipientAccountId);
  const hbarAmount = Hbar.fromString(amount);

  const transferTx = await new TransferTransaction()
    .addHbarTransfer(sender, hbarAmount.negated())
    .addHbarTransfer(recipient, hbarAmount)
    .execute(client);

  const receipt = await transferTx.getReceipt(client);
  return receipt;
};

