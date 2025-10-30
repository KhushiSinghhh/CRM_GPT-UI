// openrouter.js
import fetch from "node-fetch"; // npm install node-fetch

export async function getCompletion(promptText) {
  const url = "https://openrouter.ai/api/v1/chat/completions";

  const headers = {
    "Authorization": "Bearer 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",
    "Content-Type": "application/json",
  };

  // 🧠 Adjusted system prompt
  const systemPrompt = `
You are a CRM (Customer Relationship Management) assistant.

Your role is to answer any question that is clearly or even partly related to CRM —
for example:
- What is CRM?
- How does Salesforce work?
- What are CRM benefits?
- How to automate CRM tasks?
- What is lead management in CRM?

If the user asks something unrelated to CRM, you must reply with:
"I can't understand this! Ask me a CRM Query."

If the user’s message *is even slightly related* to CRM, give a clear, correct answer.
Do NOT block valid CRM questions.
`;

  const body = JSON.stringify({
    model: "openai/gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: promptText },
    ],
    max_tokens: 250,
    temperature: 0.3,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    } else {
      console.error("⚠️ No valid response from OpenRouter:", data);
      return "⚠️ No valid response from OpenRouter.";
    }
  } catch (error) {
    console.error("❌ Error calling OpenRouter API:", error);
    throw error;
  }
}
