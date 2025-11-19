// rag.js
import fs from "fs";
import path from "path";

// 🧠 Simple RAG function: retrieves relevant context based on keywords
export async function retrieveContext(userQuery) {
  try {
    // Path to the CRM knowledge base
    const filePath = path.resolve("crm_knowledge.txt");

    // Read knowledge base content
    const data = fs.readFileSync(filePath, "utf8");

    console.log("✅ Context retrieved from knowledge base.");

    // Simple keyword-based retrieval
    const sentences = data.split(".");
    const matched = sentences
      .filter((s) => s.toLowerCase().includes(userQuery.toLowerCase()))
      .slice(0, 3)
      .join(". ");

    // Return best match or fallback context
    return matched || data.slice(0, 400);
  } catch (error) {
    console.error("❌ Error retrieving context:", error);
    return "";
  }
}
