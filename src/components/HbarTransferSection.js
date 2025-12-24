import React, { useState } from 'react';
import { transferHbar } from '../services/hbarTransfer';

const HbarTransferSection = ({ client, accountId, privateKey, onTransferSuccess }) => {
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleTransfer = async () => {
    if (!accountId || !privateKey || !toAccount || !amount) {
      setStatus('❌ Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setStatus('Sending HBAR...');
    
    try {
      const receipt = await transferHbar(client, accountId, privateKey, toAccount, amount);
      setStatus(`✅ Sent ${amount} HBAR! Tx: ${receipt.transactionId}`);
      
      // Clear form
      setToAccount('');
      setAmount('');
      
      // Notify parent to refresh balances
      if (onTransferSuccess) {
        onTransferSuccess();
      }
    } catch (error) {
      setStatus(`❌ HBAR transfer failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="send-section">
      <h3>💸 Send HBAR</h3>
      <input
        placeholder="To Account ID (0.0.123456)"
        value={toAccount}
        onChange={(e) => setToAccount(e.target.value)}
        disabled={isLoading}
      />
      <input
        placeholder="Amount (e.g., 1.5)"
        type="number"
        step="0.00000001"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={isLoading}
      />
      <button onClick={handleTransfer} disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send HBAR'}
      </button>
      {status && <div style={{ marginTop: '10px', fontSize: '14px' }}>{status}</div>}
    </div>
  );
};

export default HbarTransferSection;

