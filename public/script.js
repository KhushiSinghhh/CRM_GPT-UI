const chatBox = document.getElementById("chat-box");
const input = document.getElementById("promptInput");
const sendBtn = document.getElementById("sendBtn");
const firstUI = document.getElementById("first-ui");
const secondUI = document.getElementById("second-ui");
const chatBox2 = document.getElementById("chat-box2");
const input2 = document.getElementById("promptInput2");
const sendBtn2 = document.getElementById("sendBtn2");

let firstMessageSent = false;

/* -----------------------------------------
        FORMAT RESPONSE (BOT ONLY)
------------------------------------------*/
function formatResponse(text) {
  text = text.replace(/^### (.*)$/gm, "<h3>$1</h3>");
  text = text.replace(/^## (.*)$/gm, "<h2>$1</h2>");
  text = text.replace(/^# (.*)$/gm, "<h1>$1</h1>");

 // Headings rule 1 (lines containing CRM)
text = text.replace(/^(.+CRM.+)$/gm, "<h2>$1</h2>");

// Headings rule 2 (big lines starting with capital letter)
text = text.replace(/^([A-Z][A-Za-z0-9 ,'-]{5,})$/gm, "<h2>$1</h2>");


  const keywords = [
    "CRM", "lead", "sales", "pipeline", "workflow",
    "automation", "integration", "API", "features", "pricing"
  ];

  keywords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    text = text.replace(
      regex,
      `<strong style="font-weight:700;color:#fff;">${word}</strong>`
    );
  });

  return text;
}

/* -----------------------------------------
           ADD MESSAGE TO CHATBOX
------------------------------------------*/
function addMessage(box, content, sender) {
  const msg = document.createElement("div");

  msg.classList.add("message", sender, "markdown-body");

  if (sender === "bot") {
    msg.innerHTML = marked.parse(formatResponse(content));
  } else {
    msg.textContent = content;
  }

  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

/* -----------------------------------------
             FIRST UI CHAT SEND
------------------------------------------*/
sendBtn.addEventListener("click", async () => {
  const prompt = input.value.trim();
  if (!prompt) return;

  addMessage(chatBox, prompt, "user");
  input.value = "";

  addMessage(chatBox, "⏳ Thinking...", "bot");

  if (!firstMessageSent) {
    firstMessageSent = true;
    chatBox2.innerHTML = chatBox.innerHTML;
  }

  try {
    const res = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    chatBox.lastChild.remove();
    addMessage(chatBox, data.response || "⚠️ No response.", "bot");

    chatBox2.innerHTML = chatBox.innerHTML;

    if (firstMessageSent) {
      setTimeout(() => {
        firstUI.classList.add("hidden");
        setTimeout(() => {
          firstUI.style.display = "none";
          secondUI.style.display = "block";
        }, 400);
      }, 300);
    }

  } catch {
    chatBox.lastChild.remove();
    addMessage(chatBox, "❌ Error connecting to server.", "bot");
  }
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

/* -----------------------------------------
             SECOND UI CHAT SEND
------------------------------------------*/
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
    addMessage(chatBox2, data.response || "⚠️ No response.", "bot");

  } catch {
    chatBox2.lastChild.remove();
    addMessage(chatBox2, "❌ Error connecting to server.", "bot");
  }
});

input2.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn2.click();
});

/* ---------------------------------------------------
       SIDEBAR ACTIVE HIGHLIGHT HANDLER
----------------------------------------------------*/
const menuItems = document.querySelectorAll(".menu-item");

function setActiveMenu(id) {
  menuItems.forEach(item => item.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* -----------------------------------------
           GO BACK TO FIRST UI (RESET)
------------------------------------------*/
document.getElementById("homeBtn").addEventListener("click", () => {
  chatBox.innerHTML = `<div class="message bot markdown-body">Hi there! How can I assist you today?</div>`;
  chatBox2.innerHTML = `<div class="message bot markdown-body">What is your CRM query?</div>`;

  firstMessageSent = false;

  secondUI.style.display = "none";
  firstUI.style.display = "flex";

  firstUI.classList.remove("hidden");

  chatBox.scrollTop = chatBox.scrollHeight;
});

/* -----------------------------------------
     FIXED BUBBLE CLICK HANDLER (NO DUPLICATE)
------------------------------------------*/
document.querySelectorAll(".q-bubble").forEach(bubble => {
  bubble.addEventListener("click", () => {
    const question = bubble.innerText.trim();
    sendToChat(question);
  });
});

/* -----------------------------------------
       FIXED FUNCTION — NO DUPLICATE
------------------------------------------*/
function sendToChat(text) {
  // DO NOT add the user message manually
  input2.value = text;
  sendBtn2.click(); // this will add user message + send to bot
}

function sendToBot(prompt) {
  input2.value = prompt;
  sendBtn2.click();
}
