// server.js
import express from "express";
import cors from "cors";
import { getCompletion } from "./openrouter.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// POST endpoint for chat prompts
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const reply = await getCompletion(prompt);
    res.json({ response: reply });
  } catch (error) {
    res.status(500).json({ error: "Error fetching AI response" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
