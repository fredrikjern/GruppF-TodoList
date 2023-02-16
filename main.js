const API_BASE = "https://nackademin-item-tracker.herokuapp.com/"; //Den delen av API:urlen som är samma för alla anrop
const buyList = document.getElementById("buy-list");
let shoppingField = document.querySelector("#buy-list-input");
let homeField = document.querySelector("#home-list-input");

let shopButton = document.querySelector("#shopButton");
let homeButton = document.querySelector("#homeButton");
let currentList = "";

let buyID = "63ea106e843a53f2e4b457f3";
let inventoryID = "63ea107d843a53f2e4b457f4";
/*
 Function that takes buyList or inventoryList and then calls the write function.
*/
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
  );
  const data = await res.json();
  printToList(data, listID);
}
/*
Post new objects to a list which is specified in the input
Input: a string with the list ID
 */
async function apiPost(listID) {
  let inputMain;
  let inputDesc;
  if (listID === buyID) {
    inputMain = document.querySelector("#shoppingField").value;
    inputDesc = document.querySelector("#shoppingDesc").value;
    shoppingField.reset();
  } else if (listID === inventoryID) {
    inputMain = document.querySelector("#homeField").value;
    inputDesc = document.querySelector("#homeDesc").value;
    homeField.reset();
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
        checked: false,
      }),
    }
  );
  const data = await res.json();
  printToList(data.list, listID);
}
/*
Takes all items and prints it to desired list in the DOM
Input:
items - an object
listName - a string
*/
function printToList(items, listName) {
  console.log(items);
  console.log(listName);
  if (listName === buyID) {
    list = "buy-list";
  } else if (listName === inventoryID) {
    list = "inventory-list";
  }
  document.getElementById(list).innerHTML = "";

  items.itemList.forEach((item) => {
    createItem(item, list, listName);
  });
}
/*
Creates a list-element from a item, list? and listIDs? 
*/
function createItem(obj, list, listIDs) {
  //console.log(listIDs);
  // <input type="checkbox" name="${
  //   list === "buy-list" ? "buy" : "inventory"
  // }" id="" value="${obj._id}" ${obj.checked ? "checked" : ""}>
  console.log(list);
  let liElem = document.createElement("li");
  liElem.innerHTML = `<p>${obj.description}, ${obj.title}</p>`;
  let checkbox = document.createElement("INPUT");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("name", `${list === "buy-list" ? "buy" : "inventory"}`);
  checkbox.setAttribute("value", `${obj._id}`);
  if (obj.checked==="true") {
    checkbox.setAttribute("checked", "true");
  }
  liElem.append(checkbox)
  let deleteItemBtn = document.createElement("button");
  deleteItemBtn.classList.add("fa", "fa-trash");
  deleteItemBtn.setAttribute("aria-hidden", "true");
  liElem.append(deleteItemBtn);

  document.getElementById(list).append(liElem);

  checkbox.addEventListener("change", async function () {
    console.log("checkbox change eventlistener inne asyncfunctionen");
    console.log(obj.checked);
    const res = await fetch(`${API_BASE}lists/${listID}/items/${obj._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checked: `${obj.checked === "false" ? "true" : "false"}`,
      }),
    });
    apiGet(listID)
  });
  let listID = listIDs;
  deleteItemBtn.addEventListener("click", async function () {
    const res = await fetch(`${API_BASE}lists/${listID}/items/${obj._id}`, {
      method: "DELETE",
    }); // deletar objekt med _id.
    console.log(listID + "  klick på delete");
    //let data = await res.json(); // Hämtar den nya listan som där objektet är borttaget.
    apiGet(listID);
    // printToList(data.list);
  });
}
/*
Eventlisteners for forms event submit 
*/
shoppingField.addEventListener("submit", function (e) {
  e.preventDefault();
  apiPost(buyID);
});
homeField.addEventListener("submit", function (e) {
  e.preventDefault();
  apiPost(inventoryID);
});
apiGet(buyID); // Initial call to API, to get the list to render
apiGet(inventoryID);
