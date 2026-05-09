import { useEffect, useState } from "react";

const Button = ({ char,
    gameHasStart,
    handleGameStart,
    gameIsOver,
    gameisOnPause,
    innerRef,
    reveal,
    triggerBomb,
    canPutFlag,
    addFlag,
    checksForWin }) => {
    const [revealed, setRevealed] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [flaged,  setFlaged] = useState(false);

    useEffect(() => {
        const interval_id = (revealed && !gameIsOver) && setInterval(() => setClicked(false), 1000)
        return () => clearInterval(interval_id);
    }, [revealed, gameIsOver]);

    const handleContexteMenu = (e) => {
        e.preventDefault()
        if (!revealed)
        {

            if (flaged){
                setFlaged(false);
                addFlag(-1);
            }
            else if (!flaged && canPutFlag){
                setFlaged(true);
                addFlag(1);
                setTimeout(() => checksForWin(), 10);
            }
        }
    }

    const handleClick = (e) => {
        if (flaged)
            return;
 
        setRevealed(true)

        if (!gameHasStart)
            handleGameStart(true);

        if (gameIsOver)
            return;

        if (char === "*")
            triggerBomb();

        if (char === " " && !revealed)
            reveal();

        setClicked(true)
        setTimeout(() => checksForWin(), 10);
    }

    const getClassname = () => {
        let classList = "";

        if (gameisOnPause){
            classList = 'mine-cell paused';
        }
        else{
            if (revealed)
                classList = `mine-cell revealed risk-${(char === ' ' && char !== "*") ? '0' : char} ${char === "*" ? `${clicked ? 'mine-cell-bomb-active' : "mine-cell-bomb"}` : ''}`;
            else
                classList = 'mine-cell hidden-cell';
            
            if (flaged)
                classList += " flaged";
        }

        return (classList)
    }

    return (
        <button ref={innerRef} onContextMenu={(e) => handleContexteMenu(e)} onClick={handleClick} type="button" className={getClassname()}>{((revealed || flaged) && !gameisOnPause) && (flaged ? "🏴" : (char === "*") ? "💣" : char)}</button>
    )
}

export default Button;
