const API_BASE = "https://nackademin-item-tracker.herokuapp.com/"; //Den delen av API:urlen som är samma för alla anrop
const buyList = document.getElementById("buy-list");
let shoppingField = document.querySelector("#buy-list-input");
let homeField = document.querySelector("#home-list-input");

let shopButton = document.querySelector("#shopButton");
let homeButton = document.querySelector("#homeButton");
let currentList = "";

let buyID = "63ea106e843a53f2e4b457f3";
let inventoryID = "63ea107d843a53f2e4b457f4";

/**
 * Function that takes buyList or inventoryList and then calls the write function.
 * @param {*} listID
 * @returns
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
/**
 * Post new objects to a list which is specified in the input
 * @param {* a string with the list ID} listID
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
/**
 *
 * @param {* An array with objects} items
 * @param {* A String} listName
 */
function printToList(items, listName) {
  // console.log(items);
  // console.log(listName);
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
/**
 * createItem
 * @param {*} obj
 * @param {*} list
 * @param {*} listIDs
 */
function createItem(obj, list, listIDs) {
  // console.log(list);
  let liElem = document.createElement("li");
  liElem.innerHTML = `<p>${obj.description}, ${obj.title}</p>`;

  let checkbox = document.createElement("INPUT");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("name", `${list === "buy-list" ? "buy" : "inventory"}`);
  checkbox.setAttribute("value", `${obj._id}`);
  if (obj.checked === "true") checkbox.setAttribute("checked", "true");
  liElem.append(checkbox);

  let deleteItemBtn = document.createElement("button");
  deleteItemBtn.classList.add("fa", "fa-trash");
  deleteItemBtn.setAttribute("aria-hidden", "true");
  liElem.append(deleteItemBtn);

  document.getElementById(list).append(liElem); // It's here the element is added to the DOM and eventlisteners can be added.

  checkbox.addEventListener("change", async function () {
    const res = await fetch(`${API_BASE}lists/${listID}/items/${obj._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checked: `${obj.checked === "false" ? "true" : "false"}`,
      }),
    });
    apiGet(listID);
  });
  let listID = listIDs;
  deleteItemBtn.addEventListener("click", async function () {
    apiDelete(listID, obj);
    // printToList(data.list);
  });
}

async function apiDelete(listID, obj) {
  const res = await fetch(`${API_BASE}lists/${listID}/items/${obj._id}`, {
    method: "DELETE",
  }); // deletar objekt med _id.
  console.log(listID + "  klick på delete");
  apiGet(listID);
  // printToList(data.list);
}
function myFunc() {
  let arr = [];
  let checkboxes = document.querySelectorAll("input[type='checkbox']:checked");

  checkboxes.forEach((item) => {
    arr.push(item.value);
  });
}

function transferItems(checkName, listID) {
  let checked = [];
  let id = listID;
  let checkedboxes = document.querySelectorAll(
    "input[type='checkbox']" + "[name=" + CSS.escape(checkName) + "]"
  );
  console.log(checkedboxes);
  checkedboxes.forEach((item) => {
    if (item.checked === true) {
      // apiDelete(id, item.value);
      // checked.push(item.value);
    }
  });
  console.log(checked);
  // if (obj.checked === "true") {
  //   apiDelete(listID, obj);
  // }
}
let buyCheck = "buy";
let inventoryCheck = "inventory";
let shoppingMove = document.querySelector("#shoppingMove");
shoppingMove.addEventListener("click", function (e) {
  e.preventDefault();
  transferItems(buyCheck, buyID);
});

/**
 * Eventlisteners for forms, event submit
 */
shoppingField.addEventListener("submit", function (e) {
  e.preventDefault();
  apiPost(buyID);
});
homeField.addEventListener("submit", function (e) {
  e.preventDefault();
  apiPost(inventoryID);
});
/**
 * Initial call to API, to get the list to render
 */
apiGet(buyID);
apiGet(inventoryID);
