//import { TatumSDK, Network } from '@tatumio/tatum'
//get the html elements to display
const itemNameDisplay = document.getElementById("itemNameDisplay");
const itemLocationDisplay = document.getElementById("itemLocationDisplay");
const itemPriceDisplay = document.getElementById("itemPriceDisplay");
//display the info function
function displayInfo() {
    //get values entered by the user from the HTML
    const itemName = document.getElementById("itemName").value;
    const itemLocation = document.getElementById("itemLocation").value;
    const itemPrice = document.getElementById("itemPrice").value;
    //display on screen
    itemNameDisplay.textContent = `What is Item: ${itemName}`;
    itemLocationDisplay.textContent = `Where is Item: ${itemLocation}`;
    itemPriceDisplay.textContent = `What Price: ${itemPrice}`;
}

//# sourceMappingURL=itemone.9dbf6edd.js.map
