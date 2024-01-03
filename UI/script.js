const wrapper = document.querySelector(".wrapper");
const btnPopUp = document.querySelector(".btnLogin-popUp");
const iconClose = document.querySelector(".icon-close");

window.onload = function () {
  Particles.init({
    selector: ".background",
    maxParticles: 220,
    sizeVariations: 3,
    color: "#aaaaaa",
    connectParticles: true,
    minDistance: 80,
  });
};

btnPopUp.addEventListener("click", () => {
  wrapper.classList.add("active-popUp");
});

iconClose.addEventListener("click", () => {
  wrapper.classList.remove("active-popUp");
});
