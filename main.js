
let buyListInput = document.querySelector("#buy-list-input");
let buyList = document.querySelector("#buy-list");



// Api post funtion that adds items into buy list
async function apiPost(str){
    const res = await fetch(
        `https://nackademin-item-tracker.herokuapp.com/lists/GruppF-UserName-Buy/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: str
          }),
        }
      );
      console.log("Hej");
      //const { buyList } = await res.json();
};



// Submit eventListener on buy item form
buyListInput.addEventListener("submit", (event)=>{
    event.preventDefault();
    let input = document.querySelector("#buy-list-input> input").value;
    apiPost(input);
});


function createItem(item) { 
  const liElem = document.createElement('li')
  liElem.innerHTML = `<h4>${item.title}</h4><p>${item.description}${item.checked ? '✅' : ''}</p>`

  const deleteItemBtn = document.createElement('button')
  deleteItemBtn.innerText = 'Del'
  liElem.appendChild(deleteItemBtn)
  
  const setAsCheckedBtn = document.createElement('button')
  setAsCheckedBtn.innerText = 'Check'
  liElem.appendChild(setAsCheckedBtn)

  listItemHolder.appendChild(liElem)

  deleteItemBtn.addEventListener('click', async function () { 
    const res = await fetch(`${API_BASE}lists/${currentList}/items/${item._id}`, {
      method: 'DELETE'
    })
    const { list } = await res.json()

    drawItems(list.itemList)
  })



// Takes all items and prits it to desired list
function printToList(items, list) {
  list.innerHTML = ''

  items.forEach(item => { 
    createItem(item)
  })
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
