function solveSudoku(algo, board) {
  // Prepare data types for all algorithms based on user choice
  let queue;
  let stack;

  switch (algo) {
    case "BFS":
      queue = [board];
      break;
    case "DFS":
    case "Greedy":
      stack = [board];
      break;
    default:
      throw new Error("Invalid algorithm specified");
  }
  let delay = 10; // Delay time (in milliseconds)

  function solve(currentBoard) {
    let emptyCell = findEmptyCell(currentBoard);

    if (!emptyCell) {
      // Puzzle solved successfully
      updateBoardAI(currentBoard, true);
      printValid();
      return currentBoard;
    }
    if (algo === "BFS" && queue.length === 0) {
      return null; // No solution found (BFS specific)
    }
    let [row, col] = emptyCell;

    if (algo === "Greedy") {
      let nextCell = findNextCellGreedy(currentBoard);
      row = nextCell[0];
      col = nextCell[1];
    }

    for (let num = 1; num <= board.length; num++) {
      if (isValidMove(currentBoard, row, col, num)) {
        let newBoard = copyBoard(currentBoard);
        newBoard[row][col] = num;
        if (algo === "BFS") {
          queue.push(newBoard);
        } else {
          stack.push(newBoard); // For DFS, DLS, and Greedy
        }
      }
    }

    let nextBoard;
    switch (algo) {
      case "BFS":
        nextBoard = queue.shift();
        break;
      case "DFS":
      case "Greedy":
        nextBoard = stack.pop();
        break;
      default:
        throw new Error("Invalid algorithm specified");
    }

    updateBoardAI(currentBoard, true); // Can be called before or after pushing to stack

    return setTimeout(() => solve(nextBoard), delay); // Recursive call with next state and depth for BFS/DFS/DLS/Greedy
  }

  // Start the recursive step with a delay
  return setTimeout(() => solve(board), delay);
}

function findNextCellGreedy(board) {
  // This function should find the empty cell with the fewest possible valid moves.
  // Here's an example implementation:
  let minValidMoves = board.length;
  let minValidCell = null;

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      if (board[row][col] === 0) {
        let validMoves = 0;
        for (let num = 1; num <= board.length; num++) {
          if (isValidMove(board, row, col, num)) {
            validMoves++;
          }
        }
        if (validMoves < minValidMoves) {
          minValidMoves = validMoves;
          minValidCell = [row, col];
        }
      }
    }
  }
  return minValidCell; // Return the cell with the fewest valid moves
}
