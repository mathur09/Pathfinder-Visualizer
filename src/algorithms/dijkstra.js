// Performs Dijkstra's algorithm on a 2D grid.
// Returns all nodes in the order they were visited, which allows us to animate the search.
// Also mutates the grid nodes to calculate distances and set previousNode pointers.
export function dijkstra(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  
  // Flatten the 2D grid into a 1D array of all nodes to act as our unvisited set.
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length > 0) {
    // Sort unvisited nodes by distance so we can always pick the closest one (Greedy search).
    // Note: A Min-Heap/Priority Queue would optimize this sorting step from O(V log V) to O(log V),
    // but for our 20x50 grid (1,000 nodes), a simple array sort is extremely fast (~2ms) and clean.
    sortNodesByDistance(unvisitedNodes);
    
    const closestNode = unvisitedNodes.shift(); // Remove the closest node from the unvisited set

    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;

    // If the closest node has a distance of Infinity, we are trapped (no reachable path exists).
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // If we reached the target node, we are done!
    if (closestNode === endNode) return visitedNodesInOrder;

    // Otherwise, explore neighbors of the closest node
    updateUnvisitedNeighbors(closestNode, grid);
  }

  return visitedNodesInOrder;
}

// Sorts nodes in place by distance.
function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

// Updates the distance and back-pointers of adjacent unvisited nodes.
function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1; // Unweighted step has a cost of 1
    neighbor.previousNode = node; // Link for backtracking
  }
}

// Retrieves the 4 adjacent nodes (Up, Down, Left, Right) with boundary safety checks.
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  // Check Up
  if (row > 0) neighbors.push(grid[row - 1][col]);
  // Check Down
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  // Check Left
  if (col > 0) neighbors.push(grid[row][col - 1]);
  // Check Right
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  // Filter out neighbors that are already visited or are walls
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

// Helper to flatten 2D grid array into a 1D array of nodes
function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the endNode to find the shortest path.
// Only call this AFTER dijkstra has completed.
export function getNodesInShortestPathOrder(endNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = endNode;
  
  // Backtrack from target node back to start node using previousNode references
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  
  // If the first node is not start, it means there is no path (disconnected graph)
  return nodesInShortestPathOrder;
}
