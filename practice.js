/**
 * Practice Mode Module
 * Handles practice questions, hints, and answer checking
 */

// ===================================
// Practice Question Bank
// ===================================

const PracticeQuestions = {
    linear: [
        {
            id: 'lin-1',
            question: '3x + 7 = 19',
            answer: '4',
            hint: 'First, subtract 7 from both sides to isolate the term with x.',
            topic: 'Linear Equations',
            difficulty: 'easy'
        },
        {
            id: 'lin-2',
            question: '5x - 12 = 23',
            answer: '7',
            hint: 'Add 12 to both sides, then divide by 5.',
            topic: 'Linear Equations',
            difficulty: 'easy'
        },
        {
            id: 'lin-3',
            question: '2(x + 3) = 14',
            answer: '4',
            hint: 'First, divide both sides by 2, or expand the left side.',
            topic: 'Linear Equations',
            difficulty: 'medium'
        },
        {
            id: 'lin-4',
            question: '4x + 5 = 2x + 17',
            answer: '6',
            hint: 'Get all x terms on one side and constants on the other.',
            topic: 'Linear Equations',
            difficulty: 'medium'
        },
        {
            id: 'lin-5',
            question: '(x/2) + 3 = 8',
            answer: '10',
            hint: 'Subtract 3 from both sides, then multiply by 2.',
            topic: 'Linear Equations',
            difficulty: 'medium'
        }
    ],
    quadratic: [
        {
            id: 'quad-1',
            question: 'x² - 9 = 0',
            answer: '3,-3',
            hint: 'This is a difference of squares. Factor as (x+3)(x-3).',
            topic: 'Quadratic Equations',
            difficulty: 'easy'
        },
        {
            id: 'quad-2',
            question: 'x² - 7x + 12 = 0',
            answer: '3,4',
            hint: 'Find two numbers that multiply to 12 and add to -7.',
            topic: 'Quadratic Equations',
            difficulty: 'medium'
        },
        {
            id: 'quad-3',
            question: 'x² + 6x + 9 = 0',
            answer: '-3',
            hint: 'This is a perfect square trinomial: (x+3)².',
            topic: 'Quadratic Equations',
            difficulty: 'medium'
        },
        {
            id: 'quad-4',
            question: '2x² - 8 = 0',
            answer: '2,-2',
            hint: 'First divide by 2, then solve x² = 4.',
            topic: 'Quadratic Equations',
            difficulty: 'easy'
        },
        {
            id: 'quad-5',
            question: 'x² - 4x - 5 = 0',
            answer: '5,-1',
            hint: 'Factor: find two numbers that multiply to -5 and add to -4.',
            topic: 'Quadratic Equations',
            difficulty: 'medium'
        }
    ],
    derivatives: [
        {
            id: 'der-1',
            question: 'd/dx(x⁴)',
            answer: '4x³',
            hint: 'Use the power rule: bring down the exponent and reduce it by 1.',
            topic: 'Derivatives',
            difficulty: 'easy'
        },
        {
            id: 'der-2',
            question: 'd/dx(5x²)',
            answer: '10x',
            hint: 'Constants multiply through: d/dx(cf) = c·f\'.',
            topic: 'Derivatives',
            difficulty: 'easy'
        },
        {
            id: 'der-3',
            question: 'd/dx(x³ + 3x)',
            answer: '3x²+3',
            hint: 'Differentiate each term separately.',
            topic: 'Derivatives',
            difficulty: 'medium'
        },
        {
            id: 'der-4',
            question: 'd/dx(2x⁴ - 5x²)',
            answer: '8x³-10x',
            hint: 'Apply power rule to each term.',
            topic: 'Derivatives',
            difficulty: 'medium'
        },
        {
            id: 'der-5',
            question: 'd/dx(x⁵ + 2x³ - x)',
            answer: '5x⁴+6x²-1',
            hint: 'Use power rule on each term. Remember d/dx(x) = 1.',
            topic: 'Derivatives',
            difficulty: 'medium'
        }
    ],
    integration: [
        {
            id: 'int-1',
            question: '∫x³ dx',
            answer: 'x⁴/4+C',
            hint: 'Increase the power by 1 and divide by the new power.',
            topic: 'Integration',
            difficulty: 'easy'
        },
        {
            id: 'int-2',
            question: '∫4x dx',
            answer: '2x²+C',
            hint: 'Constants multiply through. Don\'t forget +C!',
            topic: 'Integration',
            difficulty: 'easy'
        },
        {
            id: 'int-3',
            question: '∫(x² + 2) dx',
            answer: 'x³/3+2x+C',
            hint: 'Integrate each term separately.',
            topic: 'Integration',
            difficulty: 'medium'
        },
        {
            id: 'int-4',
            question: '∫(3x² - 4x) dx',
            answer: 'x³-2x²+C',
            hint: 'Apply power rule to each term.',
            topic: 'Integration',
            difficulty: 'medium'
        },
        {
            id: 'int-5',
            question: '∫(x⁴ + x²) dx',
            answer: 'x⁵/5+x³/3+C',
            hint: 'Integrate term by term using power rule.',
            topic: 'Integration',
            difficulty: 'medium'
        }
    ]
};

// ===================================
// Practice Mode State
// ===================================

let currentPracticeSet = [];
let currentQuestionIndex = 0;
let practiceScore = { correct: 0, total: 0 };

// ===================================
// Start Practice
// ===================================

function startPractice(topic) {
    // Get questions for topic
    currentPracticeSet = shuffleArray([...PracticeQuestions[topic]]).slice(0, 5);
    currentQuestionIndex = 0;
    practiceScore = { correct: 0, total: 0 };

    // Hide topic selection, show question
    document.getElementById('topic-selection').style.display = 'none';
    document.getElementById('practice-question').style.display = 'block';

    // Update score display
    updatePracticeScore();

    // Load first question
    loadPracticeQuestion();
}

function loadPracticeQuestion() {
    if (currentQuestionIndex >= currentPracticeSet.length) {
        showPracticeResults();
        return;
    }

    const question = currentPracticeSet[currentQuestionIndex];

    // Update question header
    document.querySelector('.question-number').textContent =
        `Question ${currentQuestionIndex + 1} of ${currentPracticeSet.length}`;
    document.querySelector('.question-topic').textContent = question.topic;

    // Update question text
    const questionText = document.getElementById('question-text');
    questionText.innerHTML = `\\(${question.question}\\)`;

    // Trigger MathJax rendering
    if (window.MathJax) {
        MathJax.typesetPromise([questionText]);
    }

    // Clear answer input
    document.getElementById('user-answer').value = '';

    // Hide hint and feedback
    document.getElementById('hint-box').style.display = 'none';
    document.getElementById('feedback-box').style.display = 'none';
}

// ===================================
// Answer Checking
// ===================================

function checkAnswer() {
    const question = currentPracticeSet[currentQuestionIndex];
    const userAnswer = document.getElementById('user-answer').value.trim();

    if (!userAnswer) {
        alert('Please enter an answer');
        return;
    }

    // Normalize answers for comparison
    const correctAnswers = question.answer.split(',').map(a => a.trim().toLowerCase());
    const userAnswers = userAnswer.split(',').map(a => a.trim().toLowerCase());

    // Check if answers match (order doesn't matter for multiple answers)
    const isCorrect = arraysEqual(correctAnswers.sort(), userAnswers.sort());

    // Update score
    practiceScore.total++;
    if (isCorrect) {
        practiceScore.correct++;
    }

    // Show feedback
    showFeedback(isCorrect, question);

    // Update score display
    updatePracticeScore();

    // Update concept mastery
    updateConceptMastery(question.topic, isCorrect);
}

function showFeedback(isCorrect, question) {
    const feedbackBox = document.getElementById('feedback-box');
    feedbackBox.style.display = 'block';
    feedbackBox.className = 'feedback-box ' + (isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
        feedbackBox.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div class="success-checkmark"></div>
                <div>
                    <h4 style="color: var(--success-color); margin-bottom: 0.5rem;">Correct! 🎉</h4>
                    <p>Great job! You got it right.</p>
                </div>
            </div>
            <button class="btn btn-primary" onclick="nextPracticeQuestion()" style="margin-top: 1rem;">Next Question</button>
        `;
    } else {
        feedbackBox.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div class="error-cross"></div>
                <div>
                    <h4 style="color: var(--error-color); margin-bottom: 0.5rem;">Not quite right</h4>
                    <p>The correct answer is: <strong>${question.answer}</strong></p>
                    <button class="btn btn-secondary" onclick="showFullSolution()" style="margin-top: 0.5rem;">View Solution</button>
                </div>
            </div>
            <button class="btn btn-primary" onclick="nextPracticeQuestion()" style="margin-top: 1rem;">Next Question</button>
        `;
    }
}

function nextPracticeQuestion() {
    currentQuestionIndex++;
    loadPracticeQuestion();
}

// ===================================
// Hints & Solutions
// ===================================

function showHint() {
    const question = currentPracticeSet[currentQuestionIndex];
    const hintBox = document.getElementById('hint-box');

    hintBox.style.display = 'block';
    hintBox.innerHTML = `
        <h4 style="color: var(--warning-color); margin-bottom: 0.5rem;">💡 Hint</h4>
        <p>${question.hint}</p>
    `;
}

function showFullSolution() {
    // In a full implementation, this would show step-by-step solution
    // For now, just show the answer
    const question = currentPracticeSet[currentQuestionIndex];
    alert(`Solution: ${question.answer}\n\nFor detailed steps, solve this problem in the main app.`);
}

// ===================================
// Practice Results
// ===================================

function showPracticeResults() {
    const percentage = Math.round((practiceScore.correct / practiceScore.total) * 100);

    const questionContainer = document.getElementById('practice-question');
    questionContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">
                ${percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
            </div>
            <h2 style="margin-bottom: 1rem;">Practice Complete!</h2>
            <div style="font-size: 3rem; font-weight: bold; color: var(--primary-color); margin-bottom: 1rem;">
                ${practiceScore.correct} / ${practiceScore.total}
            </div>
            <p style="font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 2rem;">
                ${percentage}% Correct
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="restartPractice()">Practice Again</button>
                <button class="btn btn-secondary" onclick="closePractice()">Back to Home</button>
            </div>
        </div>
    `;
}

function restartPractice() {
    // Reset and show topic selection
    document.getElementById('practice-question').style.display = 'none';
    document.getElementById('topic-selection').style.display = 'block';
    document.getElementById('practice-question').innerHTML = `
        <div class="question-header">
            <span class="question-number">Question 1 of 5</span>
            <span class="question-topic">Linear Equations</span>
        </div>
        
        <div class="question-content">
            <div class="question-text" id="question-text">
                <!-- LaTeX rendered question -->
            </div>
            
            <div class="answer-input">
                <label for="user-answer">Your Answer:</label>
                <input type="text" id="user-answer" class="answer-field" placeholder="Enter your answer">
            </div>
            
            <div class="question-actions">
                <button class="btn btn-secondary" onclick="showHint()">💡 Hint</button>
                <button class="btn btn-secondary" onclick="showFullSolution()">📖 Solution</button>
                <button class="btn btn-primary" onclick="checkAnswer()">Check Answer</button>
            </div>
            
            <div class="hint-box" id="hint-box" style="display: none;">
                <!-- Hint content -->
            </div>
        </div>
        
        <div class="feedback-box" id="feedback-box" style="display: none;">
            <!-- Feedback after answer -->
        </div>
    `;
}

// ===================================
// Score Display
// ===================================

function updatePracticeScore() {
    const scoreDisplay = document.getElementById('practice-score');
    if (scoreDisplay) {
        scoreDisplay.textContent = `${practiceScore.correct}/${practiceScore.total}`;
    }
}

// ===================================
// Concept Mastery Tracking
// ===================================

function updateConceptMastery(topic, isCorrect) {
    // Map topic names to concept keys
    const topicMap = {
        'Linear Equations': 'linear-equations',
        'Quadratic Equations': 'quadratic-equations',
        'Derivatives': 'derivatives',
        'Integration': 'integration'
    };

    const conceptKey = topicMap[topic];
    if (!conceptKey) return;

    // Update mastery (simple algorithm: +5 for correct, -2 for incorrect)
    const currentMastery = AppState.conceptMastery[conceptKey] || 0;
    const delta = isCorrect ? 5 : -2;
    const newMastery = Math.max(0, Math.min(100, currentMastery + delta));

    AppState.conceptMastery[conceptKey] = newMastery;
    saveState();
}

// ===================================
// Utility Functions
// ===================================

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
