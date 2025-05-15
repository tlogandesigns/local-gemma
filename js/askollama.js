async function askOllama(event) {
  event.preventDefault(); // stop form from reloading
  const prompt = document.getElementById("message").value;
  const responseElement = document.getElementById("response");
  responseElement.textContent = "Thinking...";

  try {
    const res = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gemma3:1b",
        prompt: prompt+" answer the question with no more than 5 words",
        max_length: 100,
        temperature: 0.7,
        stream: false
      })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    responseElement.textContent = data.response || "No response received.";
  } catch (error) {
    responseElement.textContent = `Error: ${error.message}`;
  }
}