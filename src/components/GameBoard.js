import { useRef } from "react";
import { useEffect, useState } from "react";
import Button from "./Button";

/* Game ringtones */
const ringtones = {
    bomb: './ringtones/Bomb.mp3',
    win: './ringtones/Applause.mp3',
}
// 🏴 flag
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
 * constructGame - Put mines inside the board
 * 
 * @param {object} board: The board caracteristics
 * 
 * @returns {String} the board with mines inside
 */
function constructGame(board) {
    let game = ''

    game = game.padStart((board.row * board.col) - board.mines, ' ') + game.padStart(board.mines, '*');
    game = countMines(board, game.shuffle());

    return (game);
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
        (coords.col >= 0 && coords.col < limitCoords.col));
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
    return ((coords.row * row) + coords.col);
}

/**
 * getCoords - retrieve double array coords
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
    };
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
    return (board);
}

/**
 * GameBoard component
 * @returns JSX
 */
function GameBoard({ board, startOver }) {
    const [game, setGame] = useState("");
    const [time, setTime] = useState(0);
    const [game_start, setGameStart] = useState(false);
    const [game_pause, setGamePause] = useState(false);
    const [game_over, setGameOver] = useState(false);
    const [flags, setFlags] = useState(0);
    const [buttons_key, setGamePlayed] = useState(0)


    const audioElement = useRef();
    const revealedRef = useRef([]);
    // revealedRef.current = [];

    useEffect(() => {
        document.querySelector(':root').style.setProperty('--gap', '2px')
        setGame(constructGame(board));
    }, [board]);

    const checksForWin = () => {
        let matches = 0;
        let safeArea = 0;

        for (let i = 0; i < game.length; i++) {
            if (game[i] === "*" && revealedRef.current[i].classList.contains('flaged'))
            {
                matches++;
            }
            else if (game[i] !== "*" && revealedRef.current[i].classList.contains('revealed'))
            {
                safeArea++;
            }
        }

        if (matches === board.mines || safeArea === (game.length - board.mines))
        {
            audioElement.current.src = ringtones.win;
            audioElement.current.currentTime = 0;
            audioElement.current.play();
            setGameOver(true);
        }
    }

    const addToRef = (el) => {
        if (el && !revealedRef.current.includes(el)){
            revealedRef.current.push(el);
        }
    }

    const reset = () => {
        setGame(constructGame(board));
        setGamePlayed(buttons_key + game.length)

        if (game_start)
            setGameStart(false);
        if (game_pause)
            setGamePause(false);
        if (game_over)
            setGameOver(false);

        setTime(0);
        setFlags(0);
        revealedRef.current = []
    }

    const putFlag = (num) => {
        setFlags(flags + num);
    }
    /**
     * 
     * @param {*} id (Number): the id to reveal
     */
    const handleReveal = (id) => {
        reveal(id);
    }

    const handlePause = () => {
        let rootStyle = document.querySelector(':root').style

        if (!game_pause)
        {
            rootStyle.setProperty('--gap', '0px')
            for (let i = 0; i < game.length; i++) {
                if (!revealedRef.current[i].classList.contains('revealed')){
                    revealedRef.current[i].setAttribute('disabled', true)
                }
                continue;
            }
            setGamePause(true)
        }
        else{
            rootStyle.setProperty('--gap', '2px')
            for (let i = 0; i < game.length; i++) {
                if (!revealedRef.current[i].classList.contains('revealed')){
                    revealedRef.current[i].removeAttribute('disabled')
                }
                continue;
            }
            setGamePause(false)
        }
    }

    const click = (id) => {
        setTimeout(() => {
            revealedRef.current[id].click();
        }, 10);
    }

    /**
     * reveal - This function reveal hidden case for the user
     * 
     * @param {*} id: the index to reveal
     */
    function reveal(id) {
        if (game[id] === "*")
            return;

        revealedRef.current[id].click();

        if (game[id] === " ") {
            let i = getCoords(id, board).row;
            let j = getCoords(id, board).col;

            // check if there is a mine in NW -> NORD-WEST
            if (isValidCoord({ row: (i - 1), col: (j - 1) }, board)) {
                let idx = index({ row: (i - 1), col: (j - 1) }, board.row);
                if (game[idx] !== "*") {
                    click(idx);
                }
            }

            // check if there is a mine in NE -> NORD-EAST
            if (isValidCoord({ row: (i - 1), col: (j + 1) }, board)) {
                let idx = index({ row: (i - 1), col: (j + 1) }, board.row);
                if (game[idx] !== "*") {
                    click(idx);
                }
            }

            // check if there is a mine in N -> NORD
            if (isValidCoord({ row: (i - 1), col: (j) }, board)) {
                let idx = index({ row: (i - 1), col: (j) }, board.row);
                if (game[idx] !== "*") {
                    click(idx);
                }
            }

            // // check if there is a mine in W -> WEST
            if (isValidCoord({ row: (i), col: (j - 1) }, board)) {
                let idx = index({ row: (i), col: (j - 1) }, board.row);
                if (game[idx] !== "*") {
                    click(idx);
                }
            }

            // check if there is a mine in E -> EAST
            if (isValidCoord({ row: (i), col: (j + 1) }, board)) {
                let idx = index({ row: (i), col: (j + 1) }, board.row);
                if (game[idx] !== "*") {
                    click(idx);
                }
            }

            // check if there is a mine in SW -> SUD-WEST
            if (isValidCoord({ row: (i + 1), col: (j - 1) }, board)) {
                let idx = index({ row: (i + 1), col: (j - 1) }, board.row);
                if (game[idx] !== "*") {
                    click(idx);
                }
            }

            // check if there is a mine in SE -> SUD-EAST
            if (isValidCoord({ row: (i + 1), col: (j + 1) }, board)) {
                let idx = index({ row: (i + 1), col: (j + 1) }, board.row);
                if (game[idx] !== "*") {
                    click(idx);
                }
            }

            // check if there is a mine in S -> SUD
            if (isValidCoord({ row: (i + 1), col: (j) }, board)) {
                let idx = index({ row: (i + 1), col: (j) }, board.row);
                if (game[idx] !== "*") {
                    click(idx);
                }
            }
            return

        }
    }

    const triggerBomb = () => {
        if (game_over)
            return;

        audioElement.current.src = ringtones.bomb
        audioElement.current.currentTime = 0
        audioElement.current.play()

        setTimeout(() => {

            for (let i = 0; i < game.length; i++) {
                if (game[i] === "*" && !revealedRef.current[i].classList.contains('revealed'))
                {
                    revealedRef.current[i].click();
                }
                revealedRef.current[i].setAttribute('disabled', true);
            }
        }, 10);
        
        setGameOver(true)
    }

    useEffect(() => {
        const interval_id = (game_start && !game_pause && !game_over) && setInterval(() => setTime(time + 1), 1000);
        return () => clearInterval(interval_id);
    }, [time, game_start, game_pause, game_over]);

    const timer = (time) => {
        // calculate time spent
        const minutes = Math.floor(time / 60);
        const seconds = time - minutes * 60;

        return `${minutes < 10 ? '0' + minutes.toString() : minutes} : ${seconds < 10 ? '0' + seconds.toString() : seconds}`
    }

    const create_buttons = () => {
        let buttons = [];

        for (let i = 0; i < game.length; i++) {
            buttons.push(<Button 
                key={i + buttons_key}
                char={game[i]}
                gameHasStart={game_start}
                handleGameStart={setGameStart}
                gameIsOver={game_over}
                gameisOnPause={game_pause}
                innerRef={addToRef}
                reveal={() => handleReveal(i)}
                triggerBomb={triggerBomb}
                canPutFlag={flags !== board.mines}
                addFlag={putFlag}
                checksForWin={checksForWin}
            />)
        }

        return (buttons)
    }

    return (
        <div className="overflow-x-auto flex flex-col lg:flex-row justify-center">
            <div className={`mx-auto lg:mx-0 rounded-md`}>
                <div className={`board-${board.col} grid grid-${board.col}`}>{create_buttons()}</div>
            </div>
            <div className="self-center mx-auto lg:mx-0 lg:ml-20 mt-10 lg:mt-0 flex flex-col">
                <h1 className="hidden lg:block py-4 text-5xl font-towards text-center text-white  mb-10">
                    Minesweeper
                </h1>
                <div className="mb-4 flex-grow">
                    <div className="text-white flex flex-col">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="self-center w-14 h-14" viewBox="0 0 16 16">
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                        </svg>
                        <span className="self-center text-2xl">{timer(time)} {game_pause && "⏸️"}</span>
                    </div>
                </div>

                <button type="button" onClick={() => reset()} disabled={!game_start} className={`bg-opacity-10 px-6 py-3 mb-5 bg-slate-200 backdrop-blur-xl rounded-md border shadow-md ${game_start ? 'text-white' : 'cursor-not-allowed bg-opacity-5 text-gray-600 border-gray-600'}`}>
                    <h5 className="font-poppins text-center text-md lg:text-lg font-light">Start over</h5>
                </button>

                <button type="button" onClick={() => startOver(null)} className="bg-opacity-10 px-6 py-3 mb-5 bg-slate-200 backdrop-blur-xl rounded-md border shadow-md">
                    <h5 className="font-poppins text-center text-md lg:text-lg font-light text-white">Change the difficulty </h5>
                </button>

                <button type="button" onClick={() => handlePause()} disabled={!game_start && (game_over)} className={`bg-opacity-10 px-6 py-3 mb-5 bg-slate-200 backdrop-blur-xl rounded-md border shadow-md ${(game_start && !(game_over)) ? 'text-white' : 'cursor-not-allowed bg-opacity-5 text-gray-600 border-gray-600'}`}>
                    <h5 className="font-poppins text-center text-md lg:text-lg font-light">{game_pause ? 'Take over' : 'Pause'}</h5>
                </button>
            </div>

            <audio ref={audioElement} />
        </div>
    )
}

export default GameBoard;
