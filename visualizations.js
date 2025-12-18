/**
 * Visualizations Module
 * Interactive math visualizations using Canvas and Chart.js
 */

// ===================================
// Visualization Display
// ===================================

function displayVisualizations(visualizations) {
    const container = document.getElementById('visualization-container');
    if (!container || !visualizations || visualizations.length === 0) {
        if (container) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No visualizations available for this problem type.</p>';
        }
        return;
    }

    // Clear container
    container.innerHTML = '';

    // Create visualization for each type
    visualizations.forEach((viz, index) => {
        const vizWrapper = document.createElement('div');
        vizWrapper.className = 'viz-wrapper';
        vizWrapper.style.marginBottom = '2rem';

        const title = document.createElement('h3');
        title.textContent = getVisualizationTitle(viz.type);
        title.style.marginBottom = '1rem';
        vizWrapper.appendChild(title);

        const canvas = document.createElement('canvas');
        canvas.id = `viz-canvas-${index}`;
        canvas.className = 'viz-canvas';
        vizWrapper.appendChild(canvas);

        container.appendChild(vizWrapper);

        // Render visualization
        setTimeout(() => {
            renderVisualization(viz.type, viz.data, canvas);
        }, 100);
    });
}

function getVisualizationTitle(type) {
    const titles = {
        'number-line': 'Number Line Visualization',
        'balance-scale': 'Balance Scale',
        'parabola': 'Graph of Quadratic Function',
        'derivative-graph': 'Function and Its Derivative',
        'integral-area': 'Area Under the Curve'
    };
    return titles[type] || 'Visualization';
}

// ===================================
// Specific Visualizations
// ===================================

function renderVisualization(type, data, canvas) {
    switch (type) {
        case 'number-line':
            renderNumberLine(data, canvas);
            break;
        case 'balance-scale':
            renderBalanceScale(data, canvas);
            break;
        case 'parabola':
            renderParabola(data, canvas);
            break;
        case 'derivative-graph':
            renderDerivativeGraph(data, canvas);
            break;
        case 'integral-area':
            renderIntegralArea(data, canvas);
            break;
        default:
            console.warn('Unknown visualization type:', type);
    }
}

// ===================================
// Number Line
// ===================================

function renderNumberLine(data, canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 150;

    const { solution, range } = data;
    const [min, max] = range;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate scale
    const padding = 50;
    const lineY = height / 2;
    const scale = (width - 2 * padding) / (max - min);

    // Draw line
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(padding, lineY);
    ctx.lineTo(width - padding, lineY);
    ctx.stroke();

    // Draw tick marks and labels
    ctx.fillStyle = '#374151';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';

    for (let i = min; i <= max; i++) {
        const x = padding + (i - min) * scale;

        // Tick mark
        ctx.beginPath();
        ctx.moveTo(x, lineY - 10);
        ctx.lineTo(x, lineY + 10);
        ctx.stroke();

        // Label
        ctx.fillText(i.toString(), x, lineY + 30);
    }

    // Draw solution point (animated)
    const solutionX = padding + (solution - min) * scale;

    // Outer circle (glow)
    const gradient = ctx.createRadialGradient(solutionX, lineY, 0, solutionX, lineY, 20);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.5)');
    gradient.addColorStop(1, 'rgba(102, 126, 234, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(solutionX, lineY, 20, 0, Math.PI * 2);
    ctx.fill();

    // Inner circle
    ctx.fillStyle = '#667eea';
    ctx.beginPath();
    ctx.arc(solutionX, lineY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 16px Inter';
    ctx.fillText(`x = ${solution}`, solutionX, lineY - 25);

    // Animate point
    animateNumberLinePoint(ctx, solutionX, lineY);
}

function animateNumberLinePoint(ctx, x, y) {
    let scale = 0;
    const animate = () => {
        if (scale < 1) {
            scale += 0.05;

            ctx.save();
            ctx.translate(x, y);
            ctx.scale(scale, scale);
            ctx.translate(-x, -y);

            // Redraw point
            ctx.fillStyle = '#667eea';
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

            requestAnimationFrame(animate);
        }
    };
    animate();
}

// ===================================
// Balance Scale
// ===================================

function renderBalanceScale(data, canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 300;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // Draw base
    ctx.fillStyle = '#374151';
    ctx.fillRect(centerX - 10, centerY + 50, 20, 100);
    ctx.fillRect(centerX - 50, centerY + 150, 100, 20);

    // Draw beam
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX - 150, centerY);
    ctx.lineTo(centerX + 150, centerY);
    ctx.stroke();

    // Draw fulcrum
    ctx.fillStyle = '#667eea';
    ctx.beginPath();
    ctx.moveTo(centerX - 20, centerY + 50);
    ctx.lineTo(centerX + 20, centerY + 50);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fill();

    // Draw pans
    const leftPanX = centerX - 120;
    const rightPanX = centerX + 120;
    const panY = centerY + 20;

    // Left pan
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftPanX - 60, panY);
    ctx.lineTo(leftPanX - 50, panY + 10);
    ctx.lineTo(leftPanX + 50, panY + 10);
    ctx.lineTo(leftPanX + 60, panY);
    ctx.stroke();

    // Right pan
    ctx.beginPath();
    ctx.moveTo(rightPanX - 60, panY);
    ctx.lineTo(rightPanX - 50, panY + 10);
    ctx.lineTo(rightPanX + 50, panY + 10);
    ctx.lineTo(rightPanX + 60, panY);
    ctx.stroke();

    // Draw weights (example values)
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 18px Inter';
    ctx.textAlign = 'center';

    // Left side: 2x + 5
    ctx.fillText('2x + 5', leftPanX, panY + 40);

    // Right side: 13
    ctx.fillText('13', rightPanX, panY + 40);

    // Balanced indicator
    ctx.fillStyle = '#10b981';
    ctx.font = '14px Inter';
    ctx.fillText('Balanced ⚖️', centerX, centerY - 30);
}

// ===================================
// Parabola (Quadratic Function)
// ===================================

function renderParabola(data, canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 400;

    ctx.clearRect(0, 0, width, height);

    const { roots, vertex } = data;

    // Set up coordinate system
    const padding = 50;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    const xMin = -1;
    const xMax = 6;
    const yMin = -2;
    const yMax = 8;

    const xScale = graphWidth / (xMax - xMin);
    const yScale = graphHeight / (yMax - yMin);

    // Transform functions
    const toCanvasX = (x) => padding + (x - xMin) * xScale;
    const toCanvasY = (y) => height - padding - (y - yMin) * yScale;

    // Draw axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, toCanvasY(0));
    ctx.lineTo(width - padding, toCanvasY(0));
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), padding);
    ctx.lineTo(toCanvasX(0), height - padding);
    ctx.stroke();

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    for (let x = Math.ceil(xMin); x <= xMax; x++) {
        ctx.beginPath();
        ctx.moveTo(toCanvasX(x), padding);
        ctx.lineTo(toCanvasX(x), height - padding);
        ctx.stroke();
    }

    for (let y = Math.ceil(yMin); y <= yMax; y++) {
        ctx.beginPath();
        ctx.moveTo(padding, toCanvasY(y));
        ctx.lineTo(width - padding, toCanvasY(y));
        ctx.stroke();
    }

    // Draw parabola: y = x^2 - 5x + 6
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let first = true;
    for (let x = xMin; x <= xMax; x += 0.1) {
        const y = x * x - 5 * x + 6;
        const canvasX = toCanvasX(x);
        const canvasY = toCanvasY(y);

        if (first) {
            ctx.moveTo(canvasX, canvasY);
            first = false;
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    ctx.stroke();

    // Highlight roots
    ctx.fillStyle = '#ef4444';
    roots.forEach(root => {
        const x = toCanvasX(root);
        const y = toCanvasY(0);

        // Outer glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.5)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Point
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`x = ${root}`, x, y - 15);
    });

    // Highlight vertex
    const [vx, vy] = vertex;
    const vertexX = toCanvasX(vx);
    const vertexY = toCanvasY(vy);

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(vertexX, vertexY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 14px Inter';
    ctx.fillText(`Vertex (${vx}, ${vy})`, vertexX, vertexY - 15);

    // Labels
    ctx.fillStyle = '#374151';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('x', width - padding + 20, toCanvasY(0) + 5);
    ctx.fillText('y', toCanvasX(0) - 20, padding - 10);
}

// ===================================
// Derivative Graph
// ===================================

function renderDerivativeGraph(data, canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 400;

    ctx.clearRect(0, 0, width, height);

    const padding = 50;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    const xMin = -2;
    const xMax = 2;
    const yMin = -5;
    const yMax = 10;

    const xScale = graphWidth / (xMax - xMin);
    const yScale = graphHeight / (yMax - yMin);

    const toCanvasX = (x) => padding + (x - xMin) * xScale;
    const toCanvasY = (y) => height - padding - (y - yMin) * yScale;

    // Draw axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, toCanvasY(0));
    ctx.lineTo(width - padding, toCanvasY(0));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), padding);
    ctx.lineTo(toCanvasX(0), height - padding);
    ctx.stroke();

    // Draw original function: f(x) = x^3 + 2x
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let first = true;
    for (let x = xMin; x <= xMax; x += 0.05) {
        const y = x * x * x + 2 * x;
        const canvasX = toCanvasX(x);
        const canvasY = toCanvasY(y);

        if (first) {
            ctx.moveTo(canvasX, canvasY);
            first = false;
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    ctx.stroke();

    // Draw tangent line at x = 1
    const point = data.point || 1;
    const fx = point * point * point + 2 * point;
    const slope = 3 * point * point + 2; // f'(x) = 3x^2 + 2

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();

    const tangentXMin = point - 1;
    const tangentXMax = point + 1;
    const tangentYMin = fx + slope * (tangentXMin - point);
    const tangentYMax = fx + slope * (tangentXMax - point);

    ctx.moveTo(toCanvasX(tangentXMin), toCanvasY(tangentYMin));
    ctx.lineTo(toCanvasX(tangentXMax), toCanvasY(tangentYMax));
    ctx.stroke();
    ctx.setLineDash([]);

    // Mark point
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(toCanvasX(point), toCanvasY(fx), 6, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'left';
    ctx.fillText('f(x) = x³ + 2x', padding + 10, padding + 20);

    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`Tangent at x=${point}`, padding + 10, padding + 40);
    ctx.fillText(`Slope = ${slope}`, padding + 10, padding + 60);
}

// ===================================
// Integral Area
// ===================================

function renderIntegralArea(data, canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 400;

    ctx.clearRect(0, 0, width, height);

    const { limits } = data;
    const [a, b] = limits;

    const padding = 50;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    const xMin = -1;
    const xMax = 3;
    const yMin = -1;
    const yMax = 10;

    const xScale = graphWidth / (xMax - xMin);
    const yScale = graphHeight / (yMax - yMin);

    const toCanvasX = (x) => padding + (x - xMin) * xScale;
    const toCanvasY = (y) => height - padding - (y - yMin) * yScale;

    // Draw axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, toCanvasY(0));
    ctx.lineTo(width - padding, toCanvasY(0));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), padding);
    ctx.lineTo(toCanvasX(0), height - padding);
    ctx.stroke();

    // Fill area under curve
    ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
    ctx.beginPath();
    ctx.moveTo(toCanvasX(a), toCanvasY(0));

    for (let x = a; x <= b; x += 0.05) {
        const y = x * x + 2 * x;
        ctx.lineTo(toCanvasX(x), toCanvasY(y));
    }

    ctx.lineTo(toCanvasX(b), toCanvasY(0));
    ctx.closePath();
    ctx.fill();

    // Draw function curve
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let first = true;
    for (let x = xMin; x <= xMax; x += 0.05) {
        const y = x * x + 2 * x;
        const canvasX = toCanvasX(x);
        const canvasY = toCanvasY(y);

        if (first) {
            ctx.moveTo(canvasX, canvasY);
            first = false;
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    ctx.stroke();

    // Draw limit lines
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    ctx.moveTo(toCanvasX(a), toCanvasY(0));
    ctx.lineTo(toCanvasX(a), toCanvasY(a * a + 2 * a));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toCanvasX(b), toCanvasY(0));
    ctx.lineTo(toCanvasX(b), toCanvasY(b * b + 2 * b));
    ctx.stroke();

    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'left';
    ctx.fillText('f(x) = x² + 2x', padding + 10, padding + 20);

    ctx.fillStyle = '#ef4444';
    ctx.textAlign = 'center';
    ctx.fillText(`a = ${a}`, toCanvasX(a), height - padding + 30);
    ctx.fillText(`b = ${b}`, toCanvasX(b), height - padding + 30);

    // Area label
    const area = ((b ** 3) / 3 + b ** 2) - ((a ** 3) / 3 + a ** 2);
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`Area ≈ ${area.toFixed(2)}`, width / 2, padding + 20);
}

// ===================================
// Concepts Display
// ===================================

function displayConcepts(concepts) {
    const container = document.getElementById('concepts-list');
    if (!container) return;

    if (!concepts || concepts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No additional concepts for this problem.</p>';
        return;
    }

    container.innerHTML = concepts.map(concept => `
        <div class="concept-card animate-slide-in-up">
            <h4>${concept.name}</h4>
            <p>${concept.description}</p>
            <span class="concept-level-badge">${concept.level}</span>
        </div>
    `).join('');
}

// ===================================
// Tab Switching
// ===================================

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.dataset.tab === tabName) {
            content.classList.add('active');
        }
    });
}
