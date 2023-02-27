const API_BASE = "https://nackademin-item-tracker.herokuapp.com/"; //Den delen av API:urlen som är samma för alla anrop
const buyList = document.getElementById("buy-list");
let shoppingField = document.querySelector("#buy-list-input");
let homeField = document.querySelector("#home-list-input");
let shoppingMove = document.querySelector("#shopping-move");
let inventoryMove = document.querySelector("#inventory-move");

const buyID = "63ea106e843a53f2e4b457f3";
const inventoryID = "63ea107d843a53f2e4b457f4";

let alertMessage = document.querySelector(".alertMessage-container");
let alertMessageYes = document.querySelector(".alertMessage_yes");
let alertMessageNo = document.querySelector(".alertMessage_no");

let alertMessageNumber2 = document.querySelector(".alertMessageNumber2-container");
let alertMessageNumber2Yes = document.querySelector(".alertMessageNumber2_yes");
let alertMessageNumber2No = document.querySelector(".alertMessageNumber2_no");

//Get the list with API

/**
 * Function that takes buyList or inventoryList and then calls the write function.
 * @param {*} listID
 * @returns
 */
async function apiGet(listID) {
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
        checked: "false",
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
  
  span.innerHTML = `<i class="${list === "buy-list" ? "fa-solid fa-carrot" : "fa-solid fa-house"}"></i>`

  let checkbox = document.createElement("INPUT");

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
        checked: `${obj.checked === "true" ? "false" : "true"}`,
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
      apiPost(
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
        apiGet(inventoryID);
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

// Check if the item is in the home inventory.
async function compareInputToInventory (listID,item){ 
  const checkList = await fetch(
    `https://nackademin-item-tracker.herokuapp.com/lists/${listID}`
  );
  const listItems = await checkList.json();
    
  for (let i = 0; i < listItems.itemList.length; i++) {
    if (listItems.itemList[i].title.toLowerCase() === item.toLowerCase()) {
      return true;
    }
  } 
  return false; 
}

///delete function///
async function deleteFromInventory (object){
  const res = await fetch(
    `https://nackademin-item-tracker.herokuapp.com/lists/${inventoryID}`
  );
  const inventoryListItems = await res.json();
    
  inventoryListItems.itemList.forEach( async(item) =>  {
    if (item.title.toLowerCase() === object.toLowerCase()) {
      await fetch(`${API_BASE}lists/${inventoryID}/items/${item._id}`, {
        method: "DELETE",
      });
      apiGet(inventoryID)
    }
  })
}


/** Eventlistener
 * Eventlisteners for forms, event submit
 */
shoppingField.addEventListener("submit", async function (e) {
  e.preventDefault();

  let inputMain = document.querySelector("#shoppingField").value;
  let inputDesc = document.querySelector("#shoppingDesc").value;
  errorMessage(inputMain, inputDesc);
  let isInInventory = await compareInputToInventory(inventoryID,inputMain)
  if (!isInInventory){
    apiPost(buyID,inputMain,inputDesc);
    shoppingField.reset();
  }else{
    document.querySelector(".alertContent1").innerHTML = `<p>Du har redan ${inputMain} hemma. Vill du lägga till ${inputMain} i inköpslistan ändå?</p>`;
    alertMessage.style.display = "block";
  }
});

homeField.addEventListener("submit", function (e) {
  e.preventDefault();
  let inputMain = document.querySelector("#homeField").value;
  let inputDesc = document.querySelector("#homeDesc").value;
  errorMessage(inputMain, inputDesc);
  homeField.reset();
  apiPost(inventoryID, inputMain, inputDesc);
});

alertMessageYes.addEventListener("click", function(e) {
  let inputMain = document.querySelector("#shoppingField").value;
  let inputDesc = document.querySelector("#shoppingDesc").value;
  apiPost(buyID, inputMain, inputDesc)
  alertMessage.style.display = "none";
  document.querySelector(".alertContent2").innerHTML = `<p>Vill du ta bort ${inputMain} ur hemma?`;
  alertMessageNumber2.style.display = "block";
})

alertMessageNo.addEventListener("click", function(e) {
  alertMessage.style.display = "none";
  shoppingField.reset();
})

alertMessageNumber2Yes.addEventListener("click",async function(e){
  let inputMain = document.querySelector("#shoppingField").value;
  deleteFromInventory(inputMain);
  shoppingField.reset();
  alertMessageNumber2.style.display = "none";
})

alertMessageNumber2No.addEventListener("click", function(e){
  shoppingField.reset();
  alertMessageNumber2.style.display = "none";
})

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