
import {Connection, PublicKey, Transaction, SystemProgram} from '@solana/web3.js';



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

 
window.phantom.solana.connect();

const connection = new Connection('https://api.devnet.solana.com');
    
async function transferSol() { 
try{
   
    const provider = getProvider;
    //const receiver= new solanaWeb3.PublicKey("3hFghB8bQKvDD935yDZ1UtRm657gkY8m7BparxVNVKGD");
    const transaction = new Transaction();
    //transaction.add(
     //solanaWeb3.SystemProgram.transfer({
     //  fromPubkey: provider.publicKey,
     //  toPubkey: recieverWallet,
     //  lamports: 10000
    //}))
    const {signature} = await provider.signAndSendTransaction(transaction);
    await connection.getSignatureStatus(signature);


    
} catch (err){}

};


// get values from the url params 
let urlParams = new URLSearchParams(window.location.search);

// get the values from the url params
const itemName = urlParams.get('itemName');
const itemLocation = urlParams.get('itemLocation');
const itemPrice = urlParams.get('itemPrice');



// display the item details
const itemDetails = document.getElementById('itemDetails');
    itemDetails.textContent = 
    "WHAT is the Item: "+ itemName + "<br>" +
    "WHERE is the Item:  " + itemLocation + "<br>" +
    "WHAT is the Price:  " + itemPrice + "<br>" ;
    "Use Phantom?  " + isPhantomInstalled + "<br>" ;
   
    
   
    



