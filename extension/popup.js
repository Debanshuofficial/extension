document.addEventListener('DOMContentLoaded', () => {
  const queryInput = document.getElementById('query');
  const searchBtn = document.getElementById('searchBtn');
  const apiKeySection = document.getElementById('apiKeySection');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveKeyBtn = document.getElementById('saveKeyBtn');
  const resetKeyBtn = document.getElementById('resetKeyBtn');

  const responseContainer = document.getElementById('responseContainer');
  const responseText = document.getElementById('responseText');
  const stepCounter = document.getElementById('stepCounter');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let GEMINI_API_KEY = '';
  let currentPlan = [];
  let currentStepIndex = 0;

  // --- Load API Key ---
  chrome.storage.sync.get(['geminiApiKey'], (result) => {
    if (result.geminiApiKey) {
      GEMINI_API_KEY = result.geminiApiKey;
      // If key exists, hide section, else show
      if (!GEMINI_API_KEY) apiKeySection.style.display = 'block';
    } else {
      apiKeySection.style.display = 'block';
    }
  });

  saveKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
      chrome.storage.sync.set({ geminiApiKey: key }, () => {
        GEMINI_API_KEY = key;
        apiKeySection.style.display = 'none';
        alert('API Key Saved!');
      });
    }
  });

  resetKeyBtn.addEventListener('click', () => {
    chrome.storage.sync.remove(['geminiApiKey'], () => {
      GEMINI_API_KEY = '';
      apiKeyInput.value = '';
      alert('API Key Removed.');
    });
  });

  // --- UI Updates ---
  const updateUI = () => {
    if (currentPlan.length === 0) return;

    stepCounter.innerText = `Step ${currentStepIndex + 1} of ${currentPlan.length}`;
    responseText.innerText = currentPlan[currentStepIndex];

    // Button states
    prevBtn.style.display = currentStepIndex > 0 ? 'inline-block' : 'none';

    // Last step?
    if (currentStepIndex === currentPlan.length - 1) {
      nextBtn.innerText = "Done";
      // Optional: hide next button or keep it to close
      nextBtn.style.display = 'none';
    } else {
      nextBtn.innerText = "Next >";
      nextBtn.style.display = 'inline-block';
    }
  };

  // --- Core Logic ---
  const fetchPlan = async (userQuery) => {
    if (!GEMINI_API_KEY) {
      alert('Please set your Gemini API Key first.');
      apiKeySection.style.display = 'block';
      return;
    }

    // Reset UI
    responseContainer.style.display = 'block';
    responseText.innerText = 'Analyzing Page & Creating Plan...';
    stepCounter.innerText = '';
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';

    // Get Page Context
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      let pageContext = "";
      if (tabs && tabs.length > 0) {
        pageContext = `Current Page Title: "${tabs[0].title}"\nCurrent Page URL: "${tabs[0].url}"`;
      } else {
        pageContext = "Could not detect page context.";
      }

      // Prompt for JSON
      const prompt = `User Goal: "${userQuery}".
        ${pageContext}
        
        Based on the User Goal and the Current Page, provide a specific step-by-step guide.
        if the goal is general, give general steps. If it relates to the current page, give specific UI interactions.
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

        // Clean Markdown if present
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
          currentPlan = JSON.parse(rawText);
          if (!Array.isArray(currentPlan)) {
            // Fallback if not an array (single string response)
            currentPlan = [rawText];
          }
          currentStepIndex = 0;
          updateUI();
        } catch (e) {
          console.error("JSON Parse Error", e);
          // Fallback: split by newlines if JSON fails
          const lines = rawText.split('\n').filter(line => line.trim().length > 0);
          if (lines.length > 0) {
            currentPlan = lines;
            currentStepIndex = 0;
            updateUI();
          } else {
            responseText.innerText = "Could not parse plan. Raw: " + rawText;
          }
        }

      } catch (error) {
        console.error(error);
        responseText.innerText = `Error: ${error.message}`;
      }
    });
  };

  // --- Event Listeners ---
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

  // Soft Reset (New Search)
  document.getElementById('newSearchBtn').addEventListener('click', () => {
    currentPlan = [];
    currentStepIndex = 0;
    queryInput.value = '';
    responseContainer.style.display = 'none';
    // Do NOT clear API Key
  });

  // Hard Reset (Full)
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Full Reset?\n\nThis will clear your plan AND your API Key.')) {
      // Clear Storage
      chrome.storage.sync.remove(['geminiApiKey'], () => {
        GEMINI_API_KEY = '';

        // Reset State
        currentPlan = [];
        currentStepIndex = 0;

        // Reset UI
        queryInput.value = '';
        responseContainer.style.display = 'none';
        apiKeySection.style.display = 'block';

        alert('Extension Reset. Please enter API Key again.');
      });
    }
  });
});