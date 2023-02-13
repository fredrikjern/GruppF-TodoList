let buyListInput = document.querySelector("#buy-list-input");
let buyList = document.querySelector("#buy-list");

async function apiGet(listID) {
  const res = await fetch(
    `https://nackademin-item-tracker.herokuapp.com/list/:${listID}`
  );
  const data = await res.json();
  return data;
}
let buyListID = apiGet("63ea106e843a53f2e4b457f3");
console.log(buyListID);
let inventoryListId = apiGet("63ea107d843a53f2e4b457f4");
console.log(inventoryListId);

//-------------------------------------------------------
