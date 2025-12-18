/**
 * AI-Powered Math Solver
 * Uses Google Gemini API to solve problems and generate visualizations
 */

// ===================================
// Configuration
// ===================================

const AI_CONFIG = {
    // Get your API key from: https://makersuite.google.com/app/apikey
    apiKey: 'AIzaSyBIb72TcsnkfJPl6BMp3293K5iH-1GkHO4', // Configured API key
    baseEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    currentModel: 'gemini-2.0-flash-exp', // Default model

    // Available models with their capabilities
    models: [
        {
            id: 'gemini-2.0-flash-exp',
            name: 'Gemini 2.0 Flash (Experimental)',
            description: 'Latest and fastest model with improved reasoning',
            speed: 'fastest',
            quality: 'excellent',
            recommended: true
        },
        {
            id: 'gemini-1.5-flash',
            name: 'Gemini 1.5 Flash',
            description: 'Fast and efficient for most problems',
            speed: 'fast',
            quality: 'good'
        },
        {
            id: 'gemini-1.5-pro',
            name: 'Gemini 1.5 Pro',
            description: 'Most capable for complex problems',
            speed: 'moderate',
            quality: 'best'
        }
    ],

    // Get the API endpoint for the current model
    get apiEndpoint() {
        return `${this.baseEndpoint}/${this.currentModel}:generateContent`;
    }
};

// ===================================
// AI Problem Solver
// ===================================

async function solveWithAI(problemText) {
    if (!AI_CONFIG.apiKey) {
        return await showAPIKeyPrompt();
    }

    try {
        // Show loading state
        showAILoadingState();

        // Prepare the prompt
        const prompt = createSolverPrompt(problemText, AppState.learningLevel);

        // Call Gemini API
        const response = await callGeminiAPI(prompt);

        // Parse the response
        const solution = parseAISolution(response);

        // Hide loading state
        hideAILoadingState();

        return solution;

    } catch (error) {
        console.error('AI solving failed:', error);
        hideAILoadingState();

        // Fallback to original solver
        alert('AI solving failed. Using built-in solver instead.');
        return null;
    }
}

// ===================================
// Prompt Engineering
// ===================================

function createSolverPrompt(problem, level) {
    const levelDescriptions = {
        kid: 'Explain using simple language, analogies, and encouragement. Suitable for ages 10-14.',
        school: 'Use proper mathematical terminology. Suitable for high school students preparing for exams.',
        engineering: 'Use formal mathematical notation and rigorous explanations. Suitable for university students.'
    };

    return `You are an expert math tutor. Solve this problem step-by-step and provide explanations at the ${level} level.

Problem: ${problem}

Please provide your response in the following JSON format:

{
    "problem": "${problem}",
    "topic": "Category → Subcategory (e.g., Algebra → Linear Equations)",
    "answer": "Final answer",
    "steps": [
        {
            "number": 1,
            "math": "Mathematical expression at this step",
            "concepts": ["concept1", "concept2"],
            "kid_explanation": "Simple explanation for kids",
            "school_explanation": "Explanation for high school students",
            "engineering_explanation": "Formal explanation for engineering students"
        }
    ],
    "visualizationType": "number-line | balance-scale | parabola | derivative-graph | integral-area | custom",
    "visualizationData": {
        "type": "Specific visualization type",
        "parameters": {
            "key": "value"
        }
    },
    "concepts": [
        {
            "name": "Concept name",
            "description": "Detailed explanation",
            "level": "kid | school | engineering"
        }
    ]
}

Guidelines:
1. ${levelDescriptions[level]}
2. Break down the solution into clear, logical steps
3. For each step, provide all three explanation levels
4. Identify the best visualization type for this problem
5. Provide specific parameters for the visualization
6. List key mathematical concepts involved
7. Ensure the math notation uses standard symbols (use ^ for exponents, * for multiplication)

Return ONLY the JSON, no additional text.`;
}

// ===================================
// Gemini API Integration
// ===================================

async function callGeminiAPI(prompt) {
    const url = `${AI_CONFIG.apiEndpoint}?key=${AI_CONFIG.apiKey}`;

    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        generationConfig: {
            temperature: 0.2, // Lower temperature for more consistent math solutions
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    // Extract the text from the response
    const text = data.candidates[0]?.content?.parts[0]?.text;

    if (!text) {
        throw new Error('No response from Gemini API');
    }

    return text;
}

// ===================================
// Response Parsing
// ===================================

function parseAISolution(responseText) {
    try {
        // Remove markdown code blocks if present
        let jsonText = responseText.trim();

        // Remove ```json and ``` if present
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        // Parse JSON
        const solution = JSON.parse(jsonText);

        // Validate required fields
        if (!solution.problem || !solution.steps || !solution.answer) {
            throw new Error('Invalid solution format');
        }

        // Process visualization data
        if (solution.visualizationType && solution.visualizationData) {
            solution.visualizations = [{
                type: solution.visualizationType,
                data: solution.visualizationData.parameters || solution.visualizationData
            }];
        } else {
            solution.visualizations = [];
        }

        return solution;

    } catch (error) {
        console.error('Failed to parse AI response:', error);
        console.log('Raw response:', responseText);
        throw new Error('Failed to parse AI solution');
    }
}

// ===================================
// AI Visualization Generator
// ===================================

async function generateVisualizationWithAI(problem, solution) {
    if (!AI_CONFIG.apiKey) {
        return null;
    }

    const prompt = `You are a math visualization expert. Based on this problem and solution, suggest the best visualization.

Problem: ${problem}
Solution: ${solution.answer}
Topic: ${solution.topic}

Provide a JSON response with visualization parameters:

{
    "type": "number-line | balance-scale | parabola | derivative-graph | integral-area | 3d-graph | vector-field | custom",
    "title": "Visualization title",
    "parameters": {
        "range": [min, max],
        "points": [[x1, y1], [x2, y2]],
        "labels": ["label1", "label2"],
        "colors": ["#color1", "#color2"],
        "equation": "mathematical equation",
        "special_points": {
            "roots": [values],
            "vertex": [x, y],
            "intercepts": [values]
        }
    },
    "description": "What this visualization shows"
}

Return ONLY the JSON.`;

    try {
        const response = await callGeminiAPI(prompt);
        const vizData = JSON.parse(response.replace(/```json\n?/g, '').replace(/```\n?/g, ''));
        return vizData;
    } catch (error) {
        console.error('Failed to generate visualization:', error);
        return null;
    }
}

// ===================================
// API Key Management
// ===================================

async function showAPIKeyPrompt() {
    const modal = document.createElement('div');
    modal.className = 'api-key-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <h2>🤖 AI Integration Setup</h2>
            <p>To use AI-powered problem solving, you need a Google Gemini API key.</p>
            
            <div class="setup-steps">
                <h3>How to get your API key:</h3>
                <ol>
                    <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a></li>
                    <li>Sign in with your Google account</li>
                    <li>Click "Create API Key"</li>
                    <li>Copy the key and paste it below</li>
                </ol>
            </div>
            
            <div class="input-group">
                <label for="api-key-input">API Key:</label>
                <input type="password" id="api-key-input" placeholder="Enter your Gemini API key" />
                <button class="btn btn-sm" onclick="toggleAPIKeyVisibility()">👁️ Show</button>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeAPIKeyModal()">Cancel</button>
                <button class="btn btn-primary" onclick="saveAPIKey()">Save & Continue</button>
            </div>
            
            <p class="note">💡 Your API key is stored locally and never shared.</p>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .api-key-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            position: relative;
            background: var(--bg-primary);
            border-radius: var(--radius-xl);
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            box-shadow: var(--shadow-xl);
            animation: slideInUp 0.3s ease;
        }
        
        .modal-content h2 {
            margin-bottom: 1rem;
            color: var(--text-primary);
        }
        
        .modal-content p {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
        }
        
        .setup-steps {
            background: var(--bg-secondary);
            padding: 1rem;
            border-radius: var(--radius-lg);
            margin-bottom: 1.5rem;
        }
        
        .setup-steps h3 {
            font-size: 1rem;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }
        
        .setup-steps ol {
            margin-left: 1.5rem;
            color: var(--text-secondary);
        }
        
        .setup-steps li {
            margin-bottom: 0.5rem;
        }
        
        .setup-steps a {
            color: var(--primary-color);
            text-decoration: none;
        }
        
        .setup-steps a:hover {
            text-decoration: underline;
        }
        
        .input-group {
            display: flex;
            gap: 0.5rem;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .input-group label {
            font-weight: 600;
            color: var(--text-primary);
            min-width: 80px;
        }
        
        .input-group input {
            flex: 1;
            padding: 0.75rem;
            border: 2px solid var(--border-color);
            border-radius: var(--radius-md);
            font-size: 1rem;
            background: var(--bg-secondary);
            color: var(--text-primary);
        }
        
        .input-group input:focus {
            outline: none;
            border-color: var(--primary-color);
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        
        .note {
            margin-top: 1rem;
            font-size: 0.875rem;
            color: var(--text-tertiary);
            text-align: center;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    return new Promise((resolve) => {
        window.apiKeyModalResolve = resolve;
    });
}

function toggleAPIKeyVisibility() {
    const input = document.getElementById('api-key-input');
    const btn = event.target;

    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈 Hide';
    } else {
        input.type = 'password';
        btn.textContent = '👁️ Show';
    }
}

function saveAPIKey() {
    const input = document.getElementById('api-key-input');
    const apiKey = input.value.trim();

    if (!apiKey) {
        alert('Please enter an API key');
        return;
    }

    // Validate API key format (basic check)
    if (!apiKey.startsWith('AIza')) {
        const confirm = window.confirm('This doesn\'t look like a valid Google API key. Continue anyway?');
        if (!confirm) return;
    }

    // Save to config and localStorage
    AI_CONFIG.apiKey = apiKey;
    localStorage.setItem('geminiAPIKey', apiKey);

    // Close modal
    closeAPIKeyModal();

    // Resolve promise
    if (window.apiKeyModalResolve) {
        window.apiKeyModalResolve(true);
    }
}

function closeAPIKeyModal() {
    const modal = document.querySelector('.api-key-modal');
    if (modal) {
        modal.remove();
    }

    if (window.apiKeyModalResolve) {
        window.apiKeyModalResolve(false);
    }
}

// Load API key from localStorage on init
function loadAPIKey() {
    const savedKey = localStorage.getItem('geminiAPIKey');
    if (savedKey) {
        AI_CONFIG.apiKey = savedKey;
    }

    // Load saved model preference
    const savedModel = localStorage.getItem('geminiModel');
    if (savedModel && AI_CONFIG.models.find(m => m.id === savedModel)) {
        AI_CONFIG.currentModel = savedModel;
    }
}

// ===================================
// Model Management
// ===================================

function switchModel(modelId) {
    const model = AI_CONFIG.models.find(m => m.id === modelId);
    if (!model) {
        console.error('Model not found:', modelId);
        return false;
    }

    AI_CONFIG.currentModel = modelId;
    localStorage.setItem('geminiModel', modelId);

    console.log(`Switched to model: ${model.name}`);
    return true;
}

function getCurrentModel() {
    return AI_CONFIG.models.find(m => m.id === AI_CONFIG.currentModel);
}

function showModelSelector() {
    const modal = document.createElement('div');
    modal.className = 'model-selector-modal';

    const currentModel = getCurrentModel();

    const modelCards = AI_CONFIG.models.map(model => {
        const isActive = model.id === AI_CONFIG.currentModel;
        const recommendedBadge = model.recommended ? '<span class="badge badge-recommended">Recommended</span>' : '';

        return `
            <div class="model-card ${isActive ? 'active' : ''}" onclick="selectModel('${model.id}')">
                <div class="model-header">
                    <h3>${model.name}</h3>
                    ${recommendedBadge}
                    ${isActive ? '<span class="badge badge-active">Active</span>' : ''}
                </div>
                <p class="model-description">${model.description}</p>
                <div class="model-specs">
                    <div class="spec">
                        <span class="spec-label">Speed:</span>
                        <span class="spec-value">${model.speed}</span>
                    </div>
                    <div class="spec">
                        <span class="spec-label">Quality:</span>
                        <span class="spec-value">${model.quality}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModelSelector()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>🤖 Select AI Model</h2>
                <button class="btn-close" onclick="closeModelSelector()">✕</button>
            </div>
            
            <div class="current-model-info">
                <p>Current Model: <strong>${currentModel.name}</strong></p>
            </div>
            
            <div class="model-grid">
                ${modelCards}
            </div>
            
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModelSelector()">Close</button>
            </div>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .model-selector-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .model-selector-modal .modal-content {
            position: relative;
            background: var(--bg-primary);
            border-radius: var(--radius-xl);
            padding: 2rem;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: var(--shadow-xl);
            animation: slideInUp 0.3s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .modal-header h2 {
            margin: 0;
            color: var(--text-primary);
        }
        
        .btn-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0.5rem;
            line-height: 1;
        }
        
        .btn-close:hover {
            color: var(--text-primary);
        }
        
        .current-model-info {
            background: var(--bg-secondary);
            padding: 1rem;
            border-radius: var(--radius-md);
            margin-bottom: 1.5rem;
            text-align: center;
        }
        
        .current-model-info p {
            margin: 0;
            color: var(--text-secondary);
        }
        
        .current-model-info strong {
            color: var(--primary-color);
        }
        
        .model-grid {
            display: grid;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .model-card {
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            border-radius: var(--radius-lg);
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .model-card:hover {
            border-color: var(--primary-color);
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }
        
        .model-card.active {
            border-color: var(--primary-color);
            background: linear-gradient(135deg, var(--bg-secondary) 0%, rgba(99, 102, 241, 0.1) 100%);
        }
        
        .model-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
            flex-wrap: wrap;
        }
        
        .model-header h3 {
            margin: 0;
            font-size: 1.125rem;
            color: var(--text-primary);
        }
        
        .badge {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
            border-radius: var(--radius-sm);
            font-weight: 600;
        }
        
        .badge-recommended {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }
        
        .badge-active {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
            color: white;
        }
        
        .model-description {
            color: var(--text-secondary);
            margin-bottom: 1rem;
            font-size: 0.875rem;
        }
        
        .model-specs {
            display: flex;
            gap: 1.5rem;
        }
        
        .spec {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }
        
        .spec-label {
            font-size: 0.75rem;
            color: var(--text-tertiary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .spec-value {
            font-size: 0.875rem;
            color: var(--text-primary);
            font-weight: 600;
            text-transform: capitalize;
        }
        
        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);
}

function selectModel(modelId) {
    if (switchModel(modelId)) {
        closeModelSelector();

        // Show confirmation
        const model = getCurrentModel();
        const notification = document.createElement('div');
        notification.className = 'model-switch-notification';
        notification.innerHTML = `
            <div class="notification-content">
                ✅ Switched to ${model.name}
            </div>
        `;

        const notifStyle = document.createElement('style');
        notifStyle.textContent = `
            .model-switch-notification {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                z-index: 10001;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-content {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-lg);
                font-weight: 600;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;

        document.head.appendChild(notifStyle);
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

function closeModelSelector() {
    const modal = document.querySelector('.model-selector-modal');
    if (modal) {
        modal.remove();
    }
}

// ===================================
// UI Helpers
// ===================================

function showAILoadingState() {
    const overlay = document.createElement('div');
    overlay.id = 'ai-loading-overlay';
    overlay.innerHTML = `
        <div class="ai-loading-content">
            <div class="ai-loading-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
            </div>
            <h3>🤖 AI is solving your problem...</h3>
            <p>Analyzing and generating step-by-step solution</p>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        #ai-loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        }
        
        .ai-loading-content {
            text-align: center;
            color: white;
        }
        
        .ai-loading-spinner {
            position: relative;
            width: 100px;
            height: 100px;
            margin: 0 auto 2rem;
        }
        
        .spinner-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 4px solid transparent;
            border-top-color: var(--primary-color);
            border-radius: 50%;
            animation: spin 1.5s linear infinite;
        }
        
        .spinner-ring:nth-child(2) {
            width: 80%;
            height: 80%;
            top: 10%;
            left: 10%;
            border-top-color: var(--accent-color);
            animation-duration: 2s;
        }
        
        .spinner-ring:nth-child(3) {
            width: 60%;
            height: 60%;
            top: 20%;
            left: 20%;
            border-top-color: var(--success-color);
            animation-duration: 2.5s;
        }
        
        .ai-loading-content h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }
        
        .ai-loading-content p {
            font-size: 1rem;
            opacity: 0.8;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(overlay);
}

function hideAILoadingState() {
    const overlay = document.getElementById('ai-loading-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => overlay.remove(), 300);
    }
}

// ===================================
// Integration with Existing Solver
// ===================================

// Override the original solveProblem function
const originalSolveProblem = window.solveProblem;

window.solveProblem = async function (problemText = null, imageData = null) {
    const problem = problemText || document.getElementById('problem-input')?.value;

    if (!problem || problem.trim() === '') {
        alert('Please enter a math problem');
        return;
    }

    try {
        // Try AI solver first
        const aiSolution = await solveWithAI(problem);

        if (aiSolution) {
            // Use AI solution
            AppState.currentProblem = {
                expression: problem,
                type: { category: 'ai-solved', subcategory: 'general' },
                imageData: imageData,
                timestamp: Date.now()
            };

            AppState.currentSolution = aiSolution;

            // Add to recent problems
            addToRecentProblems(problem, { category: 'ai-solved' });

            // Display solution
            displaySolution(aiSolution);

            // Navigate to solution screen
            showScreen('solution');

            // Update stats
            updateState({
                problemsSolved: AppState.problemsSolved + 1
            });

            return;
        }

    } catch (error) {
        console.error('AI solving failed:', error);
    }

    // Fallback to original solver
    return originalSolveProblem(problemText, imageData);
};

// ===================================
// Initialize
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    loadAPIKey();
    const currentModel = getCurrentModel();
    console.log('AI Solver initialized');
    console.log('API Key:', AI_CONFIG.apiKey ? 'Present' : 'Not set');
    console.log('Current Model:', currentModel.name);
    console.log('Available Models:', AI_CONFIG.models.length);
});

// ===================================
// Export
// ===================================

window.solveWithAI = solveWithAI;
window.generateVisualizationWithAI = generateVisualizationWithAI;
window.AI_CONFIG = AI_CONFIG;
window.switchModel = switchModel;
window.getCurrentModel = getCurrentModel;
window.showModelSelector = showModelSelector;
window.selectModel = selectModel;
window.closeModelSelector = closeModelSelector;
