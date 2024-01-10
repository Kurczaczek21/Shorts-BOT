const wrapper = document.querySelector(".wrapper");
const btnPopUp = document.querySelector(".btnLogin-popUp");
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

btnPopUp.addEventListener("click", () => {
  wrapper.classList.add("active-popUp");
});

iconClose.addEventListener("click", () => {
  wrapper.classList.remove("active-popUp");
});

function getCookie(name) {
  var nameEQ = name + "=";
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0)
      return cookie.substring(nameEQ.length, cookie.length);
  }
  return null;
}

async function login() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.token) {
        document.cookie = `token=${data.token}; path=/`;
      } else {
        alert("Authentication failed. Please check your credentials.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function checkTokenAndRedirectIfLoggedIn() {
  var cookies = document.cookie;

  // Check if "token" cookie exists
  if (cookies.indexOf("token=") === -1) {
    alert("No token cookie. Please log in first");
  } else {
    // "token" cookie exists
    var tokenValue = getCookie("token");
    window.location.href = "/logged-in";
    fetch("/logged-in", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenValue}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Token correct. Redirecting to the video creation page.");
        } else if (response.status === 401) {
          alert("Token is not valid. Please log in again.");
        } else {
          alert("Error: Unable to access /logged-in");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
