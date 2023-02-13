
let buyListInput = document.querySelector("#buy-list-input");
let buyList = document.querySelector("#buy-list");

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

buyListInput.addEventListener("submit", (event)=>{
    event.preventDefault();
    let input = document.querySelector("#buy-list-input> input").value;
    apiPost(input);
});

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
let buyListInput = document.querySelector(".buy-list-input");
