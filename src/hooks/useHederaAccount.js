import { useState, useEffect } from 'react';

/**
 * Custom hook for managing Hedera account state and localStorage
 */
export const useHederaAccount = () => {
  const [accountId, setAccountId] = useState(() => {
    return localStorage.getItem('hedera_account_id') || '';
  });
  const [privateKey, setPrivateKey] = useState(() => {
    return localStorage.getItem('hedera_private_key') || '';
  });
  const [tokenId, setTokenId] = useState(() => {
    return localStorage.getItem('hedera_token_id') || '';
  });
  const [operatorId, setOperatorId] = useState(() => {
    return localStorage.getItem('hedera_operator_id') || '';
  });
  const [operatorKey, setOperatorKey] = useState(() => {
    return localStorage.getItem('hedera_operator_key') || '';
  });

  // Save operator credentials to localStorage whenever they change
  useEffect(() => {
    if (operatorId) {
      localStorage.setItem('hedera_operator_id', operatorId);
    }
    if (operatorKey) {
      localStorage.setItem('hedera_operator_key', operatorKey);
    }
  }, [operatorId, operatorKey]);

  // Save account credentials to localStorage whenever they change
  useEffect(() => {
    if (accountId) {
      localStorage.setItem('hedera_account_id', accountId);
    }
    if (privateKey) {
      localStorage.setItem('hedera_private_key', privateKey);
    }
    if (tokenId) {
      localStorage.setItem('hedera_token_id', tokenId);
    }
  }, [accountId, privateKey, tokenId]);

  const clearOperator = () => {
    setOperatorId('');
    setOperatorKey('');
    localStorage.removeItem('hedera_operator_id');
    localStorage.removeItem('hedera_operator_key');
  };

  return {
    accountId,
    setAccountId,
    privateKey,
    setPrivateKey,
    tokenId,
    setTokenId,
    operatorId,
    setOperatorId,
    operatorKey,
    setOperatorKey,
    clearOperator
  };
};

