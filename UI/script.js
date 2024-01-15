const wrapper = document.querySelector(".wrapper");
const btnPopUp = document.querySelector("#login-btn");
const iconClose = document.querySelector(".icon-close");

window.onload = function () {
  video.load();
  Particles.init({
    selector: ".background",
    maxParticles: 220,
    sizeVariations: 3,
    color: "#aaaaaa",
    connectParticles: true,
    minDistance: 80,
  });
};

// test video src change to force reload
var video = document.querySelector('video');
   video.src += '?' + new Date().getTime();

async function openPopup() {
  wrapper.classList.add("active-popUp");
};

async function closePopup() {
  wrapper.classList.remove("active-popUp");
};


async function login() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
}

async function checkTokenAndRedirectIfLoggedIn() {
  var cookies = document.cookie;
}
