//this .ts file after compiling works in command-line with itemtwo.html
//this one works with input variables..in place of itemtwotest.js
//need to test with assigned variables then test with inputs
import { getKeypairFromFile } from "@solana-developers/helpers";
import { getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, ExtensionType, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE, getTokenMetadata } from "@solana/spl-token";
import { createInitializeInstruction, createUpdateFieldInstruction, TokenMetadata, pack } from "@solana/spl-token-metadata";
import {Connection, Keypair, clusterApiUrl, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
const connection = new Connection(clusterApiUrl("devnet"));

// just for testing. plan to use phantom. identify payer public key
async function mainPayer() {
const payer = await getKeypairFromFile("C:\\Users\\jenni\\.config\\solana\\id.json");

console.log("payer", payer.publicKey.toBase58());


const mint = Keypair.generate();
console.log("mint", mint.publicKey.toBase58());

//these are the assigned variables that work for test
let itemName = "LVP Oak";
let itemDescription = "lvp oak";
let itemLocation = "Savannah";
let itemPrice = "5";

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


const mintSpace = getMintLen([
    ExtensionType.MetadataPointer
]);

const metadataSpace = TYPE_SIZE + LENGTH_SIZE + TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

//async function getLamp() {
const lamports = await connection.getMinimumBalanceForRentExemption(
    mintSpace + metadataSpace
);

const createAccountIx = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint.publicKey,
    space: mintSpace,
    lamports,
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

const transaction = new Transaction().add(
    createAccountIx,
    initializeMetadataPointerIx,
    initializeMintIx,
    //have to initialize the mint as above before the metadata as below
    initializeMetadataIx,
    updateMetadataField1,
    updateMetadataField2,
    updateMetadataField3
);


//async function executeTransaction() {
const sig = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer, mint]    
);
//executeTransaction();


console.log("sig:", sig);

//async function seeMetadata() {
const chainMetadata = await getTokenMetadata(
    connection,
    mint.publicKey
)
console.log(chainMetadata);
};




mainPayer().catch(error => {
    console.error("Error:", error);
});

