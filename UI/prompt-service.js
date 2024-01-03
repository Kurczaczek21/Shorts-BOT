const generatePromptBtn = document.getElementById("generate-prompt-btn");
const promptTextarea = document.getElementById("prompt-textarea");
const sendIdeaButton = document.getElementById("idea-send");
const ideaInput = document.getElementById("idea-input");
const generateVidButton = document.getElementById("generate-vid-btn");

generatePromptBtn.addEventListener("click", async () => {
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
});

sendIdeaButton.addEventListener("click", async () => {
  const userPrompt = ideaInput.value.trim();
  console.log(userPrompt);

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
});


generateVidButton.addEventListener("click", async () => {

  try {
    vidIdea = promptTextarea.value
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
        console.log("Odpowiedź z serwera:", data.vidResponse);
      } else {
        console.error("Błąd:", vidResponse.status, vidResponse.statusText);
      }

    } else {
      console.error("Błąd:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Błąd:", error.message);
  }
});