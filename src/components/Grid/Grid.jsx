import React from 'react';
import Node from './Node';
import './Grid.css';

const Grid = ({
  grid,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  return (
    <div className="grid-outer-wrapper">
      <div className="grid-container" onMouseLeave={onMouseUp}>
        {grid.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="grid-row">
              {row.map((node, nodeIndex) => {
                const { row, col, isStart, isEnd, isWall } = node;
                return (
                  <Node
                    key={nodeIndex}
                    row={row}
                    col={col}
                    isStart={isStart}
                    isEnd={isEnd}
                    isWall={isWall}
                    onMouseDown={onMouseDown}
                    onMouseEnter={onMouseEnter}
                    onMouseUp={onMouseUp}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Grid;
