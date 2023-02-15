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
  if (listName === buyID) {
    listID = buyID;
  } else if (listName === inventoryID) {
    listID = inventoryID;
  } else {
    return console.error(
      "ApiGet id error!"
    );
  }
  const res = await fetch(
    `https://nackademin-item-tracker.herokuapp.com/lists/${listID}`
  );
  const data = await res.json();
  printToList(data, listName)
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
  let inputMain;
  let inputDesc;
  if (listID === buyID) {
    inputMain = document.querySelector("#shoppingField").value;
    inputDesc = document.querySelector("#shoppingDesc").value;
  } else if (listID === inventoryID) {
    inputMain = document.querySelector("#homeField").value;
    inputDesc = document.querySelector("#homeDesc").value;
  }
  if (!inputMain.trim().length || !inputDesc.trim().length) {
    alert("Du måste skriva något i båda fälten.");
    throw new Error("Input måste innehålla minst en karaktär.");
  }

  const res = await fetch(
    `https://nackademin-item-tracker.herokuapp.com/lists/${listID}/items`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: inputMain,
        description: inputDesc,
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
function printToList(items, listName) {
  if (listName === buyID) {
    list = "buy-list"
  } else if (listName === inventoryID) {
    list = "inventory-list"
  }
  list.innerHTML = "";

  // console.log(items.itemList)
  items.itemList.forEach(item => {
    createItem(item, list);
  });
}

function createItem(obj, list) {
  console.log(obj.title)
  let liElem = document.createElement("li")
  liElem.innerHTML = `<p>${obj.description}, ${obj.title}</p><button><i class="fa fa-trash" aria-hidden="true"></i></button>`
  document.getElementById(list).append(liElem)
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


apiGet(buyID)
apiGet(inventoryID)