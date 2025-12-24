import React, { useState, useEffect, useCallback } from 'react';
import { Client } from '@hashgraph/sdk';

import './App.css';
import { useHederaAccount } from './hooks/useHederaAccount';
import { fetchAccountBalances, createAccount as createAccountService } from './services/accountService';
import { createToken as createTokenService } from './services/tokenService';
import AccountCreation from './components/AccountCreation';
import TokenCreation from './components/TokenCreation';
import TokenAssociation from './components/TokenAssociation';
import HbarTransferSection from './components/HbarTransferSection';
import TokenTransferSection from './components/TokenTransferSection';

const TESTNET_CLIENT = Client.forTestnet();

function App() {
  const {
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
  } = useHederaAccount();

  const [balance, setBalance] = useState(0);
  const [hbarBalance, setHbarBalance] = useState(0);
  const [status, setStatus] = useState('');
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showCreateToken, setShowCreateToken] = useState(false);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [createdAccountInfo, setCreatedAccountInfo] = useState(null);
  const [createdTokenInfo, setCreatedTokenInfo] = useState(null);

  // Query balances
  const fetchBalances = useCallback(async () => {
    if (!accountId) {
      setStatus('❌ Please enter Account ID to fetch balances');
      return;
    }
    
    setIsLoadingBalances(true);
    setStatus('Fetching balances...');
    
    try {
      const { hbarBalance: hbar, tokenBalance: token } = await fetchAccountBalances(
        TESTNET_CLIENT,
        accountId,
        tokenId || null
      );
      setHbarBalance(hbar);
      setBalance(token);
      setStatus('✅ Balances updated successfully');
      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus('');
      }, 3000);
    } catch (error) {
      setStatus(`❌ Error fetching balances: ${error.message}`);
      setHbarBalance('0');
      setBalance('0');
    } finally {
      setIsLoadingBalances(false);
    }
  }, [accountId, tokenId]);

  // Create new account
  const createAccount = async (autoCreate = false) => {
    if (!operatorId || !operatorKey) {
      if (autoCreate) {
        setStatus('ℹ️ No operator credentials. Please set operator to auto-create account.');
        return;
      }
      setStatus('❌ Please enter operator Account ID and Private Key');
      return;
    }

    if (!autoCreate) {
      setStatus('Creating account...');
    }
    
    try {
      const { newAccountId, newPrivateKey } = await createAccountService(
        TESTNET_CLIENT,
        operatorId,
        operatorKey,
        0
      );

      // Auto-fill the fields
      setAccountId(newAccountId);
      setPrivateKey(newPrivateKey);
      
      // Store created account info for display
      if (!autoCreate) {
        setCreatedAccountInfo({
          accountId: newAccountId,
          privateKey: newPrivateKey
        });
        setStatus(`✅ Account created! Account ID: ${newAccountId}`);
        // Clear the created account info after 30 seconds
        setTimeout(() => setCreatedAccountInfo(null), 30000);
      }
    } catch (error) {
      if (autoCreate) {
        setStatus(`⚠️ Auto-create failed: ${error.message}`);
      } else {
        setStatus(`❌ Failed to create account: ${error.message}`);
      }
    }
  };

  // Auto-create account if missing (only once on mount)
  useEffect(() => {
    const checkAndCreateAccount = async () => {
      // Only auto-create if both accountId and privateKey are missing
      // and operator credentials are available
      if (!accountId && !privateKey && operatorId && operatorKey) {
        await createAccount(true);
      }
    };
    
    // Small delay to ensure operator credentials are loaded from localStorage
    const timer = setTimeout(checkAndCreateAccount, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Create new token
  const createToken = async (tokenData) => {
    if (!accountId || !privateKey) {
      throw new Error('Account ID and Private Key are required to create a token');
    }

    const result = await createTokenService(
      TESTNET_CLIENT,
      accountId,
      privateKey,
      tokenData.tokenName,
      tokenData.tokenSymbol,
      tokenData.initialSupply || 0,
      tokenData.decimals || 0
    );

    // Include token metadata in result
    return {
      ...result,
      tokenName: tokenData.tokenName,
      tokenSymbol: tokenData.tokenSymbol,
      initialSupply: tokenData.initialSupply || 0,
      decimals: tokenData.decimals || 0,
      treasuryAccountId: accountId
    };
  };

  // Handle token creation success
  const handleTokenCreated = (tokenInfo) => {
    setTokenId(tokenInfo.tokenId);
    // Store token info for display
    setCreatedTokenInfo(tokenInfo);
    // Auto-dismiss after 30 seconds
    setTimeout(() => setCreatedTokenInfo(null), 30000);
    // Refresh balances after token creation
    setTimeout(() => {
      fetchBalances();
    }, 1000);
  };

  // Auto-fetch balances when accountId or tokenId changes
  useEffect(() => {
    if (accountId) {
      fetchBalances();
    }
  }, [accountId, tokenId, fetchBalances]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Hedera Token Dashboard</h1>
        
        <AccountCreation
          showCreateAccount={showCreateAccount}
          setShowCreateAccount={setShowCreateAccount}
          operatorId={operatorId}
          setOperatorId={setOperatorId}
          operatorKey={operatorKey}
          setOperatorKey={setOperatorKey}
          onCreateAccount={() => createAccount(false)}
          onClearOperator={clearOperator}
          createdAccountInfo={createdAccountInfo}
          onDismissSuccess={() => setCreatedAccountInfo(null)}
        />

        <TokenCreation
          showCreateToken={showCreateToken}
          setShowCreateToken={setShowCreateToken}
          accountId={accountId}
          privateKey={privateKey}
          onCreateToken={createToken}
          onTokenCreated={handleTokenCreated}
          createdTokenInfo={createdTokenInfo}
          onDismissSuccess={() => setCreatedTokenInfo(null)}
        />
        
        <div className="inputs">
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              placeholder="Account ID (0.0.123456)"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            />
            {!accountId && operatorId && operatorKey && (
              <span style={{ fontSize: '12px', color: '#666', marginTop: '5px', display: 'block' }}>
                💡 Account will be auto-created if missing
              </span>
            )}
          </div>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              placeholder="Private Key"
              type="text"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            />
            {!privateKey && operatorId && operatorKey && (
              <span style={{ fontSize: '12px', color: '#666', marginTop: '5px', display: 'block' }}>
                💡 Private key will be auto-generated if missing
              </span>
            )}
          </div>
          <input
            placeholder="Token ID (0.0.987654)"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
          />
          {!accountId && !privateKey && operatorId && operatorKey && (
            <button 
              onClick={() => createAccount(false)}
              style={{ 
                marginTop: '10px', 
                padding: '10px 20px', 
                cursor: 'pointer',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              🔄 Create Account Now
            </button>
          )}
        </div>

        <div className="balances" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0 }}>Account Balances</h3>
            <button 
              onClick={fetchBalances} 
              disabled={isLoadingBalances || !accountId}
              style={{ 
                padding: '8px 16px', 
                cursor: isLoadingBalances || !accountId ? 'not-allowed' : 'pointer',
                backgroundColor: isLoadingBalances ? '#ccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              {isLoadingBalances ? '🔄 Loading...' : '🔄 Refresh Balances'}
            </button>
          </div>
          <div>💰 HBAR: {hbarBalance}</div>
          <div>🎫 Tokens: {balance}</div>
          {!accountId && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '10px', fontStyle: 'italic' }}>
              Enter Account ID to view balances
            </div>
          )}
          {accountId && !tokenId && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '10px', fontStyle: 'italic' }}>
              Token balance requires Token ID
            </div>
          )}
        </div>

        <HbarTransferSection
          client={TESTNET_CLIENT}
          accountId={accountId}
          privateKey={privateKey}
          onTransferSuccess={fetchBalances}
        />

        <TokenAssociation
          client={TESTNET_CLIENT}
          tokenId={tokenId}
          onAssociationSuccess={fetchBalances}
          currentAccountId={accountId}
          currentPrivateKey={privateKey}
        />

        <TokenTransferSection
          client={TESTNET_CLIENT}
          accountId={accountId}
          privateKey={privateKey}
          tokenId={tokenId}
          onTransferSuccess={fetchBalances}
        />

        <div className="status">{status}</div>
        <a href="https://hashscan.io" target="_blank" rel="noopener noreferrer">🔍 Verify on HashScan</a>
      </header>
    </div>
  );
}

export default App;
