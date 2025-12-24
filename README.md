# 🚀 Hedera Token Dashboard

A comprehensive React-based web application for interacting with the Hedera Hashgraph network. This dashboard provides an intuitive interface for managing Hedera accounts, creating tokens, transferring HBAR and tokens, and associating accounts with tokens on the Hedera testnet.

## 📋 Features

### Account Management
- **Create New Accounts**: Generate new Hedera accounts using operator credentials
- **Automatic 10 HBAR Funding**: Newly created accounts automatically receive 10 HBAR transferred from the operator account as initial balance
- **Auto-Account Creation**: Automatically create accounts when credentials are missing
- **Account Credentials Storage**: Securely store operator credentials in browser localStorage for future use
- **Balance Tracking**: View real-time HBAR and token balances for any account

### Token Operations
- **Token Creation**: Create custom tokens with configurable name, symbol, initial supply, and decimals
- **Token Association**: Associate accounts with tokens (required before receiving tokens)
- **Token Transfers**: Send tokens to other accounts on the Hedera network

### HBAR Operations
- **HBAR Transfers**: Send HBAR (Hedera's native cryptocurrency) to other accounts
- **Transaction Tracking**: View transaction IDs for all operations
- **HashScan Integration**: Quick links to verify transactions on HashScan explorer

### User Experience
- **Real-time Updates**: Automatic balance refresh after transactions
- **Status Notifications**: Clear success and error messages for all operations
- **Responsive Design**: Clean, user-friendly interface
- **Form Validation**: Input validation to prevent errors

## 🛠️ Technologies Used

- **React 19.2.3**: Modern React framework for building the UI
- **@hashgraph/sdk 2.78.0**: Official Hedera Hashgraph SDK for blockchain interactions
- **React Scripts 5.0.1**: Build tooling and development server
- **JavaScript/ES6+**: Modern JavaScript features

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher recommended)
- **npm** or **yarn** package manager
- A Hedera testnet account (for operator credentials) - Get one from [Hedera Portal](https://portal.hedera.com/)

## 🚀 Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd hedera-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   or
   ```bash
   yarn start
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Getting Started

1. **Set Up Operator Credentials** (Optional but Recommended):
   - Click "➕ Create New Account"
   - Enter your operator Account ID and Private Key
   - **Important**: Your operator account will fund new accounts with 10 HBAR each, so ensure it has sufficient balance
   - These credentials will be saved in localStorage for future account creation

2. **Create or Enter Account**:
   - If you have operator credentials, accounts can be auto-created
   - **New accounts automatically receive 10 HBAR** transferred from the operator account upon creation
   - **Note**: Ensure your operator account has sufficient HBAR balance (10 HBAR + transaction fees)
   - Alternatively, manually enter an existing Account ID and Private Key
   - The dashboard will automatically fetch balances when an account is entered

3. **View Balances**:
   - HBAR balance is displayed automatically
   - Token balance requires a Token ID to be entered
   - Click "🔄 Refresh Balances" to manually update

### Creating Tokens

1. Click "🪙 Create New Token"
2. Enter:
   - **Token Name**: A descriptive name (e.g., "My Custom Token")
   - **Token Symbol**: A short symbol (e.g., "MCT")
   - **Initial Supply**: Starting amount of tokens (default: 0)
   - **Decimals**: Number of decimal places (0-8, default: 0)
3. Click "Create Token"
4. The Token ID will be automatically populated in the main form

### Transferring HBAR

1. Ensure your Account ID and Private Key are entered
2. In the "💸 Send HBAR" section:
   - Enter the recipient's Account ID
   - Enter the amount to send
3. Click "Send HBAR"
4. Balances will automatically refresh after successful transfer

### Associating Accounts with Tokens

Before an account can receive tokens, it must be associated with the token:

1. In the "🔗 Associate Account with Token" section:
   - Enter the recipient's Account ID
   - Enter the recipient's Private Key
   - Enter the Token ID
2. Click "🔗 Associate Account with Token"
3. Once associated, the account can receive tokens

### Transferring Tokens

1. Ensure both sender and recipient accounts are associated with the token
2. In the token transfer section:
   - Enter the recipient's Account ID
   - Enter the amount of tokens to send
3. Click the transfer button
4. Balances will automatically refresh after successful transfer

## 📁 Project Structure

```
hedera-dashboard/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── AccountCreation.js
│   │   ├── HbarTransferSection.js
│   │   ├── TokenAssociation.js
│   │   ├── TokenCreation.js
│   │   └── TokenTransferSection.js
│   ├── hooks/              # Custom React hooks
│   │   └── useHederaAccount.js
│   ├── services/           # Business logic and API calls
│   │   ├── accountService.js
│   │   ├── hbarTransfer.js
│   │   ├── tokenService.js
│   │   └── tokenTransfer.js
│   ├── App.js              # Main application component
│   ├── App.css             # Application styles
│   └── index.js            # Application entry point
├── package.json
└── README.md
```

## 🎯 Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000). The page will reload automatically when you make changes.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder. The build is optimized for best performance and ready for deployment.

### `npm run eject`
**Note: This is a one-way operation!** Ejects from Create React App, giving you full control over configuration files.

## ⚠️ Important Notes

### Testnet Only
This application is configured to work with the **Hedera Testnet** only. All transactions and operations occur on the testnet, not the mainnet.

### Security Considerations
- **Never share your private keys**: Private keys are stored in browser localStorage and should never be shared
- **Testnet credentials only**: Only use testnet credentials in this application
- **No real value**: Testnet HBAR and tokens have no real-world value

### Getting Testnet HBAR
To get testnet HBAR for testing:
1. Create an account on [Hedera Portal](https://portal.hedera.com/)
2. Use the testnet faucet to receive testnet HBAR
3. Use these credentials as your operator account

## 🔍 Verifying Transactions

All transactions include a transaction ID. You can verify any transaction on [HashScan](https://hashscan.io) by clicking the "🔍 Verify on HashScan" link in the application.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available for educational and development purposes.

## 🔗 Useful Links

- [Hedera Documentation](https://docs.hedera.com/)
- [Hedera Portal](https://portal.hedera.com/)
- [HashScan Explorer](https://hashscan.io)
- [Hedera SDK Documentation](https://docs.hedera.com/hedera/sdks-and-apis/sdks)
- [React Documentation](https://reactjs.org/)

---

**Happy Building on Hedera! 🚀**
