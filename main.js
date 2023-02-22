const API_BASE = "https://nackademin-item-tracker.herokuapp.com/"; //Den delen av API:urlen som är samma för alla anrop
const buyList = document.getElementById("buy-list");
let shoppingField = document.querySelector("#buy-list-input");
let homeField = document.querySelector("#home-list-input");
let shoppingMove = document.querySelector("#shopping-move");
let inventoryMove = document.querySelector("#inventory-move");

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
  if (listID !== buyID || listID !== inventoryID) {
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
async function apiPost(listID, title, description) {
  const res = await fetch(
    `https://nackademin-item-tracker.herokuapp.com/lists/${listID}/items`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
        checked: false,
      }),
    }
  );
  const data = await res.json();
  printToList(data.list, listID);
}
/** add Item
 * @param {*} listansID 
 * @param {*} inputVara 
 * @param {*} inputAntal 
 */
async function addItemToList(listansID, inputVara, inputAntal) {
  const res = await fetch(
    `https://nackademin-item-tracker.herokuapp.com/lists/${listansID}/items`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: inputVara,
        description: inputAntal,
        checked: false,
      }),
    }
  );
  const data = await res.json();
  printToList(data.list, listansID);
}
/**
 *
 * @param {* An array with objects} items
 * @param {* A String} listName
 */
function printToList(items, listName) {
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
 * @param {*} listID
 */
function createItem(obj, list, listID) {
  let liElem = document.createElement("li");
  liElem.innerHTML = `<p>${obj.title}, ${obj.description}</p>`;

  let div = document.createElement("div");

  let label = document.createElement("label");
  let span = document.createElement("span");
  span.innerHTML = `<i class="fa-solid fa-carrot"></i>`;
  let checkbox = document.createElement("INPUT");
  let objInput = [obj.title, obj.description, obj._id];
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("name", `${list === "buy-list" ? "buy" : "inventory"}`);
  checkbox.setAttribute("value", `${obj._id}`);
  checkbox.setAttribute("data-title", `${obj.title}`);
  checkbox.setAttribute("data-description", `${obj.description}`);
  if (obj.checked === "true") checkbox.setAttribute("checked", "true");
  label.append(checkbox);
  label.append(span);
  div.append(label);

  let deleteItemBtn = document.createElement("button");
  deleteItemBtn.classList.add("fa", "fa-trash");
  deleteItemBtn.setAttribute("aria-hidden", "true");
  div.append(deleteItemBtn);
  liElem.append(div);

  document.getElementById(list).append(liElem); // It's here the element is added to the DOM and eventlisteners can be added.

  label.addEventListener("click", async function (event) {
    event.preventDefault();
    const res = await fetch(`${API_BASE}lists/${listID}/items/${obj._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checked: `${obj.checked === "false" ? "true" : "false"}`,
      }),
    });
    const data = await res.json();
    apiGet(data.list._id);
  });

  deleteItemBtn.addEventListener("click", async function () {
    const res = await fetch(`${API_BASE}lists/${listID}/items/${obj._id}`, {
      method: "DELETE",
    }); // deletar objekt med _id.
    apiGet(listID);
  });
}
// collect allt checked checkboxes in one list, post copied item, then delete old item.
async function deleteItem(listID, objectID) {
  return fetch(`${API_BASE}lists/${listID}/items/${objectID}`, {
    method: "DELETE",
  });
}
/**
 * @param {*} listname
 */
async function transferItems(listname) {
  let checkboxes = document.querySelectorAll(`[name='${listname}']`);
  const allChecked = Array.from(checkboxes).filter(
    (checkbox) => checkbox.checked
  );
  let howManyAreDone = 0;
  allChecked.forEach(async (checkbox, i) => {
    if (checkbox.checked) {
      addItemToList(
        listname === "buy" ? inventoryID : buyID,
        checkbox.dataset.title,
        checkbox.dataset.description
      );

      await deleteItem(
        listname === "buy" ? buyID : inventoryID,
        checkbox.value
      );

      howManyAreDone++;

      if (howManyAreDone === allChecked.length) {
        apiGet(buyID);
      }
    }
  });
}
/**
 * @param {*} inputMain
 * @param {*} inputDesc
 */
const errorMessage = (inputMain, inputDesc) => {
  if (!inputMain.trim().length || !inputDesc.trim().length) {
    alert("Du måste skriva något i båda fälten.");
    throw new Error("Input måste innehålla minst en karaktär.");
  }
};
/** Eventlistener
 * Eventlisteners for forms, event submit
 */
shoppingField.addEventListener("submit", function (e) {
  e.preventDefault();

  let inputMain = document.querySelector("#shoppingField").value;
  let inputDesc = document.querySelector("#shoppingDesc").value;
  errorMessage(inputMain, inputDesc);
  shoppingField.reset();

  apiPost(buyID, inputMain, inputDesc);
});
homeField.addEventListener("submit", function (e) {
  e.preventDefault();
  let inputMain = document.querySelector("#homeField").value;
  let inputDesc = document.querySelector("#homeDesc").value;
  errorMessage(inputMain, inputDesc);
  homeField.reset();
  apiPost(inventoryID, inputMain, inputDesc);
});

shoppingMove.addEventListener("click", function (e) {
  transferItems("buy");
});

inventoryMove.addEventListener("click", function (e) {
  transferItems("inventory");
});

/**
 * Initial call to API, to get the list to render
 */
apiGet(buyID);
apiGet(inventoryID);
