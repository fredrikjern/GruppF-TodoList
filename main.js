const API_BASE = "https://nackademin-item-tracker.herokuapp.com/"; //Den delen av API:urlen som är samma för alla anrop
const buyList = document.getElementById("buy-list");
let shoppingField = document.querySelector("#buy-list-input");
let homeField = document.querySelector("#home-list-input");
let shoppingMove = document.querySelector("#shopping-move");
let inventoryMove = document.querySelector("#inventory-move");

let shopButton = document.querySelector("#shopButton");
let homeButton = document.querySelector("#homeButton");
let currentList = "";

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
 *
 * @param {* An array with objects} items
 * @param {* A String} listName
 */
  //Get item from API list
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


  //Create list items from the API list
  /**
 * createItem
 * @param {*} obj
 * @param {*} list
 * @param {*} listID
 */
  function createItem(obj, list, listID) {
    console.log(list);
    let liElem = document.createElement("li");
    liElem.innerHTML = `<p>${obj.title}, ${obj.description}</p>`;

    let div = document.createElement("div");

    let label = document.createElement("label");
    let span = document.createElement("span");
    if(list === "buy-list"){
    span.innerHTML = `<i class="fa-solid fa-carrot"></i>`;
    }else{
    span.innerHTML = `<i class="fa-solid fa-house"></i>`
    }
    
    let checkbox = document.createElement("INPUT");
    let objInput = [obj.title, obj.description, obj._id];
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("name", `${list === "buy-list" ? "buy" : "inventory"}`);
    checkbox.setAttribute("value", `${obj._id}`);
    checkbox.setAttribute("data-title", `${obj.title}`);
    checkbox.setAttribute("data-description", `${obj.description}`);
    if (obj.checked==="true") checkbox.setAttribute("checked", "true");
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

    //let listID = listIDs;
    deleteItemBtn.addEventListener("click", async function () {
      const res = await fetch(`${API_BASE}lists/${listID}/items/${obj._id}`, {
        method: "DELETE",
      }); // deletar objekt med _id
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
};

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

  //Add new item to the list(into API)
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


// Check if the item is in the home inventory.
async function compareInputToInventory (listID,item){ 
    const checkList = await fetch(
        `https://nackademin-item-tracker.herokuapp.com/lists/${listID}`
      );
      const listItems = await checkList.json();
      console.log(listItems);
      
  for (let i = 0; i < listItems.itemList.length; i++) {
    console.log(listItems.itemList[i].title.toLowerCase(), item.toLowerCase())
    if (listItems.itemList[i].title.toLowerCase() === item.toLowerCase()) {
      console.log("Jag hittar " + listItems.itemList[i].title + " i inventory!")
      console.log(listItems.itemList[i]._id);
      return true;
    }
  } 
  return false; 
}


shoppingField.addEventListener("submit",async function (e) {
    e.preventDefault();
    inputMain = document.querySelector("#shoppingField").value;
    inputDesc = document.querySelector("#shoppingDesc").value;
    errorMessage(inputMain, inputDesc);
    let isInInventory = await compareInputToInventory(inventoryID,inputMain)
    console.log(isInInventory);
    if (!isInInventory){
        addItemToList(buyID,inputMain,inputDesc);
        shoppingField.reset();
    }else{
        document.querySelector(".alertContent1").innerHTML = `<p>Du har redan ${inputMain} hemma. Vill du lägga till ${inputMain} i inköpslistan ändå?</p>`;
        alertMessage.style.display = "block";
    }
    }
  );

  homeField.addEventListener("submit", function (e) {
    e.preventDefault();
    inputMain = document.querySelector("#homeField").value;
    inputDesc = document.querySelector("#homeDesc").value;
    errorMessage(inputMain, inputDesc);
    addItemToList(inventoryID,inputMain,inputDesc);
    homeField.reset();  
  });


  alertMessageYes.addEventListener("click", function(e) {
    e.preventDefault();
    inputMain = document.querySelector("#shoppingField").value;
    inputDesc = document.querySelector("#shoppingDesc").value;
    addItemToList(buyID, inputMain, inputDesc)
    alertMessage.style.display = "none";
    document.querySelector(".alertContent2").innerHTML = `<p>Vill du ta bort ${inputMain} ur hemma?`;
    alertMessageNumber2.style.display = "block";
  })

  alertMessageNo.addEventListener("click", function(e) {
    e.preventDefault();
    alertMessage.style.display = "none";
    shoppingField.reset();
  })

  //////////////////////////////////////////////////////////////////////////

 ///delete function///
async function deleteFromInventory (object){
  const checkList = await fetch(
    `https://nackademin-item-tracker.herokuapp.com/lists/${inventoryID}`
  );
  const listItems = await checkList.json();
  console.log(object);
  console.log(listItems);

  for (let i = 0; i < listItems.itemList.length; i++) {
    console.log(listItems.itemList[i].title, listItems.itemList[i]._id);
    if (listItems.itemList[i].title.toLowerCase() === object.toLowerCase()) {
      console.log("I FOUND IT!!!!!!!");

      const res = await fetch(`${API_BASE}lists/${inventoryID}/items/${listItems.itemList[i]._id}`, {
        method: "DELETE",
      });
      window.location.reload();
      }}}
  

alertMessageNumber2Yes.addEventListener("click", function(e){
  e.preventDefault();
  inputMain = document.querySelector("#shoppingField").value;
  inputDesc = document.querySelector("#shoppingDesc").value;
  deleteFromInventory(inputMain);
  alertMessageNumber2.style.display = "none";
})


alertMessageNumber2No.addEventListener("click", function(e){
  e.preventDefault();
  alertMessageNumber2.style.display = "none";
  shoppingField.reset();
})

shoppingMove.addEventListener("click", function (e) {
  transferItems("buy");
});

inventoryMove.addEventListener("click", function (e) {
  transferItems("inventory");
});

apiGet(buyID);
apiGet(inventoryID);