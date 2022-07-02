import { useEffect, useState } from "react";

String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}

String.prototype.replaceAt = function(index, replacement) {
    if (index >= this.length) {
        return this.valueOf();
    }
    return this.substring(0, index) + replacement + this.substring(index + 1);
}

/**
 * putMines - Put mines inside the board
 * 
 * @param {object} board: The board dimensions
 * @param {Number} mines: The nmber of mines needed 
 * @returns 
 */
function putMines(board, mines) {
    let game = ""

    for (let i = 0; i < (board.row * board.col); i++) {
        let insert_mines = Math.floor((Math.random() * (2 - 0) + 0));
        
        if(insert_mines && mines > 0)
        {
            game += "*";
            mines--;
        }
        else
            game += " ";
    }
    game = countMines(board, game.shuffle())
    return (game)
    return (game.replaceAll("*", "💣"))
}

/**
 * isValidCoord - check if the given coords is
 * in the board
 * @param {object} coords: the current coord
 * @param {object} limitCoords: the coords that should no be exceed
 * @returns 
 */
function isValidCoord(coords, limitCoords){
    return ((coords.row >= 0 && coords.row < limitCoords.row) &&
    (coords.col >= 0 && coords.col < limitCoords.col))
} 

/**
 * index - retrieve the good index of the coord in
 * the board
 * @param {object} coords: the coord of the current point
 * @param {Number} row: the number of line in the board
 */
function index(coords, row)
{
    return ((coords.row * row) + coords.col)
}

/**
 * 
 * @param {object} board_dimensions: the board dimensions
 * @param {String} board: the board string
 */
function countMines(board_dimensions, board) {
    for (let i = 0; i < board_dimensions.row; i++) {
        for (let j = 0; j < board_dimensions.col; j++) {
            if (board[index({row: i, col: j}, board_dimensions.row)] !== "*") {
                let founded_mines = 0;

                // check if there is a mine in NW -> NORD-WEST
                if (isValidCoord({row: (i - 1), col: (j - 1)}, board_dimensions))
                {
                    if (board[index({row: (i - 1), col: (j - 1)}, board_dimensions.row)] === "*")
                        founded_mines++;
                }
    
                // check if there is a mine in NE -> NORD-EAST
                if (isValidCoord({row: (i - 1), col: (j + 1)}, board_dimensions))
                {
                    if (board[index({row: (i - 1), col: (j + 1)}, board_dimensions.row)] === "*")
                        founded_mines++;
                }
    
                // check if there is a mine in N -> NORD
                if (isValidCoord({row: (i - 1), col: (j)}, board_dimensions))
                {
                    if (board[index({row: (i - 1), col: (j)}, board_dimensions.row)] === "*")
                        founded_mines++;
                }
    
                // check if there is a mine in W -> WEST
                if (isValidCoord({row: (i), col: (j - 1)}, board_dimensions))
                {
                    if (board[index({row: (i), col: (j - 1)}, board_dimensions.row)] === "*")
                        founded_mines++;
                }
    
                // check if there is a mine in E -> EAST
                if (isValidCoord({row: (i), col: (j + 1)}, board_dimensions))
                {
                    if (board[index({row: (i), col: (j + 1)}, board_dimensions.row)] === "*")
                        founded_mines++;
                }
    
                // check if there is a mine in SW -> SUD-WEST
                if (isValidCoord({row: (i + 1), col: (j - 1)}, board_dimensions))
                {
                    if (board[index({row: (i + 1), col: (j - 1)}, board_dimensions.row)] === "*")
                        founded_mines++;
                }
    
                // check if there is a mine in SE -> SUD-EAST
                if (isValidCoord({row: (i + 1), col: (j + 1)}, board_dimensions))
                {
                    if (board[index({row: (i + 1), col: (j + 1)}, board_dimensions.row)] === "*")
                        founded_mines++;
                }
    
                // check if there is a mine in S -> SUD
                if (isValidCoord({row: (i + 1), col: (j)}, board_dimensions))
                {
                    if (board[index({row: (i + 1), col: (j)}, board_dimensions.row)] === "*")
                        founded_mines++;
                }
    
                if (founded_mines > 0)
                {
                    let idx = index({row: i, col: j}, board_dimensions.row)
                    board = board.replaceAt(idx, founded_mines.toString());
                }
            }
        }
    }

    return (board)
}

function GameBoard({ board }) {
    const [game, setGame] = useState("");
    const [user_play, setUserPlay] = useState("");

    useEffect(() => {
        setGame(putMines(board, board.mines));
        setUserPlay(" " * (board.row * board.col))

    },[]);
    
    return (
        <div className="mb-10">
            <div className={`mx-auto w-4/5 justify-center grid grid-cols-${board.col}`}>
                {printBoard(game)}
            </div>
        </div>
    )
}

function printBoard(gameBoard) {
    let buttons = [];

    for (let i = 0; i < gameBoard.length; i++) {
        buttons.push((<button className="h-8 text-sm bg-orange-400 border" key={i}>{gameBoard[i] == "*" ? "💣" : gameBoard[i]}</button>))
    }

    return (buttons)
}

export default GameBoard;