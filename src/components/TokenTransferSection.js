import React, { useState } from 'react';
import { transferToken } from '../services/tokenTransfer';

const TokenTransferSection = ({ client, accountId, privateKey, tokenId, onTransferSuccess }) => {
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleTransfer = async () => {
    if (!accountId || !privateKey || !toAccount || !tokenId || !amount) {
      setStatus('❌ Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setStatus('Sending...');
    
    try {
      const receipt = await transferToken(client, accountId, privateKey, toAccount, tokenId, amount);
      setStatus(`✅ Sent ${amount} tokens! Tx: ${receipt.transactionId}`);
      
      // Clear form
      setToAccount('');
      setAmount('');
      
      // Notify parent to refresh balances
      if (onTransferSuccess) {
        onTransferSuccess();
      }
    } catch (error) {
      let errorMessage = error.message;
      
      // Provide helpful error message for association errors
      if (errorMessage.includes('TOKEN_NOT_ASSOCIATED_TO_ACCOUNT')) {
        errorMessage = `❌ Send failed: The recipient account (${toAccount}) is not associated with this token. The recipient must associate their account with the token before receiving tokens. If you're the recipient, use the "Associate Account with Token" section below.`;
      }
      
      setStatus(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="send-section">
      <h3>📤 Send Tokens</h3>
      {tokenId && (
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px', fontStyle: 'italic' }}>
          ⚠️ Note: The recipient account must be associated with this token before receiving tokens.
        </p>
      )}
      <input
        placeholder="To Account ID (0.0.123456)"
        value={toAccount}
        onChange={(e) => setToAccount(e.target.value)}
        disabled={isLoading}
      />
      <input
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={isLoading}
      />
      <button onClick={handleTransfer} disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Tokens'}
      </button>
      {status && <div style={{ marginTop: '10px', fontSize: '14px' }}>{status}</div>}
    </div>
  );
};

export default TokenTransferSection;

