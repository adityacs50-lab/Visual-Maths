/**
 * Progress Tracking Module
 * Handles analytics, charts, and progress visualization
 */

// ===================================
// Activity Chart
// ===================================

function renderActivityChart() {
    const canvas = document.getElementById('activity-chart');
    if (!canvas) return;

    // Destroy existing chart if any
    if (window.activityChartInstance) {
        window.activityChartInstance.destroy();
    }

    // Generate sample data (in real app, this would come from user activity)
    const labels = getLast7Days();
    const data = generateActivityData();

    const ctx = canvas.getContext('2d');
    window.activityChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Problems Solved',
                data: data,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 12
                        },
                        color: '#6b7280'
                    },
                    grid: {
                        color: '#e5e7eb',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12
                        },
                        color: '#6b7280'
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            }
        }
    });
}

function getLast7Days() {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        days.push(dayName);
    }

    return days;
}

function generateActivityData() {
    // Generate sample data based on current stats
    // In real app, this would be actual user activity
    const baseActivity = Math.max(1, Math.floor(AppState.problemsSolved / 7));
    const data = [];

    for (let i = 0; i < 7; i++) {
        // Add some randomness to make it look realistic
        const variance = Math.floor(Math.random() * 3) - 1;
        data.push(Math.max(0, baseActivity + variance));
    }

    return data;
}

// ===================================
// Progress Statistics
// ===================================

function calculateProgressStats() {
    const stats = {
        totalProblems: AppState.problemsSolved,
        totalTime: AppState.timeSpent,
        streak: AppState.streakDays,
        averageMastery: calculateAverageMastery(),
        strongestConcept: getStrongestConcept(),
        weakestConcept: getWeakestConcept(),
        recentActivity: getRecentActivity()
    };

    return stats;
}

function calculateAverageMastery() {
    const masteryValues = Object.values(AppState.conceptMastery);
    if (masteryValues.length === 0) return 0;

    const sum = masteryValues.reduce((a, b) => a + b, 0);
    return Math.round(sum / masteryValues.length);
}

function getStrongestConcept() {
    const concepts = AppState.conceptMastery;
    let strongest = { name: 'None', value: 0 };

    for (const [key, value] of Object.entries(concepts)) {
        if (value > strongest.value) {
            strongest = { name: formatConceptName(key), value };
        }
    }

    return strongest;
}

function getWeakestConcept() {
    const concepts = AppState.conceptMastery;
    let weakest = { name: 'None', value: 100 };

    for (const [key, value] of Object.entries(concepts)) {
        if (value < weakest.value && value > 0) {
            weakest = { name: formatConceptName(key), value };
        }
    }

    return weakest.value === 100 ? { name: 'None', value: 0 } : weakest;
}

function formatConceptName(key) {
    const names = {
        'linear-equations': 'Linear Equations',
        'quadratic-equations': 'Quadratic Equations',
        'derivatives': 'Derivatives',
        'integration': 'Integration',
        'matrices': 'Matrices',
        'trigonometry': 'Trigonometry'
    };
    return names[key] || key;
}

function getRecentActivity() {
    // Calculate activity for the last 7 days
    // In real app, this would track actual daily activity
    const recentProblems = AppState.recentProblems.filter(p => {
        // Filter problems from last 7 days
        return true; // Simplified for demo
    });

    return recentProblems.length;
}

// ===================================
// Streak Calculation
// ===================================

function updateStreak() {
    // In a real app, this would check if user has been active today
    // and update the streak accordingly

    const lastActive = localStorage.getItem('lastActiveDate');
    const today = new Date().toDateString();

    if (lastActive === today) {
        // Already active today
        return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastActive === yesterdayStr) {
        // Streak continues
        updateState({ streakDays: AppState.streakDays + 1 });
    } else if (!lastActive) {
        // First day
        updateState({ streakDays: 1 });
    } else {
        // Streak broken
        updateState({ streakDays: 1 });
    }

    localStorage.setItem('lastActiveDate', today);
}

// ===================================
// Time Tracking
// ===================================

let sessionStartTime = null;
let sessionTimer = null;

function startTimeTracking() {
    sessionStartTime = Date.now();

    // Update time every minute
    sessionTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 60000); // minutes
        updateState({ timeSpent: AppState.timeSpent + 1 });
    }, 60000);
}

function stopTimeTracking() {
    if (sessionTimer) {
        clearInterval(sessionTimer);
        sessionTimer = null;
    }

    if (sessionStartTime) {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 60000); // minutes
        if (elapsed > 0) {
            updateState({ timeSpent: AppState.timeSpent + elapsed });
        }
        sessionStartTime = null;
    }
}

// Start tracking when app loads
document.addEventListener('DOMContentLoaded', () => {
    startTimeTracking();
    updateStreak();
});

// Stop tracking when page unloads
window.addEventListener('beforeunload', () => {
    stopTimeTracking();
});

// ===================================
// Achievement System
// ===================================

const Achievements = {
    firstProblem: {
        id: 'first-problem',
        name: 'Getting Started',
        description: 'Solve your first problem',
        icon: '🎯',
        condition: () => AppState.problemsSolved >= 1
    },
    tenProblems: {
        id: 'ten-problems',
        name: 'Problem Solver',
        description: 'Solve 10 problems',
        icon: '🏆',
        condition: () => AppState.problemsSolved >= 10
    },
    fiftyProblems: {
        id: 'fifty-problems',
        name: 'Math Enthusiast',
        description: 'Solve 50 problems',
        icon: '⭐',
        condition: () => AppState.problemsSolved >= 50
    },
    weekStreak: {
        id: 'week-streak',
        name: 'Dedicated Learner',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        condition: () => AppState.streakDays >= 7
    },
    masterConcept: {
        id: 'master-concept',
        name: 'Concept Master',
        description: 'Reach 90% mastery in any concept',
        icon: '🎓',
        condition: () => Object.values(AppState.conceptMastery).some(v => v >= 90)
    },
    allRounder: {
        id: 'all-rounder',
        name: 'All-Rounder',
        description: 'Reach 50% mastery in all concepts',
        icon: '🌟',
        condition: () => Object.values(AppState.conceptMastery).every(v => v >= 50)
    }
};

function checkAchievements() {
    const unlockedAchievements = [];
    const previouslyUnlocked = AppState.achievements || [];

    for (const [key, achievement] of Object.entries(Achievements)) {
        if (!previouslyUnlocked.includes(achievement.id) && achievement.condition()) {
            unlockedAchievements.push(achievement);
            previouslyUnlocked.push(achievement.id);
        }
    }

    if (unlockedAchievements.length > 0) {
        updateState({ achievements: previouslyUnlocked });
        showAchievementNotification(unlockedAchievements[0]);
    }
}

function showAchievementNotification(achievement) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-content">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <h4>Achievement Unlocked!</h4>
                <p><strong>${achievement.name}</strong></p>
                <p class="achievement-desc">${achievement.description}</p>
            </div>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 3.5s;
        max-width: 350px;
    `;

    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Check achievements after each problem
function onProblemSolved() {
    checkAchievements();
}

// ===================================
// Progress Export
// ===================================

function exportProgressReport() {
    const stats = calculateProgressStats();

    const report = {
        generatedAt: new Date().toISOString(),
        user: {
            level: AppState.learningLevel,
            problemsSolved: stats.totalProblems,
            timeSpent: `${Math.floor(stats.totalTime / 60)} hours ${stats.totalTime % 60} minutes`,
            streak: stats.streak
        },
        mastery: {
            average: stats.averageMastery,
            strongest: stats.strongestConcept,
            weakest: stats.weakestConcept,
            byTopic: AppState.conceptMastery
        },
        recentActivity: {
            last7Days: stats.recentActivity,
            recentProblems: AppState.recentProblems.slice(0, 10)
        },
        achievements: AppState.achievements || []
    };

    return report;
}

function downloadProgressReport() {
    const report = exportProgressReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `visualmath-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
}

// ===================================
// Progress Insights
// ===================================

function generateInsights() {
    const stats = calculateProgressStats();
    const insights = [];

    // Streak insights
    if (stats.streak >= 7) {
        insights.push({
            type: 'positive',
            icon: '🔥',
            message: `Amazing! You've maintained a ${stats.streak}-day streak. Keep it up!`
        });
    } else if (stats.streak === 0) {
        insights.push({
            type: 'suggestion',
            icon: '💡',
            message: 'Start a learning streak by solving problems daily!'
        });
    }

    // Mastery insights
    if (stats.averageMastery >= 70) {
        insights.push({
            type: 'positive',
            icon: '⭐',
            message: 'Excellent progress! Your average mastery is above 70%.'
        });
    } else if (stats.averageMastery < 30) {
        insights.push({
            type: 'suggestion',
            icon: '📚',
            message: 'Try practice mode to improve your concept mastery.'
        });
    }

    // Weak concept insights
    if (stats.weakestConcept.value < 40 && stats.weakestConcept.value > 0) {
        insights.push({
            type: 'suggestion',
            icon: '🎯',
            message: `Focus on ${stats.weakestConcept.name} to improve your overall mastery.`
        });
    }

    // Activity insights
    if (stats.totalProblems >= 50) {
        insights.push({
            type: 'positive',
            icon: '🏆',
            message: `You've solved ${stats.totalProblems} problems! You're a math champion!`
        });
    } else if (stats.totalProblems < 5) {
        insights.push({
            type: 'suggestion',
            icon: '🚀',
            message: 'Solve more problems to unlock achievements and improve your skills!'
        });
    }

    return insights;
}

function displayInsights() {
    const insights = generateInsights();
    const container = document.getElementById('insights-container');

    if (!container || insights.length === 0) return;

    container.innerHTML = insights.map(insight => `
        <div class="insight-card ${insight.type}">
            <span class="insight-icon">${insight.icon}</span>
            <p class="insight-message">${insight.message}</p>
        </div>
    `).join('');
}

// ===================================
// Navigation Integration
// ===================================

function navigateToProgress() {
    showScreen('progress');
    updateProgressStats();
    renderActivityChart();
    displayInsights();
}
