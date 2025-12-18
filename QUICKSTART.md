# VisualMath Mentor - Quick Start Guide

## 🚀 Getting Started

### Opening the App

1. **Open the app**: Navigate to `e:\visualmaths\frontend\index.html` in your web browser
2. **Or use a local server** (recommended for full functionality):
   ```bash
   # Using Python
   cd e:\visualmaths\frontend
   python -m http.server 8000
   # Then open http://localhost:8000
   
   # Using Node.js
   npx serve
   ```

## 📱 App Walkthrough

### 1. Onboarding (First Time)

When you first open the app, you'll see:

**Step 1: Welcome Screen**
- Shows 4 key features: Scan Problems, Step-by-Step, Visual Learning, Track Progress
- Click **"Get Started"** to continue

**Step 2: Select Your Level**
- Choose your learning level:
  - **Class 5-8 (Kids)**: Simple explanations with everyday language
  - **Class 9-12 (School)**: Exam-focused with proper terminology
  - **Engineering/University**: Advanced concepts with formal notation
- Click on your level card to select it

**Step 3: Customize Experience**
- Toggle **Simple Language**: Use everyday words
- Toggle **Dark Mode**: Switch between light/dark themes
- Toggle **Show Animations**: Enable/disable visual transitions
- Click **"Start Learning"** to enter the app

### 2. Home Screen

After onboarding, you'll see 4 main action cards:

#### 📸 Scan a Problem
- Opens camera interface
- Position math problem within the frame
- Tap capture button to scan
- **Note**: Camera requires HTTPS or localhost for security

#### ✏️ Type a Problem
- Manual input for math expressions
- Math keyboard with symbols: x, y, x², √, ∫, π, etc.
- Example problems to try:
  - `2x + 5 = 13` (Linear equation)
  - `x^2 - 5x + 6 = 0` (Quadratic)
  - `d/dx(x^3 + 2x)` (Derivative)
  - Press **"Solve"** to get step-by-step solution

#### 🎯 Practice Mode
- Choose from topics:
  - Linear Equations
  - Quadratic Equations
  - Derivatives
  - Integration
- Answer 5 questions per session
- Get hints and instant feedback
- Track your score

#### 📊 My Progress
- View statistics:
  - Problems solved
  - Time spent learning
  - Current streak
  - Average mastery
- See concept mastery breakdown
- Activity chart for last 7 days

### 3. Solution Screen

After solving a problem, you'll see:

**Three Tabs:**

1. **Steps Tab** (Default)
   - Step-by-step solution
   - Each step shows:
     - Math transformation (LaTeX rendered)
     - Explanation (adapted to your level)
     - Concept tags
   - Buttons:
     - "Show All Steps": Expand/collapse
     - "Try Similar": Generate similar problems

2. **Visual Tab**
   - Interactive visualizations:
     - **Linear equations**: Number line + Balance scale
     - **Quadratics**: Parabola graph with roots
     - **Derivatives**: Function + tangent line
     - **Integrals**: Area under curve
   - All drawn with Canvas API

3. **Concepts Tab**
   - Related math concepts
   - Detailed explanations
   - Level-appropriate descriptions

### 4. Practice Mode Details

**Starting Practice:**
1. Select a topic
2. Answer 5 questions
3. Use hints if needed
4. Check your answer
5. Get instant feedback

**Answer Format:**
- Single answer: `4`
- Multiple answers: `2,3` or `3,2` (order doesn't matter)
- Expressions: `3x²+2` (spaces optional)

**Scoring:**
- Correct answers: +5% mastery
- Incorrect answers: -2% mastery
- Track progress in Progress screen

### 5. Progress Tracking

**Stats Displayed:**
- **Problems Solved**: Total count
- **Time Spent**: Hours and minutes
- **Streak**: Consecutive days of activity
- **Mastery Score**: Average across all topics

**Concept Mastery:**
- Linear Equations
- Quadratic Equations
- Derivatives
- Integration
- Matrices
- Trigonometry

Each shows percentage (0-100%) with visual progress bar.

**Activity Chart:**
- Line graph showing problems solved per day
- Last 7 days of activity
- Hover to see exact numbers

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + K**: Open Type Problem screen
- **Ctrl/Cmd + H**: Go to Home
- **Ctrl/Cmd + P**: Open Practice Mode
- **Escape**: Go back / Close current screen
- **Ctrl/Cmd + Enter**: Solve problem (when typing)

## 🎨 Features Showcase

### Adaptive Explanations

The same problem is explained differently based on your level:

**Example: 2x + 5 = 13 → 2x = 8**

- **Kids**: "x is stuck with +5. We remove 5 from both sides to help x get free."
- **School**: "Subtract 5 from both sides to isolate the term containing x."
- **Engineering**: "Apply the additive inverse of 5 to both sides to maintain equality."

### Visual Learning

Each problem type has custom visualizations:

1. **Number Line**: Shows solution point with animation
2. **Balance Scale**: Demonstrates equation balance
3. **Parabola Graph**: Highlights roots and vertex
4. **Derivative Graph**: Shows tangent line and slope
5. **Integral Area**: Fills area under curve

### Smart Problem Classification

The app automatically detects:
- Linear equations (contains =, x/y)
- Quadratic equations (contains x²)
- Derivatives (contains d/dx or "derivative")
- Integrals (contains ∫ or "integral")
- Trigonometry (contains sin, cos, tan)

## 🔧 Settings

Access via Settings screen (⚙️ icon or bottom nav):

**Learning Level:**
- Switch between Kids, School, Engineering
- Affects all explanations immediately

**Preferences:**
- Simple Language: Toggle technical terms
- Dark Mode: Switch theme
- Animations: Enable/disable transitions
- Sound Effects: Audio feedback (coming soon)

## 📝 Example Problems to Try

### Linear Equations
```
3x + 7 = 19
5x - 12 = 23
2(x + 3) = 14
4x + 5 = 2x + 17
```

### Quadratic Equations
```
x^2 - 9 = 0
x^2 - 5x + 6 = 0
x^2 + 6x + 9 = 0
2x^2 - 8 = 0
```

### Derivatives
```
d/dx(x^4)
d/dx(5x^2)
d/dx(x^3 + 3x)
d/dx(2x^4 - 5x^2)
```

### Integration
```
∫x^3 dx
∫4x dx
∫(x^2 + 2) dx
∫(3x^2 - 4x) dx
```

## 🎯 Tips for Best Experience

1. **Start with Easy Problems**: Build confidence with linear equations
2. **Use Practice Mode**: Reinforce learning with targeted exercises
3. **Check Visualizations**: They help build intuition
4. **Maintain Streaks**: Solve at least one problem daily
5. **Switch Levels**: Try different explanation styles
6. **Explore Concepts Tab**: Deepen understanding

## 🐛 Troubleshooting

### Camera Not Working
- Ensure you're using HTTPS or localhost
- Grant camera permissions in browser
- Check if camera is used by another app

### Math Not Rendering
- Wait for MathJax to load (1-2 seconds)
- Refresh the page
- Check internet connection (MathJax loads from CDN)

### Charts Not Showing
- Ensure Chart.js loaded successfully
- Check browser console for errors
- Refresh the page

### Dark Mode Not Working
- Toggle the setting in Settings screen
- Check if browser has forced color scheme

## 🚀 Next Steps

1. **Complete Onboarding**: Set your level and preferences
2. **Solve First Problem**: Try "2x + 5 = 13"
3. **Explore Visualizations**: See the number line and balance scale
4. **Try Practice Mode**: Test your skills
5. **Track Progress**: Watch your mastery grow

## 📚 Learning Path Suggestions

### For Kids (Class 5-8)
1. Start with simple linear equations
2. Use visualizations heavily
3. Practice daily for 10-15 minutes
4. Focus on understanding, not speed

### For School (Class 9-12)
1. Mix linear and quadratic equations
2. Practice derivatives and integrals
3. Aim for 80%+ mastery in each topic
4. Use for exam preparation

### For Engineering Students
1. Focus on calculus (derivatives, integrals)
2. Try complex expressions
3. Study the formal explanations
4. Use as a quick reference tool

## 🎓 Educational Philosophy

VisualMath Mentor is built on three principles:

1. **Visual First**: See concepts, don't just read them
2. **Adaptive Learning**: Explanations match your level
3. **Practice Makes Perfect**: Reinforce through repetition

## 📞 Support

For issues or questions:
- Check browser console for errors
- Ensure all files are in correct locations
- Verify internet connection for CDN resources

---

**Happy Learning! 🎉**

Start your math journey now by opening the app and selecting your level!
