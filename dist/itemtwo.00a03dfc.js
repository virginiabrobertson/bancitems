// get values from the url params
let urlParams = new URLSearchParams(window.location.search);
// get the values from the url params
const itemName = urlParams.get("itemName");
const itemLocation = urlParams.get("itemLocation");
const itemPrice = urlParams.get("itemPrice");
// display the item details
const itemDetails = document.getElementById("itemDetails");
itemDetails.textContent = "WHAT is the Item: " + itemName + "\n" + "WHERE is the Item:  " + itemLocation + "\n" + "WHAT is the Price:  " + itemPrice; //send to mint file
 //export {itemName, itemLocation, itemPrice};

//# sourceMappingURL=itemtwo.00a03dfc.js.map
