# solana-tokens-minting-transfer

This repository contains a script to perform basic token operations on the Solana blockchain using the `@solana/spl-token` and `@solana/web3.js` libraries. The script demonstrates the following operations:

1. **Creating New Wallets**: Generates new Solana wallets.
2. **Airdropping SOL**: Requests an airdrop of SOL to a specified wallet.
3. **Minting New Tokens**: Creates new tokens and mints them to a specified wallet.
4. **Transferring Tokens**: Transfers tokens from one wallet to another.

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- Yarn installed for package management.

### Installing

1. Clone the repository:
   
   ```sh
   git clone git@github.com:silviaferraris/solana-tokens-minting-transfer.git
   cd solana-tokens-minting-transfer
   ```
3. Install the dependencies:
   
   ```sh
   yarn install
   ```
4. Run the script using
   
   ```sh
   yarn exam
   ```

### Script Overview

- createNewWallet: Generates a new Solana wallet.
- requestAirdrop: Requests an airdrop of SOL to the provided public key.
- mintTokens: Mints new tokens to the specified public key.
- transferTokens: Transfers tokens from one wallet to another.

### Example Output
The script logs various details during execution, such as public keys of the wallets, transaction signatures, and addresses involved in token operations.

```sh
Mint Authority (Payer):  <Mint Authority PublicKey>
Wallet A:  <Wallet A PublicKey>
Wallet B:  <Wallet B PublicKey>
Airdrop Transaction:  <Airdrop Transaction Signature>
Mint:  <Mint PublicKey>
Mint Transaction:  <Mint Transaction Signature>
Transfer Transaction:  <Transfer Transaction Signature>
```

### Acknowledgments
- Solana for providing the blockchain platform.
- @solana/web3.js for the JavaScript API to interact with Solana.
- @solana/spl-token for the SPL Token Library.

Feel free to fork the repository and contribute!
