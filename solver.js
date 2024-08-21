document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('sudoku-grid');
    for (let row = 0; row < 9; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < 9; col++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 0;
            input.max = 9;
            input.value = 0;
            td.appendChild(input);
            tr.appendChild(td);
        }
        grid.appendChild(tr);
    }
});

function getGrid() {
    const grid = [];
    const rows = document.querySelectorAll('#sudoku-grid tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('input');
        const rowValues = [];
        cells.forEach(cell => {
            rowValues.push(parseInt(cell.value) || 0);
        });
        grid.push(rowValues);
    });
    return grid;
}

function setGrid(grid) {
    const rows = document.querySelectorAll('#sudoku-grid tr');
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('input');
        cells.forEach((cell, colIndex) => {
            cell.value = grid[rowIndex][colIndex];
        });
    });
}

function isSafe(grid, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num || grid[x][col] === num ||
            grid[Math.floor(row / 3) * 3 + Math.floor(x / 3)][Math.floor(col / 3) * 3 + x % 3] === num) {
            return false;
        }
    }
    return true;
}

function isValidGrid(grid) {
    for (let row = 0; row < 9; row++) {
        const rowSet = new Set();
        const colSet = new Set();
        const boxSet = new Set();
        for (let col = 0; col < 9; col++) {
            const rowValue = grid[row][col];
            const colValue = grid[col][row];
            const boxValue = grid[Math.floor(row / 3) * 3 + Math.floor(col / 3)][(row % 3) * 3 + (col % 3)];

            // Check if values are out of range or negative
            if (rowValue < 0 || rowValue > 9 || rowSet.has(rowValue)) return false;
            if (colValue < 0 || colValue > 9 || colSet.has(colValue)) return false;
            if (boxValue < 0 || boxValue > 9 || boxSet.has(boxValue)) return false;

            rowSet.add(rowValue);
            colSet.add(colValue);
            boxSet.add(boxValue);
        }
    }
    return true;
}

function solveSudokuUtil(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isSafe(grid, row, col, num)) {
                        grid[row][col] = num;
                        if (solveSudokuUtil(grid)) {
                            return true;
                        }
                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function solveSudoku() {
    const grid = getGrid();
    const message = document.getElementById('message');
    const solveButton = document.getElementById('solve-button');
    
    if (!isValidGrid(grid)) {
        message.textContent = 'Invalid input!';
        message.style.color = 'red';
        solveButton.style.display = 'none'; // Hide the button if input is invalid
        return;
    }
    
    if (solveSudokuUtil(grid)) {
        setGrid(grid);
        message.textContent = 'Solved!';
        message.style.color = 'green';
    } else {
        message.textContent = 'No solution possible!';
        message.style.color = 'red';
    }
}
