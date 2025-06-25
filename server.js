import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://cinescope-ai.onrender.com",
  "https://cine-scope-ai-prompt-based-movie-re.vercel.app",
  "http://localhost:3000", // optional, for local development
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed from this origin"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true, // Only use if you're sending cookies/auth
  })
);

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_KEY);

app.post("/api/gpt", async (req, res) => {
  const { prompt } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (err) {
    // console.error("Gemini error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
