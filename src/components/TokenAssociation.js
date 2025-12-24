import React, { useState } from 'react';
import { associateToken } from '../services/tokenService';

const TokenAssociation = ({ client, tokenId, onAssociationSuccess }) => {
  const [recipientAccountId, setRecipientAccountId] = useState('');
  const [recipientPrivateKey, setRecipientPrivateKey] = useState('');
  const [associationTokenId, setAssociationTokenId] = useState(tokenId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

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
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
        Before receiving tokens, an account must be associated with the token. Enter the account details that need to be associated.
      </p>
      
      <input
        placeholder="Recipient Account ID (0.0.123456)"
        value={recipientAccountId}
        onChange={(e) => setRecipientAccountId(e.target.value)}
        disabled={isLoading}
        style={{ marginBottom: '10px', padding: '8px', width: '100%', maxWidth: '400px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
      />
      
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
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
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
      </div>
      
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

