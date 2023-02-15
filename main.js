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
async function apiGet(listID) {
  if (listID === buyID) {
async function apiGet(listID) {
  if (listID === buyID) {
    listID = buyID;
  } else if (listID === inventoryID) {
  } else if (listID === inventoryID) {
    listID = inventoryID;
  } else {
    return console.error("ApiGet id error!");
  }
  const res = await fetch(
    `https://nackademin-item-tracker.herokuapp.com/lists/${listID}`
  )
  const data = await res.json()
  printToList(data, listID)
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
  const data = await res.json();
  printToList(data.list, listID);
}

// Takes all items and prits it to desired list
function printToList(items, listName) {
  if (listName === buyID) {
    list = "buy-list";
  } else if (listName === inventoryID) {
    list = "inventory-list";
  }
  document.getElementById(list).innerHTML = ""

  items.itemList.forEach((item) => {
    createItem(item, list, listName);
  });
}

function createItem(obj, list, listIDs) {
  let liElem = document.createElement("li");
  liElem.innerHTML = `<p>${obj.description}, ${obj.title}</p>`;

  let deleteItemBtn = document.createElement("button");
  deleteItemBtn.classList.add("fa");
  deleteItemBtn.classList.add("fa-trash");
  deleteItemBtn.setAttribute("aria-hidden", "true");
  liElem.append(deleteItemBtn);

  document.getElementById(list).append(liElem);

  let listID = listIDs;
  deleteItemBtn.addEventListener("click", async function () {
    const res = await fetch(`${API_BASE}lists/${listID}/items/${obj._id}`, {
      method: "DELETE",
    }); // deletar objekt med _id.
    console.log(listID);
    let data = await res.json(); // Hämtar den nya listan som där objektet är borttaget.
    apiGet(listID);
    // printToList(data.list);
  });
}

apiGet(buyID);
apiGet(inventoryID);
