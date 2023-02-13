let buyListInput = document.querySelector("#buy-list-input");
let buyList = document.querySelector("#buy-list");
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
      console.log(list)
};

buyListInput.addEventListener("submit", (event)=>{
    event.preventDefault();
    let input = document.querySelector("#buy-list-input> input").value;
    apiPost(input);
});