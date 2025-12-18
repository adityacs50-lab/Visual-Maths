# VisualMath Mentor - Technical Documentation

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [File Structure](#file-structure)
3. [Core Modules](#core-modules)
4. [State Management](#state-management)
5. [Visualization System](#visualization-system)
6. [Problem Solving Engine](#problem-solving-engine)
7. [Practice Mode](#practice-mode)
8. [Progress Tracking](#progress-tracking)
9. [Styling System](#styling-system)
10. [Future Enhancements](#future-enhancements)

---

## Architecture Overview

### Technology Stack

**Frontend (Web MVP)**
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with CSS variables, gradients, animations
- **Vanilla JavaScript**: No framework dependencies for simplicity
- **MathJax 3**: LaTeX math rendering
- **Chart.js 4**: Data visualization and charts
- **Canvas API**: Custom interactive visualizations

**Design Principles**
- Mobile-first responsive design
- Progressive enhancement
- Accessibility (ARIA labels, keyboard navigation)
- Performance optimization (lazy loading, efficient rendering)

### Application Flow

```
Onboarding → Home → [Scan/Type/Practice/Progress] → Solution → Home
```

**Key User Journeys:**
1. **Solve Problem**: Home → Type → Solution → Home
2. **Practice**: Home → Practice → Questions → Results → Home
3. **Track Progress**: Home → Progress → [View Stats/Charts] → Home

---

## File Structure

```
visualmaths/
├── frontend/
│   ├── index.html              # Main HTML file (all screens)
│   ├── css/
│   │   ├── main.css           # Core styles, variables, layout
│   │   ├── components.css     # Component-specific styles
│   │   └── animations.css     # Keyframes, transitions, effects
│   └── js/
│       ├── app.js             # Main app logic, state management
│       ├── navigation.js      # Screen navigation, routing
│       ├── camera.js          # Camera access, image capture
│       ├── solver.js          # Problem solving, step generation
│       ├── visualizations.js  # Canvas-based visualizations
│       ├── practice.js        # Practice mode, question bank
│       └── progress.js        # Analytics, charts, achievements
├── README.md                   # Project overview
├── QUICKSTART.md              # User guide
└── TECHNICAL.md               # This file
```

---

## Core Modules

### 1. app.js - Application Core

**Responsibilities:**
- Application state management
- Initialization and setup
- Event listener registration
- UI updates and synchronization
- Theme management
- Local storage persistence

**Key Functions:**
```javascript
loadState()           // Load saved state from localStorage
saveState()           // Persist state to localStorage
updateState(updates)  // Update state and trigger UI refresh
updateUI()            // Sync UI with current state
applyTheme()          // Apply light/dark theme
```

**State Structure:**
```javascript
AppState = {
    learningLevel: 'school',      // 'kid' | 'school' | 'engineering'
    simpleLanguage: true,
    darkMode: false,
    animations: true,
    currentScreen: 'onboarding',
    problemsSolved: 0,
    timeSpent: 0,
    streakDays: 0,
    conceptMastery: {},
    recentProblems: []
}
```

### 2. navigation.js - Navigation System

**Features:**
- Screen transitions
- Navigation history
- Deep linking (URL hash routing)
- Keyboard shortcuts
- Mobile gesture support
- Navigation guards

**Key Functions:**
```javascript
navigate(screenName)      // Navigate to screen
goBack()                  // Navigate back
handleDeepLink()          // Process URL hash
trackNavigation()         // Analytics tracking
```

**Keyboard Shortcuts:**
- `Ctrl/Cmd + K`: Type problem
- `Ctrl/Cmd + H`: Home
- `Ctrl/Cmd + P`: Practice
- `Escape`: Go back

### 3. camera.js - Camera Module

**Features:**
- Camera initialization
- Photo capture
- Flash control
- Camera switching (front/back)
- Gallery selection
- OCR simulation

**Key Functions:**
```javascript
initializeCamera()        // Request camera access
capturePhoto()            // Capture and process image
switchCamera()            // Toggle front/back camera
toggleFlash()             // Enable/disable flash
extractMathFromImage()    // OCR processing (simulated)
```

**Browser Requirements:**
- HTTPS or localhost (for camera access)
- `getUserMedia` API support
- Modern browser (Chrome, Firefox, Safari, Edge)

### 4. solver.js - Problem Solver

**Features:**
- Problem classification
- Step-by-step solution generation
- Multi-level explanations
- LaTeX rendering integration
- Solution display

**Problem Types Supported:**
1. **Linear Equations**: `ax + b = c`
2. **Quadratic Equations**: `ax² + bx + c = 0`
3. **Derivatives**: `d/dx(f(x))`
4. **Integrals**: `∫f(x)dx`

**Solution Structure:**
```javascript
{
    problem: "2x + 5 = 13",
    topic: "Algebra → Linear Equations",
    answer: "x = 4",
    steps: [
        {
            number: 1,
            math: "2x + 5 = 13",
            concepts: ["linear equation"],
            kid_explanation: "...",
            school_explanation: "...",
            engineering_explanation: "..."
        }
    ],
    visualizations: [...],
    concepts: [...]
}
```

### 5. visualizations.js - Visualization Engine

**Visualization Types:**

1. **Number Line**
   - Shows solution point
   - Animated sliding
   - Range: configurable

2. **Balance Scale**
   - Left/right pans
   - Equation balance
   - Visual equality

3. **Parabola Graph**
   - Quadratic function curve
   - Highlighted roots
   - Vertex marker
   - Coordinate grid

4. **Derivative Graph**
   - Original function
   - Tangent line
   - Slope indicator
   - Interactive point

5. **Integral Area**
   - Function curve
   - Shaded area
   - Integration limits
   - Area calculation

**Canvas Rendering:**
- 2D context
- Responsive sizing
- Smooth animations
- High DPI support

### 6. practice.js - Practice Mode

**Features:**
- Question bank (20+ questions)
- Topic-based practice
- Hint system
- Answer validation
- Score tracking
- Mastery updates

**Question Bank Topics:**
- Linear Equations (5 questions)
- Quadratic Equations (5 questions)
- Derivatives (5 questions)
- Integration (5 questions)

**Practice Flow:**
```
Select Topic → Load Questions → Answer → Check → Feedback → Next → Results
```

**Mastery Algorithm:**
- Correct answer: +5%
- Incorrect answer: -2%
- Clamped to [0, 100]

### 7. progress.js - Progress Tracking

**Features:**
- Activity charts (Chart.js)
- Statistics dashboard
- Concept mastery tracking
- Streak calculation
- Achievement system
- Progress export

**Statistics Tracked:**
- Problems solved
- Time spent (minutes)
- Current streak (days)
- Average mastery (%)
- Strongest/weakest concepts
- Recent activity

**Achievements:**
- First Problem (1 solved)
- Problem Solver (10 solved)
- Math Enthusiast (50 solved)
- Dedicated Learner (7-day streak)
- Concept Master (90% mastery)
- All-Rounder (50% all concepts)

---

## State Management

### Local Storage Schema

```javascript
{
    "visualMathState": {
        // User preferences
        "learningLevel": "school",
        "simpleLanguage": true,
        "darkMode": false,
        "animations": true,
        
        // Progress data
        "problemsSolved": 42,
        "timeSpent": 3600,
        "streakDays": 7,
        
        // Mastery tracking
        "conceptMastery": {
            "linear-equations": 85,
            "quadratic-equations": 60,
            // ...
        },
        
        // Recent problems
        "recentProblems": [...]
    },
    
    "onboardingComplete": "true",
    "lastActiveDate": "Mon Dec 02 2024",
    "navigationAnalytics": [...],
    "screenStates": {...}
}
```

### State Persistence

**When State is Saved:**
- After each problem solved
- After practice session
- On settings change
- On app close (beforeunload)

**State Loading:**
- On app initialization
- After page refresh

---

## Visualization System

### Canvas Architecture

**Coordinate System:**
```javascript
// Transform from math coordinates to canvas pixels
const toCanvasX = (x) => padding + (x - xMin) * xScale;
const toCanvasY = (y) => height - padding - (y - yMin) * yScale;
```

**Rendering Pipeline:**
1. Clear canvas
2. Draw grid/axes
3. Draw function curve
4. Draw highlights (roots, points)
5. Draw labels
6. Apply animations

**Animation Techniques:**
- RequestAnimationFrame for smooth 60fps
- Easing functions for natural motion
- Incremental rendering for complex curves

### Chart.js Integration

**Activity Chart Configuration:**
```javascript
{
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', ...],
        datasets: [{
            data: [3, 5, 2, 7, 4, 6, 8],
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4
        }]
    }
}
```

---

## Problem Solving Engine

### Classification Algorithm

```javascript
function classifyProblem(problem) {
    // Check for calculus keywords
    if (contains('d/dx', 'derivative')) return 'derivative';
    if (contains('∫', 'integral')) return 'integral';
    
    // Check for polynomial degree
    if (contains('^2', '²')) return 'quadratic';
    if (contains('=', 'x')) return 'linear';
    
    // Default
    return 'general';
}
```

### Step Generation

**Linear Equation Example:**
```
Input: 2x + 5 = 13

Steps:
1. 2x + 5 = 13          [Given]
2. 2x + 5 - 5 = 13 - 5  [Subtract 5]
3. 2x = 8               [Simplify]
4. 2x ÷ 2 = 8 ÷ 2       [Divide by 2]
5. x = 4                [Solution]
```

**Explanation Levels:**
- **Kid**: Simple language, analogies, encouragement
- **School**: Proper terminology, exam-focused
- **Engineering**: Formal notation, mathematical rigor

---

## Styling System

### CSS Architecture

**Design Tokens (CSS Variables):**
```css
:root {
    /* Colors */
    --primary-color: #667eea;
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    /* Spacing */
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    
    /* Typography */
    --font-primary: 'Inter', sans-serif;
    
    /* Effects */
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --radius-lg: 0.75rem;
}
```

**Component Structure:**
```
.component-name {
    /* Layout */
    /* Typography */
    /* Colors */
    /* Effects */
    /* Transitions */
}
```

### Responsive Breakpoints

```css
/* Mobile: < 480px */
/* Tablet: 480px - 768px */
/* Desktop: > 768px */

@media (max-width: 768px) {
    /* Tablet styles */
}

@media (max-width: 480px) {
    /* Mobile styles */
}
```

### Animation System

**Keyframes:**
- `slideInUp`, `slideInDown`, `slideInLeft`, `slideInRight`
- `fadeIn`, `fadeOut`
- `scaleIn`, `scaleOut`
- `pulse`, `bounce`, `shake`
- `scan`, `shimmer`, `glow`

**Usage:**
```css
.element {
    animation: slideInUp 0.4s ease;
}
```

---

## Future Enhancements

### Phase 1: Core Improvements
- [ ] Real OCR integration (Tesseract.js or API)
- [ ] Backend API for problem solving
- [ ] SymPy integration for CAS
- [ ] More problem types (trigonometry, matrices)
- [ ] Offline mode with service workers

### Phase 2: Advanced Features
- [ ] User accounts and cloud sync
- [ ] Social features (share solutions)
- [ ] Teacher dashboard
- [ ] Custom problem sets
- [ ] Video explanations
- [ ] Voice input

### Phase 3: Mobile Apps
- [ ] React Native or Flutter app
- [ ] Native camera integration
- [ ] Push notifications
- [ ] Offline problem bank
- [ ] App store deployment

### Phase 4: AI Integration
- [ ] LLM-powered explanations
- [ ] Natural language problem input
- [ ] Personalized learning paths
- [ ] Adaptive difficulty
- [ ] Smart hints

### Backend Architecture (Future)

```
Backend/
├── server.js              # Express server
├── routes/
│   ├── solve.js          # POST /api/solve
│   ├── practice.js       # GET /api/practice
│   └── progress.js       # GET /api/progress
├── services/
│   ├── ocr.js            # Tesseract integration
│   ├── solver.js         # SymPy wrapper
│   └── explanations.js   # LLM integration
└── models/
    ├── User.js
    ├── Problem.js
    └── Progress.js
```

---

## Development Guidelines

### Code Style

**JavaScript:**
- Use ES6+ features
- Descriptive variable names
- JSDoc comments for functions
- Async/await for promises
- Error handling with try/catch

**CSS:**
- BEM-like naming convention
- Mobile-first approach
- CSS variables for theming
- Avoid !important
- Group related properties

**HTML:**
- Semantic elements
- ARIA labels for accessibility
- Unique IDs for elements
- Data attributes for state

### Testing Strategy

**Manual Testing:**
1. Test on Chrome, Firefox, Safari, Edge
2. Test on mobile devices
3. Test with different screen sizes
4. Test camera functionality
5. Test all problem types

**Future Automated Testing:**
- Unit tests (Jest)
- Integration tests (Cypress)
- Visual regression tests
- Performance tests

### Performance Optimization

**Current:**
- Lazy loading of visualizations
- Debounced input handlers
- Efficient Canvas rendering
- Minimal DOM manipulation

**Future:**
- Code splitting
- Image optimization
- CDN for static assets
- Service worker caching

---

## API Documentation (Future)

### POST /api/solve

**Request:**
```json
{
    "problem": "2x + 5 = 13",
    "level": "school",
    "imageData": "base64..." // optional
}
```

**Response:**
```json
{
    "success": true,
    "solution": {
        "problem": "2x + 5 = 13",
        "answer": "x = 4",
        "steps": [...],
        "visualizations": [...],
        "concepts": [...]
    }
}
```

### GET /api/practice

**Query Parameters:**
- `topic`: linear | quadratic | derivatives | integration
- `level`: kid | school | engineering
- `count`: number of questions (default: 5)

**Response:**
```json
{
    "success": true,
    "questions": [
        {
            "id": "lin-1",
            "question": "3x + 7 = 19",
            "answer": "4",
            "hint": "..."
        }
    ]
}
```

---

## Deployment

### Web Deployment

**Static Hosting:**
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

**Steps:**
1. Build assets (if using build tools)
2. Upload to hosting service
3. Configure custom domain
4. Enable HTTPS
5. Set up analytics

### Mobile Deployment

**React Native:**
1. Set up React Native project
2. Port components
3. Add native camera module
4. Build for iOS/Android
5. Submit to app stores

**Flutter:**
1. Set up Flutter project
2. Create UI widgets
3. Integrate native features
4. Build APK/IPA
5. Deploy to stores

---

## Troubleshooting

### Common Issues

**MathJax not rendering:**
- Check internet connection
- Verify MathJax CDN URL
- Wait for script to load
- Check console for errors

**Camera not working:**
- Ensure HTTPS or localhost
- Check browser permissions
- Verify camera availability
- Test on different browser

**Charts not displaying:**
- Verify Chart.js loaded
- Check canvas element exists
- Ensure data is valid
- Check browser console

**State not persisting:**
- Check localStorage quota
- Verify saveState() calls
- Check browser settings
- Clear and reset if needed

---

## Contributing

### How to Contribute

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Code Review Checklist

- [ ] Code follows style guide
- [ ] Functions are documented
- [ ] No console.log in production
- [ ] Responsive design tested
- [ ] Accessibility checked
- [ ] Performance optimized

---

## License

MIT License - See LICENSE file for details

---

## Credits

**Libraries:**
- [MathJax](https://www.mathjax.org/) - Math rendering
- [Chart.js](https://www.chartjs.org/) - Charts
- [Google Fonts](https://fonts.google.com/) - Typography

**Inspiration:**
- Photomath
- Khan Academy
- Wolfram Alpha
- Symbolab

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Maintainer**: VisualMath Team
