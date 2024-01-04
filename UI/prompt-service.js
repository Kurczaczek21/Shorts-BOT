const generatePromptBtn = document.getElementById("generate-prompt-btn");
const promptTextarea = document.getElementById("prompt-textarea");
const sendIdeaButton = document.getElementById("idea-send");
const ideaInput = document.getElementById("idea-input");
const loader1 = document.getElementById("loader1");
const loader2 = document.getElementById("loader2");
const loader3 = document.getElementById("loader3");
const loader4 = document.getElementById("loader4");

const section1 = document.getElementById("section1");
const section2 = document.getElementById("section2");
const section3 = document.getElementById("section3");
const generateVidButton = document.getElementById("generate-vid-btn");

const video = document.querySelector("video");

generatePromptBtn.addEventListener("click", async () => {
  generatePromptBtn.style.fontSize = 0;
  loader1.style.visibility = "visible";

  // Get all cookies
  var cookies = document.cookie;

  // Check if "token" cookie exists
  if (cookies.indexOf("token=") === -1) {
    // "token" cookie not found, display alert
    alert("No token cookie. Please log in first");
    return;
  }

  var token = getCookie("token");
  console.log(token);

  try {
    const response = await fetch("/chat", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const generatedPrompt = data.response;
      console.log(generatedPrompt);
      promptTextarea.value = generatedPrompt;
    } else {
      console.error("Błąd:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Błąd:", error.message);
  }

  generatePromptBtn.style.fontSize = "1em";
  loader1.style.visibility = "hidden";
  section2.scrollIntoView({ behavior: "smooth" });
});

sendIdeaButton.addEventListener("click", async () => {
  const userPrompt = ideaInput.value.trim();
  sendIdeaButton.style.fontSize = 0;
  loader2.style.visibility = "visible";
  console.log(userPrompt);

  // Get all cookies
  var cookies = document.cookie;

  // Check if "token" cookie exists
  if (cookies.indexOf("token=") === -1) {
    // "token" cookie not found, display alert
    alert("No token cookie. Please log in first");
    return;
  }

  var token = getCookie("token");
  console.log(token);

  try {
    const response = await fetch("/chat1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt: userPrompt }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Odpowiedź z serwera:", data.response);
      promptTextarea.value = data.response;
    } else {
      console.error("Błąd:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Błąd:", error.message);
  }
  sendIdeaButton.style.fontSize = "1em";
  loader2.style.visibility = "hidden";
  ideaInput.value = "";
  section2.scrollIntoView({ behavior: "smooth" });
});

generateVidButton.addEventListener("click", async () => {
  generateVidButton.style.fontSize = 0;
  loader3.style.visibility = "visible";
  try {
    vidIdea = promptTextarea.value;
    const response = await fetch("/modify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: vidIdea }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Odpowiedź z serwera:", data.response);
      const JSONvidIdea = data.response;

      // start vid gen
      const vidResponse = await fetch("/genvid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: JSONvidIdea }),
      });

      if (vidResponse.ok) {
        console.log("DONE..........");
        const data = await vidResponse.json();
        console.log("Odpowiedź z serwera:", data);
        console.log("Odpowiedź z serwera:", data.response);
        document.getElementById("vid-link").innerHTML = data.response;
        generateVidButton.style.fontSize = "1em";
        loader3.style.visibility = "hidden";
        location.reload();
      } else {
        console.error("Błąd:", vidResponse.status, vidResponse.statusText);
      }
    } else {
      console.error("Błąd:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Błąd:", error.message);
  }

  section3.scrollIntoView({ behavior: "smooth" });
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
