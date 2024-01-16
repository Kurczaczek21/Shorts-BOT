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
var video = document.querySelector("video");
video.src += "?" + new Date().getTime();

async function openPopup() {
  wrapper.classList.add("active-popUp");
}

async function closePopup() {
  wrapper.classList.remove("active-popUp");
}

async function signOut() {
  try {
    const response = await fetch("/api/auth/signout", {
      method: "POST",
    });
    if (response.ok) {
      window.location.href = "/";
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function login() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    if (response.ok) {
      const data = await response.json();
      // data.username=
      // window.location.href = "/panel";
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function checkTokenAndRedirectIfLoggedIn() {
  try {
    const response = await fetch("/api/auth/check", {
      method: "POST",
      credentials: "include",
    });
    console.log(response);

    if (response.ok) {
      window.location.href = "/panel";
    } else {
      console.log("User not logged innnnnnnnnnn");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
