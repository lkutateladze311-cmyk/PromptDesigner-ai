```javascript
// ELEMENTS
const promptInput = document.getElementById("promptInput");
const categorySelect = document.getElementById("category");
const styleSelect = document.getElementById("style");

const improveBtn = document.getElementById("improveBtn");
const resultContainer = document.getElementById("resultContainer");
const resultText = document.getElementById("resultText");
const copyBtn = document.getElementById("copyBtn");
const errorMessage = document.getElementById("errorMessage");


// IMPROVE PROMPT
improveBtn.addEventListener("click", async () => {

    const prompt = promptInput.value.trim();
    const category = categorySelect.value;
    const style = styleSelect.value;

    // Check empty prompt
    if (!prompt) {
        errorMessage.textContent = "Please enter a prompt first.";
        resultContainer.hidden = true;
        promptInput.focus();
        return;
    }

    // Reset previous results
    errorMessage.textContent = "";
    resultContainer.hidden = true;

    // Loading state
    improveBtn.disabled = true;
    improveBtn.textContent = "✦ Improving your prompt...";

    try {

        const response = await fetch("/api/improve", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                prompt: prompt,
                category: category,
                style: style
            })
        });

        const data = await response.json();

        // Check server response
        if (!response.ok || !data.success) {
            throw new Error(data.error || "Something went wrong.");
        }

        // Display improved prompt
        resultText.textContent = data.improvedPrompt;

        resultContainer.hidden = false;

        resultContainer.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    } catch (error) {

        console.error("PromptForge Error:", error);

        errorMessage.textContent =
            error.message || "Unable to connect to PromptForge AI.";

    } finally {

        // Restore button
        improveBtn.disabled = false;
        improveBtn.textContent = "✦ Improve My Prompt";

    }

});


// COPY IMPROVED PROMPT
copyBtn.addEventListener("click", async () => {

    const text = resultText.textContent;

    if (!text) return;

    try {

        await navigator.clipboard.writeText(text);

        copyBtn.textContent = "✓ Copied!";

        setTimeout(() => {
            copyBtn.textContent = "Copy";
        }, 2000);

    } catch (error) {

        console.error("Copy error:", error);
        copyBtn.textContent = "Copy failed";

    }

});


// CLEAR ERROR WHEN USER TYPES
promptInput.addEventListener("input", () => {

    errorMessage.textContent = "";

});


// ENTER KEY SUPPORT
promptInput.addEventListener("keydown", (event) => {

    if (event.ctrlKey && event.key === "Enter") {
        improveBtn.click();
    }

});

console.log("PromptForge AI frontend loaded successfully.");
```;
