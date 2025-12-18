/**
 * Navigation Module
 * Handles screen transitions and navigation state
 */

// ===================================
// Navigation State
// ===================================

const NavigationHistory = [];
let currentNavigationIndex = -1;

// ===================================
// Core Navigation
// ===================================

function navigate(screenName, addToHistory = true) {
    const previousScreen = AppState.currentScreen;

    // Add to history
    if (addToHistory) {
        NavigationHistory.push({
            screen: screenName,
            timestamp: Date.now()
        });
        currentNavigationIndex = NavigationHistory.length - 1;
    }

    // Show the screen
    showScreen(screenName);

    // Screen-specific initialization
    initializeScreen(screenName);

    // Track navigation event
    trackNavigation(previousScreen, screenName);
}

function initializeScreen(screenName) {
    switch (screenName) {
        case 'home':
            updateRecentProblems();
            break;
        case 'camera':
            initializeCamera();
            break;
        case 'practice':
            // Practice mode initialization handled in practice.js
            break;
        case 'progress':
            updateProgressStats();
            renderActivityChart();
            break;
        case 'settings':
            syncSettingsUI();
            break;
        case 'solution':
            // Solution display handled in solver.js
            break;
    }
}

// ===================================
// Back Navigation
// ===================================

function goBack() {
    if (currentNavigationIndex > 0) {
        currentNavigationIndex--;
        const previous = NavigationHistory[currentNavigationIndex];
        navigate(previous.screen, false);
    } else {
        // Default back behavior
        navigate('home', false);
    }
}

// Handle browser back button
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.screen) {
        navigate(event.state.screen, false);
    } else {
        goBack();
    }
});

// ===================================
// Deep Linking
// ===================================

function handleDeepLink() {
    const hash = window.location.hash.slice(1);

    if (hash) {
        const [screen, ...params] = hash.split('/');

        switch (screen) {
            case 'problem':
                if (params[0]) {
                    loadProblemById(params[0]);
                }
                break;
            case 'practice':
                if (params[0]) {
                    navigate('practice');
                    startPractice(params[0]);
                }
                break;
            default:
                navigate(screen);
        }
    }
}

// Initialize deep linking
window.addEventListener('hashchange', handleDeepLink);
document.addEventListener('DOMContentLoaded', handleDeepLink);

// ===================================
// Screen Transitions
// ===================================

function setScreenTransition(type = 'slide') {
    // Add transition classes for animations
    const screens = document.querySelectorAll('.screen');

    screens.forEach(screen => {
        screen.classList.remove('transition-slide', 'transition-fade', 'transition-scale');
        screen.classList.add(`transition-${type}`);
    });
}

// ===================================
// Navigation Analytics
// ===================================

function trackNavigation(from, to) {
    // Track navigation for analytics
    const navigationEvent = {
        from: from,
        to: to,
        timestamp: Date.now(),
        userLevel: AppState.learningLevel
    };

    // In a real app, this would send to analytics service
    console.log('Navigation:', navigationEvent);

    // Store in local analytics
    const analytics = JSON.parse(localStorage.getItem('navigationAnalytics') || '[]');
    analytics.push(navigationEvent);

    // Keep only last 100 events
    if (analytics.length > 100) {
        analytics.shift();
    }

    localStorage.setItem('navigationAnalytics', JSON.stringify(analytics));
}

// ===================================
// Keyboard Shortcuts
// ===================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K: Focus search/input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('problem-input');
        if (input) {
            navigate('type');
            setTimeout(() => input.focus(), 100);
        }
    }

    // Escape: Go back or close modals
    if (e.key === 'Escape') {
        const currentScreen = AppState.currentScreen;
        if (currentScreen !== 'home' && currentScreen !== 'onboarding') {
            goBack();
        }
    }

    // Ctrl/Cmd + H: Go home
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        navigate('home');
    }

    // Ctrl/Cmd + P: Practice mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        navigate('practice');
    }
});

// ===================================
// Mobile Navigation Gestures
// ===================================

let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe right - go back
            goBack();
        }
    }
}

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
}, { passive: true });

// ===================================
// Navigation Guards
// ===================================

function canNavigateAway(fromScreen) {
    // Check if there's unsaved work or active processes

    if (fromScreen === 'camera' && cameraStream) {
        // Stop camera before leaving
        stopCamera();
    }

    if (fromScreen === 'practice') {
        // Check if practice is in progress
        if (currentPracticeSet.length > 0 && currentQuestionIndex < currentPracticeSet.length) {
            const confirmed = confirm('You have an active practice session. Are you sure you want to leave?');
            return confirmed;
        }
    }

    return true;
}

// ===================================
// Breadcrumb Navigation
// ===================================

function updateBreadcrumbs() {
    const breadcrumbContainer = document.getElementById('breadcrumbs');
    if (!breadcrumbContainer) return;

    const screenNames = {
        home: 'Home',
        camera: 'Scan Problem',
        type: 'Type Problem',
        solution: 'Solution',
        practice: 'Practice',
        progress: 'Progress',
        settings: 'Settings'
    };

    const currentScreen = AppState.currentScreen;
    const breadcrumbs = [];

    // Always start with home
    if (currentScreen !== 'home') {
        breadcrumbs.push({ name: 'Home', screen: 'home' });
    }

    // Add current screen
    breadcrumbs.push({ name: screenNames[currentScreen] || currentScreen, screen: currentScreen });

    breadcrumbContainer.innerHTML = breadcrumbs.map((crumb, index) => `
        ${index > 0 ? '<span class="breadcrumb-separator">›</span>' : ''}
        <span class="breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}" 
              onclick="${index < breadcrumbs.length - 1 ? `navigate('${crumb.screen}')` : ''}">
            ${crumb.name}
        </span>
    `).join('');
}

// ===================================
// Tab Navigation (within screens)
// ===================================

function initializeTabNavigation() {
    const tabButtons = document.querySelectorAll('[data-tab]');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            switchTab(tabName);
        });
    });
}

// ===================================
// Navigation Helpers
// ===================================

function loadProblemById(problemId) {
    // Find problem in recent problems
    const problem = AppState.recentProblems.find(p => p.id === problemId);

    if (problem) {
        // Load and display the problem
        document.getElementById('problem-input').value = problem.expression;
        navigate('solution');
        solveProblem(problem.expression);
    } else {
        console.warn('Problem not found:', problemId);
        navigate('home');
    }
}

// ===================================
// Screen State Persistence
// ===================================

function saveScreenState(screenName, state) {
    const screenStates = JSON.parse(localStorage.getItem('screenStates') || '{}');
    screenStates[screenName] = state;
    localStorage.setItem('screenStates', JSON.stringify(screenStates));
}

function loadScreenState(screenName) {
    const screenStates = JSON.parse(localStorage.getItem('screenStates') || '{}');
    return screenStates[screenName] || null;
}

// ===================================
// Initialize Navigation
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize tab navigation
    initializeTabNavigation();

    // Set initial navigation state
    if (AppState.currentScreen) {
        navigate(AppState.currentScreen, false);
    }

    // Update breadcrumbs
    updateBreadcrumbs();
});

// Update breadcrumbs on navigation
const originalShowScreen = showScreen;
showScreen = function (screenName) {
    originalShowScreen(screenName);
    updateBreadcrumbs();
};

// ===================================
// Export Navigation Functions
// ===================================

window.navigate = navigate;
window.goBack = goBack;
window.navigateTo = navigate; // Alias for consistency with HTML onclick handlers
