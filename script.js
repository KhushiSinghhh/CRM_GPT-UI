const chatBox = document.getElementById("chat-box");
const input = document.getElementById("promptInput");
const sendBtn = document.getElementById("sendBtn");
const firstUI = document.getElementById("first-ui");
const secondUI = document.getElementById("second-ui");
const chatBox2 = document.getElementById("chat-box2");
const input2 = document.getElementById("promptInput2");
const sendBtn2 = document.getElementById("sendBtn2");

// Add message to chat
function addMessage(box, content, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = content;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

// Handle sending messages
sendBtn.addEventListener("click", async () => {
  const prompt = input.value.trim();
  if (!prompt) return;

  addMessage(chatBox, prompt, "user");
  input.value = "";

  addMessage(chatBox, "⏳ Thinking...", "bot");

  try {
    const res = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    chatBox.lastChild.remove(); // remove "Thinking..."
    addMessage(chatBox, data.response || "⚠️ No response from server.", "bot");

    // Switch to second UI
    setTimeout(() => {
      firstUI.classList.add("hidden");
      setTimeout(() => {
        firstUI.style.display = "none";
        secondUI.style.display = "block";
      }, 400);
    }, 700);
  } catch {
    chatBox.lastChild.remove();
    addMessage(chatBox, "❌ Error connecting to server.", "bot");
  }
});

// Send on Enter key
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

// SECOND UI Chat
sendBtn2.addEventListener("click", async () => {
  const prompt = input2.value.trim();
  if (!prompt) return;

  addMessage(chatBox2, prompt, "user");
  input2.value = "";

  addMessage(chatBox2, "⏳ Thinking...", "bot");

  try {
    const res = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    chatBox2.lastChild.remove();
    addMessage(chatBox2, data.response || "⚠️ No response from server.", "bot");
  } catch {
    chatBox2.lastChild.remove();
    addMessage(chatBox2, "❌ Error connecting to server.", "bot");
  }
});

input2.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn2.click();
});