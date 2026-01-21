if (document.getElementById('gemini-ext-root')) {
} else {
    const style = document.createElement('style');
    style.textContent = `
    /* Base Container for Isolation */
    #gemini-ext-root {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 999999;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        display: flex;
        flex-direction: column-reverse;
        /* Eye at bottom, panel above */
        align-items: flex-end;
        gap: 10px;
        pointer-events: none;
        /* Let clicks pass through empty space */
    }
    
    #gemini-ext-root * {
        box-sizing: border-box;
    }
    
    /* Floating Eye Button - Always Visible */
    #gemini-ext-eye {
        pointer-events: auto;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: 2px solid rgba(255, 255, 255, 0.2);
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        font-size: 24px;
        color: white;
        user-select: none;
    }
    
    #gemini-ext-eye:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }
    
    #gemini-ext-eye:active {
        transform: scale(0.95);
    }
    
    /* Main Panel - Hidden by default */
    #gemini-ext-panel {
        pointer-events: auto;
        width: 350px;
        background: rgba(30, 30, 30, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 20px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: none;
        /* Toggled via JS */
        flex-direction: column;
        gap: 15px;
        animation: slideIn 0.3s ease-out;
    }
    
    #gemini-ext-panel.visible {
        display: flex;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
    
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Input Section */
    .gemini-input-group {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 25px;
        padding: 5px 15px;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .gemini-input {
        flex-grow: 1;
        background: transparent;
        border: none;
        color: #ffffff;
        font-size: 14px;
        outline: none;
        padding: 8px 0;
    }
    
    .gemini-input::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }
    
    .gemini-search-btn {
        background: none;
        border: none;
        color: #a78bfa;
        cursor: pointer;
        padding: 5px;
        transition: color 0.2s;
    }
    
    .gemini-search-btn:hover {
        color: #ffffff;
    }
    
    /* Response Area */
    #gemini-response {
        font-size: 14px;
        line-height: 1.5;
        color: #e2e8f0;
        max-height: 200px;
        overflow-y: auto;
        white-space: pre-wrap;
        padding-right: 5px;
    }
    
    /* Scrollbar for response */
    #gemini-response::-webkit-scrollbar {
        width: 6px;
    }
    
    #gemini-response::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
    }
    
    /* Controls (API Key / Next Step) */
    .gemini-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 5px;
    }
    
    .gemini-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: white;
        padding: 5px 12px;
        border-radius: 15px;
        font-size: 12px;
        cursor: pointer;
        transition: background 0.2s;
    }
    
    .gemini-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .gemini-btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
    }
    
    #gemini-api-section {
        display: none;
        flex-direction: column;
        gap: 10px;
        margin-top: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 10px;
    }
    `;
    document.head.appendChild(style);

    // --- UI Creation ---
    const root = document.createElement('div');
    root.id = 'gemini-ext-root';

    const eyeBtn = document.createElement('div');
    eyeBtn.id = 'gemini-ext-eye';
    eyeBtn.innerHTML = '👁️';
    eyeBtn.title = 'Toggle Gemini Assistant';

    const panel = document.createElement('div');
    panel.id = 'gemini-ext-panel';
    panel.innerHTML = `
    <div class="gemini-input-group">
      <input type="text" id="gemini-query" class="gemini-input" placeholder="What is your goal?">
      <button id="gemini-search-btn" class="gemini-search-btn">➤</button>
    </div>
    
    <div id="gemini-step-counter" style="font-size: 11px; color: #aaa; margin: 10px 0 5px 0; font-weight: bold;"></div>
    <div id="gemini-response" style="margin-bottom: 10px; font-size: 14px; line-height: 1.4;"></div>

    <div class="gemini-controls" style="display: flex; gap: 5px; margin-bottom: 10px;">
      <button id="gemini-prev-btn" class="gemini-btn" style="flex: 1; display: none;">&lt; Prev</button>
      <button id="gemini-next-btn" class="gemini-btn gemini-btn-primary" style="flex: 1; display: none;">Next &gt;</button>
    </div>

    <div class="gemini-settings-row">
       <button id="gemini-settings-btn" class="gemini-btn" style="width: 100%;">⚙️ Settings</button>
    </div>

    <div id="gemini-api-section" style="display: none; flex-direction: column; gap: 5px; margin-top: 10px;">
      <input type="text" id="gemini-api-input" class="gemini-input" style="background:rgba(0,0,0,0.3); padding-left:10px;" placeholder="Paste Gemini API Key">
      <button id="gemini-save-key-btn" class="gemini-btn gemini-btn-primary" style="width:100%">Save Key</button>
    </div>
  `;

    root.appendChild(panel);
    root.appendChild(eyeBtn);
    document.body.appendChild(root);

    // --- State & Elements ---
    const queryInput = document.getElementById('gemini-query');
    const searchBtn = document.getElementById('gemini-search-btn');
    const responseDiv = document.getElementById('gemini-response');
    const stepCounter = document.getElementById('gemini-step-counter');
    const prevBtn = document.getElementById('gemini-prev-btn');
    const nextBtn = document.getElementById('gemini-next-btn');
    const settingsBtn = document.getElementById('gemini-settings-btn');
    const apiSection = document.getElementById('gemini-api-section');
    const apiInput = document.getElementById('gemini-api-input');
    const saveKeyBtn = document.getElementById('gemini-save-key-btn');

    let GEMINI_API_KEY = '';
    let currentPlan = [];
    let currentStepIndex = 0;

    // --- Logic ---

    // Toggle Panel
    eyeBtn.addEventListener('click', () => {
        panel.classList.toggle('visible');
        if (panel.classList.contains('visible')) {
            queryInput.focus();
        }
    });

    // Settings Toggle
    settingsBtn.addEventListener('click', () => {
        apiSection.style.display = apiSection.style.display === 'flex' ? 'none' : 'flex';
    });

    // Load API Key
    chrome.storage.sync.get(['geminiApiKey'], (result) => {
        if (result.geminiApiKey) {
            GEMINI_API_KEY = result.geminiApiKey;
        } else {
            responseDiv.innerText = "Please set your API Key in settings ⚙️";
            apiSection.style.display = 'flex';
            panel.classList.add('visible');
        }
    });

    // Save API Key
    saveKeyBtn.addEventListener('click', () => {
        const key = apiInput.value.trim();
        if (key) {
            chrome.storage.sync.set({ geminiApiKey: key }, () => {
                GEMINI_API_KEY = key;
                apiSection.style.display = 'none';
                responseDiv.innerText = "API Key Saved! Ready.";
            });
        }
    });

    // Update UI
    const updateUI = () => {
        if (currentPlan.length === 0) return;

        stepCounter.innerText = `Step ${currentStepIndex + 1} of ${currentPlan.length}`;
        responseDiv.innerText = currentPlan[currentStepIndex];

        prevBtn.style.display = currentStepIndex > 0 ? 'inline-block' : 'none';

        if (currentStepIndex === currentPlan.length - 1) {
            nextBtn.innerText = "Done";
            nextBtn.style.display = 'none'; // Or keep to close
        } else {
            nextBtn.innerText = "Next >";
            nextBtn.style.display = 'inline-block';
        }
    };

    // API Logic (Direct Fetch)
    const fetchPlan = async (userQuery) => {
        if (!GEMINI_API_KEY) {
            responseDiv.innerText = "Please set your API Key first.";
            apiSection.style.display = 'flex';
            return;
        }

        // Reset UI
        responseDiv.innerText = "Creating Plan...";
        stepCounter.innerText = "";
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';

        const pageContext = `Current Page: ${document.title} (${window.location.href})`;

        const prompt = `User Goal: "${userQuery}". ${pageContext}.
        Provide a step-by-step guide to achieve this.
        RETURN ONLY A RAW JSON ARRAY of strings. No markdown, no "json" tags.
        Example: ["Step 1: Click X", "Step 2: Type Y"]`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (!response.ok) {
                throw new Error(`API Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            let rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!rawText) throw new Error("No response from AI.");

            // Clean Markdown
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

            try {
                currentPlan = JSON.parse(rawText);
                if (!Array.isArray(currentPlan)) currentPlan = [rawText];
                currentStepIndex = 0;
                updateUI();
            } catch (e) {
                // Fallback splitting
                const lines = rawText.split('\n').filter(l => l.trim().length > 0);
                if (lines.length > 0) {
                    currentPlan = lines;
                    currentStepIndex = 0;
                    updateUI();
                } else {
                    responseDiv.innerText = "Could not parse plan. Raw: " + rawText;
                }
            }

        } catch (error) {
            console.error(error);
            responseDiv.innerText = `Error: ${error.message}`;
        }
    };

    // Actions
    searchBtn.addEventListener('click', () => {
        const q = queryInput.value.trim();
        if (q) fetchPlan(q);
    });

    queryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const q = queryInput.value.trim();
            if (q) fetchPlan(q);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            updateUI();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentStepIndex < currentPlan.length - 1) {
            currentStepIndex++;
            updateUI();
        }
    });
}
