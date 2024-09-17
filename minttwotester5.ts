import { getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, ExtensionType, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE, getTokenMetadata } from "@solana/spl-token";
import { createInitializeInstruction, createUpdateFieldInstruction, TokenMetadata, pack } from "@solana/spl-token-metadata";
//import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
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
    
    //const message= "Please sign to authorize creation of NFTs";
    //const encodeMessage= new TextEncoder().encode(message);
    //const {signature1}= await window.solana.signMessage(encodeMessage, 'utf8');
    //console.log('message signed ');


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

//const createAccountIx = SystemProgram.createAccount({
       // fromPubkey: payer.publicKey,
       // newAccountPubkey: mint.publicKey,
       // space: mintSpace, lamports,
       // programId: TOKEN_2022_PROGRAM_ID
       // });
    
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
        //const payer =  await getProvider();
        console.log("provider public", payer);
        const mintpublic= mint.publicKey.toBase58();
        console.log("mint", mintpublic);
        console.log("mintspace", mintSpace);
        console.log('lamports', lamports);
       //const urlParams = new URLSearchParams(window.location.search);
       //const nonce = urlParams.get('nonce');
        let {blockhash} = await connection.getLatestBlockhash();
        const transaction = new Transaction();
        transaction.recentBlockhash = blockhash;
        const latestBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = latestBlockhash.blockhash;
        transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;
        transaction.feePayer = provider.publicKey;
        //const destPubkeyStr = new PublicKey('3hFghB8bQKvDD935yDZ1UtRm657gkY8m7BparxVNVKGD');
        //const destPubkey = new PublicKey(destPubkeyStr);
        
        transaction.add(
            SystemProgram.createAccount({
                fromPubkey: provider.publicKey,
                newAccountPubkey: mint.publicKey,
                space: mintSpace, lamports,
                programId: TOKEN_2022_PROGRAM_ID
                })
            //createAccountIx,
            //initializeMintIx,
            //initializeMetadataPointerIx,
            //initializeMetadataIx,
            //updateMetadataField1,
            //updateMetadataField2,
            //updateMetadataField3 

        );
        
        
        //console.log ("connection ", connection)
        console.log ('transaction', transaction);
        console.log('payer', payer);
        console.log('mint', mint.publicKey);
        //const txsignature= await window.solana.sendAndConfirmTransaction(connection, Transaction, [mint]);
        
        //const txsignature= await window.solana.signTransaction(transaction);
        
        //console.log("Transaction signature", txsignature );
        //console.log("Trace: ", txsignature.serializeMessage().toString("base64"));
        //console.log('Signatures after Phantom sign', transaction.signatures);
        
        //txsignature.sign(mint);
        //transaction.sign(provider.publicKey);
        //const serializedTransaction = txsignature.serialize();
        //console.log('Signatures after Phantom sign + mint sign', transaction.signatures);
        //const sig = await connection.sendRawTransaction(serializedTransaction);
        //const txsend= await sendAndConfirmTransaction(connection, transaction, [mint]);
        transaction.sign(mint);
        const sig1 = await window.solana.signTransaction(transaction);
        if (sig1.recentBlockhash !== transaction.recentBlockhash) {
            throw new Error ('Transaction has changed since signing');
        }
        //await connection.sendTransaction(transaction);
        console.log("phantom account signed", sig1);
        console.log('mintpair', mint);
        //transaction.sign(mint);
        console.log('sig1 transaction mint signed too', sig1)
        console.log("transaction2", transaction);
        const serializedTransaction= sig1.serialize();
        console.log("serialTrans", serializedTransaction);
        const txsignature=await connection.sendRawTransaction(serializedTransaction);
        console.log('raw sig', txsignature);
        //  const sendtx = await window.solana.sendAndConfirmTransaction(transaction);
       
        } catch (error) {
        console.error("error in transaction", error);
       
        }    
    }
//mainPayer();
mainPayer().catch(error => {
    console.error("Error:", error);
});

