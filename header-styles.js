						
let hamburgerMenu = document.getElementById("hamburgerMenu");
let menu = document.getElementById("menu");

menu.style.display="none"
let active = false;

hamburgerMenu.addEventListener("click", () => {
  if(!active){
    active = true
    menu.style.display="flex"
    hamburgerMenu.style.color="black"
  } else if(active) {
    active=false
    menu.style.display="none"
    hamburgerMenu.style.color="white"
  }
})
