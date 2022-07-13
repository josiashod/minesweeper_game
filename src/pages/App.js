import { useState } from "react";
import GameBoard from "../components/GameBoard";
import Level from "../components/Level";

export const MAX_MINES = 99;
export const MINES_PERCENTAGE = 23.4375;

function App() {
  const [board, setBoard] = useState(null)

  return (
    <div className="w-full min-h-screen bg-zinc-800 pt-20">
      <h1 className="block lg:hidden py-4 text-5xl font-towards text-center text-white  mb-10">
        Minesweeper
      </h1>
      {!board ? <Level handleBoard={setBoard} /> : <GameBoard board={board} startOver={setBoard} />}

      {/* <footer className="absolute bottom-0 left-0 right-0 py-4 text-center text-white font-thin">
        Powered by <a href="#tes" className="text-blue-800">@josiashod</a>
      </footer> */}
    </div>
  );
}

export default App;
