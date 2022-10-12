import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';

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
    // Step 1: Connect to cluster and generate a new Keypair
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    const fromWallet = Keypair.fromSecretKey(FROM_SECRET_KEY);
    const toWalletArray = [
        "52kADyLKNKpC7kJ4fX3u7AjQX4q6UHpEcpD8qYHEXTJM",
        "EGMhU6W74hqTSEeRnCFi3aijNkEBs2NNN6hrk67iV7NU",
        "PyNdYkfBwwsDAwpesgJWUrABc1AvKFXEsb5fZYw16ex",
        "CERrTWqjsbHYuaXQR3aJUsvn4xBTKCn1kmFeEC9FKdQ3",
        "AjTnUNRGA14h4PbMZb9ESFepWnXVs68vBoijjX9GEQ3B",
        "CQqUSHoEaoD2UZnm1NodhaBNU2Udh2fm32FtSV21q4Nv",
        "GmMrE4EcfPRC4XzU1bR2uygVN7wwjtPGzFZfkdQMWBTb",
        "3hSGSFVjPkghomFisAdFbT6bQ4X4sLyFvJABQdvxPmsc",
        "DX6qteWXo4GSm2Jrq6jVjFSyPvnsTWVby4oZZfc8cfz3",
        "9EergP6hXSxRS6FPMHEoekaECGytLbB5Qh5YtCJvmsfv"
    ]

    const mint = new PublicKey("5ACuBmwjgm7Hs4ogpW4iGsGpFjrt72VWUX9vQPgdUwVQ");
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
    )

    for (let i = 0; i < toWalletArray.length; i++)
    {
        var toWallet = toWalletArray[i];
        // Step 2: Airdrop SOL into your from wallet
        const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
        // Wait for airdrop confirmation
        await connection.confirmTransaction(fromAirdropSignature, { commitment: "confirmed" });
        
        console.log("Current TO Wallet {}", toWallet);
        //Step 3: Get the token account of the to-wallet address and if it does not exist, create it
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet);

        //Step 4: Transfer the new token to the to-wallet's token account that was just created
        // Transfer the new token to the "toTokenAccount" we just created
        signature = await transfer(
            connection,
            fromWallet,
            fromTokenAccount.address,
            toTokenAccount.address,
            fromWallet.publicKey,
            1000000000,
            []
        );
        console.log('transfer tx:', signature);        
    }
})();