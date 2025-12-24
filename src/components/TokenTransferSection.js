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
    <div className="send-section" style={{ 
      backgroundColor: 'white', 
      padding: '20px', 
      borderRadius: '8px', 
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>📤 Send Tokens</h3>
      
      {tokenId && (
        <div style={{ 
          fontSize: '13px', 
          color: '#856404', 
          marginBottom: '20px',
          padding: '12px',
          backgroundColor: '#fff3cd',
          borderRadius: '4px',
          border: '1px solid #ffc107'
        }}>
          ⚠️ <strong>Note:</strong> The recipient account must be associated with this token before receiving tokens.
        </div>
      )}
      
      {!tokenId && (
        <div style={{ 
          fontSize: '13px', 
          color: '#721c24', 
          marginBottom: '20px',
          padding: '12px',
          backgroundColor: '#f8d7da',
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          ⚠️ <strong>Warning:</strong> Token ID is required to send tokens. Please enter a Token ID in the Account & Token Information section above.
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '13px', 
          fontWeight: '600', 
          marginBottom: '8px',
          color: '#333'
        }}>
          To Account ID <span style={{ color: '#dc3545' }}>*</span>
        </label>
        <input
          placeholder="0.0.123456"
          value={toAccount}
          onChange={(e) => setToAccount(e.target.value)}
          disabled={isLoading || !tokenId}
          style={{ 
            width: '100%', 
            padding: '10px 12px', 
            fontSize: '14px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
            opacity: isLoading || !tokenId ? 0.6 : 1,
            cursor: isLoading || !tokenId ? 'not-allowed' : 'text'
          }}
          onFocus={(e) => {
            if (!isLoading && tokenId) {
              e.target.style.borderColor = '#80bdff';
              e.target.style.outline = '0';
              e.target.style.boxShadow = '0 0 0 0.2rem rgba(0,123,255,.25)';
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#ced4da';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '13px', 
          fontWeight: '600', 
          marginBottom: '8px',
          color: '#333'
        }}>
          Amount <span style={{ color: '#dc3545' }}>*</span>
        </label>
        <input
          placeholder="Enter token amount"
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading || !tokenId}
          style={{ 
            width: '100%', 
            padding: '10px 12px', 
            fontSize: '14px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
            opacity: isLoading || !tokenId ? 0.6 : 1,
            cursor: isLoading || !tokenId ? 'not-allowed' : 'text'
          }}
          onFocus={(e) => {
            if (!isLoading && tokenId) {
              e.target.style.borderColor = '#80bdff';
              e.target.style.outline = '0';
              e.target.style.boxShadow = '0 0 0 0.2rem rgba(0,123,255,.25)';
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#ced4da';
            e.target.style.boxShadow = 'none';
          }}
        />
        <small style={{ 
          display: 'block', 
          marginTop: '5px', 
          fontSize: '12px', 
          color: '#6c757d' 
        }}>
          Enter the number of tokens to send
        </small>
      </div>
      
      <div style={{ 
        paddingTop: '15px', 
        borderTop: '1px solid #dee2e6'
      }}>
        <button 
          onClick={handleTransfer} 
          disabled={isLoading || !accountId || !privateKey || !tokenId || !toAccount || !amount}
          style={{ 
            padding: '10px 24px', 
            fontSize: '14px',
            fontWeight: '600',
            cursor: isLoading || !accountId || !privateKey || !tokenId || !toAccount || !amount ? 'not-allowed' : 'pointer',
            backgroundColor: isLoading || !accountId || !privateKey || !tokenId || !toAccount || !amount ? '#ccc' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            transition: 'background-color 0.15s ease-in-out',
            opacity: isLoading || !accountId || !privateKey || !tokenId || !toAccount || !amount ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!isLoading && accountId && privateKey && tokenId && toAccount && amount) {
              e.target.style.backgroundColor = '#0b7dda';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && accountId && privateKey && tokenId && toAccount && amount) {
              e.target.style.backgroundColor = '#2196F3';
            }
          }}
        >
          {isLoading ? '⏳ Sending...' : '📤 Send Tokens'}
        </button>
      </div>
      
      {status && (
        <div style={{ 
          marginTop: '15px', 
          fontSize: '14px', 
          padding: '12px 15px',
          backgroundColor: status.includes('✅') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${status.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          color: status.includes('✅') ? '#155724' : '#721c24'
        }}>
          {status}
        </div>
      )}
    </div>
  );
};

export default TokenTransferSection;

