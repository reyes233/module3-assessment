import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';

const FROM_SECRET_KEY = new Uint8Array(
    [
        181, 250, 170, 152, 194,  91,   0, 115, 104, 148,  77,
        108,  84, 123, 227,  50, 191,  82, 164,  92,  63, 124,
        99, 158, 218, 179, 194,  62,  87,  41, 217,  92, 186,
        112, 213, 151,  72, 205,  18, 163, 156, 118,  46,  51,
        101, 199, 197, 253,  61,  49, 209, 177, 219, 250, 196,
        141, 101,  15, 162,  61,  87,  11, 210,  46
    ]
);

(async () => {
    // Step 1: Connect to cluster
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    const fromWallet = Keypair.fromSecretKey(FROM_SECRET_KEY);
        
    // Step 2: Airdrop SOL into your from wallet
    const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
    // Wait for airdrop confirmation
    await connection.confirmTransaction(fromAirdropSignature, { commitment: "confirmed" });

    // Step 3: Create new token mint and get the token account of the fromWallet address
    //If the token account does not exist, create it
    const mint = await createMint(connection, fromWallet, fromWallet.publicKey, null, 9);
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
    )

    //Step 4: Mint a new token to the from account
    let signature = await mintTo(
        connection,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        100000000000,
        []
    );
    console.log('mint tx:', signature); 

})();