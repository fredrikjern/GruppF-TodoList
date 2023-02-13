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