let buyListInput = document.querySelector(".buy-list-input");
let buyList = document.querySelector("#buy-list");

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



// Api post funtion that adds items into buy list

async function apiPost(str){
    const res = await fetch(
        `https://nackademin-item-tracker.herokuapp.com/lists/63ea106e843a53f2e4b457f3/items`,
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
      const { list } = await res.json();
      drawItems(list.itemList, buyList);
};



// Submit eventListener on buy item form
buyListInput.addEventListener("submit", (event)=>{
    event.preventDefault();
    let input = document.querySelector("#shoppingField").value;
    apiPost(input);
});

function createItem(item, list){
    const li = document.createElement("li");
    li.innerHTML = `<h4>${item.title}</h4>`;
    list.appendChild(li);
}

// Takes all items and prits it to desired list
function drawItems(items, list) {
  list.innerHTML = ''

  let content = items.forEach(item => { 
    createItem(item, list)
  })
}



