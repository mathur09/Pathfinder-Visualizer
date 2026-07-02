// Performs Depth-First Search (DFS) on a 2D grid.
// DFS uses a Stack (LIFO: Last-In-First-Out) structure, exploring deep down one path before backtracking.
// DFS is NOT guaranteed to find the shortest path, but it is a classic traversal algorithm.
export function dfs(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const stack = [startNode];

  while (stack.length > 0) {
    const currentNode = stack.pop(); // LIFO: Remove from the back of the stack

    // Skip if it's a wall or already visited
    if (currentNode.isWall || currentNode.isVisited) continue;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    // If we reached the target node, we're done!
    if (currentNode === endNode) return visitedNodesInOrder;

    // Explore neighbors
    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.previousNode = currentNode; // Link for backtracking
        stack.push(neighbor); // Push to the back of the stack
      }
    }
  }

  return visitedNodesInOrder;
}

// Retrieves neighbors (Up, Down, Left, Right)
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  // Ordering of push affects search direction. Standard order: Up, Down, Left, Right.
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter(neighbor => !neighbor.isVisited);
}
