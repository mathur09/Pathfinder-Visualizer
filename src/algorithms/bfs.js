// Performs Breadth-First Search (BFS) on a 2D grid.
// BFS uses a Queue (FIFO: First-In-First-Out) structure, exploring neighbors level by level.
// This guarantees the shortest path on an unweighted grid.
export function bfs(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const queue = [startNode];
  startNode.isVisited = true;

  while (queue.length > 0) {
    const currentNode = queue.shift(); // FIFO: Remove from the front of the queue
    visitedNodesInOrder.push(currentNode);

    // If we reached the target node, we're done!
    if (currentNode === endNode) return visitedNodesInOrder;

    // Explore neighbors
    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isWall && !neighbor.isVisited) {
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode; // Link for backtracking
        queue.push(neighbor); // Add to the back of the queue
      }
    }
  }

  return visitedNodesInOrder;
}

// Retrieves neighbors (Up, Down, Left, Right)
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter(neighbor => !neighbor.isVisited);
}
