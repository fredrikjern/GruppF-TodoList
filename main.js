let buyListInput = document.querySelector("#buy-list-input");
let buyList = document.querySelector("#buy-list");

// Submit eventListener on buy item form
// buyListInput.addEventListener("submit", (event) => {
//   event.preventDefault();
//   let input = document.querySelector("#buy-list-input> input").value;
//   apiPost(input);
// });

// Takes all items and prits it to desired list
function printToList(items, list) {
  list.innerHTML = "";

  items.forEach((item) => {
    createItem(item);
  });
}

/*
This function takes in the a list and an item and deletes the selected item.
Use this in the context of the delete button appended to each list item.
*/
async function deleteFunction(currentList, item) {
  const res = await fetch(`${API_BASE}lists/${currentList}/items/${item._id}`, {
    method: "DELETE",
  }); // deletar objekt med _id.
  let { list } = await res.json(); // Hämtar den nya listan som där objektet är borttaget.
  return list;
}

async function apiGet(id) {
  const res = await fetch(
    `https://nackademin-item-tracker.herokuapp.com/lists/${id}`
  );
  const data = await res.json();
  console.log(data);
  console.log("hämtat datat");
  return data;
}

let buyID = "63ea106e843a53f2e4b457f3";
let inventoryID = "63ea107d843a53f2e4b457f4";
let buyListData = apiGet(buyID);
console.log(buyListData);
// console.log(buyListData);
//let inventoryListData = apiGet(inventoryID);
//console.log(inventoryListData);

//-------------------------------------------------------
