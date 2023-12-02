const generatePromptBtn = document.getElementById("generate-prompt-btn");
const promptTextarea = document.getElementById("prompt-textarea");

generatePromptBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("/chat", {
      method: "GET", // Możesz użyć 'POST', jeśli zdecydujesz się przesyłać dane w ciele żądania
    });

    if (response.ok) {
      const data = await response.json();
      const generatedPrompt = data.response;
      console.log(generatedPrompt);
      // Wyświetl odpowiedź w elemencie textarea
      promptTextarea.value = generatedPrompt;

      // Możesz dodać dodatkową logikę lub manipulacje DOM w zależności od potrzeb
    } else {
      console.error("Błąd:", response.status, response.statusText);
      // Obsługa błędów w przypadku niepowodzenia żądania
    }
  } catch (error) {
    console.error("Błąd:", error.message);
    // Obsługa błędów w przypadku innych problemów
  }
});
