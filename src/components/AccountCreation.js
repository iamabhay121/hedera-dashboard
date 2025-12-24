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
  const [automaticAssociation, setAutomaticAssociation] = useState('0');
  const [memo, setMemo] = useState('');

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
      <h3 style={{ color: '#155724' }}>Create New Account</h3>
      
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

      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        border: '1px solid #dee2e6',
        marginBottom: '20px'
      }}>
        <p style={{ 
          fontSize: '13px', 
          color: '#666', 
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          border: '1px solid #e9ecef'
        }}>
          {operatorId && operatorKey 
            ? '✅ Operator credentials saved! You can create multiple accounts with the same operator.'
            : 'Enter your operator account credentials (to pay for account creation). These will be saved for future use.'}
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '13px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#333'
          }}>
            Operator Account ID <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <input
            placeholder="0.0.123456"
            value={operatorId}
            onChange={(e) => setOperatorId(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              fontSize: '14px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#80bdff';
              e.target.style.outline = '0';
              e.target.style.boxShadow = '0 0 0 0.2rem rgba(0,123,255,.25)';
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
            Operator Private Key <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <input
            placeholder="Enter your operator private key"
            type="text"
            value={operatorKey}
            onChange={(e) => setOperatorKey(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              fontSize: '14px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#80bdff';
              e.target.style.outline = '0';
              e.target.style.boxShadow = '0 0 0 0.2rem rgba(0,123,255,.25)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ced4da';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '13px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#333'
          }}>
            Max Automatic Token Associations
          </label>
          <input
            placeholder="0"
            type="number"
            min="0"
            value={automaticAssociation}
            onChange={(e) => setAutomaticAssociation(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              fontSize: '14px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#80bdff';
              e.target.style.outline = '0';
              e.target.style.boxShadow = '0 0 0 0.2rem rgba(0,123,255,.25)';
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
            Maximum number of tokens this account can automatically associate (default: 0)
          </small>
        </div> */}

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '13px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#333'
          }}>
            Account Memo <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#6c757d' }}>(Optional)</span>
          </label>
          <input
            placeholder="Enter account memo"
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              fontSize: '14px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#80bdff';
              e.target.style.outline = '0';
              e.target.style.boxShadow = '0 0 0 0.2rem rgba(0,123,255,.25)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ced4da';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ 
          paddingTop: '15px', 
          borderTop: '1px solid #dee2e6',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => onCreateAccount(10, automaticAssociation, memo)} 
            style={{ 
              padding: '10px 24px', 
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              transition: 'background-color 0.15s ease-in-out'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
          >
            ➕ Create Account
          </button>
          {operatorId && operatorKey && (
            <button 
              onClick={onClearOperator} 
              style={{ 
                padding: '10px 24px', 
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer', 
                backgroundColor: '#ff6b6b', 
                color: 'white', 
                border: 'none',
                borderRadius: '4px',
                transition: 'background-color 0.15s ease-in-out'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e55a5a'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b6b'}
            >
              🗑️ Clear Operator
            </button>
          )}
          <button 
            onClick={() => setShowCreateAccount(false)} 
            style={{ 
              padding: '10px 24px', 
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              transition: 'background-color 0.15s ease-in-out'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
          >
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountCreation;

