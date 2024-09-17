import { getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, ExtensionType, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE, getTokenMetadata } from "@solana/spl-token";
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
       
        } catch (error) {
        console.error("error in transaction", error);
       
        }    
    }

mainPayer().catch(error => {
    console.error("Error:", error);
});

