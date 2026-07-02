import React from 'react';
import './Toolbar.css';

const Toolbar = ({
  selectedAlgorithm,
  setSelectedAlgorithm,
  speed,
  setSpeed,
  isVisualizing,
  onVisualize,
  onClearBoard,
  onClearPath,
  onGenerateMaze,
}) => {
  return (
    <div className="toolbar-container">
      {/* 1. Algorithm Selector Dropdown */}
      <div className="toolbar-group">
        <label htmlFor="algorithm-select">Algorithm:</label>
        <select
          id="algorithm-select"
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value)}
          disabled={isVisualizing}
        >
          <option value="dijkstra">Dijkstra's Algorithm (Weighted)</option>
          <option value="astar">A* Search (Heuristic)</option>
          <option value="bfs">Breadth-First Search (BFS)</option>
          <option value="dfs">Depth-First Search (DFS)</option>
        </select>
      </div>

      {/* 2. Speed Selector Dropdown */}
      <div className="toolbar-group">
        <label htmlFor="speed-select">Speed:</label>
        <select
          id="speed-select"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          disabled={isVisualizing}
        >
          <option value="10">Fast (10ms)</option>
          <option value="30">Medium (30ms)</option>
          <option value="75">Slow (75ms)</option>
        </select>
      </div>

      {/* 3. Action Buttons */}
      <div className="toolbar-buttons">
        <button
          className="btn btn-visualize"
          onClick={onVisualize}
          disabled={isVisualizing || !selectedAlgorithm}
        >
          {selectedAlgorithm
            ? `Visualize ${
                selectedAlgorithm === 'dijkstra'
                  ? 'Dijkstra'
                  : selectedAlgorithm === 'astar'
                  ? 'A*'
                  : selectedAlgorithm.toUpperCase()
              }!`
            : 'Select an Algorithm'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={onGenerateMaze}
          disabled={isVisualizing}
        >
          Generate Maze
        </button>

        <button
          className="btn btn-secondary"
          onClick={onClearPath}
          disabled={isVisualizing}
        >
          Clear Path
        </button>

        <button
          className="btn btn-secondary"
          onClick={onClearBoard}
          disabled={isVisualizing}
        >
          Clear Board
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
