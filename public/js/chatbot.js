document.addEventListener("DOMContentLoaded", function () {
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  chatForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const userInput = chatInput.value.trim();
    if (userInput) {
      appendMessage("You", userInput);
      chatInput.value = "";
      getBotResponse(userInput);
    }
  });

  function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getBotResponse(userInput) {
    fetch("/get_response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_input: userInput }),
    })
      .then((response) => response.json())
      .then((data) => {
        data.response.forEach((botResponse) => {
          appendMessage("Chatbot", botResponse);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});
