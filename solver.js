/**
 * Math Solver Module
 * Handles problem solving, step generation, and explanation formatting
 */

// ===================================
// Problem Solving
// ===================================

async function solveProblem(problemText = null, imageData = null) {
    // Get problem text
    const problem = problemText || document.getElementById('problem-input')?.value;

    if (!problem || problem.trim() === '') {
        alert('Please enter a math problem');
        return;
    }

    try {
        // Show loading state
        showLoadingState();

        // Classify problem type
        const problemType = classifyProblem(problem);

        // Generate solution
        const solution = await generateSolution(problem, problemType);

        // Store current problem
        AppState.currentProblem = {
            expression: problem,
            type: problemType,
            imageData: imageData,
            timestamp: Date.now()
        };

        AppState.currentSolution = solution;

        // Add to recent problems
        addToRecentProblems(problem, problemType);

        // Display solution
        displaySolution(solution);

        // Navigate to solution screen
        showScreen('solution');

        // Update stats
        updateState({
            problemsSolved: AppState.problemsSolved + 1
        });

    } catch (error) {
        console.error('Solving failed:', error);
        alert('Failed to solve problem. Please try again.');
    } finally {
        hideLoadingState();
    }
}

// ===================================
// Problem Classification
// ===================================

function classifyProblem(problem) {
    const lower = problem.toLowerCase();

    // Check for calculus
    if (lower.includes('d/dx') || lower.includes('derivative') || lower.includes('differentiate')) {
        return { category: 'calculus', subcategory: 'derivative' };
    }
    if (lower.includes('∫') || lower.includes('integral') || lower.includes('integrate')) {
        return { category: 'calculus', subcategory: 'integral' };
    }

    // Check for quadratic
    if (problem.includes('^2') || problem.includes('²')) {
        return { category: 'algebra', subcategory: 'quadratic' };
    }

    // Check for linear equation
    if (problem.includes('=') && (problem.includes('x') || problem.includes('y'))) {
        return { category: 'algebra', subcategory: 'linear' };
    }

    // Check for trigonometry
    if (lower.match(/sin|cos|tan|sec|csc|cot/)) {
        return { category: 'trigonometry', subcategory: 'basic' };
    }

    // Default to algebra
    return { category: 'algebra', subcategory: 'general' };
}

// ===================================
// Solution Generation
// ===================================

async function generateSolution(problem, problemType) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate solution based on problem type
    if (problemType.category === 'algebra') {
        if (problemType.subcategory === 'linear') {
            return solveLinearEquation(problem);
        } else if (problemType.subcategory === 'quadratic') {
            return solveQuadraticEquation(problem);
        }
    } else if (problemType.category === 'calculus') {
        if (problemType.subcategory === 'derivative') {
            return solveDerivative(problem);
        } else if (problemType.subcategory === 'integral') {
            return solveIntegral(problem);
        }
    }

    // Fallback
    return generateGenericSolution(problem);
}

// ===================================
// Specific Solvers
// ===================================

function solveLinearEquation(problem) {
    // Example: 2x + 5 = 13
    return {
        problem: problem,
        topic: 'Algebra → Linear Equations',
        answer: 'x = 4',
        steps: [
            {
                number: 1,
                math: '2x + 5 = 13',
                concepts: ['linear equation', 'equality'],
                kid_explanation: 'We start with the problem. We need to find what number x is.',
                school_explanation: 'Given equation: 2x + 5 = 13. Our goal is to isolate x.',
                engineering_explanation: 'Initial equation in standard form. Objective: solve for x using inverse operations.'
            },
            {
                number: 2,
                math: '2x + 5 - 5 = 13 - 5',
                concepts: ['subtraction property of equality', 'inverse operations'],
                kid_explanation: 'x is stuck with +5. Let\'s remove 5 from both sides to help x get free.',
                school_explanation: 'Subtract 5 from both sides to isolate the term containing x.',
                engineering_explanation: 'Apply the additive inverse of 5 to both sides to maintain equality while isolating the x-term.'
            },
            {
                number: 3,
                math: '2x = 8',
                concepts: ['simplification'],
                kid_explanation: 'After removing 5 from both sides, we get 2x = 8.',
                school_explanation: 'Simplify: 2x = 8',
                engineering_explanation: 'Simplification yields: 2x = 8'
            },
            {
                number: 4,
                math: '2x ÷ 2 = 8 ÷ 2',
                concepts: ['division property of equality'],
                kid_explanation: 'Now x is multiplied by 2. Let\'s divide both sides by 2 to find x alone.',
                school_explanation: 'Divide both sides by 2 to solve for x.',
                engineering_explanation: 'Apply the multiplicative inverse (division by 2) to both sides.'
            },
            {
                number: 5,
                math: 'x = 4',
                concepts: ['solution'],
                kid_explanation: 'We found it! x equals 4. We can check: 2(4) + 5 = 8 + 5 = 13 ✓',
                school_explanation: 'Solution: x = 4. Verification: 2(4) + 5 = 13 ✓',
                engineering_explanation: 'Final solution: x = 4. Verification confirms the solution satisfies the original equation.'
            }
        ],
        visualizations: [
            {
                type: 'number-line',
                data: { solution: 4, range: [-2, 10] }
            },
            {
                type: 'balance-scale',
                data: { steps: ['2x+5', '13', '2x', '8', 'x', '4'] }
            }
        ],
        concepts: [
            {
                name: 'Linear Equations',
                description: 'An equation where the variable has an exponent of 1. The graph is always a straight line.',
                level: 'school'
            },
            {
                name: 'Inverse Operations',
                description: 'Operations that undo each other. Addition and subtraction are inverses, as are multiplication and division.',
                level: 'kid'
            },
            {
                name: 'Equality Property',
                description: 'Whatever you do to one side of an equation, you must do to the other side to keep it balanced.',
                level: 'kid'
            }
        ]
    };
}

function solveQuadraticEquation(problem) {
    // Example: x^2 - 5x + 6 = 0
    return {
        problem: problem,
        topic: 'Algebra → Quadratic Equations',
        answer: 'x = 2 or x = 3',
        steps: [
            {
                number: 1,
                math: 'x² - 5x + 6 = 0',
                concepts: ['quadratic equation', 'standard form'],
                kid_explanation: 'This is a quadratic equation because x is squared (x²). We need to find what values of x make this equal to zero.',
                school_explanation: 'Given quadratic equation in standard form: ax² + bx + c = 0, where a=1, b=-5, c=6.',
                engineering_explanation: 'Standard form quadratic: x² - 5x + 6 = 0. Coefficients: a=1, b=-5, c=6.'
            },
            {
                number: 2,
                math: '(x - 2)(x - 3) = 0',
                concepts: ['factoring', 'zero product property'],
                kid_explanation: 'We can break this into two smaller parts that multiply together. We\'re looking for two numbers that multiply to 6 and add to -5.',
                school_explanation: 'Factor the quadratic expression. Find two numbers that multiply to 6 and add to -5: -2 and -3.',
                engineering_explanation: 'Factor by finding roots of the characteristic polynomial. Factorization: (x - 2)(x - 3) = 0.'
            },
            {
                number: 3,
                math: 'x - 2 = 0  or  x - 3 = 0',
                concepts: ['zero product property'],
                kid_explanation: 'If two things multiply to make zero, at least one of them must be zero. So either (x-2) is zero OR (x-3) is zero.',
                school_explanation: 'Apply the zero product property: if ab = 0, then a = 0 or b = 0.',
                engineering_explanation: 'Zero product property: For the product to equal zero, at least one factor must equal zero.'
            },
            {
                number: 4,
                math: 'x = 2  or  x = 3',
                concepts: ['solutions', 'roots'],
                kid_explanation: 'We found two answers! x can be 2 or x can be 3. Both work!',
                school_explanation: 'Solutions: x = 2 and x = 3. These are the roots of the equation.',
                engineering_explanation: 'Roots of the quadratic: x₁ = 2, x₂ = 3. Both values satisfy the original equation.'
            }
        ],
        visualizations: [
            {
                type: 'parabola',
                data: {
                    equation: 'x^2 - 5x + 6',
                    roots: [2, 3],
                    vertex: [2.5, -0.25]
                }
            }
        ],
        concepts: [
            {
                name: 'Quadratic Equations',
                description: 'An equation where the highest power of the variable is 2. The graph is a parabola (U-shape).',
                level: 'school'
            },
            {
                name: 'Factoring',
                description: 'Breaking down an expression into simpler parts that multiply together.',
                level: 'school'
            },
            {
                name: 'Zero Product Property',
                description: 'If two numbers multiply to give zero, at least one of them must be zero.',
                level: 'kid'
            }
        ]
    };
}

function solveDerivative(problem) {
    // Example: d/dx(x^3 + 2x)
    return {
        problem: problem,
        topic: 'Calculus → Derivatives',
        answer: '3x² + 2',
        steps: [
            {
                number: 1,
                math: 'd/dx(x³ + 2x)',
                concepts: ['derivative', 'differentiation'],
                kid_explanation: 'A derivative tells us how fast something is changing. We\'re finding how fast this function changes.',
                school_explanation: 'Find the derivative of f(x) = x³ + 2x with respect to x.',
                engineering_explanation: 'Compute the first derivative of the polynomial function f(x) = x³ + 2x.'
            },
            {
                number: 2,
                math: 'd/dx(x³) + d/dx(2x)',
                concepts: ['sum rule'],
                kid_explanation: 'We can find the derivative of each part separately and then add them.',
                school_explanation: 'Apply the sum rule: the derivative of a sum is the sum of derivatives.',
                engineering_explanation: 'Linearity of differentiation: d/dx[f(x) + g(x)] = f\'(x) + g\'(x).'
            },
            {
                number: 3,
                math: '3x² + 2',
                concepts: ['power rule', 'constant rule'],
                kid_explanation: 'For x³, we bring down the 3 and reduce the power by 1, giving 3x². For 2x, the derivative is just 2.',
                school_explanation: 'Apply power rule: d/dx(x³) = 3x². The derivative of 2x is 2.',
                engineering_explanation: 'Power rule: d/dx(xⁿ) = nxⁿ⁻¹. Thus d/dx(x³) = 3x² and d/dx(2x) = 2.'
            }
        ],
        visualizations: [
            {
                type: 'derivative-graph',
                data: {
                    original: 'x^3 + 2x',
                    derivative: '3x^2 + 2',
                    point: 1
                }
            }
        ],
        concepts: [
            {
                name: 'Derivative',
                description: 'Measures the rate of change or slope of a function at any point.',
                level: 'school'
            },
            {
                name: 'Power Rule',
                description: 'To find the derivative of xⁿ, multiply by n and reduce the power by 1: nxⁿ⁻¹.',
                level: 'school'
            }
        ]
    };
}

function solveIntegral(problem) {
    // Example: ∫(x^2 + 2x) dx
    return {
        problem: problem,
        topic: 'Calculus → Integration',
        answer: '(x³/3) + x² + C',
        steps: [
            {
                number: 1,
                math: '∫(x² + 2x) dx',
                concepts: ['integral', 'antiderivative'],
                kid_explanation: 'Integration is the opposite of finding a derivative. We\'re finding the original function.',
                school_explanation: 'Find the indefinite integral (antiderivative) of x² + 2x.',
                engineering_explanation: 'Compute the indefinite integral of the polynomial function f(x) = x² + 2x.'
            },
            {
                number: 2,
                math: '∫x² dx + ∫2x dx',
                concepts: ['sum rule'],
                kid_explanation: 'We can integrate each part separately.',
                school_explanation: 'Apply the sum rule for integration.',
                engineering_explanation: 'Linearity of integration: ∫[f(x) + g(x)]dx = ∫f(x)dx + ∫g(x)dx.'
            },
            {
                number: 3,
                math: 'x³/3 + x² + C',
                concepts: ['power rule for integration', 'constant of integration'],
                kid_explanation: 'For x², we increase the power by 1 and divide by the new power. Don\'t forget +C at the end!',
                school_explanation: 'Apply power rule: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. Result: x³/3 + x² + C.',
                engineering_explanation: 'Power rule for integration: ∫xⁿdx = xⁿ⁺¹/(n+1) + C. The constant C represents the family of antiderivatives.'
            }
        ],
        visualizations: [
            {
                type: 'integral-area',
                data: {
                    function: 'x^2 + 2x',
                    limits: [0, 2]
                }
            }
        ],
        concepts: [
            {
                name: 'Integration',
                description: 'The reverse process of differentiation. Finds the area under a curve.',
                level: 'school'
            },
            {
                name: 'Constant of Integration',
                description: 'The +C added to indefinite integrals because many functions have the same derivative.',
                level: 'school'
            }
        ]
    };
}

function generateGenericSolution(problem) {
    return {
        problem: problem,
        topic: 'Mathematics',
        answer: 'Solution pending',
        steps: [
            {
                number: 1,
                math: problem,
                concepts: ['problem analysis'],
                kid_explanation: 'Let\'s look at this problem carefully.',
                school_explanation: 'Analyze the given problem.',
                engineering_explanation: 'Problem statement analysis required.'
            }
        ],
        visualizations: [],
        concepts: []
    };
}

// ===================================
// Solution Display
// ===================================

function displaySolution(solution) {
    // Update problem header
    const problemExpression = document.getElementById('problem-expression');
    const topicTag = document.getElementById('topic-tag');
    const problemPreview = document.getElementById('problem-preview');

    if (problemExpression) {
        problemExpression.innerHTML = `\\(${solution.problem}\\)`;
        // Trigger MathJax rendering
        if (window.MathJax) {
            MathJax.typesetPromise([problemExpression]);
        }
    }

    if (topicTag) {
        topicTag.textContent = solution.topic;
    }

    if (problemPreview && AppState.currentProblem?.imageData) {
        problemPreview.innerHTML = `<img src="${AppState.currentProblem.imageData}" alt="Problem" style="max-width: 100%; border-radius: 8px;">`;
    }

    // Display steps
    displaySteps(solution.steps);

    // Display visualizations
    displayVisualizations(solution.visualizations);

    // Display concepts
    displayConcepts(solution.concepts);
}

function displaySteps(steps) {
    const container = document.getElementById('steps-list');
    if (!container) return;

    const level = AppState.learningLevel;
    const explanationKey = `${level}_explanation`;

    container.innerHTML = steps.map(step => `
        <div class="step-item animate-slide-in-up">
            <div class="step-header">
                <span class="step-number">${step.number}</span>
            </div>
            <div class="step-math">\\(${step.math}\\)</div>
            <div class="step-explanation">${step[explanationKey] || step.school_explanation}</div>
            <div class="step-tags">
                ${step.concepts.map(concept => `
                    <span class="concept-tag">${concept}</span>
                `).join('')}
            </div>
        </div>
    `).join('');

    // Trigger MathJax rendering
    if (window.MathJax) {
        MathJax.typesetPromise([container]);
    }
}

// ===================================
// Helper Functions
// ===================================

function addToRecentProblems(problem, problemType) {
    const recent = {
        id: Date.now().toString(),
        expression: problem,
        topic: problemType.category,
        date: 'Today'
    };

    AppState.recentProblems.unshift(recent);
    if (AppState.recentProblems.length > 10) {
        AppState.recentProblems.pop();
    }

    saveState();
}

function showLoadingState() {
    // TODO: Implement loading UI
}

function hideLoadingState() {
    // TODO: Implement loading UI
}

function toggleAllSteps() {
    // TODO: Implement step expansion/collapse
}

function trySimlar() {
    // TODO: Generate similar problems
    alert('Similar problems feature coming soon!');
}
