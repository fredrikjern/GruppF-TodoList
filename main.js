const buyList = document.getElementById("buy-list")



// Function that takes buyList or inventoryList and then calls the write function.
async function apiGet(listName) {
  let listID
  if (listName === "buyList") {
    listID = "63ea106e843a53f2e4b457f3"
  } else if (listName === "inventoryList") {
    listID = "63ea107d843a53f2e4b457f4"
  } else {
    return console.error("ApiGet function need to know if it is 'buylist' or 'inventoryList'!")
  }
  const res = await fetch(
    `https://nackademin-item-tracker.herokuapp.com/lists/${listID}`
    );
  const data = await res.json();
  console.log(data.itemList) //TODO Change this line to a draw function
}



// Api post funtion that adds items into buy list
async function apiPost(str) {
  const res = await fetch(
    `https://nackademin-item-tracker.herokuapp.com/lists/GruppF-UserName-Buy/items`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: str,
      }),
    }
  );
  console.log("Hej");
  //const { buyList } = await res.json();
}


const myArr = [
  {
    itemList: ["sak1", "sak2", "sak3"],
    _id: "dsgdg32432fdf",
  }
]
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
