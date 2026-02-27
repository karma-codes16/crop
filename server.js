const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ============================= */
/* MIDDLEWARE */
/* ============================= */

app.use(cors());
app.use(express.json());

/* ============================= */
/* OPENAI SETUP */
/* ============================= */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ============================= */
/* HEALTH CHECK */
/* ============================= */

/* ============================= */
/* RECOMMEND ROUTE */
/* ============================= */

app.post("/recommend", async (req, res) => {

  console.log("Incoming Data:", req.body);

  const { temperature, humidity, rainfall, soilType, ph } = req.body;

  if (!temperature || !humidity || !rainfall || !soilType || !ph) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {

    const prompt = `
You are an agricultural expert AI.

Based on:
Temperature: ${temperature}°C
Humidity: ${humidity}%
Rainfall: ${rainfall} mm
Soil Type: ${soilType}
pH Level: ${ph}

Recommend top 3 crops suitable for Northeast India.
For each crop provide:
- Suitability percentage
- 1 short reason
Format clearly.
`;

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const result = await model.generateContent(prompt);
const response = await result.response;

res.json({
  result: response.text()
});

  } catch (error) {
    console.error("AI ERROR FULL:", error);
    res.status(500).json({ error: "AI processing failed" });
  }

});

/* ============================= */
/* START SERVER */
/* ============================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running at ${PORT}`);
});

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});









