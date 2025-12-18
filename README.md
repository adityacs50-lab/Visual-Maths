# VisualMath Mentor

**See math. Understand math. From school to engineering.**

A cross-platform educational app that helps users understand and solve math problems through:
- 📸 Photo/image capture of math problems
- 🎯 Step-by-step solutions
- 🎨 Interactive visualizations (graphs, diagrams, animations)
- 📚 Three learning levels: Kids (10-14), School (15-18), Engineering/University

## Features

### Core Functionality
- **Math Problem Capture**: Take photos or type math problems
- **OCR Processing**: Extract math expressions from images
- **Step-by-Step Solutions**: Detailed breakdown of problem-solving process
- **Adaptive Explanations**: Three levels of depth based on user's learning stage
- **Visual Learning**: Interactive diagrams, graphs, and animations

### Learning Modes
1. **Scan & Solve**: Capture problems and get instant solutions
2. **Practice Mode**: Topic-based practice with hints and feedback
3. **Progress Tracking**: Concept mastery and learning analytics

### Supported Topics
- Arithmetic & Basic Algebra
- Linear & Quadratic Equations
- Trigonometry
- Calculus (Derivatives & Integrals)
- Linear Algebra (Matrices & Systems)
- Geometry

## Tech Stack

### Frontend (Web MVP)
- **HTML5/CSS3/JavaScript**: Core structure
- **Canvas API**: For interactive visualizations
- **MathJax/KaTeX**: LaTeX math rendering
- **Chart.js**: Graphing capabilities

### Backend
- **Node.js/Express**: API server
- **Python**: Math solving engine
- **SymPy**: Computer Algebra System
- **Tesseract OCR**: Math expression extraction

### Future (Mobile)
- **Flutter** or **React Native** for cross-platform mobile apps

## Project Structure

```
visualmaths/
├── frontend/           # Web application
│   ├── index.html     # Main entry point
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript modules
│   └── assets/        # Images, fonts, icons
├── backend/           # API server
│   ├── server.js      # Express server
│   ├── routes/        # API endpoints
│   ├── services/      # Business logic
│   └── utils/         # Helpers
└── docs/              # Documentation
```

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+
- Modern web browser

### Installation

1. Clone the repository
2. Install frontend dependencies (if using build tools)
3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   pip install -r requirements.txt
   ```

### Running the App

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Open `frontend/index.html` in a browser or serve via local server

## Usage

1. **Select Your Level**: Choose between Kids, School, or Engineering
2. **Capture a Problem**: Use camera or type the problem
3. **View Solution**: See step-by-step explanations with visuals
4. **Practice**: Strengthen concepts with targeted exercises
5. **Track Progress**: Monitor your learning journey

## Roadmap

- [x] Project structure
- [x] Frontend UI/UX design
- [x] Math rendering
- [x] Visualization components
- [ ] OCR integration
- [ ] Backend API
- [ ] Math solver engine
- [ ] Practice mode
- [ ] Progress tracking
- [ ] Mobile app (Flutter/React Native)

## License

MIT License

## Contributing

Contributions welcome! Please read our contributing guidelines first.
