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
      <h3>Create New Token</h3>
      
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

      <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
        {accountId && privateKey 
          ? `✅ Using account ${accountId} as treasury`
          : '⚠️ Please enter Account ID and Private Key to create a token'}
      </p>
      
      <input
        placeholder="Token Name (e.g., My Token)"
        value={tokenName}
        onChange={(e) => setTokenName(e.target.value)}
        disabled={isLoading}
        style={{ marginBottom: '10px', padding: '8px', width: '100%', maxWidth: '400px' }}
      />
      
      <input
        placeholder="Token Symbol (e.g., MTK)"
        value={tokenSymbol}
        onChange={(e) => setTokenSymbol(e.target.value)}
        disabled={isLoading}
        style={{ marginBottom: '10px', padding: '8px', width: '100%', maxWidth: '400px' }}
      />
      
      <input
        placeholder="Initial Supply (default: 0)"
        type="number"
        value={initialSupply}
        onChange={(e) => setInitialSupply(e.target.value)}
        disabled={isLoading}
        style={{ marginBottom: '10px', padding: '8px', width: '100%', maxWidth: '400px' }}
      />
      
      <input
        placeholder="Decimals (default: 0)"
        type="number"
        value={decimals}
        onChange={(e) => setDecimals(e.target.value)}
        disabled={isLoading}
        min="0"
        max="8"
        style={{ marginBottom: '10px', padding: '8px', width: '100%', maxWidth: '400px' }}
      />
      
      <div>
        <button 
          onClick={handleCreateToken} 
          disabled={isLoading || !accountId || !privateKey}
          style={{ 
            marginRight: '10px', 
            padding: '10px 20px', 
            cursor: isLoading || !accountId || !privateKey ? 'not-allowed' : 'pointer',
            backgroundColor: isLoading || !accountId || !privateKey ? '#ccc' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {isLoading ? 'Creating...' : 'Create Token'}
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
            padding: '10px 20px', 
            cursor: isLoading ? 'not-allowed' : 'pointer',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Close
        </button>
      </div>
      
      {status && (
        <div style={{ marginTop: '15px', fontSize: '14px', padding: '10px', backgroundColor: status.includes('✅') ? '#d4edda' : '#f8d7da', borderRadius: '4px' }}>
          {status}
        </div>
      )}
    </div>
  );
};

export default TokenCreation;

