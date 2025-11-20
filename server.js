// server.js
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getCompletion } from "./openrouter.js";

// Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
import dotenv from "dotenv";
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ✅ Load CRM Knowledge Base
const CRM_FILE_PATH = path.join(__dirname, "crm_knowledge.txt");

const CRM_DATA = fs.existsSync(CRM_FILE_PATH)
  ? fs.readFileSync(CRM_FILE_PATH, "utf-8")
  : "";


// ✅ Context Retrieval Function
function retrieveContext(query) {
  const crmNames = ["hubspot", "salesforce", "zoho", "freshsales"];
  const matched = crmNames.filter((crm) =>
    query.toLowerCase().includes(crm)
  );

  // 🔹 Comparison Query (e.g., compare hubspot and zoho)
  if (matched.length > 1) {
    const combined = matched
      .map((crm) => {
        const regex = new RegExp(`##\\s*${crm}.*?(?=##|$)`, "is");
        const match = CRM_DATA.match(regex);
        return match ? match[0] : "";
      })
      .join("\n\n");
    console.log(`🟢 Comparison context retrieved for: ${matched.join(" vs ")}`);
    return combined;
  }

  // 🔹 Single CRM Query
  if (matched.length === 1) {
    const regex = new RegExp(`##\\s*${matched[0]}.*?(?=##|$)`, "is");
    const match = CRM_DATA.match(regex);
    if (match) {
      console.log(`✅ Context retrieved for: ${query}`);
      return match[0];
    }
  }

  console.log(`⚪ No CRM context found for: ${query}`);
  return "General CRM knowledge: Customer Relationship Management systems help businesses manage leads, sales, and customer data.";
}

// ✅ POST endpoint for chat prompts
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    // Get context from CRM docs
    const context = retrieveContext(prompt);

    // Combine context and user prompt
    const combinedPrompt = `Use the following CRM documentation to answer:\n\n${context}\n\nUser Question: ${prompt}`;

    // Send to OpenRouter API
    const reply = await getCompletion(
      `You are a helpful CRM chatbot. 
  After answering, always ask the user a short follow-up like 
  “Would you like to explore more about this topic or compare it with another CRM?” 

  Context:
  ${context}

  User Question:
  ${prompt}`
    );
    
    res.json({ response: reply });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Error fetching AI response" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
