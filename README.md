# Gemini Web Assistant 🚀
> *A Context-Aware AI Companion for the Web*

**Built for the Gemini API Developer Competition.**

## 💡 Inspiration
Most websites fail not because they lack features, but because guidance is generic and disconnected from the actual page. Help articles assume context users don’t have. 

**Our browser extension solves this by using Gemini’s multimodal understanding to read the current webpage and generate precise, step‑by‑step instructions tailored to what the user sees.**

Instead of searching FAQs or guessing the next click, users get clear actions like: “Click Sign In → enter email → choose this option → submit.” No overlays, no UI manipulation—just accurate, sequential guidance in plain language.

## 🌟 What it Does
For the hackathon, our MVP captures the current page state, sends it to Gemini, and returns concise, actionable steps optimized for speed and clarity.
*   **👀 Reads the Page**: Scans the DOM to understand interactive elements (buttons, inputs, links).
*   **🧠 Gemini Powered**: Uses the **Gemini 2.5 Flash** model to reason about the user's goal in the context of the specific page they are on.
*   **⚡ Actionable Steps**: Returns a structured plan. Users can click "Do It" to have the extension automatically highlight and interact with the element.
*   **🗣️ Voice & Text**: Interact naturally via typing or speech commands.

## 🛠️ How we built it
We built a **Chrome Extension (Manifest V3)** using **Vanilla JavaScript** to keep it lightweight and fast.

### Core Tech Stack
*   **Frontend**: HTML, CSS, JavaScript (Content Scripts).
*   **AI Model**: Google Gemini 2.5 Flash (via direct API calls).
*   **Browser APIs**: `chrome.storage` for state/key management, `webkitSpeechRecognition` for voice, and DOM APIs for interaction.

### Key Components
1.  **Smart DOM Scanner (`getSimplifiedDOM`)**: Valid HTML is too large for context windows. We built a custom parser that extracts only "interactive" elements (buttons, inputs, labeled divs) and assigns them unique, temporary IDs (`data-gemini-id`). This gives Gemini a "map" of the page without the noise.
2.  **The "Act" Engine**: The extension doesn't just tell you what to do; it can do it for you. By mapping the AI's response back to our temporary IDs, we implement a "Do It" feature that scrolls to, highlights, and clicks elements programmatically.
3.  **Shadow-like UI**: To ensure our extension works on *any* website without style conflicts, we used a dedicated container with high z-index and scoped CSS variable isolation.

## 🧗 Challenges we ran into
*   **Context Window vs. Page Size**: Modern single-page applications (SPAs) have massive DOM trees. Sending the whole page to Gemini was slow and expensive. **Solution**: We implemented an aggressive filtering strategy that only sends visible, interactive elements to the model.
*   **Hallucinations vs. Grounding**: Early versions would invent buttons that didn't exist. **Solution**: By forcing the model to reference specific IDs from our injected "map," we grounded its responses in reality. If it can't find the ID, it can't suggest the action.
*   **Dynamic Content**: Pages change. If the user interacts with the page, our "map" becomes stale. **Solution**: We implemented a "Reload" feature to re-scan the DOM and re-plan based on the new state.

## 📚 What we learned
*   **Prompt Engineering for JSON**: Getting an LLM to reliably return executable JSON instructions requires strict prompting and robust error handling (e.g., stripping markdown code blocks).
*   **The Power of Multimodality**: While we currently use text representation of the DOM, shifting the mental model to "the AI sees what I see" fundamentally changes how we design user agents.
*   **Micro-Interactions Matter**: Adding the "Do It" button turned a passive help tool into an active agent, significantly increasing the "magic" factor.

## 📦 Installation & Setup
1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Debanshuofficial/extension.git
    ```
2.  **Load into Chrome**
    *   Open `chrome://extensions/`
    *   Toggle **Developer mode** (top right).
    *   Click **Load unpacked**.
    *   Select the `extension` folder from this project.
3.  **Configure API Key**
    *   Click the extension icon (Floating Eye).
    *   Click the **Key 🔑** button.
    *   Paste your **Google Gemini API Key**.

## 🔮 What's Next
*   **Visual Logic**: Integrating Gemini 2.5 Pro's vision capabilities to understand canvas elements and non-standard UI components.
*   **Cross-Page Agents**: Persisting state across navigations to handle multi-step flows (e.g., checkout processes).
*   **Enterprise Integration**: Pre-mapping complex internal tools for employee onboarding.
