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
            classList = 'border-4 border-zinc-600 text-md sm:text-xl bg-zinc-600 backdrop-blur-xl rounded-sm paused';
        }
        else{
            if (revealed)
                classList = `font-extrabold risk-${(char === ' ' && char !== "*") ? '0' : char} cursor-default text-md sm:text-xl text-white ${char === "*" ? `${clicked ? 'bg-red-500' : "bg-red-400"} bg-opacity-60 backdrop-blur-xl` : 'bg-opacity-10 bg-slate-400'} rounded-sm revealed`;
            else
                classList = 'border-4 border-l-zinc-400 border-t-zinc-500 border-r-zinc-600 border-b-zinc-700 text-md sm:text-xl bg-opacity-10 bg-slate-400 bg-gradient-to-tl from-zinc-700 to-zinc-500 backdrop-blur-xl rounded-sm';
            
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
