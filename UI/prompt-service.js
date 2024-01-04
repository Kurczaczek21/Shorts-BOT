const generatePromptBtn = document.getElementById("generate-prompt-btn");
const promptTextarea = document.getElementById("prompt-textarea");
const sendIdeaButton = document.getElementById("idea-send");
const ideaInput = document.getElementById("idea-input");

generatePromptBtn.addEventListener("click", async () => {
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
});




sendIdeaButton.addEventListener("click", async () => {
  const userPrompt = ideaInput.value.trim();

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
