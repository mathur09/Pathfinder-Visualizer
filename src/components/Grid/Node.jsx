import React from 'react';
import './Node.css';

const Node = ({
  row,
  col,
  isStart,
  isEnd,
  isWall,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  // Determine additional classes based on the node's state
  const extraClassName = isStart
    ? 'node-start'
    : isEnd
    ? 'node-end'
    : isWall
    ? 'node-wall'
    : '';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
};

// React.memo optimizes rendering by preventing re-renders of nodes whose props haven't changed.
// This is critical for keeping grid updates smooth during click-and-drag wall drawing!
export default React.memo(Node);
