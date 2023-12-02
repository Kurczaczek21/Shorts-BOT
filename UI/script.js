

const wrapper = document.querySelector(".wrapper");
const btnPopUp = document.querySelector(".btnLogin-popUp");
const iconClose = document.querySelector(".icon-close");

btnPopUp.addEventListener("click", () => {
  wrapper.classList.add("active-popUp");
});

iconClose.addEventListener("click", () => {
  wrapper.classList.remove("active-popUp");
});
