
// openrouter.js
import fetch from "node-fetch"; // npm install node-fetch
import { retrieveContext } from "./rag.js";

// Keep a small chat history (for better conversational flow)
let chatHistory = [];

export async function getCompletion(promptText) {
  const url = "https://openrouter.ai/api/v1/chat/completions";

 const headers = {
  "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
};

  // Retrieve relevant CRM context
  const retrievedContext = await retrieveContext(promptText);

  const systemPrompt = `
You are CRM-GPT, a friendly and knowledgeable CRM assistant that provides accurate, business-focused, and human-like answers.

Goals:
Use simple markdown for clarity: bold for headings or key terms (like Zoho CRM, Pricing, Key Features).
- Use simple markdown formatting for clarity:
   - Use **bold** for headings and key terms.
   - Use bullet points or short paragraphs for structure.
   - Avoid excessive stars or symbols.

- Avoid excessive formatting.
Make the headings in bold letters.
- Be friendly and clear — sound like a helpful business consultant, not a robot.
- No markdown formatting (**text**, *stars*, etc.)
- Give short, relevant explanations.
- After every main answer, ask a helpful follow-up such as:
  "Would you like me to explain this further?" or
  "Do you want me to tell you about pricing, setup, or business fit?"
“Use short bold section titles (like Key Features, Pricing, Best Use Cases) when appropriate.”

  - Adapt tone: 
   - For small businesses → focus on ease, pricing, and simplicity.
   - For enterprises → focus on scalability, integrations, and ROI.
- Always use retrieved CRM context for facts.
- If you don’t have reliable info, say:
  "I don’t have enough accurate data to answer that."

You are CRM-GPT, a friendly conversational CRM assistant.

Your response rules:
- Always use Markdown formatting.
- Every heading must be bold and clear.
- Highlight important keywords in bold.
- If the user asks for comparison → reply using tables.
- If the user asks for steps → reply using **numbered or bullet lists.
- If explanation is long, break it using clear sections.
- If user asks about CRM modules → format in columns or clear blocks.
- If something is technical → explain in simple language first, then detailed.
- After giving an answer, always ask:
  “Would you like a more detailed explanation or is this enough?”
- Always keep the tone friendly, like ChatGPT.

  `;

  // Add current user input to chat history
  chatHistory.push({ role: "user", content: promptText });

  const body = JSON.stringify({
    model: "openai/gpt-4o-mini",
 messages: [
    {
      role: "system",
      content: "You are a helpful CRM assistant who always checks if the user is satisfied with the answer or wants to know more. Provide friendly, structured answers with bold section titles when relevant.",
    },
    {
      role: "system",
      content: systemPrompt, // keep your detailed CRM behavior
    },
    {
      role: "user",
      content: promptText,
    },
  ],
  max_tokens: 250,
  temperature: 0.4,
  });

  try {
    const response = await fetch(url, { method: "POST", headers, body });
    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      const reply = data.choices[0].message.content.replace(/\*\*/g, "").trim();
      if (chatHistory.length > 8) chatHistory = chatHistory.slice(-8);
      // Add assistant’s reply to the chat memory
      chatHistory.push({ role: "assistant", content: reply });

      return reply;
    } else {
      console.error("No valid response from OpenRouter:", data);
      return "No valid response from OpenRouter.";
    }
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    throw error;
  }
}

