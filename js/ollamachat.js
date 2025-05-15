document.addEventListener("DOMContentLoaded", async () => { 
  const chatBox = document.getElementById("chatBox");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const maxLengthInput = document.getElementById("maxLengthInput");

  const greetings = [
    "Hey there! How can I assist you today?",
    "Hello! What can I help you with?",
    "Hi! How can I make your day easier?",
    "Hey, what can I do for you today?",
    "Greetings! What can I help you with?",
    "Hello! Need assistance with something?",
    "Hey, I’m here to help! What do you need?",
    "Hi there! How can I help?",
    "What’s up? How can I assist you today?",
    "Hello! What can I do for you?"
  ];

  let thinkingInterval;
  let thinkingMessageElement;

  if (sendBtn) {
    if (userInput) {
      userInput.addEventListener("keypress", event => {
        if (event.key === "Enter") sendMessage();
      });
    }
    sendBtn.addEventListener("click", sendMessage);
  }

  function sendMessage() {
    const message = userInput.value.trim();
    const maxLength = parseInt(maxLengthInput.value) || 100;
    if (!message) return;

    appendMessage(message, "user");
    userInput.value = "";
    userInput.disabled = true;
    sendBtn.disabled = true;

    thinkingMessageElement = appendMessage("Thinking", "bot", true);

    fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:1b-it-qat",
        prompt: message + " Answer the question in less than " + maxLength + " words.",
        stream: false
        temperature: 0.2
      })
    })
      .then(res => res.json())
      .then(data => {
        clearInterval(thinkingInterval);
        thinkingMessageElement.parentElement.remove();
        const response = data.response || "Sorry, no response received.";
        appendMessage(response, "bot");
      })
      .catch(err => {
        clearInterval(thinkingInterval);
        thinkingMessageElement.parentElement.remove();
        appendMessage("❌ Error: " + err.message, "bot");
      })
      .finally(() => {
        userInput.disabled = false;
        sendBtn.disabled = false;
      });
  }

  function appendMessage(text, sender, isThinking = false) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", sender === "user" ? "user-message" : "bot-message");

    if (sender === "bot") {
      const img = document.createElement("img");
      img.src = "/images/icon.png";
      messageElement.appendChild(img);
    }

    const textDiv = document.createElement("div");
    messageElement.appendChild(textDiv);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    if (isThinking) {
      let dots = 0;
      textDiv.textContent = "Thinking";
      thinkingInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        textDiv.textContent = "Thinking" + ".".repeat(dots);
      }, 500);
      return textDiv;
    }

    if (sender === "bot") {
      animateText(textDiv, text);
    } else {
      textDiv.textContent = text;
    }
    return textDiv;
  }

  function animateText(element, text) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;
    const words = [];
    tempDiv.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        words.push(...node.textContent.split(" "));
      } else {
        words.push(node.outerHTML);
      }
    });

    let index = 0;
    function typeNextWord() {
      if (index < words.length) {
        element.innerHTML += words[index] + " ";
        index++;
        setTimeout(typeNextWord, 30);
      }
    }
    typeNextWord();
  }

  setTimeout(() => {
    appendMessage(greetings[Math.floor(Math.random() * greetings.length)], "bot");
  }, 1000);

  function insertIntroMessage() {
    const introMessage = document.createElement("div");
    introMessage.classList.add("intro-message");
    introMessage.textContent = "Welcome to the Gemma3:1b. This chatbot is here to help you find local answers using natural language. Just ask me anything!";
    chatBox.appendChild(introMessage);
  }

  insertIntroMessage();
});
