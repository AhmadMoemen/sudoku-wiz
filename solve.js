// Function to check if a move is valid in Sudoku
function isValidMove(board, row, col, num) {
  // Check if the number already exists in the current row
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num && i !== col) {
      return false;
    }
  }

  // Check if the number already exists in the current column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num && i !== row) {
      return false;
    }
  }

  // Check if the number already exists in the current 3x3 subgrid
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num && (i !== row || j !== col)) {
        return false;
      }
    }
  }

  return true; // Move is valid
}

// Function to validate the entire Sudoku board
function validateSolution(board) {
  // Check each row, column, and 3x3 subgrid
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const num = board[i][j];
      if (num !== 0 && !isValidMove(board, i, j, num)) {
        return false; // Invalid move found
      }
    }
  }
  return true; // Solution is valid
}

// Function to render Sudoku board on the UI
function renderBoard(board) {
  const sudokuBoard = document.getElementById("sudokuBoard");
  sudokuBoard.innerHTML = ""; // Clear previous board

  for (let row = 0; row < 9; row++) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    for (let col = 0; col < 9; col++) {
      const cellInput = document.createElement("input");
      cellInput.setAttribute("type", "text");
      cellInput.setAttribute("autocomplete", "off");
      cellInput.setAttribute("id", "cell" + row + col);
      cellInput.classList.add("cell");
      cellInput.maxLength = 1;
      cellInput.style.backgroundColor = board[row][col] === 0 ? "#ccc" : "#fff";
      cellInput.value = board[row][col] === 0 ? "" : board[row][col];
      cellInput.addEventListener("input", updateBoard);
      $("input").keydown(function () {
        $(this).val("");
      });
      rowDiv.appendChild(cellInput);
    }

    sudokuBoard.appendChild(rowDiv);
  }
}

// Function to update the Sudoku grid based on user input
function updateBoard(event) {
  const numonly = /^[1-9]$/;
  const cellInput = event.target;
  const cellId = cellInput.id;
  const row = parseInt(cellId.charAt(4));
  const col = parseInt(cellId.charAt(5));
  const value = parseInt(cellInput.value) || 0;
  const prevValue = board[row][col]; // Store the previous value
  if(!numonly.test(cellInput.value)) cellInput.value = "" // input only 1-9
  board[row][col] = value;

  if (!isValidMove(board, row, col, value)) {
    cellInput.classList.add("invalid");
  } else {
    cellInput.classList.remove("invalid");
  }
}

// Function to find an empty cell in the Sudoku board
function findEmptyCell(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return null; // No empty cell found
}
// Function to copy a Sudoku board
function copyBoard(board) {
  return board.map((row) => row.slice());
}
// Function to solve Sudoku puzzle
function solveSudoku(algo, board) {
  // Data types for both BFS, DFS and IDS algorithms
  let queue = [board];
  let stack = [board];

  function stepBFS() {
    if (queue.length === 0) {
      return null; // No solution found
    }

    let current = queue.shift();
    let emptyCell = findEmptyCell(current);

    if (!emptyCell) {
      // Puzzle solved successfully
      renderBoard(current); // Render the solved board
      return current;
    }

    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
      if (isValidMove(current, row, col, num)) {
        let newBoard = copyBoard(current);
        newBoard[row][col] = num;
        queue.push(newBoard);
      }
    }
    renderBoard(current);
    setTimeout(stepBFS, 0.1);
  }

  function stepDFS() {
    if (stack.length === 0) {
      return null;
    }

    let current = stack.pop();
    let emptyCell = findEmptyCell(current);

    if (!emptyCell) {
      // Puzzle solved successfully
      renderBoard(current); // Render the solved board
      return current;
    }

    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
      if (isValidMove(current, row, col, num)) {
        let newBoard = copyBoard(current);
        newBoard[row][col] = num;
        stack.push(newBoard);
      }
    }
    renderBoard(current);
    setTimeout(stepDFS, 0.0001);
  }
  if (algo == 1) {
    stepBFS();
  } else if (algo == 2) {
    stepDFS();
  }
}

// Example Sudoku board
const board = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

renderBoard(board); // Initial rendering of Sudoku board

const btnBFS = document.getElementById("btnBFS");
btnBFS.addEventListener("click", () => {
  const solvedBoard = solveSudoku(1, board);
  renderBoard(solvedBoard);
});

const btnDFS = document.getElementById("btnDFS");
btnDFS.addEventListener("click", () => {
  const solvedBoard = solveSudoku(2, board);
  renderBoard(solvedBoard);
});
