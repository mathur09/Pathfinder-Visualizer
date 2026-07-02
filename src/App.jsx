import React, { useState } from 'react';
import Grid from './components/Grid/Grid';
import Toolbar from './components/Toolbar/Toolbar';
import { dijkstra, getNodesInShortestPathOrder } from './algorithms/dijkstra';
import { astar } from './algorithms/astar';
import { bfs } from './algorithms/bfs';
import { dfs } from './algorithms/dfs';
import { randomizedDfsMaze } from './algorithms/mazeGen';
import './App.css';

// Grid Dimensions
const ROWS = 20;
const COLS = 50;

// Helper to create a single node object
const createNode = (row, col, startNode, endNode) => {
  return {
    row,
    col,
    isStart: row === startNode.row && col === startNode.col,
    isEnd: row === endNode.row && col === endNode.col,
    isWall: false,
    isVisited: false,
    isShortestPath: false,
    distance: Infinity,
    previousNode: null,
  };
};

// Helper to create the initial grid
const getInitialGrid = (startNode, endNode) => {
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    const currentRow = [];
    for (let c = 0; c < COLS; c++) {
      currentRow.push(createNode(r, c, startNode, endNode));
    }
    grid.push(currentRow);
  }
  return grid;
};

// Helper to toggle a wall node
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.map(r => [...r]);
  const node = newGrid[row][col];
  
  if (node.isStart || node.isEnd) return grid;

  newGrid[row][col] = {
    ...node,
    isWall: !node.isWall,
  };
  return newGrid;
};

function App() {
  // Start/End coordinate states
  const [startNode, setStartNode] = useState({ row: 10, col: 15 });
  const [endNode, setEndNode] = useState({ row: 10, col: 35 });

  // Grid state
  const [grid, setGrid] = useState(() => getInitialGrid({ row: 10, col: 15 }, { row: 10, col: 35 }));

  // Controls state
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('dijkstra');
  const [speed, setSpeed] = useState(10); // delay in milliseconds

  // Interaction states
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [draggingNode, setDraggingNode] = useState(null); // 'start' | 'end' | null
  const [isVisualizing, setIsVisualizing] = useState(false);

  // Mouse Handlers
  const handleMouseDown = (row, col) => {
    if (isVisualizing) return;
    const node = grid[row][col];
    setIsMouseDown(true);

    if (node.isStart) {
      setDraggingNode('start');
    } else if (node.isEnd) {
      setDraggingNode('end');
    } else {
      setDraggingNode(null);
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid);
    }
  };

  const handleMouseEnter = (row, col) => {
    if (isVisualizing || !isMouseDown) return;

    const targetNode = grid[row][col];

    if (draggingNode === 'start') {
      if (targetNode.isEnd) return;
      const newGrid = grid.map(r => [...r]);
      
      newGrid[startNode.row][startNode.col] = {
        ...newGrid[startNode.row][startNode.col],
        isStart: false,
      };
      
      newGrid[row][col] = {
        ...newGrid[row][col],
        isStart: true,
        isWall: false,
      };

      setStartNode({ row, col });
      setGrid(newGrid);
    } else if (draggingNode === 'end') {
      if (targetNode.isStart) return;
      const newGrid = grid.map(r => [...r]);

      newGrid[endNode.row][endNode.col] = {
        ...newGrid[endNode.row][endNode.col],
        isEnd: false,
      };

      newGrid[row][col] = {
        ...newGrid[row][col],
        isEnd: true,
        isWall: false,
      };

      setEndNode({ row, col });
      setGrid(newGrid);
    } else {
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setDraggingNode(null);
  };

  // ANIMATION ENGINE: Staggered timers and direct DOM updates
  const animateAlgorithm = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (!node.isStart && !node.isEnd) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
        }
      }, speed * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    if (nodesInShortestPathOrder.length <= 1) {
      setIsVisualizing(false);
      return;
    }

    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (!node.isStart && !node.isEnd) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
        }
        if (i === nodesInShortestPathOrder.length - 1) {
          syncReactStateAfterAnimation(grid, nodesInShortestPathOrder);
        }
      }, 30 * i);
    }
  };

  const syncReactStateAfterAnimation = (currentGrid, shortestPathNodes) => {
    const shortestPathSet = new Set(shortestPathNodes.map(n => `${n.row}-${n.col}`));
    
    const newGrid = currentGrid.map(row => {
      return row.map(node => {
        const key = `${node.row}-${node.col}`;
        return {
          ...node,
          isVisited: node.isVisited || document.getElementById(`node-${node.row}-${node.col}`).className.includes('node-visited'),
          isShortestPath: shortestPathSet.has(key),
        };
      });
    });

    setGrid(newGrid);
    setIsVisualizing(false);
  };

  // Run Selected Algorithm
  const handleVisualize = () => {
    if (isVisualizing) return;
    setIsVisualizing(true);
    clearPathStyles();

    const gridCopy = grid.map(row => row.map(node => ({
      ...node,
      isVisited: false,
      isShortestPath: false,
      distance: Infinity,
      previousNode: null,
    })));
    
    const start = gridCopy[startNode.row][startNode.col];
    const end = gridCopy[endNode.row][endNode.col];

    let visitedNodesInOrder = [];
    if (selectedAlgorithm === 'dijkstra') {
      visitedNodesInOrder = dijkstra(gridCopy, start, end);
    } else if (selectedAlgorithm === 'astar') {
      visitedNodesInOrder = astar(gridCopy, start, end);
    } else if (selectedAlgorithm === 'bfs') {
      visitedNodesInOrder = bfs(gridCopy, start, end);
    } else if (selectedAlgorithm === 'dfs') {
      visitedNodesInOrder = dfs(gridCopy, start, end);
    }

    const nodesInShortestPathOrder = getNodesInShortestPathOrder(end);
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  // Carve out a Randomized DFS Maze
  const handleGenerateMaze = () => {
    if (isVisualizing) return;
    setIsVisualizing(true);

    // 1. Temporarily make all cells walls (except start and end)
    const tempGrid = grid.map(row => row.map(node => {
      if (node.isStart || node.isEnd) {
        return { ...node, isWall: false, isVisited: false, isShortestPath: false };
      }
      return { ...node, isWall: true, isVisited: false, isShortestPath: false };
    }));

    // 2. Visually block out the DOM instantly to avoid React rendering lag
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const node = tempGrid[r][c];
        if (!node.isStart && !node.isEnd) {
          document.getElementById(`node-${r}-${c}`).className = 'node node-wall';
        } else {
          document.getElementById(`node-${r}-${c}`).className = node.isStart ? 'node node-start' : 'node node-end';
        }
      }
    }

    // 3. Generate passages using Randomized DFS Maze carving
    const passagesInOrder = randomizedDfsMaze(tempGrid, startNode, endNode);
    const passageSet = new Set(passagesInOrder.map(p => `${p.row}-${p.col}`));

    // 4. Stagger-animate turning the dark wall nodes back into empty passage nodes
    for (let i = 0; i < passagesInOrder.length; i++) {
      setTimeout(() => {
        const node = passagesInOrder[i];
        if (!node.isStart && !node.isEnd) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
        }

        // On the final step, sync with React state
        if (i === passagesInOrder.length - 1) {
          const finalGrid = tempGrid.map(row => row.map(n => {
            const key = `${n.row}-${n.col}`;
            return {
              ...n,
              isWall: n.isStart || n.isEnd ? false : !passageSet.has(key),
            };
          }));
          setGrid(finalGrid);
          setIsVisualizing(false);
        }
      }, 8 * i); // Carve animation speed
    }
  };

  // Clears only animated path styles, leaving wall obstacles intact
  const clearPathStyles = () => {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const node = grid[r][c];
        if (!node.isStart && !node.isEnd) {
          document.getElementById(`node-${r}-${c}`).className = node.isWall ? 'node node-wall' : 'node';
        }
      }
    }
    
    const clearedGrid = grid.map(row => row.map(node => ({
      ...node,
      isVisited: false,
      isShortestPath: false,
      distance: Infinity,
      previousNode: null,
    })));
    setGrid(clearedGrid);
  };

  // Full reset (clears walls, paths, and positions start/end nodes)
  const resetBoard = () => {
    if (isVisualizing) return;
    const defaultStart = { row: 10, col: 15 };
    const defaultEnd = { row: 10, col: 35 };
    setStartNode(defaultStart);
    setEndNode(defaultEnd);
    
    const newGrid = getInitialGrid(defaultStart, defaultEnd);
    setGrid(newGrid);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const isStart = r === defaultStart.row && c === defaultStart.col;
        const isEnd = r === defaultEnd.row && c === defaultEnd.col;
        document.getElementById(`node-${r}-${c}`).className = isStart
          ? 'node node-start'
          : isEnd
          ? 'node node-end'
          : 'node';
      }
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Pathfinding Visualizer</h1>
        <p>Compare how Dijkstra, A*, BFS, and DFS navigate grids and walls. Generate a maze to challenge them!</p>
      </header>

      <Toolbar
        selectedAlgorithm={selectedAlgorithm}
        setSelectedAlgorithm={setSelectedAlgorithm}
        speed={speed}
        setSpeed={setSpeed}
        isVisualizing={isVisualizing}
        onVisualize={handleVisualize}
        onClearBoard={resetBoard}
        onClearPath={clearPathStyles}
        onGenerateMaze={handleGenerateMaze}
      />
      
      <main className="app-content">
        <Grid
          grid={grid}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
          onMouseUp={handleMouseUp}
        />
      </main>
    </div>
  );
}

export default App;
