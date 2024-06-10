import {
  Account,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

import mintAuthorityPK from "../mintAuthority.json";

// Function to generate a new wallet
const createNewWallet = (): Keypair => {
  return Keypair.generate();
};

// Function to request an airdrop of SOL to a specified public key
const requestAirdrop = async (
  connection: Connection,
  recipient: PublicKey,
  amount: number
): Promise<string> => {
  const airdropSignature = await connection.requestAirdrop(
    recipient,
    amount * LAMPORTS_PER_SOL
  );

  return airdropSignature;
};

// Function to mint new tokens to a specified public key
const mintTokens = async (
  connection: Connection,
  mintAuthority: Keypair,
  mint: PublicKey,
  recipient: PublicKey,
  amount: number
) => {
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    mintAuthority,
    mint,
    recipient
  );

  const recipientAddress = tokenAccount.address;

  return await mintTo(
    connection,
    mintAuthority,
    mint,
    recipientAddress,
    mintAuthority.publicKey,
    amount
  );
};

// Function to transfer tokens from one wallet to another
const transferTokens = async (
  connection: Connection,
  mintAuthority: Keypair,
  mint: PublicKey,
  sender: Keypair,
  recipient: PublicKey,
  amount: number
) => {
  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    mintAuthority,
    mint,
    recipient
  );

  const recipientTokenAccountAddress = recipientTokenAccount.address;

  const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    mintAuthority,
    mint,
    sender.publicKey
  );

  const senderTokenAccountAddress = senderTokenAccount.address;

  return await transfer(
    connection,
    mintAuthority,
    senderTokenAccountAddress,
    recipientTokenAccountAddress,
    sender,
    amount
  );
};

// Main async function to execute the script
(async () => {
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "finalized"
  );
  const mintAuthority = Keypair.fromSecretKey(new Uint8Array(mintAuthorityPK));
  const walletA = createNewWallet();
  const walletB = createNewWallet();

  console.log("Mint Authority (Payer): ", mintAuthority.publicKey);
  console.log("Wallet A: ", walletA.publicKey);
  console.log("Wallet B: ", walletB.publicKey);

  // Create a new mint with 6 decimal places
  const mint = await createMint(
    connection,
    mintAuthority,
    mintAuthority.publicKey,
    null,
    6
  );

  console.log("Mint: ", mint);

  // Mint 10 tokens to Wallet A
  const mintTx = await mintTokens(
    connection,
    mintAuthority,
    mint,
    walletA.publicKey,
    10e6
  );
  console.log("Mint Transaction: ", mintTx);

  // Transfer 1 token from Wallet A to Wallet B
  const transferTx = await transferTokens(
    connection,
    mintAuthority,
    mint,
    walletA,
    walletB.publicKey,
    10e5
  );
  console.log("Transfer Transaction: ", transferTx);
})();
