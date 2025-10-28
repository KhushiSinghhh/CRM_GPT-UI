// openrouter.js
import fetch from "node-fetch"; // npm install node-fetch

// Function to call OpenRouter API
export async function getCompletion(promptText) {
  const url = "https://openrouter.ai/api/v1/chat/completions";

  const headers = {
    "Authorization": "Bearer OPENROUTER_API_KEY",
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    model: "openai/gpt-4o-mini",
    prompt: promptText,
    max_tokens: 60,
    temperature: 0.7,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    const data = await response.json();

    // ✅ Extract correct text from your API structure
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].text.trim();
    } else {
      return "⚠️ No valid response from OpenRouter.";
    }
  } catch (error) {
    console.error("❌ Error calling OpenRouter API:", error);
    throw error;
  }
}
