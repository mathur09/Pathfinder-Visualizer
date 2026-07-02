# Pathfinder-Visualizer
An interactive React web application that visualizes classic graph search and pathfinding algorithms on a 2D grid in real-time. Features fluid animations, drag and drop node relocations, customizable speed settings, and randomized maze generation.
## 🚀 Features

* **Real-time Pathfinding Visualizations:** See the exploration wave and shortest-path calculation of various search strategies.
* **4 Core Search Algorithms:**
  * **Dijkstra's Algorithm (Weighted):** The father of pathfinding; guarantees the shortest path.
  * **A\* Search (Informed Heuristic):** Fast heuristic-based search using Manhattan distance; guarantees shortest path.
  * **Breadth-First Search (BFS) (Unweighted):** Radial expansion; guarantees shortest path on unweighted grids.
  * **Depth-First Search (DFS) (Unweighted):** Winding exploration; does not guarantee shortest path.
* **High-Performance Animations:** Custom hardware-accelerated CSS animations mapped directly to the DOM for a lock-solid 60 FPS exploration wave.
* **Interactive Grid:**
  * Click and drag to draw and erase wall barriers.
  * Drag and drop the green (Start) and red (End) nodes to relocate them dynamically.
* **Randomized Maze Generator:** Carve complex, fully solvable mazes using a Randomized Depth-First Search (Recursive Backtracking) algorithm.
* **Responsive Control Panel:** Adjust animation speeds (Fast, Medium, Slow) and clean up the board easily (Clear Path vs. Clear Board).
## 🛠️ Tech Stack

* **Frontend Library:** [React.js](https://react.dev/) (Functional components with React Hooks)
* **Build Tool & Dev Server:** [Vite](https://vite.dev/) (Extremely fast hot-module replacement)
* **Language:** JavaScript (ES6+)
* **Styling:** Vanilla CSS (Tailwind-free for bespoke, performant keyframe animations)

## 📂 Project Architecture

```text
pathfinding-visualizer/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Grid/           # Grid layout and cell configurations
│   │   │   ├── Grid.jsx
│   │   │   ├── Grid.css
│   │   │   ├── Node.jsx
│   │   │   └── Node.css
│   │   └── Toolbar/        # Control Panel buttons and dropdowns
│   │       ├── Toolbar.jsx
│   │       └── Toolbar.css
│   ├── algorithms/         # The pathfinding & maze engine
│   │   ├── dijkstra.js     # Dijkstra search
│   │   ├── astar.js        # A* search with Manhattan heuristic
│   │   ├── bfs.js          # Breadth-first search
│   │   ├── dfs.js          # Depth-first search
│   │   └── mazeGen.js      # Randomized DFS maze carver
│   ├── App.jsx             # Main state container and layout coordinator
│   ├── App.css             # Main styling
│   ├── index.css           # Global theme, resets, and custom scrollbars
│   └── main.jsx            # Entry point
```

---

## 💻 Running Locally

To run this application on your computer:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v20+ recommended).

### Steps
1. **Clone or Open the directory:**
   ```bash
   cd pathfinding-visualizer
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the local development server:**
   ```bash
   npm run dev
   ```
4. **Open your browser:**
   Navigate to the URL output in your terminal (typically `http://localhost:5173/`).
