import { useEffect, useState } from "react";

// eslint-disable-next-line
String.prototype.shuffle = function () {
    var a = this.split(''),
        n = a.length;

    for (var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join('');
}

// eslint-disable-next-line
String.prototype.replaceAt = function (index, replacement) {
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

        if (insert_mines && mines > 0) {
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
function isValidCoord(coords, limitCoords) {
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
function index(coords, row) {
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
function getCoords(index, coords) {
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
            if (board[index({ row: i, col: j }, board_dimensions.row)] !== "*") {
                let founded_mines = 0;

                // check if there is a mine in NW -> NORD-WEST
                if (isValidCoord({ row: (i - 1), col: (j - 1) }, board_dimensions)) {
                    if (board[index({ row: (i - 1), col: (j - 1) }, board_dimensions.row)] === "*")
                        founded_mines++;
                }

                // check if there is a mine in NE -> NORD-EAST
                if (isValidCoord({ row: (i - 1), col: (j + 1) }, board_dimensions)) {
                    if (board[index({ row: (i - 1), col: (j + 1) }, board_dimensions.row)] === "*")
                        founded_mines++;
                }

                // check if there is a mine in N -> NORD
                if (isValidCoord({ row: (i - 1), col: (j) }, board_dimensions)) {
                    if (board[index({ row: (i - 1), col: (j) }, board_dimensions.row)] === "*")
                        founded_mines++;
                }

                // check if there is a mine in W -> WEST
                if (isValidCoord({ row: (i), col: (j - 1) }, board_dimensions)) {
                    if (board[index({ row: (i), col: (j - 1) }, board_dimensions.row)] === "*")
                        founded_mines++;
                }

                // check if there is a mine in E -> EAST
                if (isValidCoord({ row: (i), col: (j + 1) }, board_dimensions)) {
                    if (board[index({ row: (i), col: (j + 1) }, board_dimensions.row)] === "*")
                        founded_mines++;
                }

                // check if there is a mine in SW -> SUD-WEST
                if (isValidCoord({ row: (i + 1), col: (j - 1) }, board_dimensions)) {
                    if (board[index({ row: (i + 1), col: (j - 1) }, board_dimensions.row)] === "*")
                        founded_mines++;
                }

                // check if there is a mine in SE -> SUD-EAST
                if (isValidCoord({ row: (i + 1), col: (j + 1) }, board_dimensions)) {
                    if (board[index({ row: (i + 1), col: (j + 1) }, board_dimensions.row)] === "*")
                        founded_mines++;
                }

                // check if there is a mine in S -> SUD
                if (isValidCoord({ row: (i + 1), col: (j) }, board_dimensions)) {
                    if (board[index({ row: (i + 1), col: (j) }, board_dimensions.row)] === "*")
                        founded_mines++;
                }

                if (founded_mines > 0) {
                    let idx = index({ row: i, col: j }, board_dimensions.row)
                    board = board.replaceAt(idx, founded_mines.toString());
                }
            }
        }
    }

    return (board)
}


function GameBoard({ board, startOver }) {
    const [game, setGame] = useState("");
    const [user_play, setUserPlay] = useState("");
    const [timer, setTimer] = useState(0)
    const [game_start, setGameStart] = useState(false)
    const [game_pause, setGamePause] = useState(false)
    const [last_play, setLastPlay] = useState(null)
    const [game_lost, setGameLost] = useState(false)
    const [game_win, setGameWin] = useState(false)

    useEffect(() => {
        setGame(putMines(board, board.mines));

        setUserPlay("-".repeat(board.row * board.col))

    }, [board]);

    const revealAllMines = () => {
        let new_user_play = user_play
        for (let i = 0; i < game.length; i++) {
            if (game[i] === "*")
                new_user_play = new_user_play.replaceAt(i, game[i])
        }
        return (new_user_play)
    }

    const revealEmptyCaseArea = (id, user_game) => {
        if (game[id] === " ") {
            let i = getCoords(id, board).row;
            let j = getCoords(id, board).col;

            // check if there is a mine in NW -> NORD-WEST
            if (isValidCoord({ row: (i - 1), col: (j - 1) }, board)) {
                let idx = index({ row: (i - 1), col: (j - 1) }, board.row)
                if (game[idx] !== "*")
                    user_game = user_game.replaceAt(idx, game[idx]);
            }

            // check if there is a mine in NE -> NORD-EAST
            if (isValidCoord({ row: (i - 1), col: (j + 1) }, board)) {
                let idx = index({ row: (i - 1), col: (j + 1) }, board.row)
                if (game[idx] !== "*")
                    user_game = user_game.replaceAt(idx, game[idx]);
            }

            // check if there is a mine in N -> NORD
            if (isValidCoord({ row: (i - 1), col: (j) }, board)) {
                let idx = index({ row: (i - 1), col: (j) }, board.row)
                if (game[idx] !== "*")
                    user_game = user_game.replaceAt(idx, game[idx]);
            }

            // // check if there is a mine in W -> WEST
            if (isValidCoord({ row: (i), col: (j - 1) }, board)) {
                let idx = index({ row: (i), col: (j - 1) }, board.row)
                if (game[idx] !== "*")
                    user_game = user_game.replaceAt(idx, game[idx]);
            }

            // check if there is a mine in E -> EAST
            if (isValidCoord({ row: (i), col: (j + 1) }, board)) {
                let idx = index({ row: (i), col: (j + 1) }, board.row)
                if (game[idx] !== "*")
                    user_game = user_game.replaceAt(idx, game[idx]);
            }

            // check if there is a mine in SW -> SUD-WEST
            if (isValidCoord({ row: (i + 1), col: (j - 1) }, board)) {
                let idx = index({ row: (i + 1), col: (j - 1) }, board.row)
                if (game[idx] !== "*")
                    user_game = user_game.replaceAt(idx, game[idx]);
            }

            // check if there is a mine in SE -> SUD-EAST
            if (isValidCoord({ row: (i + 1), col: (j + 1) }, board)) {
                let idx = index({ row: (i + 1), col: (j + 1) }, board.row)
                if (game[idx] !== "*")
                    user_game = user_game.replaceAt(idx, game[idx]);
            }

            // check if there is a mine in S -> SUD
            if (isValidCoord({ row: (i + 1), col: (j) }, board)) {
                let idx = index({ row: (i + 1), col: (j) }, board.row)
                if (game[idx] !== "*")
                    user_game = user_game.replaceAt(idx, game[idx]);
            }
        }

        return (user_game)
    }

    const reveal = (id, user_game) => {
        if (game[id] === "*") {
            // alert('perdu')
            setGameLost(true)
            return revealAllMines()
        }

        user_game = user_game.replaceAt(id, game[id])
        if (game[id] === " " && user_play[id] === "-") {
            let i = getCoords(id, board).row;
            let j = getCoords(id, board).col;

            // check if there is a mine in NW -> NORD-WEST
            if (isValidCoord({ row: (i - 1), col: (j - 1) }, board)) {
                let idx = index({ row: (i - 1), col: (j - 1) }, board.row)
                if (game[idx] !== "*") {
                    if (game[idx] === " ")
                        user_game = revealEmptyCaseArea(idx, user_game);
                    user_game = user_game.replaceAt(idx, game[idx]);
                }
            }

            // check if there is a mine in NE -> NORD-EAST
            if (isValidCoord({ row: (i - 1), col: (j + 1) }, board)) {
                let idx = index({ row: (i - 1), col: (j + 1) }, board.row)
                if (game[idx] !== "*") {
                    if (game[idx] === " ")
                        user_game = revealEmptyCaseArea(idx, user_game);
                    user_game = user_game.replaceAt(idx, game[idx]);
                }
            }

            // check if there is a mine in N -> NORD
            if (isValidCoord({ row: (i - 1), col: (j) }, board)) {
                let idx = index({ row: (i - 1), col: (j) }, board.row)
                if (game[idx] !== "*") {
                    if (game[idx] === " ")
                        user_game = revealEmptyCaseArea(idx, user_game);
                    user_game = user_game.replaceAt(idx, game[idx]);
                }
            }

            // // check if there is a mine in W -> WEST
            if (isValidCoord({ row: (i), col: (j - 1) }, board)) {
                let idx = index({ row: (i), col: (j - 1) }, board.row)
                if (game[idx] !== "*") {
                    if (game[idx] === " ")
                        user_game = revealEmptyCaseArea(idx, user_game);
                    user_game = user_game.replaceAt(idx, game[idx]);
                }
            }

            // check if there is a mine in E -> EAST
            if (isValidCoord({ row: (i), col: (j + 1) }, board)) {
                let idx = index({ row: (i), col: (j + 1) }, board.row)
                if (game[idx] !== "*") {
                    if (game[idx] === " ")
                        user_game = revealEmptyCaseArea(idx, user_game);
                    user_game = user_game.replaceAt(idx, game[idx]);
                }
            }

            // check if there is a mine in SW -> SUD-WEST
            if (isValidCoord({ row: (i + 1), col: (j - 1) }, board)) {
                let idx = index({ row: (i + 1), col: (j - 1) }, board.row)
                if (game[idx] !== "*") {
                    if (game[idx] === " ")
                        user_game = revealEmptyCaseArea(idx, user_game);
                    user_game = user_game.replaceAt(idx, game[idx]);
                }
            }

            // check if there is a mine in SE -> SUD-EAST
            if (isValidCoord({ row: (i + 1), col: (j + 1) }, board)) {
                let idx = index({ row: (i + 1), col: (j + 1) }, board.row)
                if (game[idx] !== "*") {
                    if (game[idx] === " ")
                        user_game = revealEmptyCaseArea(idx, user_game);
                    user_game = user_game.replaceAt(idx, game[idx]);
                }
            }

            // check if there is a mine in S -> SUD
            if (isValidCoord({ row: (i + 1), col: (j) }, board)) {
                let idx = index({ row: (i + 1), col: (j) }, board.row)
                if (game[idx] !== "*") {
                    if (game[idx] === " ")
                        user_game = revealEmptyCaseArea(idx, user_game);
                    user_game = user_game.replaceAt(idx, game[idx]);
                }
            }
        }

        return (user_game)
    }

    const reset = () => {
        setGame(putMines(board, board.mines));
        setUserPlay("-".repeat(board.row * board.col))
        if (game_start)
            setGameStart(false)
        if (game_pause)
            setGamePause(false)
        if (game_lost)
            setGameLost(false)
        if (game_win)
            setGameWin(false)
        setTimer(0)
    }

    const handleBoardClick = (id) => {
        if (!game_start)
        {
            setGameStart(true)
            setTimer(1)
        }
        if (game_start && game_pause)
            setGamePause(!game_pause)

        setLastPlay(id)
        setUserPlay(reveal(id, user_play))
    }

    useEffect(() => {
        const interval_id = (game_start && !game_pause && !game_lost && !game_win) && setInterval(() => setTimer(timer + 1), 1000);
        return () => clearInterval(interval_id);
    }, [timer, game_start, game_pause, game_lost, game_win]);

    const getTimer = (time) => {
        // calculate time left
        const minutes = Math.floor(time / 60);
        const seconds = time - minutes * 60;

        return `${minutes < 10 ? '0' + minutes.toString() : minutes} : ${seconds < 10 ? '0' + seconds.toString() : seconds}`
      };

    const display_board = () => {
        let buttons = [];

        for (let i = 0; i < game.length; i++) {
            if (user_play[i] === "-")
                buttons.push((<button disabled={game_lost || game_win} onClick={() => handleBoardClick(i)} className="text-md sm:text-xl bg-opacity-10 bg-slate-200 backdrop-blur-xl border border-zinc-800 rounded-md" key={i}>{/*game[i] === "*" ? "💣" : game[i]*/}</button>))
            else
                buttons.push((<div className={`cursor-default text-md sm:text-xl ${game[i] === "*" ? `${i === last_play ? 'bg-red-800' : "bg-red-400"} bg-opacity-60 backdrop-blur-xl` : 'bg-white'} rounded-md border border-zinc-800`} key={i}>{game[i] === "*" ? "💣" : game[i]}</div>))
        }

        return (buttons)
    }

    return (
        <div className="overflow-x-auto mb-10 flex flex-col lg:flex-row justify-center">
            <div className={`mx-auto lg:mx-0 col-span-2 board-${board.col} border border-gray-400 grid grid-${board.col} rounded-md`}>
                {display_board()}
            </div>
            <div className="self-center mx-auto lg:mx-0 lg:ml-20 mt-10 lg:mt-0 flex flex-col">
                <h1 className="hidden lg:block py-4 text-5xl font-towards text-center text-white  mb-10">
                    Minesweeper
                </h1>
                <div className="mb-4 flex-grow">
                    <div className="text-white flex flex-col">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="self-center w-14 h-14" viewBox="0 0 16 16">
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                        </svg>
                        <span className="self-center text-2xl">{getTimer(timer)}</span>
                    </div>
                </div>
                <button type="button" onClick={reset} disabled={!game_start} className={`bg-opacity-10 px-6 py-3 mb-5 bg-slate-200 backdrop-blur-xl rounded-md border shadow-md ${game_start ? 'text-white' : 'cursor-not-allowed bg-opacity-5 text-gray-600 border-gray-600'}`}>
                    <h5 className="font-poppins text-center text-md lg:text-lg font-light">Start over</h5>
                </button>

                <button type="button" onClick={() => startOver(null)} className="bg-opacity-10 px-6 py-3 mb-5 bg-slate-200 backdrop-blur-xl rounded-md border shadow-md">
                    <h5 className="font-poppins text-center text-md lg:text-lg font-light text-white">Change the difficulty</h5>
                </button>

                <button type="button" onClick={() => setGamePause(!game_pause) } disabled={!game_start && (game_lost || game_win)} className={`bg-opacity-10 px-6 py-3 mb-5 bg-slate-200 backdrop-blur-xl rounded-md border shadow-md ${(game_start && !(game_lost || game_win)) ? 'text-white' : 'cursor-not-allowed bg-opacity-5 text-gray-600 border-gray-600'}`}>
                    <h5 className="font-poppins text-center text-md lg:text-lg font-light">{ game_pause ? 'Reprendre' : 'Pause'}</h5>
                </button>
            </div>
        </div>
    )
}

export default GameBoard;