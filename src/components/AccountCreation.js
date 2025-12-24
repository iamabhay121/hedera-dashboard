import React from 'react';

const AccountCreation = ({ 
  showCreateAccount, 
  setShowCreateAccount, 
  operatorId, 
  setOperatorId, 
  operatorKey, 
  setOperatorKey, 
  onCreateAccount,
  onClearOperator 
}) => {
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

