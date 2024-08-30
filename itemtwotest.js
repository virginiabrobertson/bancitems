import { Connection, PublicKey, Transaction, SystemProgram, signAndSendTransaction } from '@solana/web3.js';

const isPhantomInstalled = window.phantom?.solana?.isPhantom;
const getProvider = () => {
    if ('phantom' in window) {
        const provider = window.phantom?.solana;
        if (provider?.isPhantom) {
            return provider;
        }
    }
    window.open('https://phantom.app/', '_blank');
};


const connection = new Connection('https://api.devnet.solana.com');
async function makeItGo(destPubkeyStr, amount) {
    
   
    
    try {
        await window.solana.connect();
        const destPubkey = new PublicKey(destPubkeyStr);
        const provider =  await getProvider();
        const {blockhash} = await connection.getLatestBlockhash();
        const transaction = new Transaction();
        transaction.recentBlockhash = blockhash;
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: provider.publicKey,
                toPubkey: destPubkey,
                lamports: amount,
            })
        );
      
        transaction.feePayer = provider.publicKey;
        const signedTransaction = await window.solana.signAndSendTransaction(transaction);
        console.log(signedTransaction);
       
    } catch (error) {
        console.error('Error processing transaction', error);
        
    }
}
const destPubkeyStr = new PublicKey('3hFghB8bQKvDD935yDZ1UtRm657gkY8m7BparxVNVKGD');
const amount = 1000000;

makeItGo(destPubkeyStr, amount, (error, result)=>{
    if (error){
        console.error('error:', error);
    }else{
        console.log('transaction result', result);
    }
});

// get values from the url params 
let urlParams = new URLSearchParams(window.location.search);

// get the values from the url params
const itemName = urlParams.get('itemName');
const itemLocation = urlParams.get('itemLocation');
const itemPrice = urlParams.get('itemPrice');



// display the item details
const itemDetails = document.getElementById('itemDetails');
    itemDetails.textContent = 
    "WHAT is the Item: "+ itemName + 
    "  WHERE is the Item:  " + itemLocation + 
    "  WHAT is the Price:  " + itemPrice;  
   
const connects = document.getElementById('connects');  
    connects.textContent = 
    "  Phantom Working?  " + isPhantomInstalled ;
   // "  Is wallet connected?  " + provider.isConnected +
   // "  Transaction Signature   " + provider.publicKey.toString();
   
   
    

