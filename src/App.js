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
  const createAccount = async (balance = 10, automaticAssociation = '0', memo = '', autoCreate = false) => {
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
        balance,
        automaticAssociation,
        memo
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
        await createAccount(10, '0', '', true);
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
          onCreateAccount={(balance, automaticAssociation, memo) => createAccount(balance, automaticAssociation, memo, false)}
          onClearOperator={clearOperator}
          createdAccountInfo={createdAccountInfo}
          onDismissSuccess={() => setCreatedAccountInfo(null)}
        />
        <br />
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
        
        <div className="inputs" style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #dee2e6',
          marginBottom: '20px',
          display: 'block'
        }}>
          <h3 style={{ 
            marginTop: 0, 
            marginBottom: '25px', 
            color: '#333', 
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: '600',
            paddingBottom: '15px',
            borderBottom: '2px solid #dee2e6',
            display: 'block',
            width: '100%'
          }}>
            Account & Token Information
          </h3>
          
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            marginBottom: '20px',
            flexWrap: 'wrap',
            alignItems: 'flex-start'
          }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: '600', 
                marginBottom: '8px',
                color: '#333'
              }}>
                Account ID <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                placeholder="0.0.123456"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
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
              {!accountId && operatorId && operatorKey && (
                <small style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  color: '#6c757d', 
                  marginTop: '5px' 
                }}>
                  💡 Account will be auto-created if missing
                </small>
              )}
            </div>
            
            <div style={{ flex: '2', minWidth: '300px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: '600', 
                marginBottom: '8px',
                color: '#333'
              }}>
                Private Key <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                placeholder="Enter your private key"
                type="text"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
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
              {!privateKey && operatorId && operatorKey && (
                <small style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  color: '#6c757d', 
                  marginTop: '5px' 
                }}>
                  💡 Private key will be auto-generated if missing
                </small>
              )}
            </div>
            
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: '600', 
                marginBottom: '8px',
                color: '#333'
              }}>
                Token ID <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#6c757d' }}>(Optional)</span>
              </label>
              <input
                placeholder="0.0.987654"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
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
                Required to view token balance and perform token operations
              </small>
            </div>
          </div>
          
          {!accountId && !privateKey && operatorId && operatorKey && (
            <div style={{ 
              paddingTop: '15px', 
              borderTop: '1px solid #dee2e6'
            }}>
              <button 
                onClick={() => createAccount(10, '0', '', false)}
                style={{ 
                  padding: '10px 24px', 
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  transition: 'background-color 0.15s ease-in-out'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
              >
                🔄 Create Account Now
              </button>
            </div>
          )}
        </div>

        <div className="balances" style={{ 
          position: 'relative',
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #dee2e6',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#333' }}>Account Balances</h3>
            <button 
              onClick={fetchBalances} 
              disabled={isLoadingBalances || !accountId}
              style={{ 
                padding: '10px 20px', 
                fontSize: '14px',
                fontWeight: '600',
                cursor: isLoadingBalances || !accountId ? 'not-allowed' : 'pointer',
                backgroundColor: isLoadingBalances ? '#ccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                transition: 'background-color 0.15s ease-in-out',
                opacity: isLoadingBalances || !accountId ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoadingBalances && accountId) {
                  e.target.style.backgroundColor = '#45a049';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoadingBalances && accountId) {
                  e.target.style.backgroundColor = '#4CAF50';
                }
              }}
            >
              {isLoadingBalances ? '⏳ Loading...' : '🔄 Refresh Balances'}
            </button>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: '#6c757d',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>
                HBAR Balance
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#333'
              }}>
                💰 {hbarBalance}
              </div>
            </div>
            
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: '#6c757d',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>
                Token Balance
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#333'
              }}>
                🎫 {balance}
              </div>
            </div>
          </div>
          
          {!accountId && (
            <div style={{ 
              fontSize: '13px', 
              color: '#6c757d', 
              padding: '10px',
              backgroundColor: '#fff3cd',
              borderRadius: '4px',
              border: '1px solid #ffc107'
            }}>
              ⚠️ Enter Account ID to view balances
            </div>
          )}
          {accountId && !tokenId && (
            <div style={{ 
              fontSize: '13px', 
              color: '#6c757d', 
              padding: '10px',
              backgroundColor: '#d1ecf1',
              borderRadius: '4px',
              border: '1px solid #bee5eb'
            }}>
              💡 Token balance requires Token ID
            </div>
          )}
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '20px',
          flexWrap: 'wrap',
          alignItems: 'stretch'
        }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <HbarTransferSection
              client={TESTNET_CLIENT}
              accountId={accountId}
              privateKey={privateKey}
              onTransferSuccess={fetchBalances}
            />
          </div>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <TokenTransferSection
              client={TESTNET_CLIENT}
              accountId={accountId}
              privateKey={privateKey}
              tokenId={tokenId}
              onTransferSuccess={fetchBalances}
            />
          </div>
        </div>

        <TokenAssociation
          client={TESTNET_CLIENT}
          tokenId={tokenId}
          onAssociationSuccess={fetchBalances}
          currentAccountId={accountId}
          currentPrivateKey={privateKey}
        />

        <div className="status">{status}</div>
        <a href="https://hashscan.io" target="_blank" rel="noopener noreferrer">🔍 Verify on HashScan</a>
      </header>
    </div>
  );
}

export default App;
