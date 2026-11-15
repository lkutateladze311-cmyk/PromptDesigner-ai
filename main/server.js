```javascript
const express = require("express");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const path = require("path");

// CONFIGURATION
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// OPENAI CONFIGURATION
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })
    : null;


// HOME PAGE
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


// TEST API
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "PromptForge AI is running!",
        apiConfigured: Boolean(openai)
    });
});


// AI PROMPT IMPROVER
app.post("/api/improve", async (req, res) => {

    try {

        const prompt = req.body.prompt;
        const category = req.body.category || "General";
        const style = req.body.style || "Professional";

        // VALIDATE INPUT
        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({
                success: false,
                error: "Please enter a prompt."
            });
        }

        if (prompt.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: "Your prompt cannot be empty."
            });
        }

        if (prompt.length > 8000) {
            return res.status(400).json({
                success: false,
                error: "Prompt is too long."
            });
        }

        // CHECK API KEY
        if (!openai) {
            return res.status(500).json({
                success: false,
                error: "OpenAI API key is missing. Check your .env file."
            });
        }

        // AI INSTRUCTIONS
        const instructions = [
            "You are PromptForge AI, an expert prompt engineer.",
            "Improve the user's original prompt.",
            "Make it clear, detailed and well structured.",
            "Preserve the original intention.",
            "Add useful details when necessary.",
            "Follow the requested category and writing style.",
            "Return only the improved prompt."
        ].join("\n");

        // USER INPUT
        const input = [
            "CATEGORY: " + category,
            "STYLE: " + style,
            "ORIGINAL PROMPT:",
            prompt.trim()
        ].join("\n");

        // GENERATE RESPONSE
        const response = await openai.responses.create({
            model: "gpt-5-mini",
            instructions: instructions,
            input: input
        });

        const improvedPrompt = response.output_text;

        if (!improvedPrompt) {
            throw new Error("AI returned an empty response.");
        }

        // SUCCESS
        res.json({
            success: true,
            improvedPrompt: improvedPrompt.trim()
        });

    } catch (error) {

        console.error("PROMPTFORGE ERROR:", error);

        res.status(500).json({
            success: false,
            error: error.message || "AI generation failed."
        });

    }

});


// START SERVER
app.listen(PORT, () => {

    console.log("--------------------------------");
    console.log("       PROMPTFORGE AI");
    console.log("--------------------------------");

    console.log("Website: http://localhost:" + PORT);
    console.log("API: http://localhost:" + PORT + "/api/test");

    console.log("OpenAI: " + (openai ? "CONNECTED" : "MISSING API KEY"));

    console.log("--------------------------------");

});
```;
