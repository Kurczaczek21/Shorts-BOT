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

generatePromptBtn.addEventListener("click", async () => {
  generatePromptBtn.style.fontSize = 0;
  loader1.style.visibility = "visible";

  try {
    const response = await fetch("/chat", {
      method: "GET",
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

  try {
    const response = await fetch("/chat1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
