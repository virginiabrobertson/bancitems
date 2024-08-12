
//const payer = process.env.SKEY;
const payer = 'payerrrr';
// or get values from the url params
let urlParams = new URLSearchParams(window.location.search);

// get the values from the url params
const itemName = urlParams.get('itemName');
const itemLocation = urlParams.get('itemLocation');
const itemPrice = urlParams.get('itemPrice');



// display the item details
const itemDetails = document.getElementById('itemDetails');
    itemDetails.textContent = 
    "WHAT is the Item: "+ itemName + "\n" +
    "WHERE is the Item:  " + itemLocation + "\n" +
    "WHAT is the Price:  " + itemPrice + "\n" +
    "What PAYERRRRR?  " + payer;

//send to mint file
//export {itemName, itemLocation, itemPrice};
//const payer= process.env.PRIVATE_KEY;

//const seePayer = document.getElementById('sP');
//    seePayer.textContent =
// "The payer is: " + payer;
//console.log(payer);    
