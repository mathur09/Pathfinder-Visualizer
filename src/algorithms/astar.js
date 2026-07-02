// Performs A* (A-Star) search algorithm on a 2D grid.
// A* is an informed search algorithm that uses heuristics to guide the search path.
// It calculates f = g + h, where:
// g is the actual distance from start node.
// h is the estimated Manhattan distance to the end node.
export function astar(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  
  // Set start node metrics
  startNode.distance = 0; // g score
  startNode.h = getManhattanDistance(startNode, endNode);
  startNode.f = startNode.h;

  const openSet = [startNode]; // Set of nodes to be evaluated

  while (openSet.length > 0) {
    // Sort openSet by f score. Tie breaker: if f scores are equal, pick the one with lower h score.
    // This tie-breaker guides the pathfinder to stay on a straight line toward the end node.
    sortNodesByFScore(openSet);

    const closestNode = openSet.shift(); // Remove the node with the lowest f score

    if (closestNode.isWall) continue;
    
    // If the lowest f score is Infinity, no path exists
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // If we reached the target node, we are done!
    if (closestNode === endNode) return visitedNodesInOrder;

    // Explore neighbors
    const neighbors = getUnvisitedNeighbors(closestNode, grid);
    for (const neighbor of neighbors) {
      if (neighbor.isWall || neighbor.isVisited) continue;

      const tentativeGScore = closestNode.distance + 1; // Unweighted step has a cost of 1

      if (tentativeGScore < neighbor.distance) {
        neighbor.previousNode = closestNode;
        neighbor.distance = tentativeGScore; // g score
        neighbor.h = getManhattanDistance(neighbor, endNode); // h score
        neighbor.f = neighbor.distance + neighbor.h; // f score

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return visitedNodesInOrder;
}

// Sorts nodes by f score. If equal, sorts by h score.
function sortNodesByFScore(openSet) {
  openSet.sort((nodeA, nodeB) => {
    if (nodeA.f === nodeB.f) {
      return nodeA.h - nodeB.h;
    }
    return nodeA.f - nodeB.f;
  });
}

// Calculates Manhattan Distance (sum of absolute differences in row and col coords)
function getManhattanDistance(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

// Retrieves neighbors (Up, Down, Left, Right)
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
}
