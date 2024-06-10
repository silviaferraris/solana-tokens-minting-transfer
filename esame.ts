import { Account, createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from "@solana/spl-token";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import mintAuthorityPK from "../walletA.json";

const getNewWallet = (): Keypair => {
    return Keypair.generate();
}

const airdrop = async (connection: Connection, to: PublicKey, amount: number): Promise<string> => {

    const airdropSignature = await connection.requestAirdrop(
        to,
        amount * LAMPORTS_PER_SOL
    );

    return airdropSignature;
}

const emitNewTokens = async (connection: Connection, mintAuthority: Keypair, mint: PublicKey, to: PublicKey, amount: number) => {

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        mintAuthority,
        mint,
        to,
    );

    const ata = tokenAccount.address;

    return await mintTo(
        connection,
        mintAuthority,
        mint,
        ata,
        mintAuthority.publicKey,
        amount
    );
}

const transferTokens = async (connection: Connection, mintAuthority: Keypair, mint: PublicKey, from: Keypair, to: PublicKey, amount: number) => {

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, 
        mintAuthority,
        mint,
        to,
    );

    const toAddr = toTokenAccount.address;

    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, 
        mintAuthority,
        mint,
        from.publicKey,
    );

    const fromAddr = fromTokenAccount.address;
    
    return await transfer(
        connection,
        mintAuthority,
        fromAddr,
        toAddr,
        from,
        amount
    );
}


(async () => {

    const connection = new Connection("https://api.devnet.solana.com", "finalized");
    const mintAuthority = Keypair.fromSecretKey(new Uint8Array(mintAuthorityPK))//getNewWallet();
    const walletA = getNewWallet();
    const walletB = getNewWallet();

    console.log("Mint Authority (Payer): ", mintAuthority.publicKey);
    console.log("Wallet A: ", walletA.publicKey);
    console.log("Wallet B: ", walletB.publicKey);

    // Airdrop 1 SOL su MintAuthority
    /*try {
        const airdropTx = await airdrop(connection, mintAuthority.publicKey, 1);
        console.log("Airdrop Tx: ", airdropTx);
    }
    catch (e) {
        console.log(e);
        return;
    }*/

    const mint = await createMint(
        connection,
        mintAuthority,
        mintAuthority.publicKey,
        null,
        6,
    );

    console.log("Mint: ", mint);

    // Minto 10 Token su WalletA
    const emitTx = await emitNewTokens(connection, mintAuthority, mint, walletA.publicKey, 10e6);
    console.log("Emit trasaction: ", emitTx);

    // Trasferisco 1 Token da WalletA --> WalletB
    const transferTx = await transferTokens(connection, mintAuthority, mint, walletA, walletB.publicKey, 10e5);
    console.log("Trasfer transaction: ", transferTx);

})()

