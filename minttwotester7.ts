import { getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, ExtensionType, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE, getTokenMetadata, createMintToInstruction, mintTo, getMint, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { createInitializeInstruction, createUpdateFieldInstruction, TokenMetadata, pack } from "@solana/spl-token-metadata";
import {Connection, Keypair, clusterApiUrl, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction, NonceAccount, PublicKey, VersionedTransaction, TransactionMessage, sendAndConfirmRawTransaction } from "@solana/web3.js";

declare global  { interface Window {solana?: any;}}

const isPhantomInstalled = window.solana?.isPhantom;
const getProvider = () => {
    if ('phantom' in window) {
        const provider = window.solana;
        if (provider?.isPhantom) {
            return provider;
        }
    }
    window.open('https://phantom.app/', '_blank');
};

const connection = new Connection('https://api.devnet.solana.com');

async function mainPayer() {

    await window.solana.connect();
    
    const provider =  await getProvider();
    const payer= provider.publicKey.toString();
    console.log('payer as provider.pub to string', payer);
    console.log('provider.publicKey', provider.publicKey);
    
    const mint = Keypair.generate();
        console.log("mint", mint.publicKey.toBase58());
    const newTokenPayer = Keypair.generate();
        console.log('new token payer', newTokenPayer.publicKey.toBase58);

    //these are the assigned variables that work for test
    //let itemName = "LVP Oak";
    //let itemDescription = "lvp oak";
    //let itemLocation = "Savannah";
    //let itemPrice = "5";

    const urlParams = new URLSearchParams(window.location.search);
    // get the values from the url params
    let itemName = urlParams.get('itemName');
    let itemDescription = urlParams.get('itemName');
    let itemLocation = urlParams.get('itemLocation');
    let itemPrice = urlParams.get('itemPrice');

    // display the item details
    let itemDetails = document.getElementById('itemDetails');
       itemDetails.textContent = 
     "What is the Item: "+ itemName + "\n" +
     "Where is the Item: " + itemLocation + "\n" +
     "What is the Price: " + itemPrice
     ;

    const metadata : TokenMetadata= {
            mint: mint.publicKey,
            name: itemName,
            symbol: "item",
            uri: "https://itembancindex.io",
            additionalMetadata: [
                ["what", itemDescription],
                ["where", itemLocation],
                ["whatprice", itemPrice] 
            ]
        };
    //have to initialize the mint as above before the metadata as below
    const mintSpace = getMintLen([ExtensionType.MetadataPointer]);
    const metadataSpace = TYPE_SIZE + LENGTH_SIZE + TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
    const lamports = await connection.getMinimumBalanceForRentExemption(
        mintSpace + metadataSpace);
    console.log('lamports', lamports);
    
    const message= "Please sign to authorize creation of NFTs";
    const encodeMessage= new TextEncoder().encode(message);
    const {signature1}= await window.solana.signMessage(encodeMessage, 'utf8');
    console.log('message signed ');


    //or.... get values form the url params in itemtwo.html


const moveMoney = SystemProgram.transfer({
    fromPubkey: provider.publicKey,
    toPubkey: newTokenPayer.publicKey,
    lamports: 10000000
})

const createAccountIx = SystemProgram.createAccount({
        fromPubkey: provider.publicKey,
        newAccountPubkey: mint.publicKey,
        space: mintSpace, lamports,
        programId: TOKEN_2022_PROGRAM_ID
        });
    
const initializeMetadataPointerIx = createInitializeMetadataPointerInstruction(
        mint.publicKey,
        provider.publicKey,
        mint.publicKey,
        TOKEN_2022_PROGRAM_ID
        );
    
const initializeMintIx= createInitializeMintInstruction(
        mint.publicKey,
        2,
        provider.publicKey,
        null,
        TOKEN_2022_PROGRAM_ID
        ); 

    const initializeMetadataIx = createInitializeInstruction({
    mint: mint.publicKey,
    metadata: mint.publicKey,
    mintAuthority: provider.publicKey,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    programId: TOKEN_2022_PROGRAM_ID,
    updateAuthority: provider.publicKey
    });

    const updateMetadataField1 = createUpdateFieldInstruction({
    metadata: mint.publicKey,
    programId: TOKEN_2022_PROGRAM_ID,
    updateAuthority: provider.publicKey,
    field: metadata.additionalMetadata[0][0],
    value: metadata.additionalMetadata[0][1]
    });

    const updateMetadataField2 = createUpdateFieldInstruction({
    metadata: mint.publicKey,
    programId: TOKEN_2022_PROGRAM_ID,
    updateAuthority: provider.publicKey,
    field: metadata.additionalMetadata[1][0],
    value: metadata.additionalMetadata[1][1]
    });

    const updateMetadataField3 = createUpdateFieldInstruction({
    metadata: mint.publicKey,
    programId: TOKEN_2022_PROGRAM_ID,
    updateAuthority: provider.publicKey,
    field: metadata.additionalMetadata[2][0],
    value: metadata.additionalMetadata[2][1]
    });

    //const makeTokens = createMintToInstruction({
    //mint: mint.publicKey, 
    //destination: 'CLTycZtfAzkyVb2YZY5ySKtQoJo89tHoEM1T6LaCveM4', 
    //authorityPublicKey: provider.publicKey, 
    //amount: 1000000000, 
    //multiSigners:[provider], 
    //programId: TOKEN_PROGRAM_ID
    //});

   


    try {
       
        console.log("provider public", payer);
        const mintpublic= mint.publicKey.toBase58();
        console.log("mint", mintpublic);
        console.log("mintspace", mintSpace);
        console.log('lamports', lamports);
      
        let {blockhash} = await connection.getLatestBlockhash();
        const transaction = new Transaction();
        transaction.recentBlockhash = blockhash;
        const latestBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = latestBlockhash.blockhash;
        transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;
        transaction.feePayer = provider.publicKey;
       
        
        transaction.add(
            createAccountIx,
            initializeMetadataPointerIx,
            initializeMintIx,
            //mint must preceed metadata
            initializeMetadataIx,
            updateMetadataField1,
            updateMetadataField2,
            updateMetadataField3
        );
        
        
       
        console.log ('transaction', transaction);
        console.log('payer', payer);
        console.log('mint', mint.publicKey);
        transaction.sign(mint);
        const sig1 = await window.solana.signTransaction(transaction);
        if (sig1.recentBlockhash !== transaction.recentBlockhash) {
            throw new Error ('Transaction has changed since signing');
        }

        console.log("phantom account signed", sig1);
        console.log('mintpair', mint);
        
        console.log('sig1 transaction mint signed too', sig1)
        console.log("transaction2", transaction);
        const serializedTransaction= sig1.serialize();
        console.log("serialTrans", serializedTransaction);
       
        const txsignature=await connection.sendRawTransaction(serializedTransaction);
        console.log('raw sig', txsignature);
        //const transactionBase64 = serializedTransaction.toString('base64');
        //console.log('transaction', transactionBase64);
        //return{encoded_transaction: transactionBase64};

        //const mintInfo= await getMint(connection, mint.publicKey);
        //console.log(mintInfo.supply);
        //const theMint= await mintTo(connection, newTokenPayer, mint.publicKey, provider.publicKey, provider.publicKey, 1000000000);
        //console.log(theMint);
       
        } catch (error) {
        console.error("error in transaction", error);
  
        } 
        
        const message2= "Please sign for creation of token";
        const encodeMessage2= new TextEncoder().encode(message2);
        const {signature2}= await window.solana.signMessage(encodeMessage2, 'utf8');
        console.log('message signed ');

        try{

        let {blockhash} = await connection.getLatestBlockhash();
        const transaction2 = new Transaction();
        transaction2.recentBlockhash = blockhash;
        const latestBlockhash = await connection.getLatestBlockhash();
        transaction2.recentBlockhash = latestBlockhash.blockhash;
        transaction2.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;
        transaction2.feePayer = provider.publicKey;
       
console.log('mint.publicKey: ', mint.publicKey);
console.log('provider.publicKey: ', provider.publicKey)


   

    
    const getata=await getAssociatedTokenAddress(
        mint.publicKey, 
        provider.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    );
    const ata = getata.toBase58();
    
    console.log('ata', ata);

    const makeata = createAssociatedTokenAccountInstruction(
        provider.publicKey,
        getata,
        provider.publicKey,
        mint.publicKey,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    );

       
    const makeTokens = createMintToInstruction(
    mint.publicKey, 
    getata, 
    provider.publicKey, 
    100n, 
    provider, 
    TOKEN_2022_PROGRAM_ID
    );
    
     
    //const signata= await window.solana.signTransaction(ata);
      
            transaction2.add(
                makeata,
                makeTokens
            );
          
            const sig2 = await window.solana.signTransaction(transaction2);
            if (sig2.recentBlockhash !== transaction2.recentBlockhash) {
                throw new Error ('Transaction has changed since signing');
            }

       
        
        console.log('token mint signed too', sig2)
        console.log("transaction2", transaction2);
        const serializedTransaction2= sig2.serialize();
        console.log("serialTrans", serializedTransaction2);
       
        const txsignature2=await connection.sendRawTransaction(serializedTransaction2);
        console.log('raw sig', txsignature2);
        

        }catch(error){
            console.error("error in transaction", error);
        }
    }

mainPayer().catch(error => {
    console.error("Error:", error);
});