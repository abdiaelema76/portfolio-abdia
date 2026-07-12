// contact-form/server.js
// Express + MongoDB contact form backend.


require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());

// Allow local dev AND your deployed site.
// Set ALLOWED_ORIGINS in your host's env vars, comma-separated, e.g.:
// ALLOWED_ORIGINS=https://portfolio-abdia.netlify.app,https://yourdomain.com
const allowedOrigins = (process.env.ALLOWED_ORIGINS ||
  "http://127.0.0.1:5500,http://localhost:5500"
).split(",");

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Contact schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  message: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);

// Health check (useful for Render's monitoring)
app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

// Handle form submissions
app.post("/submit-form", async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }

  try {
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();
    res.status(200).json({ message: "Form submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error submitting form" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
