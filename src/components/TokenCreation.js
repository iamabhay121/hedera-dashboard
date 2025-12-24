import React, { useState } from 'react';

const TokenCreation = ({ 
  showCreateToken, 
  setShowCreateToken, 
  accountId,
  privateKey,
  onCreateToken,
  onTokenCreated,
  createdTokenInfo,
  onDismissSuccess
}) => {
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState('0');
  const [decimals, setDecimals] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
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

  const handleCreateToken = async () => {
    if (!accountId || !privateKey) {
      setStatus('❌ Please enter Account ID and Private Key');
      return;
    }

    if (!tokenName || !tokenSymbol) {
      setStatus('❌ Token Name and Symbol are required');
      return;
    }

    setIsLoading(true);
    setStatus('Creating token...');
    
    try {
      const result = await onCreateToken({
        tokenName,
        tokenSymbol,
        initialSupply: parseInt(initialSupply) || 0,
        decimals: parseInt(decimals) || 0
      });
      
      setStatus(`✅ Token created! Token ID: ${result.tokenId}`);
      
      // Clear form
      setTokenName('');
      setTokenSymbol('');
      setInitialSupply('0');
      setDecimals('0');
      
      // Notify parent with full token info
      if (onTokenCreated) {
        onTokenCreated(result);
      }
      
      // Don't auto-close - let user see the success card
      setTimeout(() => {
        setStatus('');
      }, 3000);
    } catch (error) {
      setStatus(`❌ Failed to create token: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showCreateToken) {
    return (
      <button 
        onClick={() => setShowCreateToken(true)}
        style={{ 
          marginBottom: '20px', 
          padding: '10px 20px', 
          fontSize: '16px', 
          cursor: 'pointer',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        🪙 Create New Token
      </button>
    );
  }

  return (
    <div className="create-token-section" style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ color: '#084298' }}>Create New Token</h3>
      
      {/* Success Card for Newly Created Token */}
      {createdTokenInfo && (
        <div style={{
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: '#cfe2ff',
          border: '2px solid #0d6efd',
          borderRadius: '8px',
          color: '#084298',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', marginRight: '10px' }}>✅</span>
              <h3 style={{ margin: 0, color: '#084298' }}>Token Created Successfully!</h3>
            </div>
            <button
              onClick={onDismissSuccess}
              style={{
                padding: '4px 8px',
                backgroundColor: 'transparent',
                border: '1px solid #084298',
                borderRadius: '4px',
                color: '#084298',
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
            border: '1px solid #b6d4fe'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                marginBottom: '5px',
                color: '#084298',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Token ID
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
                  color: '#084298',
                  wordBreak: 'break-all'
                }}>
                  {createdTokenInfo.tokenId}
                </code>
                <button
                  onClick={() => copyToClipboard(createdTokenInfo.tokenId, 'tokenId')}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: copiedField === 'tokenId' ? '#0d6efd' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {copiedField === 'tokenId' ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  marginBottom: '5px',
                  color: '#084298',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Token Name
                </label>
                <div style={{ 
                  backgroundColor: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6',
                  color: '#084298',
                  fontWeight: '500'
                }}>
                  {createdTokenInfo.tokenName}
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  marginBottom: '5px',
                  color: '#084298',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Token Symbol
                </label>
                <div style={{ 
                  backgroundColor: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6',
                  color: '#084298',
                  fontWeight: '500'
                }}>
                  {createdTokenInfo.tokenSymbol}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  marginBottom: '5px',
                  color: '#084298',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Initial Supply
                </label>
                <div style={{ 
                  backgroundColor: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6',
                  color: '#084298',
                  fontWeight: '500'
                }}>
                  {createdTokenInfo.initialSupply.toLocaleString()}
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  marginBottom: '5px',
                  color: '#084298',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Decimals
                </label>
                <div style={{ 
                  backgroundColor: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6',
                  color: '#084298',
                  fontWeight: '500'
                }}>
                  {createdTokenInfo.decimals}
                </div>
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                marginBottom: '5px',
                color: '#084298',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Treasury Account
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
                  color: '#084298',
                  wordBreak: 'break-all'
                }}>
                  {createdTokenInfo.treasuryAccountId}
                </code>
                <button
                  onClick={() => copyToClipboard(createdTokenInfo.treasuryAccountId, 'treasury')}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: copiedField === 'treasury' ? '#0d6efd' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {copiedField === 'treasury' ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ 
            fontSize: '12px', 
            color: '#084298',
            padding: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '4px'
          }}>
            💡 <strong>Next Steps:</strong> The token has been created and the initial supply (if any) is held by the treasury account. 
            Recipients must associate their accounts with this token before receiving transfers.
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
          {accountId && privateKey 
            ? `✅ Using account ${accountId} as treasury`
            : '⚠️ Please enter Account ID and Private Key to create a token'}
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '13px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#333'
          }}>
            Token Name <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <input
            placeholder="e.g., My Token"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
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
            Token Symbol <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <input
            placeholder="e.g., MTK"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
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
            Initial Supply
          </label>
          <input
            placeholder="0"
            type="number"
            min="0"
            value={initialSupply}
            onChange={(e) => setInitialSupply(e.target.value)}
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
            Initial token supply to mint (default: 0)
          </small>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '13px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#333'
          }}>
            Decimals
          </label>
          <input
            placeholder="0"
            type="number"
            min="0"
            max="8"
            value={decimals}
            onChange={(e) => setDecimals(e.target.value)}
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
            Number of decimal places (0-8, default: 0)
          </small>
        </div>

        <div style={{ 
          paddingTop: '15px', 
          borderTop: '1px solid #dee2e6',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={handleCreateToken} 
            disabled={isLoading || !accountId || !privateKey}
            style={{ 
              padding: '10px 24px', 
              fontSize: '14px',
              fontWeight: '600',
              cursor: isLoading || !accountId || !privateKey ? 'not-allowed' : 'pointer',
              backgroundColor: isLoading || !accountId || !privateKey ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              transition: 'background-color 0.15s ease-in-out',
              opacity: isLoading || !accountId || !privateKey ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isLoading && accountId && privateKey) {
                e.target.style.backgroundColor = '#0b7dda';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && accountId && privateKey) {
                e.target.style.backgroundColor = '#2196F3';
              }
            }}
          >
            {isLoading ? '⏳ Creating...' : '🪙 Create Token'}
          </button>
          <button 
            onClick={() => {
              setShowCreateToken(false);
              setStatus('');
              setTokenName('');
              setTokenSymbol('');
              setInitialSupply('0');
              setDecimals('0');
            }} 
            disabled={isLoading}
            style={{ 
              padding: '10px 24px', 
              fontSize: '14px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              transition: 'background-color 0.15s ease-in-out',
              opacity: isLoading ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#5a6268';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#6c757d';
              }
            }}
          >
            ✕ Close
          </button>
        </div>
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

export default TokenCreation;

