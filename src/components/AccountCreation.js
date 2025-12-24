import React, { useState } from 'react';

const AccountCreation = ({ 
  showCreateAccount, 
  setShowCreateAccount, 
  operatorId, 
  setOperatorId, 
  operatorKey, 
  setOperatorKey, 
  onCreateAccount,
  onClearOperator,
  createdAccountInfo,
  onDismissSuccess
}) => {
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!showCreateAccount) {
    return (
      <button 
        onClick={() => setShowCreateAccount(true)}
        style={{ marginBottom: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        ➕ Create New Account
      </button>
    );
  }

  return (
    <div className="create-account-section" style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h3>Create New Account</h3>
      
      {/* Success Card for Newly Created Account */}
      {createdAccountInfo && (
        <div style={{
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: '#d4edda',
          border: '2px solid #28a745',
          borderRadius: '8px',
          color: '#155724',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', marginRight: '10px' }}>✅</span>
              <h3 style={{ margin: 0, color: '#155724' }}>Account Created Successfully!</h3>
            </div>
            <button
              onClick={onDismissSuccess}
              style={{
                padding: '4px 8px',
                backgroundColor: 'transparent',
                border: '1px solid #155724',
                borderRadius: '4px',
                color: '#155724',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              title="Dismiss"
            >
              ✕
            </button>
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            padding: '15px', 
            borderRadius: '6px', 
            marginBottom: '15px',
            border: '1px solid #c3e6cb'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                marginBottom: '5px',
                color: '#155724',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Account ID
              </label>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                backgroundColor: '#f8f9fa',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                <code style={{ 
                  flex: 1, 
                  fontSize: '16px', 
                  fontFamily: 'monospace',
                  color: '#155724',
                  wordBreak: 'break-all'
                }}>
                  {createdAccountInfo.accountId}
                </code>
                <button
                  onClick={() => copyToClipboard(createdAccountInfo.accountId, 'accountId')}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: copiedField === 'accountId' ? '#28a745' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {copiedField === 'accountId' ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                marginBottom: '5px',
                color: '#155724',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Private Key
              </label>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                backgroundColor: '#f8f9fa',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                <code style={{ 
                  flex: 1, 
                  fontSize: '14px', 
                  fontFamily: 'monospace',
                  color: '#155724',
                  wordBreak: 'break-all'
                }}>
                  {createdAccountInfo.privateKey}
                </code>
                <button
                  onClick={() => copyToClipboard(createdAccountInfo.privateKey, 'privateKey')}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: copiedField === 'privateKey' ? '#28a745' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {copiedField === 'privateKey' ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ 
            fontSize: '12px', 
            color: '#155724',
            padding: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '4px'
          }}>
            ⚠️ <strong>Important:</strong> Save these credentials securely. The private key cannot be recovered if lost!
          </div>
        </div>
      )}

      <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
        {operatorId && operatorKey 
          ? '✅ Operator credentials saved! You can create multiple accounts with the same operator.'
          : 'Enter your operator account credentials (to pay for account creation). These will be saved for future use.'}
      </p>
      <input
        placeholder="Operator Account ID (0.0.123456)"
        value={operatorId}
        onChange={(e) => setOperatorId(e.target.value)}
        style={{ marginBottom: '10px', padding: '8px', width: '100%', maxWidth: '400px' }}
      />
      <input
        placeholder="Operator Private Key"
        type="text"
        value={operatorKey}
        onChange={(e) => setOperatorKey(e.target.value)}
        style={{ marginBottom: '10px', padding: '8px', width: '100%', maxWidth: '400px' }}
      />
      <div>
        <button onClick={onCreateAccount} style={{ marginRight: '10px', padding: '10px 20px', cursor: 'pointer' }}>
          Create Account
        </button>
        {operatorId && operatorKey && (
          <button 
            onClick={onClearOperator} 
            style={{ marginRight: '10px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#ff6b6b', color: 'white', border: 'none' }}
          >
            Clear Operator
          </button>
        )}
        <button onClick={() => setShowCreateAccount(false)} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AccountCreation;

