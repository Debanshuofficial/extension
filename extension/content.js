if (document.getElementById('gemini-ext-root')) {

} else {
    // --- CSS Styles ---
    const style = document.createElement('style');
    style.textContent = `
    /* Base Container */
    #gemini-ext-root {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 2147483647; /* Max Z-Index */
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        display: flex;
        flex-direction: column-reverse;
        align-items: flex-end;
        gap: 15px;
        pointer-events: none;
    }

    #gemini-ext-root * {
        box-sizing: border-box;
    }

    /* Floating Eye Button */
    #gemini-ext-eye {
        pointer-events: auto;
        width: 60px;
        height: 60px;
        border-radius: 30px; /* Pillow/Circle shape */
        background: rgba(30, 30, 30, 0.9);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        transition: transform 0.2s, background 0.2s;
        color: white;
    }

    #gemini-ext-eye:hover {
        transform: scale(1.05);
        background: rgba(40, 40, 40, 1);
    }

    /* Main Panel */
    #gemini-ext-panel {
        pointer-events: auto;
        width: 380px;
        max-height: 80vh;
        background: rgba(20, 20, 20, 0.95);
        backdrop-filter: blur(15px);
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        border: 1px solid rgba(255,255,255,0.1);
        display: none;
        flex-direction: column;
        overflow: hidden;
        animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    #gemini-ext-panel.visible {
        display: flex;
    }

    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* Row 1: Current Page Header */
    .gemini-header {
        padding: 12px 15px;
        background: rgba(255,255,255,0.03);
        border-bottom: 1px solid rgba(255,255,255,0.05);
        font-size: 12px;
        color: #aaa;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    .gemini-header-icon { font-size: 14px; }

    /* Row 2: Instructions Body */
    .gemini-body {
        flex-grow: 1;
        padding: 20px;
        overflow-y: auto;
        min-height: 150px;
        max-height: 400px;
        display: flex;
        flex-direction: column;
        justify-content: center; /* Center empty state */
        color: #e0e0e0;
        font-size: 15px;
        line-height: 1.6;
    }

    .gemini-step-counter {
        font-size: 11px;
        color: #667eea;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
        font-weight: bold;
    }

    .gemini-content-text {
        white-space: pre-wrap;
    }

    /* Row 3: Search Bar */
    .gemini-input-row {
        padding: 10px 15px;
        border-top: 1px solid rgba(255,255,255,0.05);
        display: flex;
        gap: 10px;
        background: rgba(0,0,0,0.2);
    }

    .gemini-input {
        flex-grow: 1;
        background: transparent;
        border: none;
        color: white;
        font-size: 14px;
        outline: none;
        padding: 8px;
    }
    .gemini-input::placeholder { color: #555; }

    .gemini-send-btn {
        background: #667eea;
        border: none;
        color: white;
        border-radius: 8px;
        width: 36px;
        height: 36px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: opacity 0.2s;
    }
    .gemini-send-btn:hover { opacity: 0.9; }

    /* Row 4: Controls (5 Buttons) */
    .gemini-controls-row {
        padding: 12px 15px;
        display: flex;
        justify-content: space-between;
        background: rgba(0,0,0,0.3);
        border-top: 1px solid rgba(255,255,255,0.05);
    }

    .gemini-icon-btn {
        background: transparent;
        border: 1px solid rgba(255,255,255,0.1);
        color: #aaa;
        width: 38px;
        height: 38px;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        transition: all 0.2s;
    }

    .gemini-icon-btn:hover {
        background: rgba(255,255,255,0.1);
        color: white;
        border-color: rgba(255,255,255,0.3);
    }

    .gemini-icon-btn:active { transform: scale(0.95); }
    
    /* Utility */
    .hidden { display: none !important; }
    
    /* Scrollbar */
    .gemini-body::-webkit-scrollbar { width: 6px; }
    .gemini-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
    `;
    document.head.appendChild(style);

    // --- HTML Structure ---
    const root = document.createElement('div');
    root.id = 'gemini-ext-root';

    // Panel
    const panel = document.createElement('div');
    panel.id = 'gemini-ext-panel';
    panel.innerHTML = `
        <!-- Row 1: Current Page Header -->
        <div class="gemini-header">
            <span class="gemini-header-icon">📄</span>
            <span id="gemini-page-title">Detecting page...</span>
        </div>

        <!-- Row 2: Instructions Body -->
        <div class="gemini-body" id="gemini-body">
            <div id="gemini-empty-state" style="text-align: center; color: #666;">
                <div style="font-size: 24px; margin-bottom: 10px;">👋</div>
                Type your goal below to get started.
            </div>
            <div id="gemini-content-wrapper" class="hidden">
                <div class="gemini-step-counter" id="gemini-step-counter">STEP 1</div>
                <div class="gemini-content-text" id="gemini-instruction-text"></div>
            </div>
            <!-- API Key Overlay (Hidden by default) -->
            <div id="gemini-api-overlay" class="hidden" style="position: absolute; inset: 0; background: rgba(20,20,20,0.98); padding: 20px; display: flex; flex-direction: column; justify-content: center; gap: 10px; z-index: 10;">
                <div style="font-weight: bold; color: white;">Setup API Key</div>
                <input type="text" id="gemini-api-input" class="gemini-input" style="border: 1px solid #333; border-radius: 5px; background: black;" placeholder="Paste Gemini API Key">
                <button id="gemini-save-key-btn" class="gemini-send-btn" style="width: 100%; margin-top: 5px;">Save</button>
                <button id="gemini-close-key-btn" style="background: none; border: none; color: #666; cursor: pointer; margin-top: 5px;">Cancel</button>
            </div>
        </div>

        <!-- Row 3: Input Row -->
        <div class="gemini-input-row">
            <input type="text" id="gemini-query-input" class="gemini-input" placeholder="What do you want to do?">
            <button id="gemini-send-btn" class="gemini-send-btn">➤</button>
        </div>

        <!-- Row 4: Controls Row -->
        <div class="gemini-controls-row">
            <button class="gemini-icon-btn" id="btn-key" title="API Key">🔑</button>
            <button class="gemini-icon-btn" id="btn-prev" title="Previous Step">⬅️</button>
            <button class="gemini-icon-btn" id="btn-reload" title="Refresh Instructions">🔄</button>
            <button class="gemini-icon-btn" id="btn-next" title="Next Step">➡️</button>
            <button class="gemini-icon-btn" id="btn-trash" title="Clear Response">🗑️</button>
        </div>
    `;

    // Eye Button
    const eyeBtn = document.createElement('div');
    eyeBtn.id = 'gemini-ext-eye';
    eyeBtn.innerHTML = '👁️';
    eyeBtn.title = 'Open Assistant';

    root.appendChild(panel);
    root.appendChild(eyeBtn);
    document.body.appendChild(root);

    // --- Logic & State ---
    const state = {
        isVisible: false,
        apiKey: '',
        currentPlan: [],
        currentStepIndex: 0,
        userQuery: '',
    };

    // Elements
    const els = {
        panel: document.getElementById('gemini-ext-panel'),
        eye: document.getElementById('gemini-ext-eye'),
        pageTitle: document.getElementById('gemini-page-title'),
        body: document.getElementById('gemini-body'),
        emptyState: document.getElementById('gemini-empty-state'),
        contentWrapper: document.getElementById('gemini-content-wrapper'),
        stepCounter: document.getElementById('gemini-step-counter'),
        instructionText: document.getElementById('gemini-instruction-text'),
        apiOverlay: document.getElementById('gemini-api-overlay'),
        apiInput: document.getElementById('gemini-api-input'),
        queryInput: document.getElementById('gemini-query-input'),

        // Buttons
        btnSend: document.getElementById('gemini-send-btn'),
        btnKey: document.getElementById('btn-key'),
        btnPrev: document.getElementById('btn-prev'),
        btnReload: document.getElementById('btn-reload'),
        btnNext: document.getElementById('btn-next'),
        btnTrash: document.getElementById('btn-trash'),
        btnSaveKey: document.getElementById('gemini-save-key-btn'),
        btnCloseKey: document.getElementById('gemini-close-key-btn')
    };

    // Helpers
    const saveState = () => {
        chrome.storage.local.set({
            geminiState: {
                isVisible: state.isVisible,
                currentPlan: state.currentPlan,
                currentStepIndex: state.currentStepIndex,
                userQuery: state.userQuery
            }
        });
    };

    const updateUI = () => {
        // 1. Panel Visibility
        if (state.isVisible) els.panel.classList.add('visible');
        else els.panel.classList.remove('visible');

        // 2. Page Title
        els.pageTitle.innerText = document.title || 'Unknown Page';

        // 3. Content Area
        if (state.currentPlan && state.currentPlan.length > 0) {
            els.emptyState.classList.add('hidden');
            els.contentWrapper.classList.remove('hidden');

            els.stepCounter.innerText = `STEP ${state.currentStepIndex + 1} / ${state.currentPlan.length}`;
            els.instructionText.innerText = state.currentPlan[state.currentStepIndex];

            // Auto-scroll body to top when step changes
            els.body.scrollTop = 0;
        } else {
            els.emptyState.classList.remove('hidden');
            els.contentWrapper.classList.add('hidden');
        }

        // 4. Button States
        // Disable nav buttons if no plan
        const hasPlan = state.currentPlan.length > 0;
        els.btnNext.style.opacity = (hasPlan && state.currentStepIndex < state.currentPlan.length - 1) ? '1' : '0.3';
        els.btnPrev.style.opacity = (hasPlan && state.currentStepIndex > 0) ? '1' : '0.3';
        els.btnReload.style.opacity = (state.userQuery) ? '1' : '0.3';
        els.btnTrash.style.opacity = (hasPlan) ? '1' : '0.3';
    };

    const fetchGeminiPlan = async (query, forceContextUpdate = false) => {
        if (!state.apiKey) {
            els.apiOverlay.classList.remove('hidden');
            return;
        }

        // UI Loading State
        els.emptyState.classList.add('hidden');
        els.contentWrapper.classList.remove('hidden');
        els.stepCounter.innerText = "THINKING...";
        els.instructionText.innerText = "Analyzing page structure...";

        const pageContext = `Current Page Title: "${document.title}"\nURL: "${window.location.href}"`;

        // Construct Prompt
        const prompt = `
        User Goal: "${query}"
        Context: ${pageContext}
        
        Task: Provide a clear, step-by-step guide to achieve the User Goal on this specific page.
        Format: Return ONLY a raw JSON array of strings. Example: ["Click on 'Login'", "Enter credentials"]
        `;

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${state.apiKey}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            if (!response.ok) throw new Error("API Error");
            const data = await response.json();
            let text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) throw new Error("No response");

            // Parse JSON
            text = text.replace(/```json|```/g, '').trim();
            let plan = [];
            try {
                plan = JSON.parse(text);
            } catch (e) {
                plan = text.split('\n').filter(line => line.trim().length > 0);
            }

            if (!Array.isArray(plan)) plan = [text];

            // Update State
            state.currentPlan = plan;
            state.currentStepIndex = 0;
            state.userQuery = query;
            saveState();
            updateUI();

        } catch (err) {
            els.instructionText.innerText = `Error: ${err.message}`;
            els.stepCounter.innerText = "ERROR";
        }
    };

    // --- Initialization ---
    // 1. Load API Key
    chrome.storage.sync.get(['geminiApiKey'], (res) => {
        if (res.geminiApiKey) state.apiKey = res.geminiApiKey;
    });

    // 2. Load UI State
    chrome.storage.local.get(['geminiState'], (res) => {
        if (res.geminiState) {
            const s = res.geminiState;
            state.isVisible = s.isVisible || false;
            state.currentPlan = s.currentPlan || [];
            state.currentStepIndex = s.currentStepIndex || 0;
            state.userQuery = s.userQuery || '';
            updateUI();
        }
    });

    // --- Event Listeners ---

    // Toggle Visibility
    els.eye.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click from closing immediately if we add outside click logic later
        state.isVisible = !state.isVisible;
        saveState();
        updateUI();
    });

    // API Key Management
    els.btnKey.addEventListener('click', () => els.apiOverlay.classList.remove('hidden'));
    els.btnCloseKey.addEventListener('click', () => els.apiOverlay.classList.add('hidden'));
    els.btnSaveKey.addEventListener('click', () => {
        const key = els.apiInput.value.trim();
        if (key) {
            chrome.storage.sync.set({ geminiApiKey: key }, () => {
                state.apiKey = key;
                els.apiOverlay.classList.add('hidden');
                alert("API Key Saved");
            });
        }
    });

    // Search / Send
    const handleSearch = () => {
        const q = els.queryInput.value.trim();
        if (q) fetchGeminiPlan(q);
    };
    els.btnSend.addEventListener('click', handleSearch);
    els.queryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Navigation Buttons
    els.btnPrev.addEventListener('click', () => {
        if (state.currentStepIndex > 0) {
            state.currentStepIndex--;
            saveState();
            updateUI();
        }
    });

    els.btnNext.addEventListener('click', () => {
        if (state.currentStepIndex < state.currentPlan.length - 1) {
            state.currentStepIndex++;
            saveState();
            updateUI();
        }
    });

    // Reload (Re-fetch with current page context but same query)
    els.btnReload.addEventListener('click', () => {
        if (state.userQuery) {
            fetchGeminiPlan(state.userQuery);
        }
    });

    // Trash (Clear everything)
    els.btnTrash.addEventListener('click', () => {
        state.currentPlan = [];
        state.currentStepIndex = 0;
        state.userQuery = '';
        els.queryInput.value = '';
        saveState();
        updateUI();
    });
}
