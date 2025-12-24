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
    <div className="send-section" style={{ 
      backgroundColor: 'white', 
      padding: '20px', 
      borderRadius: '8px', 
      border: '1px solid #dee2e6'
      
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>💸 Send HBAR</h3>
      
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
          disabled={isLoading}
          style={{ 
            width: '100%', 
            padding: '10px 12px', 
            fontSize: '14px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'text'
          }}
          onFocus={(e) => {
            if (!isLoading) {
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
          Amount (HBAR) <span style={{ color: '#dc3545' }}>*</span>
        </label>
        <input
          placeholder="e.g., 1.5"
          type="number"
          step="0.00000001"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
          style={{ 
            width: '100%', 
            padding: '10px 12px', 
            fontSize: '14px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'text'
          }}
          onFocus={(e) => {
            if (!isLoading) {
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
          Enter the amount of HBAR to send
        </small>
      </div>
      
      <div style={{ 
        paddingTop: '15px', 
        borderTop: '1px solid #dee2e6'
      }}>
        <button 
          onClick={handleTransfer} 
          disabled={isLoading || !accountId || !privateKey || !toAccount || !amount}
          style={{ 
            padding: '10px 24px', 
            fontSize: '14px',
            fontWeight: '600',
            cursor: isLoading || !accountId || !privateKey || !toAccount || !amount ? 'not-allowed' : 'pointer',
            backgroundColor: isLoading || !accountId || !privateKey || !toAccount || !amount ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            transition: 'background-color 0.15s ease-in-out',
            opacity: isLoading || !accountId || !privateKey || !toAccount || !amount ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!isLoading && accountId && privateKey && toAccount && amount) {
              e.target.style.backgroundColor = '#218838';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && accountId && privateKey && toAccount && amount) {
              e.target.style.backgroundColor = '#28a745';
            }
          }}
        >
          {isLoading ? '⏳ Sending...' : '💸 Send HBAR'}
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

export default HbarTransferSection;

