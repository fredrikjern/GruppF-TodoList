const API_BASE = "https://nackademin-item-tracker.herokuapp.com/"; //Den delen av API:urlen som är samma för alla anrop
const buyList = document.getElementById("buy-list");
let shoppingField = document.querySelector("#buy-list-input");
let homeField = document.querySelector("#home-list-input");

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
async function apiGet(listID) {
  //if (listID !== buyID || listID !== inventoryID) {
    //return console.error("ApiGet id error!");
  //}
    const res = await fetch(
      `https://nackademin-item-tracker.herokuapp.com/lists/${listID}`
    );
    const data = await res.json();
    printToList(data, listID);
  }

 
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
  function createItem(obj, list, listIDs) {
    console.log(list);
    let liElem = document.createElement("li");
    liElem.innerHTML = `<p>${obj.description}, ${obj.title}</p>`;
    
    let checkbox = document.createElement("INPUT");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("name", `${list === "buy-list" ? "buy" : "inventory"}`);
    checkbox.setAttribute("value", `${obj._id}`);
    if (obj.checked==="true") checkbox.setAttribute("checked", "true");
    liElem.append(checkbox)
  
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
      apiGet(listID)
    });

    let listID = listIDs;
    deleteItemBtn.addEventListener("click", async function () {
      const res = await fetch(`${API_BASE}lists/${listID}/items/${obj._id}`, {
        method: "DELETE",
      }); // deletar objekt med _id.
      console.log(listID + "  klick på delete");
  
      apiGet(listID);
    });
  }

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
    
    let isInInventory = await compareInputToInventory(inventoryID,inputMain)
    console.log(isInInventory);
    if (!isInInventory){
        addItemToList(buyID,inputMain,inputDesc);
       
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
})


apiGet(buyID);
apiGet(inventoryID);












