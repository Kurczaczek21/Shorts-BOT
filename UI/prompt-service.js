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

const videoURL = document.getElementById("vid-link");
const videoTitle = document.getElementById("vid-title");
const videoDesc = document.getElementById("vid-desc");
const generateVidButton = document.getElementById("generate-vid-btn");
const uploadVidButton = document.getElementById("upload-vid-btn");

generatePromptBtn.addEventListener("click", async () => {
  console.log("prprpr");
  generatePromptBtn.style.fontSize = 0;
  generatePromptBtn.disabled = true;
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
  generatePromptBtn.disabled = false;
  loader1.style.visibility = "hidden";
  section2.scrollIntoView({ behavior: "smooth" });
});

sendIdeaButton.addEventListener("click", async () => {
  const userPrompt = ideaInput.value.trim();
  sendIdeaButton.style.fontSize = 0;
  sendIdeaButton.disabled = true;
  loader2.style.visibility = "visible";
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
      promptTextarea.value = data.response;
    } else {
      console.error("Błąd:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Błąd:", error.message);
  }
  sendIdeaButton.style.fontSize = "1em";
  sendIdeaButton.disabled = false;
  loader2.style.visibility = "hidden";
  ideaInput.value = "";
  section2.scrollIntoView({ behavior: "smooth" });
});

generateVidButton.addEventListener("click", async () => {
  generateVidButton.style.fontSize = 0;
  generateVidButton.disabled = true;
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
        const data = await vidResponse.json();
        console.log("Odpowiedź z serwera:", data.response);
        videoURL.value = data.response.url;
        videoTitle.value = data.response.title;
        videoDesc.value = data.response.description;
        section3.scrollIntoView({ behavior: "smooth" });
        await delay(2000);
        location.reload();
      } else {
        console.error("Błąd:", vidResponse.status, vidResponse.statusText);
        alert("Unexpected error occured during video generation. Try again");
      }
    } else {
      console.error("Błąd:", response.status, response.statusText);
    }
  } catch (error) {
    alert("Unexpected error occured. Try again");
    console.log("Error occured, video not made.");
    console.error("Błąd:", error.message);
  }
  generateVidButton.style.fontSize = "1em";
  generateVidButton.disabled = false;
  loader3.style.visibility = "hidden";
});

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
    console.log(time / 1000 + "s passed");
  });
}

uploadVidButton.addEventListener("click", async () => {
  uploadVidButton.style.fontSize = 0;
  uploadVidButton.disabled = true;
  loader4.style.visibility = "visible";
  try {
    const vidCaption = videoTitle.value + videoDesc.value;
    videoData = {
      caption: vidCaption,
      url: videoURL.value,
    };
    const vidResponse = await fetch("/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: videoData }),
    });
    alert("Video successfully uploaded!");
  } catch (error) {
    alert("Unexpected error occured.");
    console.error("Błąd:", error.message);
  }
  uploadVidButton.style.fontSize = "1em";
  uploadVidButton.disabled = false;
  loader4.style.visibility = "hidden";
});
