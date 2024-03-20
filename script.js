/*----- constants -----*/
const COLOR_LOOKUP = {
    "1": "purple",
    "-1": "orange",
    "null": "white"
};

/*----- state variables -----*/
let board;
let winner;
let turn;

/*----- cached elements  -----*/
const messageEl = document.querySelector("h1");
const playAgainBtn = document.querySelector("button");
const markerEls = Array.from(document.querySelectorAll("#markers > div"));
// const markerEls = [...document.querySelectorAll("#markers > div")]; 
// ^ this is a newer syntax feature

/*----- event listeners -----*/
playAgainBtn.addEventListener("click", init);
document.getElementById("markers").addEventListener("click", handleDrop);
/*----- functions -----*/
init();

function init() {
    board = [
        [null, null, null, null, null, null], // col 0
        [null, null, null, null, null, null], // col 1
        [null, null, null, null, null, null], // col 2
        [null, null, null, null, null, null], // col 3
        [null, null, null, null, null, null], // col 4
        [null, null, null, null, null, null], // col 5
        [null, null, null, null, null, null], // col 6
    ];

    winner = null; // null represents no winner no tie; game in progress.
    turn = 1; // Purple or "Player 1" will be the first player to go

    render(); // transfer the intial state to the DOM
}

function handleDrop(evt) {
    // find the column index that each clicked marker pertains to
    // we have a list of marker elements in a nodelist named markerEls
    // each of those marker elements contains a index position
    // we can use those position values to determine which column array
    // to add a 1 or -1 to
    const colIdx = markerEls.indexOf(evt.target);
    if (colIdx === -1) return;
    const colArr = board[colIdx];
    const rowIdx = colArr.indexOf(null); // find first available position
    colArr[rowIdx] = turn; // add 1 or -1 to row cell
    // check if winning move
    winner = checkWinner(colIdx, rowIdx);
    turn *= -1; // toggle to other player's turn
    render();
}

function checkWinner(colIdx, rowIdx) {
    // check four in a row vertical
    return checkVerticalWin(colIdx, rowIdx) ||
        checkNeSwWin(colIdx, rowIdx) ||
        checkNwSeWin(colIdx, rowIdx) ||
        checkHorizontalWin(colIdx, rowIdx);
    // check four in a row diagonal NE SW (up to the right - down to the left)
    // check four in a row diagonal NW SE (up to the left - down to the right)
    // check four in a row horizontal
}

function checkNwSeWin(colIdx, rowIdx) {
    // 1) check NW
    const adjCountNW = checkAdjacent(colIdx, rowIdx, -1, 1);
    // 2) check SE
    const adjCountSE = checkAdjacent(colIdx, rowIdx, 1, -1);
    // 3) add count from NW + SE and if value >= 3, we have a winner winner chicken dinner
    return adjCountNW + adjCountSE >= 3 ? board[colIdx][rowIdx] : null;
}

function checkNeSwWin(colIdx, rowIdx) {
    // 1) check NE
    const adjCountNE = checkAdjacent(colIdx, rowIdx, 1, 1);
    // 2) check SW
    const adjCountSW = checkAdjacent(colIdx, rowIdx, -1, -1);
    // 3) add count from NE + SW and if value >= 3, we have a winner winner chicken dinner
    return adjCountNE + adjCountSW >= 3 ? board[colIdx][rowIdx] : null;
}


function checkHorizontalWin(colIdx, rowIdx) {
    const adjCountRight = checkAdjacent(colIdx, rowIdx, 1, 0)
    const adjCountLeft = checkAdjacent(colIdx, rowIdx, -1, 0)
    return adjCountRight + adjCountLeft >= 3 ? board[colIdx][rowIdx] : null;
}

function checkVerticalWin(colIdx, rowIdx) {
    const adjCount = checkAdjacent(colIdx, rowIdx, 0, -1)
    return adjCount === 3 ? board[colIdx][rowIdx] : null;
}

function checkAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
    let count = 0;
    const playerValue = board[colIdx][rowIdx];

    // perform the offset to begin checking adjacent cells
    colIdx += colOffset;
    rowIdx += rowOffset;

    while (board[colIdx] && board[colIdx][rowIdx] === playerValue) {
        count++;
        colIdx += colOffset
        rowIdx += rowOffset
    }
    return count;
}

function render() {
    renderBoard(); // transfer state "data" from the board 2d array to the brower's dom
    renderMessage(); // display who's turn or who won based on turn or winner state
    renderControls(); // show/hide game controls based on win state
}

function renderControls() {
    playAgainBtn.style.visibility = winner ? "visible" : "hidden";
    markerEls.forEach(function (markerEl, idx) {
        const hideMarker = !board[idx].includes(null) || winner
        markerEl.style.visibility = hideMarker ? "hidden" : "visible"
    });
}

function renderMessage() {
    if (winner === "T") {
        // Display tie game!
        messageEl.innerText = "Tie Game!";
    } else if (winner) {
        // Display who won
        messageEl.innerHTML = `<span style="color: ${COLOR_LOOKUP[winner]}">${COLOR_LOOKUP[winner]}</span> Wins!`;
    } else {
        // Display the turn
        messageEl.innerHTML = `<span style="color: ${COLOR_LOOKUP[turn]}">${COLOR_LOOKUP[turn]}'s</span> Turn`;
    }
}

function renderBoard() {
    // loop over the board array
    board.forEach(function (colArray, colIdx) {
        // for each column array inside the board array
        colArray.forEach(function (cellValue, rowIdx) {
            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            // we'll evalute each cell value and use that value to set the background color
            // of the each corresponding cell div in the dom
            cellEl.style.backgroundColor = COLOR_LOOKUP[cellValue];
        });
    });
}