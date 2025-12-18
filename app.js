/**
 * VisualMath Mentor - Main Application
 * Core app logic and state management
 */

// ===================================
// Application State
// ===================================

const AppState = {
    // User preferences
    learningLevel: 'school', // 'kid' | 'school' | 'engineering'
    simpleLanguage: true,
    darkMode: false,
    animations: true,
    sounds: false,
    
    // Current state
    currentScreen: 'onboarding',
    onboardingStep: 1,
    selectedLevel: null,
    
    // User data
    problemsSolved: 0,
    timeSpent: 0,
    streakDays: 0,
    
    // Current problem
    currentProblem: null,
    currentSolution: null,
    
    // Practice mode
    practiceMode: null,
    practiceQuestions: [],
    currentQuestionIndex: 0,
    practiceScore: { correct: 0, total: 0 },
    
    // Progress tracking
    conceptMastery: {
        'linear-equations': 0,
        'quadratic-equations': 0,
        'derivatives': 0,
        'integration': 0,
        'matrices': 0,
        'trigonometry': 0
    },
    
    // Recent problems
    recentProblems: []
};

// ===================================
// Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('VisualMath Mentor initialized');
    
    // Load saved state from localStorage
    loadState();
    
    // Apply theme
    applyTheme();
    
    // Check if user has completed onboarding
    if (AppState.learningLevel && localStorage.getItem('onboardingComplete')) {
        showScreen('home');
    } else {
        showScreen('onboarding');
    }
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Update UI
    updateUI();
});

// ===================================
// State Management
// ===================================

function loadState() {
    const savedState = localStorage.getItem('visualMathState');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            Object.assign(AppState, parsed);
        } catch (e) {
            console.error('Failed to load state:', e);
        }
    }
}

function saveState() {
    try {
        localStorage.setItem('visualMathState', JSON.stringify(AppState));
    } catch (e) {
        console.error('Failed to save state:', e);
    }
}

function updateState(updates) {
    Object.assign(AppState, updates);
    saveState();
    updateUI();
}

// ===================================
// Screen Management
// ===================================

function showScreen(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        AppState.currentScreen = screenName;
        
        // Update navigation
        updateNavigation(screenName);
    }
}

function updateNavigation(screenName) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.screen === screenName) {
            item.classList.add('active');
        }
    });
}

// ===================================
// Onboarding Flow
// ===================================

function nextOnboardingStep() {
    const currentStep = AppState.onboardingStep;
    const nextStep = currentStep + 1;
    
    if (nextStep <= 3) {
        // Hide current step
        document.querySelector(`.onboarding-step[data-step="${currentStep}"]`)?.classList.remove('active');
        
        // Show next step
        document.querySelector(`.onboarding-step[data-step="${nextStep}"]`)?.classList.add('active');
        
        // Update step indicator
        document.querySelectorAll('.step-indicator .step').forEach((step, index) => {
            if (index < nextStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        AppState.onboardingStep = nextStep;
    }
}

function selectLevel(level) {
    // Remove previous selection
    document.querySelectorAll('.level-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    const selectedCard = document.querySelector(`.level-card[data-level="${level}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    AppState.selectedLevel = level;
    AppState.learningLevel = level;
    
    // Auto-advance after selection
    setTimeout(() => {
        nextOnboardingStep();
    }, 500);
}

function completeOnboarding() {
    // Save preferences
    const simpleLanguage = document.getElementById('simple-language')?.checked ?? true;
    const darkMode = document.getElementById('dark-mode')?.checked ?? false;
    const animations = document.getElementById('animations')?.checked ?? true;
    
    updateState({
        simpleLanguage,
        darkMode,
        animations
    });
    
    localStorage.setItem('onboardingComplete', 'true');
    
    // Apply theme
    applyTheme();
    
    // Navigate to home
    showScreen('home');
    
    // Update level badge
    updateLevelBadge();
}

// ===================================
// Theme Management
// ===================================

function applyTheme() {
    if (AppState.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

function toggleDarkMode(enabled) {
    updateState({ darkMode: enabled });
    applyTheme();
}

// ===================================
// UI Updates
// ===================================

function updateUI() {
    updateLevelBadge();
    updateRecentProblems();
    updateProgressStats();
}

function updateLevelBadge() {
    const badge = document.getElementById('user-level-badge');
    if (badge) {
        const levelNames = {
            kid: 'Kids',
            school: 'School',
            engineering: 'Engineering'
        };
        badge.textContent = levelNames[AppState.learningLevel] || 'School';
    }
}

function updateRecentProblems() {
    const container = document.getElementById('recent-problems');
    if (!container) return;
    
    if (AppState.recentProblems.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No recent problems yet. Start by scanning or typing a problem!</p>';
        return;
    }
    
    container.innerHTML = AppState.recentProblems.map(problem => `
        <div class="recent-item" onclick="viewProblem('${problem.id}')">
            <div class="recent-icon">${problem.topic === 'algebra' ? '📐' : '📊'}</div>
            <div class="recent-info">
                <div class="recent-expression">${problem.expression}</div>
                <div class="recent-meta">${problem.topic} • ${problem.date}</div>
            </div>
        </div>
    `).join('');
}

function updateProgressStats() {
    // Update stats in progress screen
    const problemsSolvedEl = document.getElementById('problems-solved');
    const timeSpentEl = document.getElementById('time-spent');
    const streakDaysEl = document.getElementById('streak-days');
    const masteryScoreEl = document.getElementById('mastery-score');
    
    if (problemsSolvedEl) problemsSolvedEl.textContent = AppState.problemsSolved;
    if (timeSpentEl) timeSpentEl.textContent = `${Math.floor(AppState.timeSpent / 60)}h`;
    if (streakDaysEl) streakDaysEl.textContent = AppState.streakDays;
    
    // Calculate average mastery
    const masteryValues = Object.values(AppState.conceptMastery);
    const avgMastery = masteryValues.length > 0 
        ? Math.round(masteryValues.reduce((a, b) => a + b, 0) / masteryValues.length)
        : 0;
    if (masteryScoreEl) masteryScoreEl.textContent = `${avgMastery}%`;
    
    // Update mastery list
    updateMasteryList();
}

function updateMasteryList() {
    const container = document.getElementById('mastery-list');
    if (!container) return;
    
    const conceptNames = {
        'linear-equations': 'Linear Equations',
        'quadratic-equations': 'Quadratic Equations',
        'derivatives': 'Derivatives',
        'integration': 'Integration',
        'matrices': 'Matrices',
        'trigonometry': 'Trigonometry'
    };
    
    container.innerHTML = Object.entries(AppState.conceptMastery).map(([key, value]) => `
        <div class="mastery-item">
            <div class="mastery-header">
                <span class="mastery-name">${conceptNames[key]}</span>
                <span class="mastery-percentage">${value}%</span>
            </div>
            <div class="mastery-bar">
                <div class="mastery-progress" style="width: ${value}%"></div>
            </div>
        </div>
    `).join('');
}

// ===================================
// Navigation Functions
// ===================================

function navigateTo(screen) {
    showScreen(screen);
}

function showCamera() {
    showScreen('camera');
    initializeCamera();
}

function closeCamera() {
    stopCamera();
    showScreen('home');
}

function showTypeProblem() {
    showScreen('type');
}

function closeTypeProblem() {
    showScreen('home');
}

function showPracticeMode() {
    showScreen('practice');
}

function closePractice() {
    showScreen('home');
}

function showProgress() {
    showScreen('progress');
    updateProgressStats();
    renderActivityChart();
}

function showSettings() {
    showScreen('settings');
    syncSettingsUI();
}

function closeSettings() {
    showScreen('home');
}

function closeSolution() {
    showScreen('home');
}

// ===================================
// Settings Management
// ===================================

function syncSettingsUI() {
    // Sync level buttons
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.level === AppState.learningLevel) {
            btn.classList.add('active');
        }
    });
    
    // Sync toggles
    const simpleLanguageToggle = document.getElementById('setting-simple-language');
    const darkModeToggle = document.getElementById('setting-dark-mode');
    const animationsToggle = document.getElementById('setting-animations');
    const soundsToggle = document.getElementById('setting-sounds');
    
    if (simpleLanguageToggle) simpleLanguageToggle.checked = AppState.simpleLanguage;
    if (darkModeToggle) darkModeToggle.checked = AppState.darkMode;
    if (animationsToggle) animationsToggle.checked = AppState.animations;
    if (soundsToggle) soundsToggle.checked = AppState.sounds;
}

function changeLevel(level) {
    updateState({ learningLevel: level });
    updateLevelBadge();
    syncSettingsUI();
}

// ===================================
// Event Listeners
// ===================================

function initializeEventListeners() {
    // Settings toggles
    const simpleLanguageToggle = document.getElementById('setting-simple-language');
    const darkModeToggle = document.getElementById('setting-dark-mode');
    const animationsToggle = document.getElementById('setting-animations');
    const soundsToggle = document.getElementById('setting-sounds');
    
    if (simpleLanguageToggle) {
        simpleLanguageToggle.addEventListener('change', (e) => {
            updateState({ simpleLanguage: e.target.checked });
        });
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', (e) => {
            toggleDarkMode(e.target.checked);
        });
    }
    
    if (animationsToggle) {
        animationsToggle.addEventListener('change', (e) => {
            updateState({ animations: e.target.checked });
        });
    }
    
    if (soundsToggle) {
        soundsToggle.addEventListener('change', (e) => {
            updateState({ sounds: e.target.checked });
        });
    }
    
    // Problem input
    const problemInput = document.getElementById('problem-input');
    if (problemInput) {
        problemInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                solveProblem();
            }
        });
    }
}

// ===================================
// Utility Functions
// ===================================

function insertSymbol(symbol) {
    const input = document.getElementById('problem-input');
    if (input) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const text = input.value;
        input.value = text.substring(0, start) + symbol + text.substring(end);
        input.selectionStart = input.selectionEnd = start + symbol.length;
        input.focus();
    }
}

function loadExample(example) {
    const input = document.getElementById('problem-input');
    if (input) {
        input.value = example;
        input.focus();
    }
}

function shareSolution() {
    // TODO: Implement sharing functionality
    alert('Share functionality coming soon!');
}

function exportProgress() {
    // TODO: Implement export functionality
    const data = JSON.stringify(AppState, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visualmath-progress.json';
    a.click();
    URL.revokeObjectURL(url);
}

function viewProblem(problemId) {
    // TODO: Load and display specific problem
    console.log('View problem:', problemId);
}

// ===================================
// Demo Data (for testing)
// ===================================

function loadDemoData() {
    updateState({
        problemsSolved: 42,
        timeSpent: 3600, // 60 hours in minutes
        streakDays: 7,
        conceptMastery: {
            'linear-equations': 85,
            'quadratic-equations': 60,
            'derivatives': 45,
            'integration': 30,
            'matrices': 20,
            'trigonometry': 70
        },
        recentProblems: [
            {
                id: '1',
                expression: '2x + 5 = 13',
                topic: 'Linear Equations',
                date: 'Today'
            },
            {
                id: '2',
                expression: 'x² - 5x + 6 = 0',
                topic: 'Quadratic Equations',
                date: 'Yesterday'
            }
        ]
    });
}

// Uncomment to load demo data
// loadDemoData();

// ===================================
// Export for use in other modules
// ===================================

window.AppState = AppState;
window.updateState = updateState;
window.showScreen = showScreen;
