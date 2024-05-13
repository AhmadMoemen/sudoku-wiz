// Function to check if a move is valid in Sudoku
function isValidMove(board, row, col, num) {
  const boardLength = board.length;
  const subgridSize = Math.sqrt(boardLength);
  // Check row and column for duplicates
  for (let i = 0; i < boardLength; i++) {
    if (
      (board[row][i] === num && i !== col) ||
      (board[i][col] === num && i !== row)
    ) {
      return false;
    }
  }

  const startRow = Math.floor(row / subgridSize) * subgridSize;
  const startCol = Math.floor(col / subgridSize) * subgridSize;

  // Check for conflicts in the subgrid
  for (let i = startRow; i < startRow + subgridSize; i++) {
    for (let j = startCol; j < startCol + subgridSize; j++) {
      if (board[i][j] === num && (i !== row || j !== col)) {
        return false;
      }
    }
  }

  return true;
}

// Function to validate the entire Sudoku board
function validateSolution(board) {
  const boardLength = board.length;
  // Check each row, column, and 3x3 subgrid
  for (let i = 0; i < boardLength; i++) {
    for (let j = 0; j < boardLength; j++) {
      const num = board[i][j];
      if (num !== 0 && !isValidMove(board, i, j, num)) {
        return false; // Invalid move found
      }
    }
  }
  return true; // Solution is valid
}

// Tell the user that the solution is valid and puzzle solved.
function printValid() {
  console.log("printing");
  if (validateSolution) {
    document.getElementById("status").innerText = "Solution is valid.";
  }
}

// Function to render Sudoku board on the UI
function renderBoard(board) {
  const boardLength = board.length;
  const sudokuBoard = document.getElementById("sudokuBoard");
  sudokuBoard.innerHTML = ""; // Clear previous board

  for (let row = 0; row < boardLength; row++) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    for (let col = 0; col < boardLength; col++) {
      const cellInput = document.createElement("input");
      cellInput.setAttribute("type", "text");
      cellInput.setAttribute("autocomplete", "off");
      cellInput.setAttribute("id", "cell" + row + col);
      cellInput.classList.add("cell");
      cellInput.setAttribute("maxlength", "1"); // Only one number is entered
      if (board[row][col] === 0) {
        cellInput.style.backgroundColor = "#fff";
      } else {
        cellInput.style.backgroundColor = "#ccc";
      }

      // Convert array zeros to blank cells and disable preexisting board numbers
      if (board[row][col] === 0) {
        cellInput.value = "";
      } else {
        cellInput.value = board[row][col];
        cellInput.setAttribute("disabled", true);
      }

      cellInput.addEventListener("input", handleUserInput);
      // Switch numbers when user presses on another number immediately.
      document.querySelectorAll("input").forEach(function (input) {
        input.addEventListener("keydown", function (event) {
          // Check if the pressed key is not an arrow key
          this.value = ""; // Clear the input value
        });
      });

      rowDiv.appendChild(cellInput);
    }

    sudokuBoard.append(rowDiv);
  }
}

// Handle user input everytime he enters a value
function handleUserInput(event) {
  const cellInput = event.target;
  const cellId = cellInput.id;
  const row = parseInt(cellId.charAt(4));
  const col = parseInt(cellId.charAt(5));
  update(cellInput, board, row, col);
  // Regex for input validation (1-9)
  const numOnly = /^[1-9]$/;
  if (!numOnly.test(cellInput.value)) cellInput.value = "";
}

// Update the board recursively to solve using an algorithm
function updateBoardAI(board, isAIUpdate = true) {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      const cellInput = document.getElementById("cell" + row + col);
      update(cellInput, board, row, col, isAIUpdate); // Pass cellInput and other arguments
    }
  }
}

function update(cellInput, board, row, col, isAIUpdate = false) {
  const value = parseInt(cellInput.value) || 0;
  // Convert array zeros to blank cells and disable preexisting board numbers
  if (isAIUpdate) {
    if (board[row][col] === 0) {
      cellInput.value = "";
    } else {
      // Insert values in AI update function
      cellInput.value = board[row][col];
      cellInput.setAttribute("disabled", true);
    }
  } else {
    // Insert values in user input event
    board[row][col] = value;

    // Validate if solution completed in
    let emptyCell = findEmptyCell(board);
    if (!emptyCell) {
      // Puzzle solved successfully
      updateBoardAI(board, true);
      printValid();
      return board;
    } else {
      document.getElementById("status").innerText = "";
    }
  }
  if (!isValidMove(board, row, col, value)) {
    cellInput.classList.add("invalid");
  } else {
    cellInput.classList.remove("invalid");
  }
}

// Function to find an empty cell in the Sudoku board
function findEmptyCell(board) {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
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
  const solvedBoard = solveSudoku("BFS", board);
  updateBoardAI(solvedBoard, true);
});

const btnDFS = document.getElementById("btnDFS");
btnDFS.addEventListener("click", () => {
  const solvedBoard = solveSudoku("DFS", board);
  updateBoardAI(solvedBoard, true);
});

const btnDLS = document.getElementById("btnIDS");
btnDLS.addEventListener("click", () => {
  const solvedBoard = solveSudoku("IDS", board);
  updateBoardAI(solvedBoard, true);
});

const btnGreedy = document.getElementById("btnGreedy");
btnGreedy.addEventListener("click", () => {
  const solvedBoard = solveSudoku("Greedy", board);
  updateBoardAI(solvedBoard, true);
});
