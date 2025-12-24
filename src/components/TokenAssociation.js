import React, { useState } from 'react';
import { associateToken } from '../services/tokenService';

const TokenAssociation = ({ client, tokenId, onAssociationSuccess, currentAccountId, currentPrivateKey }) => {
  const [recipientAccountId, setRecipientAccountId] = useState('');
  const [recipientPrivateKey, setRecipientPrivateKey] = useState('');
  const [associationTokenId, setAssociationTokenId] = useState(tokenId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const useCurrentAccount = () => {
    if (currentAccountId && currentPrivateKey) {
      setRecipientAccountId(currentAccountId);
      setRecipientPrivateKey(currentPrivateKey);
    }
  };

  // Update associationTokenId when tokenId prop changes
  React.useEffect(() => {
    if (tokenId) {
      setAssociationTokenId(tokenId);
    }
  }, [tokenId]);

  const handleAssociate = async () => {
    if (!recipientAccountId || !recipientPrivateKey || !associationTokenId) {
      setStatus('❌ Please fill in Recipient Account ID, Private Key, and Token ID');
      return;
    }

    setIsLoading(true);
    setStatus('Associating account with token...');
    
    try {
      const { receipt, transactionId } = await associateToken(client, recipientAccountId, recipientPrivateKey, associationTokenId);
      setStatus(`✅ Account ${recipientAccountId} associated with token ${associationTokenId}! Tx: ${transactionId}`);
      
      // Clear form on success
      setRecipientAccountId('');
      setRecipientPrivateKey('');
      
      // Notify parent to refresh balances
      if (onAssociationSuccess) {
        onAssociationSuccess();
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatus('');
      }, 5000);
    } catch (error) {
      setStatus(`❌ Association failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="association-section" style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ffa500', borderRadius: '8px', backgroundColor: '#fff8e1' }}>
      <h3 style={{color: 'black'}}>🔗 Associate Account with Token</h3>
      <div style={{ 
        fontSize: '12px', 
        color: '#856404', 
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '4px'
      }}>
        <strong>⚠️ Important:</strong> Before receiving tokens, an account must be associated with the token. 
        <br /><br />
        <strong>Why you need the private key:</strong> In Hedera, only the account owner can associate their account with a token. 
        The association transaction must be signed by the account being associated, which requires that account's private key.
        <br /><br />
        <strong>In production:</strong> The recipient would typically associate their own account themselves. 
        This feature is useful when you control multiple accounts for testing purposes.
      </div>
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto 10px auto' }}>
        <input
          placeholder="Recipient Account ID (0.0.123456)"
          value={recipientAccountId}
          onChange={(e) => setRecipientAccountId(e.target.value)}
          disabled={isLoading}
          style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        />
        {currentAccountId && currentPrivateKey && !recipientAccountId && (
          <button
            onClick={useCurrentAccount}
            style={{
              position: 'absolute',
              right: '5px',
              top: '5px',
              padding: '4px 8px',
              fontSize: '11px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            title="Use current account credentials"
          >
            Use Current Account
          </button>
        )}
      </div>
      
      <input
        placeholder="Recipient Private Key"
        type="text"
        value={recipientPrivateKey}
        onChange={(e) => setRecipientPrivateKey(e.target.value)}
        disabled={isLoading}
        style={{ marginBottom: '10px', padding: '8px', width: '100%', maxWidth: '400px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
      />
      
      <input
        placeholder="Token ID (0.0.987654)"
        value={associationTokenId}
        onChange={(e) => setAssociationTokenId(e.target.value)}
        disabled={isLoading}
        style={{ marginBottom: '10px', padding: '8px', width: '100%', maxWidth: '400px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
      />
      
      <button 
        onClick={handleAssociate} 
        disabled={isLoading || !recipientAccountId || !recipientPrivateKey || !associationTokenId}
        style={{ 
          padding: '10px 20px', 
          cursor: isLoading || !recipientAccountId || !recipientPrivateKey || !associationTokenId ? 'not-allowed' : 'pointer',
          backgroundColor: isLoading || !recipientAccountId || !recipientPrivateKey || !associationTokenId ? '#ccc' : '#ff9800',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px'
        }}
      >
        {isLoading ? 'Associating...' : '🔗 Associate Account with Token'}
      </button>
      
      {status && (
        <div style={{ 
          marginTop: '15px', 
          fontSize: '14px', 
          padding: '10px',
          backgroundColor: status.includes('✅') ? '#d4edda' : '#f8d7da',
          borderRadius: '4px'
        }}>
          {status}
        </div>
      )}
    </div>
  );
};

export default TokenAssociation;

