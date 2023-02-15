const API_BASE = "https://nackademin-item-tracker.herokuapp.com/"; //Den delen av API:urlen som är samma för alla anrop
const buyList = document.getElementById("buy-list");
let shoppingField = document.querySelector("#buy-list-input");
let homeField = document.querySelector("#home-list-input");
let shopButton = document.querySelector("#shopButton");
let homeButton = document.querySelector("#homeButton");
let currentList = "";

let buyID = "63ea106e843a53f2e4b457f3";
let inventoryID = "63ea107d843a53f2e4b457f4";
// Function that takes buyList or inventoryList and then calls the write function.
async function apiGet(listName) {
  let listID;
  if (listName === "buyList") {
    listID = buyID;
  } else if (listName === "inventoryList") {
    listID = inventoryID;
  } else {
    return console.error(
      "ApiGet function need to know if it is 'buylist' or 'inventoryList'!"
    );
  }
  const res = await fetch(
    `https://nackademin-item-tracker.herokuapp.com/lists/${listID}`
  );
  const data = await res.json();
  console.log(data.itemList); //TODO Change this line to a draw function
}

// Api post funtion that adds items into buy list
// ID till input fältet #shoppingField och #homeField
// ID till knappen för input fältet #shopButton och #homeButton
shoppingField.addEventListener("submit", function (e) {
  e.preventDefault();
  apiPost(buyID);
});
homeField.addEventListener("submit", function (e) {
  e.preventDefault();
  apiPost(inventoryID);
});
async function apiPost(listID) {
  let input;
  if (listID === buyID) {
    input = document.querySelector("#shoppingField").value;
  } else if (listID === inventoryID) {
    input = document.querySelector("#homeField").value;
  }
  const res = await fetch(
    `https://nackademin-item-tracker.herokuapp.com/lists/${listID}/items`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: input,
      }),
    }
  );

  const { list } = await res.json();
  console.log(list.itemList);
  // drawItems(list.itemList);
  console.log("Hej");
  //const { buyList } = await res.json();
}

const myArr = [
  {
    itemList: ["sak1", "sak2", "sak3"],
    _id: "dsgdg32432fdf",
  },
];
// Takes all items and prits it to desired list
function printToList(items, list) {
  list.innerHTML = "";

  items.forEach((item) => {
    createItem(item);
  });
}

// This function takes in the a list and an item and deletes the selected item.
// Use this in the context of the delete button appended to each list item.
async function deleteFunction(currentList, item) {
  const res = await fetch(`${API_BASE}lists/${currentList}/items/${item._id}`, {
    method: "DELETE",
  }); // deletar objekt med _id.
  let { list } = await res.json(); // Hämtar den nya listan som där objektet är borttaget.
  return list;
}

// Submit eventListener on buy item form
// buyListInput.addEventListener("submit", (event) => {
//   event.preventDefault();
//   let input = document.querySelector("#buy-list-input> input").value;
//   apiPost(input);
// });
