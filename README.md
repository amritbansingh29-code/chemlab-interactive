# 🧪 ChemLab Interactive

An advanced, interactive chemistry laboratory simulation and learning platform built with React and Vite. Experience hands-on virtual chemistry experiments, real-time 3D test tube reactions, comprehensive study modules, quizzes, and an intelligent chemistry assistant.

![ChemLab Interactive](https://img.shields.io/badge/ChemLab-Interactive-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)

---

## ✨ Features

- **🔬 Virtual 3D Lab**: Perform dynamic chemical reactions with real-time visual feedback, color changes, precipitate formation, gas emissions, and temperature shifts.
- **🤖 ChemAI Assistant**: An integrated chemistry assistant capable of balancing equations, explaining reaction mechanisms, and answering complex chemistry questions.
- **📚 Interactive Classroom & Explore**: Curated lessons, reaction catalogs, and deep dives into fundamental chemistry concepts.
- **📝 Comprehensive Quiz & Practice**: Test and reinforce chemical knowledge with interactive quizzes and immediate feedback.
- **⚡ Portable Single-File Build**: Ability to bundle the complete web application into a standalone HTML file (`CHEMISTRY PROJECT.html` / `app.html`) using `vite-plugin-singlefile`.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (version 18 or higher recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amritbansingh29-code/chemlab-interactive.git
   cd chemlab-interactive
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 🛠️ Build Scripts

- **`npm run dev`**: Starts Vite dev server with hot module replacement (HMR).
- **`npm run build`**: Builds the production bundle and generates self-contained single-file HTML distributions via `scripts/build-project.js`.
- **`npm run preview`**: Locally previews the production build.

---

## 📁 Project Structure

```text
CHEMLAB INTERACTIVE/
├── src/
│   ├── components/      # Reusable UI components & 3D reaction visualizations
│   ├── pages/           # Application views (VirtualLab, Assistant, Quiz, Classroom, Explore)
│   ├── styles/          # Styling & glassmorphism theme tokens
│   ├── utils/           # Chemistry simulation engine & reaction logic
│   ├── App.jsx          # Routing & layout configuration
│   └── main.jsx         # App entry point
├── scripts/             # Post-build generation and sync scripts
├── index.html           # Main HTML template
├── package.json         # Project metadata and dependencies
└── vite.config.js       # Vite configuration
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) (or as designated by the author).
