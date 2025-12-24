import React, { useState } from 'react';

const TokenCreation = ({ 
  showCreateToken, 
  setShowCreateToken, 
  accountId,
  privateKey,
  onCreateToken,
  onTokenCreated
}) => {
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState('0');
  const [decimals, setDecimals] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

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
      
      // Notify parent
      if (onTokenCreated) {
        onTokenCreated(result.tokenId);
      }
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        setShowCreateToken(false);
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

