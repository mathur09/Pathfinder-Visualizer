// Performs a Randomized Depth-First Search (Recursive Backtracker) to generate a maze.
// Returns an array of passage nodes in the order they are carved.
// In the visualizer, we will first turn the whole board into walls,
// and then animate "carving out" these passages by removing the walls in order.
export function randomizedDfsMaze(grid, startNode, endNode) {
  const passagesInOrder = [];
  const rows = grid.length;
  const cols = grid[0].length;

  // 1. Create a 2D array to track visited cells for the maze generator
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  // 2. Define a stack for backtracking
  const stack = [];

  // We start carving from a random coordinate (preferably odd row/col to align corridors)
  const startRow = 1;
  const startCol = 1;
  let current = grid[startRow][startCol];
  visited[startRow][startCol] = true;
  passagesInOrder.push(current);
  stack.push(current);

  while (stack.length > 0) {
    const nextNeighbor = getRandomUnvisitedNeighbor2StepsAway(current, grid, visited);

    if (nextNeighbor) {
      // Mark neighbor as visited
      visited[nextNeighbor.row][nextNeighbor.col] = true;
      
      // Get the wall cell directly between the current cell and the neighbor
      const wallRow = current.row + (nextNeighbor.row - current.row) / 2;
      const wallCol = current.col + (nextNeighbor.col - current.col) / 2;
      const wallNode = grid[wallRow][wallCol];
      
      visited[wallRow][wallCol] = true;

      // Add the carved passages to our animation sequence
      passagesInOrder.push(wallNode);
      passagesInOrder.push(nextNeighbor);

      // Backtracking stack
      stack.push(nextNeighbor);
      current = nextNeighbor;
    } else {
      // No unvisited neighbors? Pop from stack to backtrack
      current = stack.pop();
    }
  }

  // Ensure start and end nodes are cleared of walls and included in passages
  const start = grid[startNode.row][startNode.col];
  const end = grid[endNode.row][endNode.col];
  passagesInOrder.unshift(start);
  passagesInOrder.push(end);

  // Clear some random walls near start and end to guarantee they connect to the maze corridors
  connectToMaze(startNode, grid, passagesInOrder);
  connectToMaze(endNode, grid, passagesInOrder);

  return passagesInOrder;
}

// Retrieves a random unvisited neighbor exactly 2 steps away
function getRandomUnvisitedNeighbor2StepsAway(node, grid, visited) {
  const neighbors = [];
  const { row, col } = node;

  // Up 2 steps
  if (row > 1) neighbors.push(grid[row - 2][col]);
  // Down 2 steps
  if (row < grid.length - 2) neighbors.push(grid[row + 2][col]);
  // Left 2 steps
  if (col > 1) neighbors.push(grid[row][col - 2]);
  // Right 2 steps
  if (col < grid[0].length - 2) neighbors.push(grid[row][col + 2]);

  // Filter unvisited neighbors
  const unvisitedNeighbors = neighbors.filter(
    n => !visited[n.row][n.col]
  );

  if (unvisitedNeighbors.length === 0) return null;

  // Pick a random unvisited neighbor
  const randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length);
  return unvisitedNeighbors[randomIndex];
}

// Helper to ensure start/end nodes connect to adjacent passages
function connectToMaze(node, grid, passagesInOrder) {
  const { row, col } = node;
  const directions = [
    { r: -1, c: 0 },
    { r: 1, c: 0 },
    { r: 0, c: -1 },
    { r: 0, c: 1 }
  ];

  for (const dir of directions) {
    const targetRow = row + dir.r;
    const targetCol = col + dir.c;
    
    // If adjacent cell is within bounds, add it to passages to clear any wall blocking start/end
    if (
      targetRow >= 0 &&
      targetRow < grid.length &&
      targetCol >= 0 &&
      targetCol < grid[0].length
    ) {
      const adjacentNode = grid[targetRow][targetCol];
      passagesInOrder.push(adjacentNode);
    }
  }
}
