import { useEffect, useState } from "react";

// eslint-disable-next-line
String.prototype.shuffle = function () {
    var a = this.split(''),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join('');
}

// eslint-disable-next-line
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
 * 
 * @returns {String} the board with mines inside
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
    // return (game.replaceAll("*", "💣"))
}

/**
 * isValidCoord - check if the given coords is
 * in the board
 * @param {object} coords: the current coord
 * @param {object} limitCoords: the coords that should no be exceed
 * 
 * @returns {Boolean} true on success, false on fail
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
 * 
 * @returns {Number} the corrresponding index in the string
 */
function index(coords, row)
{
    return ((coords.row * row) + coords.col)
}

/**
 * getCoords - retrieve array coords
 * 
 * @param {Number} index: the crrent index in board
 * @param {*} coords: the board dimensions
 * 
 * @returns {Object} the coord of the given index
 */
function getCoords(index, coords)
{
    let col = index % coords.col;
    return {
        row: Math.floor((index - col) / coords.row),
        col: col
    }
}

/**
 * 
 * @param {object} board_dimensions: the board dimensions
 * @param {String} board: the board string
 * 
 * @returns {Number} the number of mines found
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
    // const [game_lost, setGameLost] = useState(false)
    // const [game_win, setGameWin] = useState(false)

    useEffect(() => {
        setGame(putMines(board, board.mines));

        setUserPlay("-".repeat(board.row * board.col))

    },[board]);

    const revealAllMines = () => {
        let new_user_play = user_play
        for (let i = 0; i < game.length; i++) {
            if (game[i] === "*")
                new_user_play = new_user_play.replaceAt(i, game[i])
        }
        return (new_user_play)
    }

    const revealEmptyCaseArea = (id, user_game) => {
        if (game[id] === " " && user_play[id] === "-")
        {
            let i = getCoords(id, board).row;
            let j = getCoords(id, board).col;

            // check if there is a mine in NW -> NORD-WEST
            if (isValidCoord({row: (i - 1), col: (j - 1)}, board))
            {
                let idx = index({row: (i - 1), col: (j - 1)}, board.row)
                if (game[idx] !== "*")
                    user_game = user_game.replaceAt(idx, game[idx]);
            }

            // check if there is a mine in NE -> NORD-EAST
            if (isValidCoord({row: (i - 1), col: (j + 1)}, board))
            {
                let idx = index({row: (i - 1), col: (j + 1)}, board.row)
                if (game[idx] !== "*")
                    user_game = user_game.replaceAt(idx, game[idx]);
            }

            // check if there is a mine in N -> NORD
            if (isValidCoord({row: (i - 1), col: (j)}, board))
            {
                let idx = index({row: (i - 1), col: (j)}, board.row)
                if (game[idx] !== "*")
                    user_game = user_game.replaceAt(idx, game[idx]);
            }

            // // check if there is a mine in W -> WEST
            if (isValidCoord({row: (i), col: (j - 1)}, board))
            {
                let idx = index({row: (i), col: (j - 1)}, board.row)
                if (game[idx] !== "*")
                    user_game = user_game.replaceAt(idx, game[idx]);
            }

            // check if there is a mine in E -> EAST
            if (isValidCoord({row: (i), col: (j + 1)}, board))
            {
                let idx = index({row: (i), col: (j + 1)}, board.row)
                if (game[idx] !== "*")
                    user_game = user_game.replaceAt(idx, game[idx]);
            }

            // check if there is a mine in SW -> SUD-WEST
            if (isValidCoord({row: (i + 1), col: (j - 1)}, board))
            {
                let idx = index({row: (i + 1), col: (j - 1)}, board.row)
                if (game[idx] !== "*")
                    user_game = user_game.replaceAt(idx, game[idx]);
            }

            // check if there is a mine in SE -> SUD-EAST
            if (isValidCoord({row: (i + 1), col: (j + 1)}, board))
            {
                let idx = index({row: (i + 1), col: (j + 1)}, board.row)
                if (game[idx] !== "*")
                    user_game = user_game.replaceAt(idx, game[idx]);
            }

            // check if there is a mine in S -> SUD
            if (isValidCoord({row: (i + 1), col: (j)}, board))
            {
                let idx = index({row: (i + 1), col: (j)}, board.row)
                if (game[idx] !== "*")
                    user_game = user_game.replaceAt(idx, game[idx]);
            }
        }

        return (user_game)
    }

    const reveal = (id, user_game) => {
        if (game[id] === "*")
        {
            // alert('perdu')
            return revealAllMines()
        }

        user_game = user_game.replaceAt(id, game[id])
        if (game[id] === " " && user_play[id] === "-")
        {
            let i = getCoords(id, board).row;
            let j = getCoords(id, board).col;

            // check if there is a mine in NW -> NORD-WEST
            if (isValidCoord({row: (i - 1), col: (j - 1)}, board))
            {
                let idx = index({row: (i - 1), col: (j - 1)}, board.row)
                if (game[idx] !== "*")
                    {
                        // setUserPlay(user_play.replaceAt(idx, game[idx]))
                        if (game[idx] === " ")
                            user_game = revealEmptyCaseArea(idx, user_game);
                        user_game = user_game.replaceAt(idx, game[idx]);
                    }
            }

            // check if there is a mine in NE -> NORD-EAST
            if (isValidCoord({row: (i - 1), col: (j + 1)}, board))
            {
                let idx = index({row: (i - 1), col: (j + 1)}, board.row)
                if (game[idx] !== "*")
                   {
                        // setUserPlay(user_play.replaceAt(idx, game[idx]))
                        if (game[idx] === " ")
                            user_game = revealEmptyCaseArea(idx, user_game);
                        user_game = user_game.replaceAt(idx, game[idx]);
                   }
            }

            // check if there is a mine in N -> NORD
            if (isValidCoord({row: (i - 1), col: (j)}, board))
            {
                let idx = index({row: (i - 1), col: (j)}, board.row)
                if (game[idx] !== "*")
                   {
                        // setUserPlay(user_play.replaceAt(idx, game[idx]))
                        if (game[idx] === " ")
                            user_game = revealEmptyCaseArea(idx, user_game);
                        user_game = user_game.replaceAt(idx, game[idx]);
                   }
            }

            // // check if there is a mine in W -> WEST
            if (isValidCoord({row: (i), col: (j - 1)}, board))
            {
                let idx = index({row: (i), col: (j - 1)}, board.row)
                if (game[idx] !== "*")
                   {
                        // setUserPlay(user_play.replaceAt(idx, game[idx]))
                        if (game[idx] === " ")
                            user_game = revealEmptyCaseArea(idx, user_game);
                        user_game = user_game.replaceAt(idx, game[idx]);
                   }
            }

            // check if there is a mine in E -> EAST
            if (isValidCoord({row: (i), col: (j + 1)}, board))
            {
                let idx = index({row: (i), col: (j + 1)}, board.row)
                if (game[idx] !== "*")
                   {
                        // setUserPlay(user_play.replaceAt(idx, game[idx]))
                        if (game[idx] === " ")
                            user_game = revealEmptyCaseArea(idx, user_game);
                        user_game = user_game.replaceAt(idx, game[idx]);
                   }
            }

            // check if there is a mine in SW -> SUD-WEST
            if (isValidCoord({row: (i + 1), col: (j - 1)}, board))
            {
                let idx = index({row: (i + 1), col: (j - 1)}, board.row)
                if (game[idx] !== "*")
                   {
                        // setUserPlay(user_play.replaceAt(idx, game[idx]))
                        if (game[idx] === " ")
                            user_game = revealEmptyCaseArea(idx, user_game);
                        user_game = user_game.replaceAt(idx, game[idx]);
                   }
            }

            // check if there is a mine in SE -> SUD-EAST
            if (isValidCoord({row: (i + 1), col: (j + 1)}, board))
            {
                let idx = index({row: (i + 1), col: (j + 1)}, board.row)
                if (game[idx] !== "*")
                   {
                        // setUserPlay(user_play.replaceAt(idx, game[idx]))
                        if (game[idx] === " ")
                            user_game = revealEmptyCaseArea(idx, user_game);
                        user_game = user_game.replaceAt(idx, game[idx]);
                   }
            }

            // check if there is a mine in S -> SUD
            if (isValidCoord({row: (i + 1), col: (j)}, board))
            {
                let idx = index({row: (i + 1), col: (j)}, board.row)
                if (game[idx] !== "*")
                   {
                        // setUserPlay(user_play.replaceAt(idx, game[idx]))
                        if (game[idx] === " ")
                            user_game = revealEmptyCaseArea(idx, user_game);
                        user_game = user_game.replaceAt(idx, game[idx]);
                   }
            }
        }

        return (user_game)
    }

    const handleBoardClick = (id) => {
        setUserPlay(reveal(id, user_play))
    }

    const display_board = () => {
        let buttons = [];
    
        for (let i = 0; i < game.length; i++) {
            if(user_play[i] === "-")
                buttons.push((<button onClick={() => handleBoardClick(i)} className="text-md sm:text-xl bg-gradient-to-r from-orange-600 to-orange-500 rounded-sm" key={i}>{game[i] === "*" ? "💣" : game[i]}</button>))
            else
                buttons.push((<div className={`text-md sm:text-xl ${game[i] === "*" ? "bg-red-400" : 'bg-white'} rounded-sm border border-blue-400`} key={i}>{game[i] === "*" ? "💣" : game[i]}</div>))
        }
    
        return (buttons)
    }
    
    return (
        <div className="mb-10">
            <div className={`mx-auto board-${board.col} border border-blue-400 grid grid-${board.col}`}>
                {display_board()}
            </div>
        </div>
    )
}

export default GameBoard;