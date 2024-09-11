import { getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, ExtensionType, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE, getTokenMetadata } from "@solana/spl-token";
import { createInitializeInstruction, createUpdateFieldInstruction, TokenMetadata, pack } from "@solana/spl-token-metadata";
//import { ConnectionProvider } from "@solana/wallet-adapter-react";
import {Connection, Keypair, clusterApiUrl, sendAndConfirmTransaction, SystemProgram, Transaction, PublicKey, VersionedTransaction, TransactionMessage, sendAndConfirmRawTransaction } from "@solana/web3.js";

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

const connection = new Connection(clusterApiUrl("devnet"));

async function mainPayer() {
    await window.solana.connect();
    const payer =  await getProvider();
    
    const mint = Keypair.generate();
        console.log("mint", mint.publicKey.toBase58());

    //these are the assigned variables that work for test
    let itemName = "LVP Oak";
    let itemDescription = "lvp oak";
    let itemLocation = "Savannah";
    let itemPrice = "5";

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


    //const urlParams = new URLSearchParams(window.location.search);
    // get the values from the url params
    //let itemName = urlParams.get('itemName');
    //let itemDescription = urlParams.get('itemName');
    //let itemLocation = urlParams.get('itemLocation');
    //let itemPrice = urlParams.get('itemPrice');

    // display the item details
    //let itemDetails = document.getElementById('itemDetails');
    //   itemDetails.textContent = 
    // "What is the Item: "+ itemName + "\n" +
    // "Where is the Item: " + itemLocation + "\n" +
    // "What is the Price: " + itemPrice
    //;

const createAccountIx = SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: mint.publicKey,
        space: mintSpace, lamports,
        programId: TOKEN_2022_PROGRAM_ID
        });
    
const initializeMetadataPointerIx = createInitializeMetadataPointerInstruction(
        mint.publicKey,
        payer.publicKey,
        mint.publicKey,
        TOKEN_2022_PROGRAM_ID
        );
    
const initializeMintIx= createInitializeMintInstruction(
        mint.publicKey,
        2,
        payer.publicKey,
        null,
        TOKEN_2022_PROGRAM_ID
        ); 

    const initializeMetadataIx = createInitializeInstruction({
    mint: mint.publicKey,
    metadata: mint.publicKey,
    mintAuthority: payer.publicKey,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    programId: TOKEN_2022_PROGRAM_ID,
    updateAuthority: payer.publicKey
    });

    const updateMetadataField1 = createUpdateFieldInstruction({
    metadata: mint.publicKey,
    programId: TOKEN_2022_PROGRAM_ID,
    updateAuthority: payer.publicKey,
    field: metadata.additionalMetadata[0][0],
    value: metadata.additionalMetadata[0][1]
    });

    const updateMetadataField2 = createUpdateFieldInstruction({
    metadata: mint.publicKey,
    programId: TOKEN_2022_PROGRAM_ID,
    updateAuthority: payer.publicKey,
    field: metadata.additionalMetadata[1][0],
    value: metadata.additionalMetadata[1][1]
    });

    const updateMetadataField3 = createUpdateFieldInstruction({
    metadata: mint.publicKey,
    programId: TOKEN_2022_PROGRAM_ID,
    updateAuthority: payer.publicKey,
    field: metadata.additionalMetadata[2][0],
    value: metadata.additionalMetadata[2][1]
    });

    try {
       
        console.log("payer", payer.publicKey.toBase58());
        let {blockhash} = await connection.getLatestBlockhash();
        const transaction = new Transaction();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = payer.publicKey;
        transaction.add(createAccountIx);
        const signedTransaction1 = await window.solana.signAndSendTransaction(await transaction);
        await connection.confirmTransaction(signedTransaction1);
        console.log(signedTransaction1);
        //const signature1 = await connection.sendRawTransaction(signedTransaction1.serialize());
       
        
        } catch (error) {
        console.error("error at signature", error);
       
        }    
    }
//mainPayer();
mainPayer().catch(error => {
    console.error("Error:", error);
});

